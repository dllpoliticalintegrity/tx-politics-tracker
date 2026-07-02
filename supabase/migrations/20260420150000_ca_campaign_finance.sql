-- ============================================================================
-- CA Governor 2026 Campaign Finance
-- Mirrors the vote-integrity FEC schema pattern with CAL-ACCESS-sourced tables.
-- Scope: 2026 primary + general, all 24 certified-list candidates.
-- ============================================================================

-- 1. Ensure the California Governor 2026 race exists (slug: california-governor-2026).
insert into public.races (state, district, slug, year, primary_date, featured)
values ('California', 'Governor', 'california-governor-2026', 2026, '2026-06-02', true)
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- 2. ca_candidates  (mirrors public.candidates)
-- ---------------------------------------------------------------------------
create table if not exists public.ca_candidates (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  party text,
  candidate_filer_id integer not null unique,
  committee_filer_id integer unique,
  committee_name text,
  race_id uuid references public.races(race_id) on delete set null,
  office text not null default 'GOV',
  election_year integer not null default 2026,
  cycle text not null default 'both',
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

create index if not exists idx_ca_candidates_committee_filer on public.ca_candidates(committee_filer_id);
create index if not exists idx_ca_candidates_slug on public.ca_candidates(slug);

alter table public.ca_candidates enable row level security;

create policy "CA candidates are publicly readable"
  on public.ca_candidates for select using (true);

create trigger update_ca_candidates_updated_at
  before update on public.ca_candidates
  for each row execute function public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- 3. ca_filings  (cover pages from CVR_CAMPAIGN_DISCLOSURE_CD)
-- ---------------------------------------------------------------------------
create table if not exists public.ca_filings (
  filing_id bigint not null,
  amend_id integer not null,
  filer_id integer not null,
  form_type text,
  stmt_type text,
  rpt_start date,
  rpt_end date,
  elect_date date,
  filed_date date,
  office_cd text,
  cand_filer_id integer,
  cand_last_name text,
  cand_first_name text,
  sup_opp_cd text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (filing_id, amend_id)
);

create index if not exists idx_ca_filings_filer on public.ca_filings(filer_id);
create index if not exists idx_ca_filings_cand_filer on public.ca_filings(cand_filer_id);
create index if not exists idx_ca_filings_form_type on public.ca_filings(form_type);

alter table public.ca_filings enable row level security;

create policy "CA filings are publicly readable"
  on public.ca_filings for select using (true);

create trigger update_ca_filings_updated_at
  before update on public.ca_filings
  for each row execute function public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- 4. ca_contributions  (receipts from RCPT_CD, scoped to the 24 candidates)
-- ---------------------------------------------------------------------------
create table if not exists public.ca_contributions (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references public.ca_candidates(id) on delete cascade,
  committee_filer_id integer not null,
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

create index if not exists idx_ca_contributions_cand_date on public.ca_contributions(candidate_id, contribution_date desc);
create index if not exists idx_ca_contributions_cand_amount on public.ca_contributions(candidate_id, amount desc);
create index if not exists idx_ca_contributions_cand_type on public.ca_contributions(candidate_id, contributor_type);
create index if not exists idx_ca_contributions_contributor_name on public.ca_contributions(contributor_last_name, contributor_first_name);
create index if not exists idx_ca_contributions_cycle on public.ca_contributions(candidate_id, cycle);

alter table public.ca_contributions enable row level security;

create policy "CA contributions are publicly readable"
  on public.ca_contributions for select using (true);

create trigger update_ca_contributions_updated_at
  before update on public.ca_contributions
  for each row execute function public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- 5. ca_expenditures  (from EXPN_CD, scoped to the 24 candidates)
-- ---------------------------------------------------------------------------
create table if not exists public.ca_expenditures (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references public.ca_candidates(id) on delete cascade,
  committee_filer_id integer not null,
  filing_id bigint not null,
  amend_id integer not null,
  tran_id text not null,
  payee_last_name text,
  payee_first_name text,
  payee_city text,
  payee_state text,
  payee_zip text,
  amount numeric(14,2) not null,
  expenditure_date date,
  expn_code text,
  expn_description text,
  cumulative_ytd numeric(14,2),
  cycle text,
  source_form_type text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (filing_id, amend_id, tran_id)
);

create index if not exists idx_ca_expenditures_cand_date on public.ca_expenditures(candidate_id, expenditure_date desc);
create index if not exists idx_ca_expenditures_cand_amount on public.ca_expenditures(candidate_id, amount desc);
create index if not exists idx_ca_expenditures_expn_code on public.ca_expenditures(expn_code);
create index if not exists idx_ca_expenditures_cycle on public.ca_expenditures(candidate_id, cycle);

alter table public.ca_expenditures enable row level security;

create policy "CA expenditures are publicly readable"
  on public.ca_expenditures for select using (true);

create trigger update_ca_expenditures_updated_at
  before update on public.ca_expenditures
  for each row execute function public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- 6. ca_ie_committees  (independent-expenditure filers)
-- ---------------------------------------------------------------------------
create table if not exists public.ca_ie_committees (
  filer_id integer primary key,
  name text not null,
  filer_type text,
  status text,
  sponsor text,
  party_affiliation text,
  city text,
  state text,
  zip text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.ca_ie_committees enable row level security;

create policy "CA IE committees are publicly readable"
  on public.ca_ie_committees for select using (true);

create trigger update_ca_ie_committees_updated_at
  before update on public.ca_ie_committees
  for each row execute function public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- 7. ca_independent_expenditures
-- ---------------------------------------------------------------------------
create table if not exists public.ca_independent_expenditures (
  id uuid primary key default gen_random_uuid(),
  ie_committee_filer_id integer references public.ca_ie_committees(filer_id) on delete cascade,
  target_candidate_id uuid references public.ca_candidates(id) on delete cascade,
  filing_id bigint not null,
  amend_id integer not null,
  tran_id text not null,
  support_oppose text,
  amount numeric(14,2) not null,
  expenditure_date date,
  description text,
  cycle text,
  source_form_type text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (filing_id, amend_id, tran_id)
);

create index if not exists idx_ca_ie_target_date on public.ca_independent_expenditures(target_candidate_id, expenditure_date desc);
create index if not exists idx_ca_ie_committee on public.ca_independent_expenditures(ie_committee_filer_id, expenditure_date desc);
create index if not exists idx_ca_ie_support_oppose on public.ca_independent_expenditures(target_candidate_id, support_oppose);

alter table public.ca_independent_expenditures enable row level security;

create policy "CA IE are publicly readable"
  on public.ca_independent_expenditures for select using (true);

create trigger update_ca_ie_updated_at
  before update on public.ca_independent_expenditures
  for each row execute function public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- 8. ca_contributions_summary  (rollup view per candidate per cycle)
-- ---------------------------------------------------------------------------
create or replace view public.ca_contributions_summary as
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

-- ---------------------------------------------------------------------------
-- 9. ca_ie_by_candidate  (S/O rollup per candidate per cycle)
-- ---------------------------------------------------------------------------
create or replace view public.ca_ie_by_candidate as
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

-- ---------------------------------------------------------------------------
-- 10. Seed the 24 candidates
-- ---------------------------------------------------------------------------
insert into public.ca_candidates
  (slug, name, party, candidate_filer_id, committee_filer_id, committee_name, race_id)
values
  ('xavier-becerra',       'Xavier Becerra',       'D',  1003436, 1480025, 'Becerra for Governor 2026',         (select race_id from public.races where slug = 'california-governor-2026')),
  ('chad-bianco',          'Chad Bianco',          'R',  1479043, 1479095, 'Bianco for Governor 2026',          (select race_id from public.races where slug = 'california-governor-2026')),
  ('elaine-culotti',       'Elaine Culotti',       'R',  1486416, 1486415, 'Culotti for Governor 2026',         (select race_id from public.races where slug = 'california-governor-2026')),
  ('serge-fiankan',        'Serge Fiankan',        null, 1444990, 1485387, 'Fiankan for Governor 2026',         (select race_id from public.races where slug = 'california-governor-2026')),
  ('william-derek-grasty', 'William Derek Grasty', null, 1483316, 1483315, 'Grasty for Governor 2026',          (select race_id from public.races where slug = 'california-governor-2026')),
  ('jon-henderson',        'Jon Henderson',        null, 1484520, 1484529, 'Henderson for Governor 2026',       (select race_id from public.races where slug = 'california-governor-2026')),
  ('lewis-norman-herms',   'Lewis Norman Herms',   null, 1481557, 1482256, 'Herms for Governor 2026',           (select race_id from public.races where slug = 'california-governor-2026')),
  ('steve-hilton',         'Steve Hilton',         'R',  1480426, 1480425, 'Hilton for Governor 2026',          (select race_id from public.races where slug = 'california-governor-2026')),
  ('dawit-kellel',         'Dawit A. Kellel',      null, 1486205, 1486702, 'Kellel for Governor 2026',          (select race_id from public.races where slug = 'california-governor-2026')),
  ('matt-mahan',           'Matt Mahan',           'D',  1486859, 1486858, 'Mahan for Governor 2026',           (select race_id from public.races where slug = 'california-governor-2026')),
  ('daniel-mercuri',       'Daniel R. Mercuri',    null, 1433524, 1480107, 'Mercuri for California Governor 2026', (select race_id from public.races where slug = 'california-governor-2026')),
  ('timothy-nelson',       'Timothy D. Nelson',    null, 1488271, 1488446, 'Nelson for Governor 2026',          (select race_id from public.races where slug = 'california-governor-2026')),
  ('thunder-parley',       'Thunder Parley',       null, 1482430, 1482429, 'Parley for Governor 2026',          (select race_id from public.races where slug = 'california-governor-2026')),
  ('katie-porter',         'Katie Porter',         'D',  1479598, 1479597, 'Porter for Governor 2026',          (select race_id from public.races where slug = 'california-governor-2026')),
  ('raji-rab',             'Raji Rab',             null, 1468886, 1469628, 'Rab for Governor 2026',             (select race_id from public.races where slug = 'california-governor-2026')),
  ('ramsey-robinson',      'Ramsey Robinson',      null, 1481349, 1481346, 'Robinson for Governor 2026',        (select race_id from public.races where slug = 'california-governor-2026')),
  ('reza-safarnejad',      'Reza Safarnejad',      null, 1481368, 1487566, 'Safarnejad for Governor 2026',      (select race_id from public.races where slug = 'california-governor-2026')),
  ('tom-steyer',           'Tom Steyer',           'D',  1485078, 1485077, 'Steyer for Governor 2026',          (select race_id from public.races where slug = 'california-governor-2026')),
  ('eric-swalwell',        'Eric Swalwell',        'D',  1485127, 1485146, 'Swalwell for Governor 2026',        (select race_id from public.races where slug = 'california-governor-2026')),
  ('tony-thurmond',        'Tony Thurmond',        'D',  1295704, 1461509, 'Thurmond for Governor 2026',        (select race_id from public.races where slug = 'california-governor-2026')),
  ('antonio-villaraigosa', 'Antonio Villaraigosa', 'D',  1004202, 1471635, 'Villaraigosa for Governor 2026',    (select race_id from public.races where slug = 'california-governor-2026')),
  ('betty-yee',            'Betty T. Yee',         'D',  1273041, 1465732, 'Yee for Governor 2026',             (select race_id from public.races where slug = 'california-governor-2026')),
  ('nancy-young',          'Nancy D. Young',       null, 1488342, 1488484, 'Young for Governor 2026',           (select race_id from public.races where slug = 'california-governor-2026')),
  ('leo-zacky',            'Leo S. Zacky',         'R',  1439063, 1460341, 'Zacky for Governor 2026',           (select race_id from public.races where slug = 'california-governor-2026'))
on conflict (candidate_filer_id) do nothing;
