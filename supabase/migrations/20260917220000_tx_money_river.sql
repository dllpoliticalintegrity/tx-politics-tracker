-- Money river: one chronological feed over every itemized money row the TEC
-- importer writes for Texas candidates, for the public site's /money/river
-- page (paginated, filterable by race / type / candidate).
--
-- A plain view over UNION ALL rather than a materialized one so it is live
-- the moment an import lands and needs no place in refresh_tx_finance_views().
-- Each branch joins tx_candidates so the office (race) filter and the
-- candidate label come back in the same round trip; PostgREST pushes the
-- WHERE clauses down through the union.
--
-- Columns are normalized across the four sources:
--   kind             contribution | expenditure | loan | outside
--   txn_date         the filing's transaction date (nullable in TEC data)
--   counterparty     who gave / was paid / lent / spent
--   counterparty_type INDIVIDUAL | ENTITY | COMMITTEE (blank lender_type → null)
--   detail           employer · city · state (contributions), description ·
--                    category · city (expenditures), description · category
--                    (outside spending), "Guarantor" (loans)
--   support_oppose   S | O for outside spending, null otherwise
--   imported_at      when the importer first wrote the row — the "latest
--                    data" ordering tiebreaker and what a reader means by new
--
-- Only Texas candidates' rows are involved (every branch joins tx_candidates),
-- so this is safe in the project shared with the multi-state tracker.

create or replace view public.tx_money_river as
select
  'contribution'::text                 as kind,
  c.id,
  c.contribution_date                  as txn_date,
  c.amount,
  c.candidate_id,
  k.slug                               as candidate_slug,
  k.name                               as candidate_name,
  k.party                              as candidate_party,
  k.office,
  case
    when c.contributor_type = 'INDIVIDUAL'
      then nullif(trim(concat_ws(' ', nullif(c.contributor_first_name, ''), nullif(c.contributor_last_name, ''))), '')
    else coalesce(nullif(c.contributor_last_name, ''), nullif(c.contributor_first_name, ''))
  end                                  as counterparty,
  nullif(c.contributor_type, '')       as counterparty_type,
  nullif(concat_ws(' · ', nullif(c.employer, ''), nullif(c.city, ''), nullif(c.state, '')), '') as detail,
  null::text                           as support_oppose,
  c.cycle,
  c.report_info_ident,
  c.created_at                         as imported_at
from public.tx_contributions c
join public.tx_candidates k on k.id = c.candidate_id

union all

select
  'expenditure',
  e.id,
  e.expenditure_date,
  e.amount,
  e.candidate_id,
  k.slug, k.name, k.party, k.office,
  case
    when e.payee_type = 'INDIVIDUAL'
      then nullif(trim(concat_ws(' ', nullif(e.payee_first_name, ''), nullif(e.payee_last_name, ''))), '')
    else coalesce(nullif(e.payee_last_name, ''), nullif(e.payee_first_name, ''))
  end,
  nullif(e.payee_type, ''),
  nullif(concat_ws(' · ', nullif(e.description, ''), nullif(e.category_code, ''), nullif(e.payee_city, '')), ''),
  null,
  e.cycle,
  e.report_info_ident,
  e.created_at
from public.tx_expenditures e
join public.tx_candidates k on k.id = e.candidate_id

union all

select
  'loan',
  l.id,
  l.loan_date,
  l.amount,
  l.candidate_id,
  k.slug, k.name, k.party, k.office,
  case
    when l.lender_type = 'INDIVIDUAL'
      then nullif(trim(concat_ws(' ', nullif(l.lender_first_name, ''), nullif(l.lender_last_name, ''))), '')
    else coalesce(nullif(l.lender_last_name, ''), nullif(l.lender_first_name, ''))
  end,
  nullif(l.lender_type, ''),
  case when l.is_guarantor then 'Guarantor' else null end,
  null,
  l.cycle,
  l.report_info_ident,
  l.created_at
from public.tx_loans l
join public.tx_candidates k on k.id = l.candidate_id

union all

select
  'outside',
  i.id,
  i.expenditure_date,
  i.amount,
  i.target_candidate_id,
  k.slug, k.name, k.party, k.office,
  coalesce(nullif(m.name, ''), i.ie_filer_ident),
  'COMMITTEE',
  nullif(concat_ws(' · ', nullif(i.description, ''), nullif(i.category_code, '')), ''),
  i.support_oppose,
  i.cycle,
  i.report_info_ident,
  i.created_at
from public.tx_independent_expenditures i
join public.tx_candidates k on k.id = i.target_candidate_id
left join public.tx_ie_committees m on m.filer_ident = i.ie_filer_ident;

comment on view public.tx_money_river is
  'Chronological feed of every itemized contribution, expenditure, loan and outside expenditure for Texas candidates; backs /money/river on texaspoliticstracker.com.';

grant select on public.tx_money_river to anon, authenticated, service_role;

-- The feed sorts by transaction date across the whole cycle; the existing
-- indexes lead with candidate_id, so give each source a date-first index.
create index if not exists idx_tx_contributions_date on public.tx_contributions (contribution_date desc, created_at desc);
create index if not exists idx_tx_expenditures_date  on public.tx_expenditures  (expenditure_date desc, created_at desc);
create index if not exists idx_tx_loans_date         on public.tx_loans         (loan_date desc, created_at desc);
create index if not exists idx_tx_ie_date            on public.tx_independent_expenditures (expenditure_date desc, created_at desc);
