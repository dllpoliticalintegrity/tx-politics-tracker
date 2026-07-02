-- Drop ALL tran_type='X' rows from ca_contributions_deduped.
--
-- In CAL-ACCESS RCPT_CD, tran_type='X' marks cross-reference / memo entries:
-- the committee re-reports a contribution that was already counted on the
-- ORIGINAL recipient's filing (typically through a joint-fundraising
-- committee or earmarked-conduit pathway). Summing them double-counts.
--
-- PowerSearch deduplicates these. Verified: with this filter applied,
-- Becerra's total goes from \$6.94M to \$4.50M (matches PowerSearch
-- \$4,498,699.20 within \$330) and Porter's goes from \$9.20M to \$8.73M
-- (closes most of the gap to PowerSearch's \$8,638,649.17).
--
-- The previous filter only dropped tran_type='X' from controlled
-- committees, which missed cases where the X-row's cmte_id is null or
-- references a non-controlled intermediary.

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
itemized as (
  select
    a.id, a.candidate_id, a.committee_filer_id, a.filing_id, a.amend_id, a.tran_id,
    a.contributor_type, a.contributor_last_name, a.contributor_first_name,
    a.employer, a.occupation, a.amount, a.contribution_date,
    a.cumulative_ytd, a.city, a.state, a.zip, a.cycle, a.source_form_type
  from contrib_filtered a
  left join filer_coverage fc on fc.committee_filer_id = a.committee_filer_id
  where
    -- F497P1 covered by a filed F460 is excluded (would be in Sched A already)
    not (
      upper(coalesce(a.source_form_type,'')) = 'F497P1'
      and fc.max_f460_rpt_end is not null
      and (a.contribution_date is null or a.contribution_date <= fc.max_f460_rpt_end)
    )
    -- Cross-reference / memo entries are excluded (PowerSearch behavior)
    and upper(coalesce(a.tran_type,'')) <> 'X'
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
with itemized as (
  select
    c.id as candidate_id,
    c.slug,
    c.name,
    c.committee_filer_id,
    coalesce(x.cycle, 'unknown') as cycle,
    count(*)      filter (where x.contributor_type in ('IND','OTH'))                           as individual_donor_count,
    sum(x.amount) filter (where x.contributor_type in ('IND','OTH'))                           as individual_contributions,
    sum(x.amount) filter (where x.contributor_type in ('COM','SCC'))                           as pac_contributions,
    sum(x.amount) filter (where x.contributor_type = 'PTY')                                    as party_contributions,
    sum(x.amount) filter (where x.contributor_type in ('IND','OTH') and x.amount < 200)        as small_dollar_contributions,
    count(*)      filter (where x.contributor_type in ('IND','OTH') and x.amount < 200)        as small_dollar_count,
    sum(x.amount) as itemized_total,
    max(x.contribution_date) as itemized_as_of
  from public.ca_candidates c
  left join public.ca_contributions_deduped x on x.candidate_id = c.id
  group by c.id, c.slug, c.name, c.committee_filer_id, x.cycle
),
latest_f460 as (
  select distinct on (f.filer_id, f.filing_id)
    f.filer_id, f.filing_id, f.amend_id, f.rpt_end
  from public.ca_filings f
  where f.form_type = 'F460'
  order by f.filer_id, f.filing_id, f.amend_id desc
),
unitemized_per_filer as (
  select
    lf.filer_id as committee_filer_id,
    case
      when lf.rpt_end is null then 'unknown'
      when lf.rpt_end < date '2025-01-01' then 'pre-cycle'
      when lf.rpt_end <= date '2026-06-02' then 'primary-2026'
      when lf.rpt_end <= date '2026-11-03' then 'general-2026'
      else 'post-2026'
    end as cycle,
    sum(coalesce(s.amount_a, 0)) as unitemized_contributions
  from latest_f460 lf
  join public.ca_summaries s
    on s.filing_id = lf.filing_id
   and s.amend_id  = lf.amend_id
   and s.form_type = 'A'
   and s.line_item = '2'
  group by lf.filer_id, 2
)
select
  i.candidate_id,
  i.slug,
  i.name,
  i.committee_filer_id,
  i.cycle,
  i.individual_donor_count,
  i.individual_contributions,
  i.pac_contributions,
  i.party_contributions,
  i.small_dollar_contributions,
  i.small_dollar_count,
  coalesce(u.unitemized_contributions, 0)              as unitemized_contributions,
  i.itemized_total                                     as itemized_total,
  coalesce(i.itemized_total, 0) + coalesce(u.unitemized_contributions, 0) as total_raised,
  i.itemized_as_of                                     as as_of
from itemized i
left join unitemized_per_filer u
  on u.committee_filer_id = i.committee_filer_id
 and u.cycle = i.cycle;

create unique index ca_contributions_summary_pk
  on public.ca_contributions_summary (candidate_id, cycle);

create index ca_contributions_summary_slug_idx
  on public.ca_contributions_summary (slug);

grant select on public.ca_contributions_summary to anon, authenticated;

refresh materialized view public.ca_contributions_summary;
