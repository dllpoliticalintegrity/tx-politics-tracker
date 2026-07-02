-- Dedupe Form 497 (late-contribution) rows against their Form 460 Schedule A
-- twins so candidate totals don't double-count.
--
-- Form 497 is a 24-96h pre-election late-report. The same dollars are then
-- re-reported on the next quarterly Form 460 Schedule A as a separate filing
-- with a separate filing_id and tran_id. Our (filing_id, amend_id, tran_id)
-- upsert key keeps both, and total_raised sums them.
--
-- Concrete impact at the time of this migration:
--   Tom Steyer  $238,984,113  →  $133,969,737   (-$105M phantom F497)
--   Matt Mahan  inflated by ~$23.5M
--   Eric Swalwell inflated by ~$5.1M
--   ~24 candidates net ~$138M overstated.
--
-- Stage 5 (import_ie_contributions) already does this dedup against IE
-- committees. This migration is the equivalent for the candidate side via a
-- view-layer fix (no ingest changes, no data deleted — F497 rows stay in
-- ca_contributions for historical traceability, they're just hidden from the
-- deduped view).

-- ---------------------------------------------------------------------------
-- 1. Drop dependent views in the right order. ca_top_donors and
--    ca_contributions_summary will be recreated below; ca_contributions_deduped
--    is the one we're actually changing.
-- ---------------------------------------------------------------------------
drop materialized view if exists public.ca_contributions_summary;
drop view if exists public.ca_top_donors;
drop view if exists public.ca_contributions_deduped;

-- ---------------------------------------------------------------------------
-- 2. Recreate ca_contributions_deduped with two layers of dedup:
--    (a) per (filing_id), keep only the highest amend_id   -- amendments
--    (b) per (candidate, donor name, date, amount), prefer F460 schedules
--        (A, C, I) over F497                               -- late-report dups
-- ---------------------------------------------------------------------------
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
ranked as (
  select
    a.*,
    row_number() over (
      partition by
        a.candidate_id,
        upper(coalesce(a.contributor_last_name, '')),
        upper(coalesce(a.contributor_first_name, '')),
        a.contribution_date,
        a.amount
      order by
        -- Prefer F460 schedules (Schedule A=monetary, C=non-monetary, I=misc
        -- increases) over F497 late reports for the same dollars.
        case when upper(coalesce(a.source_form_type, '')) in ('A','C','I') then 0
             when upper(coalesce(a.source_form_type, ''))  = 'F497'        then 2
             else 1 end,
        a.amend_id desc,
        a.filing_id desc
    ) as rn
  from amend_filtered a
)
select
  id, candidate_id, committee_filer_id, filing_id, amend_id, tran_id,
  contributor_type, contributor_last_name, contributor_first_name,
  employer, occupation, amount, contribution_date,
  cumulative_ytd, city, state, zip, cycle, source_form_type
from ranked
where rn = 1;

grant select on public.ca_contributions_deduped to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- 3. Recreate ca_top_donors (definition unchanged from
--    20260421180020_tighten_ca_top_donors_grouping.sql — it already sources
--    from ca_contributions_deduped, so it picks up the new dedup
--    automatically).
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- 4. Recreate ca_contributions_summary as a materialized view that sources
--    from the deduped view. This is the table the frontend reads for "total
--    raised" — sourcing from ca_contributions directly (as before) was the
--    root cause of the inflated Steyer number.
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- 5. Refresh helper unchanged in shape, but recreate to make sure it's
--    pointed at the post-recreated MVs.
-- ---------------------------------------------------------------------------
create or replace function public.refresh_ca_finance_views()
returns void
language plpgsql
security definer
set search_path = public
set statement_timeout = '0'
as $$
begin
  refresh materialized view concurrently public.ca_contributions_summary;
  refresh materialized view concurrently public.ca_ie_by_candidate;
  refresh materialized view concurrently public.ca_top_ie_donors;
end;
$$;

grant execute on function public.refresh_ca_finance_views() to service_role;

-- ---------------------------------------------------------------------------
-- 6. Initial populate so the page reflects the fix immediately.
-- ---------------------------------------------------------------------------
refresh materialized view public.ca_contributions_summary;
