-- Rows from superseded reports were never removed.
--
-- The importer skips transaction rows whose report carries infoOnlyFlag = 'Y'
-- (superseded by a later filing), but only from that run onward: rows
-- imported while the original report was still live stay in the tables
-- forever. Bobby Cole's 8-day pre-primary report was later refiled as a
-- correction (form CORCOH, which — contrary to the note in
-- docs/tx-campaign-finance-parsing.md — re-lists every transaction), so
-- 1,766 contribution rows ($47,140) and 36 expenditure rows ($43,613) were
-- counted twice as of 2026-09-17. tx_filings already knows which reports are
-- superseded (the filings stage upserts every cover sheet, flag included), so
-- the exclusion pass can use it.
--
-- `rereported` therefore now means "excluded because a later report
-- supersedes or re-lists this row": true when the row's own report is
-- superseded, or when it is a special-report row that a regular report
-- covering its date has re-listed. tx_loans gains the same flag.

alter table public.tx_loans
  add column if not exists rereported boolean not null default false;

comment on column public.tx_contributions.rereported is
  'Excluded: the row''s report is superseded (infoOnlyFlag) or it is a special-report row a later regular report re-lists. Maintained by refresh_tx_special_supersession().';
comment on column public.tx_expenditures.rereported is
  'Excluded: the row''s report is superseded (infoOnlyFlag) or it is a special-report row a later regular report re-lists. Maintained by refresh_tx_special_supersession().';
comment on column public.tx_independent_expenditures.rereported is
  'Excluded: the row''s report is superseded (infoOnlyFlag) or it is a special-report row a later regular report re-lists. Maintained by refresh_tx_special_supersession().';
comment on column public.tx_ie_contributions.rereported is
  'Excluded: the row''s report is superseded (infoOnlyFlag) or it is a special-report row a later regular report re-lists. Maintained by refresh_tx_special_supersession().';
comment on column public.tx_loans.rereported is
  'Excluded: the row''s report is superseded (infoOnlyFlag). Maintained by refresh_tx_special_supersession().';

create index if not exists idx_tx_filings_superseded on public.tx_filings (report_info_ident) where superseded;
create index if not exists idx_tx_contributions_report on public.tx_contributions (report_info_ident);
create index if not exists idx_tx_expenditures_report  on public.tx_expenditures  (report_info_ident);
create index if not exists idx_tx_loans_report         on public.tx_loans         (report_info_ident);
create index if not exists idx_tx_ie_report            on public.tx_independent_expenditures (report_info_ident);
create index if not exists idx_tx_ie_contribs_report   on public.tx_ie_contributions (report_info_ident);

create or replace function public.refresh_tx_special_supersession()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  n_c integer; n_e integer; n_l integer; n_i integer; n_ic integer;
begin
  -- Each statement re-evaluates every row that is, or could become, excluded:
  -- special rows, rows already excluded, and rows whose report is superseded.
  update public.tx_contributions c
     set rereported =
       exists (select 1 from public.tx_filings f where f.report_info_ident = c.report_info_ident and f.superseded)
       or (c.special and exists (
         select 1 from public.tx_filings f
          where f.filer_ident = c.filer_ident and not f.special and not f.superseded
            and c.contribution_date between f.period_start and f.period_end))
   where c.special or c.rereported
      or exists (select 1 from public.tx_filings f where f.report_info_ident = c.report_info_ident and f.superseded);
  get diagnostics n_c = row_count;

  update public.tx_expenditures e
     set rereported =
       exists (select 1 from public.tx_filings f where f.report_info_ident = e.report_info_ident and f.superseded)
       or (e.special and exists (
         select 1 from public.tx_filings f
          where f.filer_ident = e.filer_ident and not f.special and not f.superseded
            and e.expenditure_date between f.period_start and f.period_end))
   where e.special or e.rereported
      or exists (select 1 from public.tx_filings f where f.report_info_ident = e.report_info_ident and f.superseded);
  get diagnostics n_e = row_count;

  update public.tx_loans l
     set rereported =
       exists (select 1 from public.tx_filings f where f.report_info_ident = l.report_info_ident and f.superseded)
   where l.rereported
      or exists (select 1 from public.tx_filings f where f.report_info_ident = l.report_info_ident and f.superseded);
  get diagnostics n_l = row_count;

  update public.tx_independent_expenditures i
     set rereported =
       exists (select 1 from public.tx_filings f where f.report_info_ident = i.report_info_ident and f.superseded)
       or (i.special and exists (
         select 1 from public.tx_filings f
          where f.filer_ident = i.ie_filer_ident and not f.special and not f.superseded
            and i.expenditure_date between f.period_start and f.period_end))
   where i.special or i.rereported
      or exists (select 1 from public.tx_filings f where f.report_info_ident = i.report_info_ident and f.superseded);
  get diagnostics n_i = row_count;

  update public.tx_ie_contributions x
     set rereported =
       exists (select 1 from public.tx_filings f where f.report_info_ident = x.report_info_ident and f.superseded)
       or (x.special and exists (
         select 1 from public.tx_filings f
          where f.filer_ident = x.ie_filer_ident and not f.special and not f.superseded
            and x.contribution_date between f.period_start and f.period_end))
   where x.special or x.rereported
      or exists (select 1 from public.tx_filings f where f.report_info_ident = x.report_info_ident and f.superseded);
  get diagnostics n_ic = row_count;

  raise notice 'row exclusions re-evaluated: % contributions, % expenditures, % loans, % outside, % ie-contributions', n_c, n_e, n_l, n_i, n_ic;
end;
$$;

select public.refresh_tx_special_supersession();

-- Loans branch of the two views now honours the flag too.
create or replace view public.tx_contributions_deduped as
select
  c.id, c.candidate_id, c.filer_ident, c.contributor_type,
  c.contributor_last_name, c.contributor_first_name, c.employer, c.occupation,
  c.amount, c.contribution_date, c.city, c.state, c.zip, c.cycle, c.source_form_type
from public.tx_contributions c
where not c.rereported
union all
select
  l.id, l.candidate_id, l.filer_ident, l.lender_type, l.lender_last_name, l.lender_first_name,
  null, null, l.amount, l.loan_date, null, null, null, l.cycle, 'B-LOAN'
from public.tx_loans l
where not l.is_guarantor and not l.rereported;

create or replace view public.tx_money_river as
select
  'contribution'::text as kind, c.id, c.contribution_date as txn_date, c.amount, c.candidate_id,
  k.slug as candidate_slug, k.name as candidate_name, k.party as candidate_party, k.office,
  case when c.contributor_type = 'INDIVIDUAL'
       then nullif(trim(concat_ws(' ', nullif(c.contributor_first_name, ''), nullif(c.contributor_last_name, ''))), '')
       else coalesce(nullif(c.contributor_last_name, ''), nullif(c.contributor_first_name, '')) end as counterparty,
  nullif(c.contributor_type, '') as counterparty_type,
  nullif(concat_ws(' · ', nullif(c.employer, ''), nullif(c.city, ''), nullif(c.state, '')), '') as detail,
  null::text as support_oppose, c.cycle, c.report_info_ident, c.created_at as imported_at,
  c.special
from public.tx_contributions c
join public.tx_candidates k on k.id = c.candidate_id
where not c.rereported
union all
select
  'expenditure', e.id, e.expenditure_date, e.amount, e.candidate_id, k.slug, k.name, k.party, k.office,
  case when e.payee_type = 'INDIVIDUAL'
       then nullif(trim(concat_ws(' ', nullif(e.payee_first_name, ''), nullif(e.payee_last_name, ''))), '')
       else coalesce(nullif(e.payee_last_name, ''), nullif(e.payee_first_name, '')) end,
  nullif(e.payee_type, ''),
  nullif(concat_ws(' · ', nullif(e.description, ''), nullif(e.category_code, ''), nullif(e.payee_city, '')), ''),
  null, e.cycle, e.report_info_ident, e.created_at,
  e.special
from public.tx_expenditures e
join public.tx_candidates k on k.id = e.candidate_id
where not e.rereported
union all
select
  'loan', l.id, l.loan_date, l.amount, l.candidate_id, k.slug, k.name, k.party, k.office,
  case when l.lender_type = 'INDIVIDUAL'
       then nullif(trim(concat_ws(' ', nullif(l.lender_first_name, ''), nullif(l.lender_last_name, ''))), '')
       else coalesce(nullif(l.lender_last_name, ''), nullif(l.lender_first_name, '')) end,
  nullif(l.lender_type, ''),
  case when l.is_guarantor then 'Guarantor' else null end,
  null, l.cycle, l.report_info_ident, l.created_at,
  false
from public.tx_loans l
join public.tx_candidates k on k.id = l.candidate_id
where not l.rereported
union all
select
  'outside', i.id, i.expenditure_date, i.amount, i.target_candidate_id, k.slug, k.name, k.party, k.office,
  coalesce(nullif(m.name, ''), i.ie_filer_ident), 'COMMITTEE',
  nullif(concat_ws(' · ', nullif(i.description, ''), nullif(i.category_code, '')), ''),
  i.support_oppose, i.cycle, i.report_info_ident, i.created_at,
  i.special
from public.tx_independent_expenditures i
join public.tx_candidates k on k.id = i.target_candidate_id
left join public.tx_ie_committees m on m.filer_ident = i.ie_filer_ident
where not i.rereported;

-- The materialized views already filter on rereported; rebuild their contents.
refresh materialized view public.tx_contributions_summary;
refresh materialized view public.tx_ie_by_candidate;
refresh materialized view public.tx_top_ie_donors;
