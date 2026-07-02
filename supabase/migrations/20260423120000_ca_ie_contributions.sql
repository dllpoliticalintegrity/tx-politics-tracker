-- ============================================================================
-- CA Governor 2026 — contributions received by independent-expenditure (IE)
-- committees active in this race.
--
-- `ca_contributions` holds receipts into the 24 CANDIDATE committees. This
-- migration adds the parallel table for IE committees (the "super PACs" of
-- California campaign finance) so we can show who funds the outside money.
--
-- An IE "committee" here = any filer in `ca_ie_committees`, which the ingest
-- populates from F496/F461 filings targeting our candidates. Contributions
-- TO those committees come from their own Form 460 disclosures (RCPT_CD).
-- ============================================================================

create table if not exists public.ca_ie_contributions (
  id uuid primary key default gen_random_uuid(),
  ie_committee_filer_id integer not null
    references public.ca_ie_committees(filer_id) on delete cascade,
  filing_id bigint not null,
  amend_id integer not null,
  tran_id text not null,
  contributor_type text,
  contributor_last_name text,
  contributor_first_name text,
  employer text,
  occupation text,
  amount numeric(14,2) not null,
  contribution_date date,
  cumulative_ytd numeric(14,2),
  city text,
  state text,
  zip text,
  cycle text,
  source_form_type text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (filing_id, amend_id, tran_id)
);

create index if not exists idx_ca_ie_contribs_committee_date
  on public.ca_ie_contributions(ie_committee_filer_id, contribution_date desc);
create index if not exists idx_ca_ie_contribs_committee_amount
  on public.ca_ie_contributions(ie_committee_filer_id, amount desc);
create index if not exists idx_ca_ie_contribs_name
  on public.ca_ie_contributions(contributor_last_name, contributor_first_name);
create index if not exists idx_ca_ie_contribs_cycle
  on public.ca_ie_contributions(cycle);

alter table public.ca_ie_contributions enable row level security;

create policy "CA IE contributions are publicly readable"
  on public.ca_ie_contributions for select using (true);

create trigger update_ca_ie_contributions_updated_at
  before update on public.ca_ie_contributions
  for each row execute function public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- ca_top_ie_donors — aggregated donors to each IE committee, grouped by
-- normalized full name. Mirrors the ca_top_donors view.
-- ---------------------------------------------------------------------------

drop view if exists public.ca_top_ie_donors;

create view public.ca_top_ie_donors as
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
  norm_last,
  coalesce(norm_first, '');

grant select on public.ca_top_ie_donors to anon, authenticated, service_role;
