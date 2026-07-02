-- Add unitemized small-dollar contributions to ca_contributions_summary by
-- reading directly from ca_summaries (CAL-ACCESS SMRY_CD), not by inventing
-- fake transaction rows.
--
-- F460 Schedule A line 2 ("Unitemized Monetary Contributions of less than
-- $100") is a real reported value — committees file it on the cover page.
-- Sum across the latest amendment of every F460 filing for the candidate's
-- committee, and expose it as a column on ca_contributions_summary.
-- total_raised = itemized transactions (from ca_contributions_deduped)
--              + unitemized summary lines (from ca_summaries).
--
-- ca_contributions_deduped stays pure transaction-row data (no synthesis).

drop materialized view if exists public.ca_contributions_summary;

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
  -- One row per (filer_id, filing_id) keeping the highest amend_id.
  select distinct on (f.filer_id, f.filing_id)
    f.filer_id, f.filing_id, f.amend_id, f.rpt_end
  from public.ca_filings f
  where f.form_type = 'F460'
  order by f.filer_id, f.filing_id, f.amend_id desc
),
unitemized_per_filer as (
  -- Sum F460 Schedule A line 2 (unitemized monetary < $100, period column A)
  -- across the latest amendment of each filing.
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
