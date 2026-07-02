-- Seed the 2026 Texas governor field, curated from
-- `python scripts/data-import/tec/import_tx_finance.py --discover`
-- (GOVERNOR-CTA filers with cycle activity, ranked by money raised) plus the
-- March 3, 2026 primary results.
--
-- filer_ident is the candidate/officeholder (COH) account;
-- committee_filer_ident is the principal SPAC where the campaign raises
-- through one (TEC links them in spacs.csv). Abbott's war chest lives in
-- SPAC 51153 "Texans for Greg Abbott" — his COH account files blank
-- contribution totals.
--
-- status values the frontend understands: 'active', 'withdrawn'/'dropped_out'
-- (Withdrew tag), 'eliminated' (Lost Primary tag).
insert into public.tx_candidates
  (slug, name, party, filer_ident, committee_filer_ident, committee_name, title, status, featured)
values
  ('greg-abbott',   'Greg Abbott',   'Republican', '19652', '51153', 'Texans for Greg Abbott', 'Governor of Texas', 'active', true),
  -- TEC filer name "Hinojosa, Regina"; campaigns and appears on the ballot as Gina.
  ('gina-hinojosa', 'Gina Hinojosa', 'Democrat',   '80440', null,    null, 'State Representative', 'active', true),
  ('pete-chambers', 'Pete Chambers', 'Republican', '89796', null,    null, null, 'eliminated', false),
  ('bobby-cole',    'Bobby Cole',    'Democrat',   '89742', null,    null, null, 'eliminated', false),
  -- Dropped out 2026-01-05, remained on the primary ballot.
  ('andrew-white',  'Andrew White',  'Democrat',   '82111', '82276', 'Texans for Andrew White', null, 'withdrawn', false)
on conflict (slug) do nothing;
