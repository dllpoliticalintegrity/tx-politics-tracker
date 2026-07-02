-- Revert ca_contributions_summary.total_raised to summing itemized contribution
-- rows from ca_contributions_deduped — that matches PowerSearch's filer-page
-- "Total Contributions Received" figure.
--
-- The previous migration (20260504000000_match_powersearch_totals) overrode
-- total_raised with F460 Line 5 column A from the cover page. That number
-- (~$134M for Steyer) is the sum of cover-page reporting periods, which is
-- different from PowerSearch's filer-summary total ($158,660,741.84 for
-- Steyer — sum of every itemized transaction). PowerSearch's headline
-- aggregates transactions, not cover-page line totals, so we go back to
-- summing transactions.
--
-- Keep the cover-page view (ca_cover_page_totals) as fixed in 20260504000000:
-- it still has value for filings-level reporting, and the previous read from
-- the stale ca_filing_summary snapshot was wrong regardless.

drop materialized view if exists public.ca_contributions_summary;

create materialized view public.ca_contributions_summary as
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
  sum(x.amount) as total_raised,
  max(x.contribution_date) as as_of
from public.ca_candidates c
left join public.ca_contributions_deduped x on x.candidate_id = c.id
group by c.id, c.slug, c.name, c.committee_filer_id, x.cycle;

create unique index ca_contributions_summary_pk
  on public.ca_contributions_summary (candidate_id, cycle);

create index ca_contributions_summary_slug_idx
  on public.ca_contributions_summary (slug);

grant select on public.ca_contributions_summary to anon, authenticated;

refresh materialized view public.ca_contributions_summary;
