-- Remove synthesized "UNITEMIZED-*" rows from ca_contributions_deduped.
-- Policy: datasets must contain only data we pull directly from CAL-ACCESS.
-- The previous view synthesized 1 row per F460 filing whose amount equalled
-- Schedule A line 2 (unitemized contributions, < $100). Those rows do not
-- exist in CAL-ACCESS RCPT_CD; they were derived from SMRY_CD line items.
-- Since we should never invent rows that aren't in source data, drop them.
--
-- Loans (from ca_loans / LOAN_CD) are real source rows — keep them.
-- Itemized RCPT_CD rows (Schedules A, C, I, F497*) are real — keep them.
-- Time-based F497P1 dedup against latest F460 stays.
-- Controlled-committee transfer (tran_type='X') filtering stays.

drop materialized view if exists public.ca_contributions_summary;
drop view if exists public.ca_top_donors;
drop view if exists public.ca_contributions_deduped;

create view public.ca_contributions_deduped as
with max_amend as (
  select filing_id, max(amend_id) as max_amend_id
  from public.ca_contributions
  where candidate_id is not null
  group by filing_id
),
contrib_filtered as (
  select c.*
  from public.ca_contributions c
  join max_amend m
    on m.filing_id = c.filing_id and m.max_amend_id = c.amend_id
  where c.candidate_id is not null
),
filer_coverage as (
  select filer_id as committee_filer_id,
         max(rpt_end) as max_f460_rpt_end
  from public.ca_filings
  where form_type = 'F460' and rpt_end is not null
  group by filer_id
),
controlled as (
  select filer_id from public.ca_candidate_controlled_committees
  union
  select committee_filer_id from public.ca_candidates
  where committee_filer_id is not null
),
itemized as (
  select
    a.id, a.candidate_id, a.committee_filer_id, a.filing_id, a.amend_id, a.tran_id,
    a.contributor_type, a.contributor_last_name, a.contributor_first_name,
    a.employer, a.occupation, a.amount, a.contribution_date,
    a.cumulative_ytd, a.city, a.state, a.zip, a.cycle, a.source_form_type
  from contrib_filtered a
  left join filer_coverage fc on fc.committee_filer_id = a.committee_filer_id
  where
    not (
      upper(coalesce(a.source_form_type,'')) = 'F497P1'
      and fc.max_f460_rpt_end is not null
      and (a.contribution_date is null or a.contribution_date <= fc.max_f460_rpt_end)
    )
    and not (
      upper(coalesce(a.tran_type,'')) = 'X'
      and a.cmte_id is not null
      and exists (select 1 from controlled cc where cc.filer_id = a.cmte_id)
    )
),
loans as (
  select
    l.id, l.candidate_id, l.committee_filer_id, l.filing_id, l.amend_id, l.tran_id,
    coalesce(l.lender_type, 'IND')        as contributor_type,
    l.lender_last_name                    as contributor_last_name,
    l.lender_first_name                   as contributor_first_name,
    l.lender_employer                     as employer,
    l.lender_occupation                   as occupation,
    coalesce(l.amount_received, 0)        as amount,
    l.loan_date                           as contribution_date,
    l.cumulative_loaned                   as cumulative_ytd,
    l.lender_city                         as city,
    l.lender_state                        as state,
    l.lender_zip                          as zip,
    l.cycle,
    'LOAN-' || coalesce(l.source_form_type, 'B1') as source_form_type
  from public.ca_loans l
  join max_amend m on m.filing_id = l.filing_id and m.max_amend_id = l.amend_id
  where coalesce(l.amount_forgiven, 0) = 0
    and not (coalesce(l.amount_received, 0) = 0 and coalesce(l.outstanding_balance, 0) > 0)
    and coalesce(l.amount_received, 0) > 0
)
select * from itemized
union all
select * from loans;

grant select on public.ca_contributions_deduped to anon, authenticated, service_role;

create view public.ca_top_donors as
with normalized as (
  select
    candidate_id, contributor_type,
    nullif(regexp_replace(regexp_replace(upper(btrim(contributor_last_name)), '[^A-Z0-9 ]', '', 'g'), '\s+', ' ', 'g'), '') as norm_last,
    nullif(regexp_replace(regexp_replace(upper(btrim(contributor_first_name)), '[^A-Z0-9 ]', '', 'g'), '\s+', ' ', 'g'), '') as norm_first,
    contributor_last_name, contributor_first_name, employer, occupation,
    city, state, amount, contribution_date
  from public.ca_contributions_deduped
  where candidate_id is not null
)
select
  candidate_id,
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
group by candidate_id, norm_last, coalesce(norm_first, '');

grant select on public.ca_top_donors to anon, authenticated, service_role;

create materialized view public.ca_contributions_summary as
select
  c.id as candidate_id, c.slug, c.name, c.committee_filer_id,
  coalesce(x.cycle, 'unknown') as cycle,
  count(*)            filter (where x.contributor_type in ('IND','OTH'))                    as individual_donor_count,
  sum(x.amount)       filter (where x.contributor_type in ('IND','OTH'))                    as individual_contributions,
  sum(x.amount)       filter (where x.contributor_type in ('COM','SCC'))                    as pac_contributions,
  sum(x.amount)       filter (where x.contributor_type = 'PTY')                              as party_contributions,
  sum(x.amount)       filter (where x.contributor_type in ('IND','OTH') and x.amount < 200) as small_dollar_contributions,
  count(*)            filter (where x.contributor_type in ('IND','OTH') and x.amount < 200) as small_dollar_count,
  sum(x.amount)                                                                              as total_raised,
  max(x.contribution_date)                                                                   as as_of
from public.ca_candidates c
left join public.ca_contributions_deduped x on x.candidate_id = c.id
group by c.id, c.slug, c.name, c.committee_filer_id, x.cycle;

create unique index ca_contributions_summary_pk
  on public.ca_contributions_summary (candidate_id, cycle);

create index ca_contributions_summary_slug_idx
  on public.ca_contributions_summary (slug);

grant select on public.ca_contributions_summary to anon, authenticated;

refresh materialized view public.ca_contributions_summary;
