-- Convert ca_contributions_summary and ca_ie_by_candidate from regular views
-- into materialized views to reduce DB load. They aggregate millions of rows
-- but source data only changes once/day from the ca-finance-sync workflow.
-- The workflow appends a REFRESH MATERIALIZED VIEW CONCURRENTLY step.

drop view if exists public.ca_contributions_summary;
drop view if exists public.ca_ie_by_candidate;

create materialized view public.ca_contributions_summary as
select
  c.id as candidate_id,
  c.slug,
  c.name,
  c.committee_filer_id,
  coalesce(x.cycle, 'unknown') as cycle,
  count(*) filter (where x.contributor_type in ('IND','OTH')) as individual_donor_count,
  sum(x.amount) filter (where x.contributor_type in ('IND','OTH')) as individual_contributions,
  sum(x.amount) filter (where x.contributor_type in ('COM','SCC')) as pac_contributions,
  sum(x.amount) filter (where x.contributor_type = 'PTY') as party_contributions,
  sum(x.amount) filter (where x.contributor_type in ('IND','OTH') and x.amount < 200) as small_dollar_contributions,
  count(*) filter (where x.contributor_type in ('IND','OTH') and x.amount < 200) as small_dollar_count,
  sum(x.amount) as total_raised,
  max(x.contribution_date) as as_of
from public.ca_candidates c
left join public.ca_contributions x on x.candidate_id = c.id
group by c.id, c.slug, c.name, c.committee_filer_id, x.cycle;

-- Required for REFRESH MATERIALIZED VIEW CONCURRENTLY
create unique index ca_contributions_summary_pk
  on public.ca_contributions_summary (candidate_id, cycle);

create index ca_contributions_summary_slug_idx
  on public.ca_contributions_summary (slug);

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
left join public.ca_independent_expenditures ie on ie.target_candidate_id = c.id
group by c.id, c.slug, c.name, ie.cycle;

create unique index ca_ie_by_candidate_pk
  on public.ca_ie_by_candidate (candidate_id, cycle);

create index ca_ie_by_candidate_slug_idx
  on public.ca_ie_by_candidate (slug);

-- Grant read access to the same roles the underlying tables expose. PostgREST
-- needs explicit SELECT on materialized views (RLS does not apply to MVs).
grant select on public.ca_contributions_summary to anon, authenticated;
grant select on public.ca_ie_by_candidate to anon, authenticated;

-- Helper that the GitHub Actions sync calls after import. Using a function
-- means the workflow doesn't need direct DB perms — it can invoke via RPC.
create or replace function public.refresh_ca_finance_views()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  refresh materialized view concurrently public.ca_contributions_summary;
  refresh materialized view concurrently public.ca_ie_by_candidate;
end;
$$;

grant execute on function public.refresh_ca_finance_views() to service_role;
