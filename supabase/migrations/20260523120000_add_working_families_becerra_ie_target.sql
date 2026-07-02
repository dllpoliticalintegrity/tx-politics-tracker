-- Pin "Working Families for Healthy Communities Supporting Becerra for
-- Governor 2026" (filer 1490885) as a primarily-formed IE committee
-- supporting Xavier Becerra.
--
-- The importer's committee-name regex requires the candidate's first+last name
-- adjacent ("XAVIER BECERRA") AND the word "GOVERNOR". This committee's name
-- has "GOVERNOR" and the last name "BECERRA" but not the first name, so the
-- first+last match failed and it was never auto-discovered. Without an entry
-- here (and the matching allowlist entry in import_ca_finance.py) its
-- independent expenditures and — more importantly — its donors were dropped.

insert into public.ca_ie_committee_targets
  (ie_committee_filer_id, target_candidate_id, support_oppose, notes)
values
  (1490885,
   (select id from public.ca_candidates where slug = 'xavier-becerra'),
   'S',
   'WORKING FAMILIES FOR HEALTHY COMMUNITIES SUPPORTING BECERRA FOR GOVERNOR 2026')
on conflict (ie_committee_filer_id, target_candidate_id) do nothing;
