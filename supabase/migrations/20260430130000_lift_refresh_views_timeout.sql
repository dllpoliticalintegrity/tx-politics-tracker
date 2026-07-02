-- Lift the per-role statement_timeout for refresh_ca_finance_views().
--
-- The function is invoked over PostgREST as service_role (from
-- .github/workflows/ca-finance-sync.yml's "Refresh materialized views" step),
-- which runs under Supabase's default ~8s statement_timeout. The three
-- CONCURRENTLY refreshes inside the function — ca_contributions_summary,
-- ca_ie_by_candidate, ca_top_ie_donors — collectively exceed that on real
-- data, so Postgres cancels the query (SQLSTATE 57014) and PostgREST returns
-- HTTP 500. The workflow's curl then exits 22.
--
-- Setting statement_timeout = 0 at the function level lifts the timeout only
-- for the duration of this function call; other queries on the same role
-- still get the normal limit. Function body is otherwise identical to
-- migration 20260423220000.

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
