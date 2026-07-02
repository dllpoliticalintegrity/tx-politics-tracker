-- Remove the 24 candidate committees from ca_ie_committees.
--
-- An earlier iteration of the import script seeded these rows; the current
-- code path would no longer produce them, but upsert-by-filer_id means the
-- bad rows have stuck around. Letting candidate committees live in
-- ca_ie_committees causes every self-funding contribution and normal donation
-- into a candidate's own committee to be double-counted: once in
-- ca_contributions (correct) and once in ca_ie_contributions (wrong). At the
-- time of this migration the bug attributed ~$184M of duplicate receipts to
-- the IE side.
--
-- ca_ie_contributions and ca_independent_expenditures both cascade on delete
-- of their parent, so the mis-classified child rows disappear atomically.
-- The candidate-side ca_contributions table is untouched (those rows were
-- always correctly scoped via ca_candidates.committee_filer_id).

delete from public.ca_ie_committees
  where filer_id in (select committee_filer_id from public.ca_candidates);

-- Keep the materialized view in sync with the freshly-truncated underlying
-- table. Non-concurrent refresh is fine here — the migration runs once and
-- the view is already gated on the daily auto-refresh anyway.
refresh materialized view public.ca_top_ie_donors;
