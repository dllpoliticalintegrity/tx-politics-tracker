-- Fix ca_contributions_deduped: keep all F460 schedule rows; only dedup
-- F497 against F460.
--
-- The previous version (migration 20260501000000) used a single PARTITION BY
-- (candidate, donor_name, date, amount) which incorrectly collapsed any two
-- F460 Schedule A rows with matching semantic key. But donors routinely max
-- out both the primary and general elections at the same checkout — that
-- produces TWO real Schedule A entries on the same filing, same donor, same
-- date, same amount, with different TRAN_IDs. Both are legitimate and both
-- should count.
--
-- Concrete impact: Sergey Brin, David Baszucki, Ranee Lan, etc. each had
-- two $39,200 max-out gifts on the same day; the old view kept only one.
-- Across Mahan that hid $4M of donations; Porter's small-dollar online
-- giving with ~50K shared-name donors had ~73K rows incorrectly merged.
--
-- New logic via window function (single pass, O(N log N)):
--   1. For every (candidate, donor_name, date, amount) partition, compute
--      whether ANY row in the partition is an F460 schedule (A/C/I).
--   2. Keep all F460 schedule rows (each TRAN_ID is its own real
--      transaction — same-day duplicates are legitimate).
--   3. Drop F497/F497P1 rows whose partition has an F460 twin.
--   4. Keep F497 orphans (no F460 twin yet — late report not yet on the
--      next quarterly).

drop materialized view if exists public.ca_contributions_summary;
drop view if exists public.ca_top_donors;
drop view if exists public.ca_contributions_deduped;

create view public.ca_contributions_deduped as
with max_amend as (
  select
    filing_id,
    max(amend_id) as max_amend_id
  from public.ca_contributions
  where candidate_id is not null
  group by filing_id
),
amend_filtered as (
  select c.*
  from public.ca_contributions c
  join max_amend m
    on m.filing_id = c.filing_id
   and m.max_amend_id = c.amend_id
  where c.candidate_id is not null
),
flagged as (
  select a.*,
    bool_or(upper(coalesce(source_form_type, '')) in ('A','C','I')) over (
      partition by
        candidate_id,
        upper(coalesce(contributor_last_name, '')),
        upper(coalesce(contributor_first_name, '')),
        contribution_date,
        amount
    ) as has_f460_twin
  from amend_filtered a
)
select
  id, candidate_id, committee_filer_id, filing_id, amend_id, tran_id,
  contributor_type, contributor_last_name, contributor_first_name,
  employer, occupation, amount, contribution_date,
  cumulative_ytd, city, state, zip, cycle, source_form_type
from flagged
where upper(coalesce(source_form_type, '')) in ('A','C','I')
   or not has_f460_twin;

grant select on public.ca_contributions_deduped to anon, authenticated, service_role;

-- Recreate ca_top_donors (definition unchanged — it sources from
-- ca_contributions_deduped and picks up the new behavior automatically).
create view public.ca_top_donors as
with normalized as (
  select
    candidate_id,
    contributor_type,
    nullif(
      regexp_replace(
        regexp_replace(upper(btrim(contributor_last_name)), '[^A-Z0-9 ]', '', 'g'),
        '\s+', ' ', 'g'
      ), ''
    ) as norm_last,
    nullif(
      regexp_replace(
        regexp_replace(upper(btrim(contributor_first_name)), '[^A-Z0-9 ]', '', 'g'),
        '\s+', ' ', 'g'
      ), ''
    ) as norm_first,
    contributor_last_name,
    contributor_first_name,
    employer,
    occupation,
    city,
    state,
    amount,
    contribution_date
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
group by
  candidate_id,
  norm_last,
  coalesce(norm_first, '');

grant select on public.ca_top_donors to anon, authenticated, service_role;

create materialized view public.ca_contributions_summary as
select
  c.id as candidate_id,
  c.slug,
  c.name,
  c.committee_filer_id,
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
