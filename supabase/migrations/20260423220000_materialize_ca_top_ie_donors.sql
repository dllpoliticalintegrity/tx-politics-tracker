-- Convert ca_top_ie_donors from a regular view to a materialized view.
--
-- The view aggregates ~631K rows in ca_ie_contributions into ~172K output
-- rows on every request, which exceeds the anon role's ~3s statement timeout
-- (PGRST returns 57014). The sibling ca_top_donors view only aggregates ~32K
-- rows and fits inside the budget, which is why only the IE page errored.
--
-- Refresh cadence matches ca_contributions_summary / ca_ie_by_candidate:
-- the ca-finance-sync GitHub Action calls refresh_ca_finance_views() once
-- per day after the CAL-ACCESS ingest, and we extend that function below.

drop view if exists public.ca_top_ie_donors;

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

-- Required for REFRESH MATERIALIZED VIEW CONCURRENTLY.
create unique index ca_top_ie_donors_pk
  on public.ca_top_ie_donors (ie_committee_filer_id, norm_last_key, norm_first_key);

-- Supports the frontend's "order by total_amount desc limit 10000" query.
create index ca_top_ie_donors_total_amount_idx
  on public.ca_top_ie_donors (total_amount desc);

grant select on public.ca_top_ie_donors to anon, authenticated, service_role;

-- Extend the existing refresh helper so the daily GH Action picks this up.
create or replace function public.refresh_ca_finance_views()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  refresh materialized view concurrently public.ca_contributions_summary;
  refresh materialized view concurrently public.ca_ie_by_candidate;
  refresh materialized view concurrently public.ca_top_ie_donors;
end;
$$;

grant execute on function public.refresh_ca_finance_views() to service_role;

-- Initial populate so the page works as soon as this migration lands.
refresh materialized view public.ca_top_ie_donors;
