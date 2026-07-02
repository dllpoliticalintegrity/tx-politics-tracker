-- TX campaign finance schema (TEC data), mirroring the ca_* tables this repo
-- uses so the frontend port is a mechanical ca_ → tx_ rename.
--
-- NOTE: this file lives under scripts/ on purpose — it must NOT run against
-- the CA Supabase project. When bootstrapping the tx-gov-polling repo, move it
-- to supabase/migrations/<timestamp>_tx_campaign_finance.sql.

-- ---------------------------------------------------------------------------
-- Candidates (seeded manually; use `import_tx_finance.py --discover` to find
-- active GOVERNOR filers). Two filer accounts per candidate, like CA:
-- the candidate/officeholder (COH) account, plus an optional principal
-- specific-purpose committee — e.g. Greg Abbott is COH 19652 but raises
-- through SPAC 51153 "Texans for Greg Abbott". spacs.csv links SPACs to the
-- candidates they support.
-- ---------------------------------------------------------------------------
create table if not exists public.tx_candidates (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  party text,
  filer_ident text not null unique,      -- TEC COH filer account #, leading zeros stripped
  committee_filer_ident text unique,     -- principal SPAC account #, if the campaign uses one
  committee_name text,
  office text not null default 'GOVERNOR',
  election_year integer not null default 2026,
  status text default 'active',
  title text,
  bio text,
  photo_url text,
  photo_url_large text,
  photo_url_medium text,
  photo_url_thumb text,
  website text,
  twitter_user text,
  instagram_user text,
  facebook_user text,
  youtube_user text,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_tx_candidates_slug on public.tx_candidates(slug);
alter table public.tx_candidates enable row level security;
create policy "TX candidates are publicly readable"
  on public.tx_candidates for select using (true);

-- Example seed (curate the real list with --discover):
-- insert into public.tx_candidates (slug, name, party, filer_ident, committee_filer_ident, committee_name)
-- values ('greg-abbott', 'Greg Abbott', 'Republican', '19652', '51153', 'Texans for Greg Abbott');

-- ---------------------------------------------------------------------------
-- Filings: one row per TEC report (cover sheet). Cover sheets carry the
-- unitemized totals and cash on hand, so there is no separate summaries table
-- (the CA pipeline needed SMRY_CD for this).
-- ---------------------------------------------------------------------------
create table if not exists public.tx_filings (
  report_info_ident bigint primary key,
  filer_ident text not null,
  filer_name text,
  form_type text,
  report_types text,                     -- comma-joined reportTypeCd1..10
  received_dt date,
  filed_dt date,
  period_start date,
  period_end date,
  election_dt date,
  election_type text,
  superseded boolean not null default false,  -- infoOnlyFlag = 'Y'
  unitemized_contribs numeric(14,2),
  total_contribs numeric(14,2),
  unitemized_expend numeric(14,2),
  total_expend numeric(14,2),
  loan_balance numeric(14,2),
  cash_on_hand numeric(14,2),            -- contribsMaintainedAmount
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_tx_filings_filer on public.tx_filings(filer_ident, period_end desc);
alter table public.tx_filings enable row level security;
create policy "TX filings are publicly readable"
  on public.tx_filings for select using (true);

-- ---------------------------------------------------------------------------
-- Itemized contributions (Schedules A/C). Superseded reports are skipped at
-- import time (infoOnlyFlag), so no amendment-window dedup is needed here.
-- ---------------------------------------------------------------------------
create table if not exists public.tx_contributions (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references public.tx_candidates(id) on delete cascade,
  filer_ident text not null,
  report_info_ident bigint not null,
  contribution_info_id bigint not null,
  contributor_type text,                 -- INDIVIDUAL | ENTITY
  contributor_last_name text,            -- organization name for ENTITY
  contributor_first_name text,
  employer text,
  occupation text,
  amount numeric(14,2) not null,
  contribution_date date,
  city text,
  state text,
  zip text,
  out_of_state_pac boolean not null default false,
  cycle text,
  source_form_type text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (report_info_ident, contribution_info_id)
);
create index if not exists idx_tx_contributions_cand_date on public.tx_contributions(candidate_id, contribution_date desc);
create index if not exists idx_tx_contributions_cand_amount on public.tx_contributions(candidate_id, amount desc);
create index if not exists idx_tx_contributions_name on public.tx_contributions(contributor_last_name, contributor_first_name);
create index if not exists idx_tx_contributions_cycle on public.tx_contributions(candidate_id, cycle);
alter table public.tx_contributions enable row level security;
create policy "TX contributions are publicly readable"
  on public.tx_contributions for select using (true);

-- ---------------------------------------------------------------------------
-- Itemized expenditures (Schedules F/G/H/I)
-- ---------------------------------------------------------------------------
create table if not exists public.tx_expenditures (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references public.tx_candidates(id) on delete cascade,
  filer_ident text not null,
  report_info_ident bigint not null,
  expend_info_id bigint not null,
  payee_type text,
  payee_last_name text,
  payee_first_name text,
  payee_city text,
  payee_state text,
  payee_zip text,
  amount numeric(14,2) not null,
  expenditure_date date,
  category_code text,
  description text,
  cycle text,
  source_form_type text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (report_info_ident, expend_info_id)
);
create index if not exists idx_tx_expenditures_cand_date on public.tx_expenditures(candidate_id, expenditure_date desc);
create index if not exists idx_tx_expenditures_cand_amount on public.tx_expenditures(candidate_id, amount desc);
alter table public.tx_expenditures enable row level security;
create policy "TX expenditures are publicly readable"
  on public.tx_expenditures for select using (true);

-- ---------------------------------------------------------------------------
-- Loans (Schedule E)
-- ---------------------------------------------------------------------------
create table if not exists public.tx_loans (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references public.tx_candidates(id) on delete cascade,
  filer_ident text not null,
  report_info_ident bigint not null,
  loan_info_id bigint not null,
  lender_type text,
  lender_last_name text,
  lender_first_name text,
  amount numeric(14,2) not null,
  loan_date date,
  is_guarantor boolean not null default false,
  cycle text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (report_info_ident, loan_info_id)
);
alter table public.tx_loans enable row level security;
create policy "TX loans are publicly readable"
  on public.tx_loans for select using (true);

-- ---------------------------------------------------------------------------
-- Direct campaign expenditures — Texas's independent-expenditure analog.
-- tx_ie_committees indexes the DCE filers; tx_independent_expenditures holds
-- the CAND rows (one per benefited candidate per expenditure).
-- ---------------------------------------------------------------------------
create table if not exists public.tx_ie_committees (
  filer_ident text primary key,
  name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.tx_ie_committees enable row level security;
create policy "TX IE committees are publicly readable"
  on public.tx_ie_committees for select using (true);

create table if not exists public.tx_independent_expenditures (
  id uuid primary key default gen_random_uuid(),
  expend_info_id bigint not null,
  expend_persent_id bigint not null,
  report_info_ident bigint not null,
  ie_filer_ident text not null references public.tx_ie_committees(filer_ident),
  target_candidate_id uuid references public.tx_candidates(id) on delete cascade,
  support_oppose text not null default 'S',
  amount numeric(14,2) not null,
  expenditure_date date,
  description text,
  category_code text,
  cycle text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (expend_info_id, expend_persent_id)
);
create index if not exists idx_tx_ie_target_date on public.tx_independent_expenditures(target_candidate_id, expenditure_date desc);
create index if not exists idx_tx_ie_committee on public.tx_independent_expenditures(ie_filer_ident, expenditure_date desc);
alter table public.tx_independent_expenditures enable row level security;
create policy "TX independent expenditures are publicly readable"
  on public.tx_independent_expenditures for select using (true);

-- Curated overrides for DCE filers whose target/support-oppose attribution
-- needs pinning (rare in TX since DCE rows name the candidate directly;
-- kept for parity with ca_ie_committee_targets).
create table if not exists public.tx_ie_committee_targets (
  ie_filer_ident text not null,
  target_candidate_id uuid not null references public.tx_candidates(id) on delete cascade,
  support_oppose text not null default 'S',
  note text,
  primary key (ie_filer_ident, target_candidate_id)
);
alter table public.tx_ie_committee_targets enable row level security;
create policy "TX IE committee targets are publicly readable"
  on public.tx_ie_committee_targets for select using (true);

-- Contributions into DCE filers (top IE donors)
create table if not exists public.tx_ie_contributions (
  id uuid primary key default gen_random_uuid(),
  ie_filer_ident text not null references public.tx_ie_committees(filer_ident),
  report_info_ident bigint not null,
  contribution_info_id bigint not null,
  contributor_type text,
  contributor_last_name text,
  contributor_first_name text,
  employer text,
  occupation text,
  amount numeric(14,2) not null,
  contribution_date date,
  city text,
  state text,
  zip text,
  out_of_state_pac boolean not null default false,
  cycle text,
  source_form_type text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (report_info_ident, contribution_info_id)
);
create index if not exists idx_tx_ie_contribs_committee_amount
  on public.tx_ie_contributions(ie_filer_ident, amount desc);
alter table public.tx_ie_contributions enable row level security;
create policy "TX IE contributions are publicly readable"
  on public.tx_ie_contributions for select using (true);

-- ---------------------------------------------------------------------------
-- Materialized views (starter versions of ca_contributions_summary /
-- ca_ie_by_candidate; refine against official TEC search totals the way the
-- 202605* CA migrations did against PowerSearch).
--
-- total_raised = itemized rows + the unitemized line from the latest
-- non-superseded filings. TEC has no $200-style itemization floor and no
-- contribution limits, so "small dollar" here just uses the same <200 cut
-- the CA views used — revisit once real distributions are visible.
-- ---------------------------------------------------------------------------
create materialized view if not exists public.tx_contributions_summary as
select
  c.id as candidate_id,
  c.slug,
  c.name,
  c.filer_ident,
  coalesce(x.cycle, 'unknown') as cycle,
  count(*) filter (where x.contributor_type = 'INDIVIDUAL') as individual_donor_count,
  sum(x.amount) filter (where x.contributor_type = 'INDIVIDUAL') as individual_contributions,
  sum(x.amount) filter (where x.contributor_type = 'ENTITY') as entity_contributions,
  sum(x.amount) filter (where x.contributor_type = 'INDIVIDUAL' and x.amount < 200) as small_dollar_contributions,
  count(*) filter (where x.contributor_type = 'INDIVIDUAL' and x.amount < 200) as small_dollar_count,
  sum(x.amount) as total_raised,
  max(x.contribution_date) as as_of
from public.tx_candidates c
left join public.tx_contributions x on x.candidate_id = c.id
group by c.id, c.slug, c.name, c.filer_ident, x.cycle;

create unique index if not exists tx_contributions_summary_pk
  on public.tx_contributions_summary (candidate_id, cycle);
create index if not exists tx_contributions_summary_slug_idx
  on public.tx_contributions_summary (slug);

create materialized view if not exists public.tx_ie_by_candidate as
select
  c.id as candidate_id,
  c.slug,
  c.name,
  coalesce(ie.cycle, 'unknown') as cycle,
  sum(ie.amount) filter (where upper(ie.support_oppose) = 'S') as total_supporting,
  sum(ie.amount) filter (where upper(ie.support_oppose) = 'O') as total_opposing,
  count(*) filter (where upper(ie.support_oppose) = 'S') as supporting_count,
  count(*) filter (where upper(ie.support_oppose) = 'O') as opposing_count,
  count(distinct ie.ie_filer_ident) as committee_count,
  max(ie.expenditure_date) as as_of
from public.tx_candidates c
left join public.tx_independent_expenditures ie on ie.target_candidate_id = c.id
group by c.id, c.slug, c.name, ie.cycle;

create unique index if not exists tx_ie_by_candidate_pk
  on public.tx_ie_by_candidate (candidate_id, cycle);
create index if not exists tx_ie_by_candidate_slug_idx
  on public.tx_ie_by_candidate (slug);

-- PostgREST needs explicit SELECT on materialized views (RLS doesn't apply).
grant select on public.tx_contributions_summary to anon, authenticated;
grant select on public.tx_ie_by_candidate to anon, authenticated;

create or replace function public.refresh_tx_finance_views()
returns void
language plpgsql
security definer
set statement_timeout = '10min'
as $$
begin
  refresh materialized view concurrently public.tx_contributions_summary;
  refresh materialized view concurrently public.tx_ie_by_candidate;
end;
$$;
