-- Applied to the TX-tracker project on 2026-10-07 via the Supabase MCP
-- (apply_migration "tx_top_donors_materialized").
--
-- tx_top_donors was a plain view that re-aggregated every contribution
-- (~650k tx_contributions rows, regexp-normalised donor names) on each
-- request. The /money/donors page asks it for the whole governor race at
-- once; by October that took ~2.7 s inside Postgres, and through PostgREST
-- it crossed the anon role's 3 s statement_timeout (57014), so the page
-- showed "Something went wrong loading donor data". Candidate profiles paid
-- 1-2 s for the same aggregate.
--
-- Same fix as tx_top_ie_donors (materialized from the start) and the
-- multi-state site's cf_top_donors (20260923 cf_top_donors_materialized):
-- the live view stays as the source under a new name, and the matview takes
-- over the old name and columns (plus a surrogate `rn` so it has a unique
-- index and can be refreshed concurrently), so the frontend needs no change.
-- Nothing else depends on the view, so the rename is safe.
alter view public.tx_top_donors rename to tx_top_donors_live;

create materialized view public.tx_top_donors as
select
  row_number() over (order by candidate_id, total_amount desc, contributor_last_name, contributor_first_name) as rn,
  *
from public.tx_top_donors_live;

create unique index tx_top_donors_pk on public.tx_top_donors (rn);
-- Candidate profile: one candidate's donors by amount.
create index tx_top_donors_candidate_amount_idx
  on public.tx_top_donors (candidate_id, total_amount desc);
-- Top donors page: a whole race's candidates at once, by amount.
create index tx_top_donors_total_amount_idx
  on public.tx_top_donors (total_amount desc);

grant select on public.tx_top_donors to anon, authenticated, service_role;

-- tx-finance-sync.yml calls this after every import; it now keeps
-- tx_top_donors current too.
create or replace function public.refresh_tx_finance_views()
returns void
language plpgsql
security definer
set search_path = public
set statement_timeout = '10min'
as $$
begin
  perform public.refresh_tx_special_supersession();
  refresh materialized view concurrently public.tx_contributions_summary;
  refresh materialized view concurrently public.tx_ie_by_candidate;
  refresh materialized view concurrently public.tx_top_ie_donors;
  refresh materialized view concurrently public.tx_top_donors;
end;
$$;
grant execute on function public.refresh_tx_finance_views() to service_role;
