-- Resolve the latest version of each filing on the IE side so amendments stop
-- double-counting (CCDC-style filing-version resolution).
--
-- CAL-ACCESS amendments are full re-statements: amend 1 restates everything in
-- amend 0. The importer keys every row on (filing_id, amend_id, tran_id), so
-- all amendments persist as separate rows. The candidate-contribution path
-- already collapses to the latest amendment (ca_contributions_deduped's
-- max_amend CTE). The IE path never did, so ca_ie_by_candidate, ca_top_ie_donors
-- and the frontend's direct ca_independent_expenditures queries summed across
-- every amendment. Measured on production at the time of this migration:
--
--   ca_independent_expenditures  $239.8M shown -> $173.1M latest-only  (+38%)
--   ca_ie_contributions          $475.6M shown -> $369.3M latest-only  (+29%)
--   Steyer IE support $106.1M -> $73.8M; Mahan $78.7M -> $52.0M.
--
-- Fix: stamp an is_latest flag per (filing_id) on both IE tables, recompute it
-- after every ingest, and filter every consumer on it. A stored flag (rather
-- than a sibling _deduped view) is used because the frontend reads these base
-- tables directly and can filter with a simple is_latest predicate.

-- ---------------------------------------------------------------------------
-- 1. Columns. Default true so a freshly-upserted amendment is visible until the
--    next recompute; recompute_ca_latest_flags() is the authority on the value.
-- ---------------------------------------------------------------------------
alter table public.ca_independent_expenditures
  add column if not exists is_latest boolean not null default true;
alter table public.ca_ie_contributions
  add column if not exists is_latest boolean not null default true;

-- ---------------------------------------------------------------------------
-- 2. Recompute: is_latest = (amend_id = max(amend_id) for that filing).
--    Idempotent; the WHERE only rewrites rows whose flag actually changes, so
--    the daily call is cheap and doesn't churn WAL.
-- ---------------------------------------------------------------------------
create or replace function public.recompute_ca_latest_flags()
returns void
language plpgsql
security definer
set search_path = public
set statement_timeout = '0'
as $$
begin
  update public.ca_independent_expenditures t
     set is_latest = (t.amend_id = m.max_amend)
    from (
      select filing_id, max(amend_id) as max_amend
      from public.ca_independent_expenditures
      group by filing_id
    ) m
   where m.filing_id = t.filing_id
     and t.is_latest is distinct from (t.amend_id = m.max_amend);

  update public.ca_ie_contributions t
     set is_latest = (t.amend_id = m.max_amend)
    from (
      select filing_id, max(amend_id) as max_amend
      from public.ca_ie_contributions
      group by filing_id
    ) m
   where m.filing_id = t.filing_id
     and t.is_latest is distinct from (t.amend_id = m.max_amend);
end;
$$;

grant execute on function public.recompute_ca_latest_flags() to service_role;

-- Backfill the flag on existing rows.
select public.recompute_ca_latest_flags();

-- ---------------------------------------------------------------------------
-- 3. Rebuild ca_ie_by_candidate to count only the latest amendment. The
--    predicate goes in the LEFT JOIN (not WHERE) so candidates with no IE
--    still appear. Definition otherwise identical to 20260421190000.
-- ---------------------------------------------------------------------------
drop materialized view if exists public.ca_ie_by_candidate;

create materialized view public.ca_ie_by_candidate as
select
  c.id as candidate_id,
  c.slug,
  c.name,
  coalesce(ie.cycle, 'unknown') as cycle,
  sum(ie.amount) filter (where upper(ie.support_oppose) = 'S') as total_supporting,
  sum(ie.amount) filter (where upper(ie.support_oppose) = 'O') as total_opposing,
  count(*) filter (where upper(ie.support_oppose) = 'S') as supporting_count,
  count(*) filter (where upper(ie.support_oppose) = 'O') as opposing_count,
  count(distinct ie.ie_committee_filer_id) as committee_count,
  max(ie.expenditure_date) as as_of
from public.ca_candidates c
left join public.ca_independent_expenditures ie
  on ie.target_candidate_id = c.id
 and ie.is_latest
group by c.id, c.slug, c.name, ie.cycle;

create unique index ca_ie_by_candidate_pk
  on public.ca_ie_by_candidate (candidate_id, cycle);
create index ca_ie_by_candidate_slug_idx
  on public.ca_ie_by_candidate (slug);

grant select on public.ca_ie_by_candidate to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 4. Rebuild ca_top_ie_donors to count only the latest amendment. Definition
--    otherwise identical to 20260423220000.
-- ---------------------------------------------------------------------------
drop materialized view if exists public.ca_top_ie_donors;

create materialized view public.ca_top_ie_donors as
with normalized as (
  select
    ie_committee_filer_id,
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
  from public.ca_ie_contributions
  where is_latest
)
select
  ie_committee_filer_id,
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
group by
  ie_committee_filer_id,
  coalesce(norm_last,  ''),
  coalesce(norm_first, '');

create unique index ca_top_ie_donors_pk
  on public.ca_top_ie_donors (ie_committee_filer_id, norm_last_key, norm_first_key);
create index ca_top_ie_donors_total_amount_idx
  on public.ca_top_ie_donors (total_amount desc);

grant select on public.ca_top_ie_donors to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- 5. Recompute is_latest before refreshing, so the daily pipeline picks up new
--    amendments. Order matters: flags first, then the matviews that read them.
-- ---------------------------------------------------------------------------
create or replace function public.refresh_ca_finance_views()
returns void
language plpgsql
security definer
set search_path = public
set statement_timeout = '0'
as $$
begin
  perform public.recompute_ca_latest_flags();
  refresh materialized view concurrently public.ca_contributions_summary;
  refresh materialized view concurrently public.ca_ie_by_candidate;
  refresh materialized view concurrently public.ca_top_ie_donors;
end;
$$;

grant execute on function public.refresh_ca_finance_views() to service_role;

-- ---------------------------------------------------------------------------
-- 6. Populate the rebuilt matviews now.
-- ---------------------------------------------------------------------------
refresh materialized view public.ca_ie_by_candidate;
refresh materialized view public.ca_top_ie_donors;
