-- Curated mapping of IE committees to the candidates they support/oppose.
-- Lets us pin (filer_id → candidate, support/oppose) explicitly so the
-- importer can attribute IE expenditures even when:
--   - The committee's CVR cover row has empty/odd CAND_NAML
--   - FILERNAME_CD's NAML doesn't include the candidate's name in a regex-
--     matchable form
--   - The IE PAC files on Form 460 Schedule E (rather than F496/F461) and
--     individual rows have blank CAND_NAML
--
-- The importer reads this table first; the committee-name regex in
-- match_committees_by_name() then auto-discovers anything not pinned here.
--
-- Multi-target PACs are supported by adding multiple rows. Most primarily-
-- formed PACs have exactly one target.

create table if not exists public.ca_ie_committee_targets (
  ie_committee_filer_id integer not null,
  target_candidate_id   uuid    not null
    references public.ca_candidates(id) on delete cascade,
  support_oppose        text    not null check (support_oppose in ('S', 'O')),
  notes                 text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  primary key (ie_committee_filer_id, target_candidate_id)
);

create index if not exists idx_ca_ie_committee_targets_candidate
  on public.ca_ie_committee_targets(target_candidate_id);

alter table public.ca_ie_committee_targets enable row level security;

create policy "CA IE committee targets are publicly readable"
  on public.ca_ie_committee_targets for select using (true);

create trigger update_ca_ie_committee_targets_updated_at
  before update on public.ca_ie_committee_targets
  for each row execute function public.update_updated_at_column();

-- Initial seed: the three known primarily-formed PACs we've identified so
-- far. Add more rows here (or via the Supabase SQL editor) as new IE
-- committees register for the 2026 race.
insert into public.ca_ie_committee_targets
  (ie_committee_filer_id, target_candidate_id, support_oppose, notes)
values
  (1487425,
   (select id from public.ca_candidates where slug = 'matt-mahan'),
   'S',
   'CALIFORNIA BACK TO BASICS SUPPORTING MATT MAHAN FOR GOVERNOR 2026'),
  (1488176,
   (select id from public.ca_candidates where slug = 'matt-mahan'),
   'S',
   'DELIVER FOR CALIFORNIA - MATT MAHAN FOR GOVERNOR 2026'),
  (1489677,
   (select id from public.ca_candidates where slug = 'tom-steyer'),
   'O',
   'California is Not for Sale, No on Steyer for Governor 2026')
on conflict (ie_committee_filer_id, target_candidate_id) do nothing;
