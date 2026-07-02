-- Align fundraising "total raised" with CA SOS PowerSearch.
--
-- Two upstream defects produced wrong totals on the UI:
--
--   1. ca_cover_page_totals read from ca_filing_summary, a one-shot snapshot
--      table loaded 2026-04-21 and never refreshed. Every candidate's
--      pre-primary F460 (rpt_end 2026-04-18, filed ~2026-04-23) is missing
--      from it, so the view returned stale or zero values — most visibly
--      Matt Mahan at $0 raised despite his F460 reporting $13.3M.
--
--   2. ca_filing_summary also kept every amendment as a separate row, so the
--      view double-counted: Porter's mid-year F460 has 3 amendments at
--      $3,015,742.74 each, all summed.
--
-- The actively-maintained source is ca_summaries (refreshed by the daily
-- ca-finance-sync job through 2026-05-01). Switching the cover-page view to
-- it, with last-amendment dedup, makes ca_cover_page_totals match the
-- numbers PowerSearch displays.
--
-- ca_contributions_summary.total_raised currently sums itemized contribution
-- rows from ca_contributions_deduped. That diverges from PowerSearch in
-- both directions: F497 24-hour reports that don't have an F460 twin yet
-- inflate Steyer ($158.7M itemized vs $134.0M cover page), and itemization
-- gaps under-count Villaraigosa ($4.1M itemized vs $7.1M cover page). The
-- canonical / PowerSearch number is F460 Line 5 column A — Total
-- Contributions Received — summed across reporting periods. We override
-- total_raised with that value while leaving the donor-type breakdowns
-- (which can only come from itemized rows) unchanged.

-- Drop the dependent matview first so the cover-page view can be replaced.
-- ca_contributions_summary is rebuilt below to read from the new view.
drop materialized view if exists public.ca_contributions_summary;
drop view if exists public.ca_cover_page_totals;

create view public.ca_cover_page_totals as
with latest_f460 as (
  select distinct on (f.filer_id, f.filing_id)
    f.filer_id,
    f.filing_id,
    f.amend_id,
    f.filed_date,
    f.rpt_end
  from public.ca_filings f
  where f.form_type = 'F460'
  order by f.filer_id, f.filing_id, f.amend_id desc
)
select
  c.id   as candidate_id,
  c.slug,
  c.name,
  coalesce(sum(s.amount_a) filter (where s.line_item = '1'), 0) as reported_monetary,
  coalesce(sum(s.amount_a) filter (where s.line_item = '2'), 0) as reported_loans,
  coalesce(sum(s.amount_a) filter (where s.line_item = '4'), 0) as reported_nonmonetary,
  coalesce(sum(s.amount_a) filter (where s.line_item = '5'), 0) as reported_total_contributions,
  max(lf.filed_date) as last_460_filed,
  max(lf.rpt_end)    as last_460_through
from public.ca_candidates c
left join latest_f460 lf on lf.filer_id = c.committee_filer_id
left join public.ca_summaries s
  on s.filing_id = lf.filing_id
 and s.amend_id  = lf.amend_id
 and s.form_type = 'F460'
group by c.id, c.slug, c.name;

grant select on public.ca_cover_page_totals to anon, authenticated, service_role;

-- Rebuild ca_contributions_summary so total_raised tracks the cover-page
-- Total Contributions Received (PowerSearch's headline number). Breakdowns
-- continue to come from itemized rows; they will not always sum to
-- total_raised, which is correct — small unitemized contributions appear in
-- Line 1 but not in Schedule A. (Already dropped above so the view above
-- could be replaced.)

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
  -- PowerSearch-equivalent total: F460 Line 5 column A summed over latest
  -- amendment of every reporting period. Falls back to the itemized sum if
  -- no F460 has been filed yet (long-shot candidates, brand-new filers).
  case
    when cpt.reported_total_contributions is not null
     and cpt.reported_total_contributions > 0
    then cpt.reported_total_contributions
    else i.itemized_total
  end as total_raised,
  greatest(i.itemized_as_of, cpt.last_460_through) as as_of
from itemized i
left join public.ca_cover_page_totals cpt on cpt.candidate_id = i.candidate_id;

create unique index ca_contributions_summary_pk
  on public.ca_contributions_summary (candidate_id, cycle);

create index ca_contributions_summary_slug_idx
  on public.ca_contributions_summary (slug);

grant select on public.ca_contributions_summary to anon, authenticated;

refresh materialized view public.ca_contributions_summary;
