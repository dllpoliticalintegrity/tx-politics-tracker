-- Special pre-election ("daily" / formerly Telegram) reports and special
-- session reports.
--
-- Texas requires a report within 48 hours for activity in the last nine days
-- before an election (Election Code §254.038-.0393). TEC's bulk CSV keeps
-- those rows in separate files — cover_t / cover_ss, cont_t / cont_ss,
-- expn_t — "to avoid creating duplicates, because they are supposed to be
-- re-reported on the next regular campaign finance report". Two gaps followed:
--
--   1. The importer never read those files, so candidates' daily-window
--      contributions and spending only appeared weeks later, once re-reported.
--   2. Direct-campaign-expenditure (outside spending) rows from special
--      reports DO reach cand.csv, which the importer reads whole — so each
--      one was counted twice once the regular report re-listed it (nine such
--      pairs from the primary and runoff windows as of 2026-09-17, e.g. a
--      $350,000 expenditure benefiting Chip Roy).
--
-- The rule, applied to every transaction table:
--   special    = the row came from a special report (set by the importer:
--                source file for contributions/expenditures, cover_t /
--                cover_ss membership of reportInfoIdent for cand.csv rows).
--   rereported = a special row whose filer has since filed a non-superseded
--                REGULAR report whose period covers the transaction date —
--                the regular copy now carries it, so the special copy is
--                excluded everywhere. Recomputed by
--                refresh_tx_special_supersession(), which
--                refresh_tx_finance_views() now calls first.
-- A special row is therefore visible within a day of filing and hands off to
-- the regular report cleanly when that lands. Regular rows never get
-- rereported = true.

-- ---------------------------------------------------------------------------
-- Columns
-- ---------------------------------------------------------------------------
alter table public.tx_filings
  add column if not exists special boolean not null default false;

alter table public.tx_contributions
  add column if not exists special    boolean not null default false,
  add column if not exists rereported boolean not null default false;
alter table public.tx_expenditures
  add column if not exists special    boolean not null default false,
  add column if not exists rereported boolean not null default false;
alter table public.tx_independent_expenditures
  add column if not exists special    boolean not null default false,
  add column if not exists rereported boolean not null default false;
alter table public.tx_ie_contributions
  add column if not exists special    boolean not null default false,
  add column if not exists rereported boolean not null default false;

comment on column public.tx_filings.special is
  'Cover sheet came from cover_t.csv / cover_ss.csv (special pre-election or special session report). These carry no totals.';
comment on column public.tx_contributions.rereported is
  'Special-report row that a later regular report from the same filer re-lists; excluded from every view. Maintained by refresh_tx_special_supersession().';

-- The supersession pass only touches special rows; keep those cheap to find.
create index if not exists idx_tx_contributions_special on public.tx_contributions (filer_ident, contribution_date) where special;
create index if not exists idx_tx_expenditures_special  on public.tx_expenditures  (filer_ident, expenditure_date)  where special;
create index if not exists idx_tx_ie_special            on public.tx_independent_expenditures (ie_filer_ident, expenditure_date) where special;
create index if not exists idx_tx_ie_contribs_special   on public.tx_ie_contributions (ie_filer_ident, contribution_date) where special;
create index if not exists idx_tx_filings_regular_period on public.tx_filings (filer_ident, period_start, period_end) where not special and not superseded;

-- ---------------------------------------------------------------------------
-- Backfill: cand.csv rows already imported from special reports. Every
-- regular cover sheet for a DCE filer is in tx_filings (the importer passes
-- the DCE filer set to the filings stage), so an outside-spending row whose
-- report is absent from tx_filings can only have come from a special report.
-- No contribution / expenditure rows can be special yet — those files were
-- never read.
-- ---------------------------------------------------------------------------
update public.tx_independent_expenditures i
   set special = true
 where not i.special
   and not exists (select 1 from public.tx_filings f where f.report_info_ident = i.report_info_ident);

-- ---------------------------------------------------------------------------
-- Supersession
-- ---------------------------------------------------------------------------
create or replace function public.refresh_tx_special_supersession()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  n_c integer; n_e integer; n_i integer; n_ic integer;
begin
  update public.tx_contributions c
     set rereported = exists (
       select 1 from public.tx_filings f
        where f.filer_ident = c.filer_ident
          and not f.special and not f.superseded
          and c.contribution_date between f.period_start and f.period_end)
   where c.special;
  get diagnostics n_c = row_count;

  update public.tx_expenditures e
     set rereported = exists (
       select 1 from public.tx_filings f
        where f.filer_ident = e.filer_ident
          and not f.special and not f.superseded
          and e.expenditure_date between f.period_start and f.period_end)
   where e.special;
  get diagnostics n_e = row_count;

  update public.tx_independent_expenditures i
     set rereported = exists (
       select 1 from public.tx_filings f
        where f.filer_ident = i.ie_filer_ident
          and not f.special and not f.superseded
          and i.expenditure_date between f.period_start and f.period_end)
   where i.special;
  get diagnostics n_i = row_count;

  update public.tx_ie_contributions x
     set rereported = exists (
       select 1 from public.tx_filings f
        where f.filer_ident = x.ie_filer_ident
          and not f.special and not f.superseded
          and x.contribution_date between f.period_start and f.period_end)
   where x.special;
  get diagnostics n_ic = row_count;

  raise notice 'special-report supersession: % contributions, % expenditures, % outside, % ie-contributions re-evaluated', n_c, n_e, n_i, n_ic;
end;
$$;

grant execute on function public.refresh_tx_special_supersession() to service_role;

select public.refresh_tx_special_supersession();

-- ---------------------------------------------------------------------------
-- Views: exclude rereported rows everywhere.
-- ---------------------------------------------------------------------------
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
where not l.is_guarantor;

drop materialized view if exists public.tx_contributions_summary;
create materialized view public.tx_contributions_summary as
select
  c.id as candidate_id, c.slug, c.name, c.filer_ident,
  coalesce(x.cycle, 'unknown') as cycle,
  count(*) filter (where x.contributor_type = 'INDIVIDUAL') as individual_donor_count,
  sum(x.amount) filter (where x.contributor_type = 'INDIVIDUAL') as individual_contributions,
  sum(x.amount) filter (where x.contributor_type = 'ENTITY') as entity_contributions,
  sum(x.amount) filter (where x.contributor_type = 'INDIVIDUAL' and x.amount < 200) as small_dollar_contributions,
  count(*) filter (where x.contributor_type = 'INDIVIDUAL' and x.amount < 200) as small_dollar_count,
  sum(x.amount) as total_raised,
  max(x.contribution_date) as as_of
from public.tx_candidates c
left join public.tx_contributions x on x.candidate_id = c.id and not x.rereported
group by c.id, c.slug, c.name, c.filer_ident, x.cycle;
create unique index tx_contributions_summary_pk on public.tx_contributions_summary (candidate_id, cycle);
create index tx_contributions_summary_slug_idx on public.tx_contributions_summary (slug);
grant select on public.tx_contributions_summary to anon, authenticated, service_role;

drop materialized view if exists public.tx_ie_by_candidate;
create materialized view public.tx_ie_by_candidate as
select
  c.id as candidate_id, c.slug, c.name,
  coalesce(ie.cycle, 'unknown') as cycle,
  sum(ie.amount) filter (where upper(ie.support_oppose) = 'S') as total_supporting,
  sum(ie.amount) filter (where upper(ie.support_oppose) = 'O') as total_opposing,
  count(*) filter (where upper(ie.support_oppose) = 'S') as supporting_count,
  count(*) filter (where upper(ie.support_oppose) = 'O') as opposing_count,
  count(distinct ie.ie_filer_ident) as committee_count,
  max(ie.expenditure_date) as as_of
from public.tx_candidates c
left join public.tx_independent_expenditures ie on ie.target_candidate_id = c.id and not ie.rereported
group by c.id, c.slug, c.name, ie.cycle;
create unique index tx_ie_by_candidate_pk on public.tx_ie_by_candidate (candidate_id, cycle);
create index tx_ie_by_candidate_slug_idx on public.tx_ie_by_candidate (slug);
grant select on public.tx_ie_by_candidate to anon, authenticated, service_role;

drop materialized view if exists public.tx_top_ie_donors;
create materialized view public.tx_top_ie_donors as
with normalized as (
  select
    ie_filer_ident, contributor_type,
    nullif(regexp_replace(regexp_replace(upper(btrim(contributor_last_name)),  '[^A-Z0-9 ]', '', 'g'), '\s+', ' ', 'g'), '') as norm_last,
    nullif(regexp_replace(regexp_replace(upper(btrim(contributor_first_name)), '[^A-Z0-9 ]', '', 'g'), '\s+', ' ', 'g'), '') as norm_first,
    contributor_last_name, contributor_first_name, employer, occupation, city, state, amount, contribution_date
  from public.tx_ie_contributions
  where not rereported
)
select
  ie_filer_ident,
  coalesce(norm_last, '')  as norm_last_key,
  coalesce(norm_first, '') as norm_first_key,
  (array_agg(contributor_last_name  order by contribution_date desc nulls last))[1] as contributor_last_name,
  (array_agg(contributor_first_name order by contribution_date desc nulls last))[1] as contributor_first_name,
  (array_agg(contributor_type       order by contribution_date desc nulls last))[1] as contributor_type,
  (array_agg(employer               order by contribution_date desc nulls last))[1] as employer,
  (array_agg(occupation             order by contribution_date desc nulls last))[1] as occupation,
  (array_agg(city                   order by contribution_date desc nulls last))[1] as city,
  (array_agg(state                  order by contribution_date desc nulls last))[1] as state,
  count(*)::bigint                  as contribution_count,
  coalesce(sum(amount), 0)::numeric as total_amount,
  max(contribution_date)            as last_contribution_date
from normalized
group by ie_filer_ident, coalesce(norm_last, ''), coalesce(norm_first, '');
create unique index tx_top_ie_donors_pk on public.tx_top_ie_donors (ie_filer_ident, norm_last_key, norm_first_key);
create index tx_top_ie_donors_total_amount_idx on public.tx_top_ie_donors (total_amount desc);
grant select on public.tx_top_ie_donors to anon, authenticated, service_role;

-- Money river: drop rereported rows and expose `special` so the page can tag
-- a 48-hour report row while it is still the only copy on file.
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

grant select on public.tx_money_river to anon, authenticated, service_role;

-- One call after an import does everything, in the right order.
create or replace function public.refresh_tx_finance_views()
returns void
language plpgsql
security definer
set search_path = public
set statement_timeout = '10min'
as $$
begin
  perform public.refresh_tx_special_supersession();
  refresh materialized view concurrently public.tx_contributions_summary;
  refresh materialized view concurrently public.tx_ie_by_candidate;
  refresh materialized view concurrently public.tx_top_ie_donors;
end;
$$;
grant execute on function public.refresh_tx_finance_views() to service_role;
