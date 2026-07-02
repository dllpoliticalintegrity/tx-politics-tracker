-- Stop Form 461 major-donor CONTRIBUTIONS from being counted as independent
-- expenditures.
--
-- Form 461 Part 5 ("Contributions ... and Independent Expenditures Made") is a
-- mixed schedule. Major donors -- individuals/firms who give $10k+ in a year --
-- report their direct candidate contributions there. In CAL-ACCESS EXPN_CD
-- those rows carry EXPN_CODE in (MON, CTB, IKD, LON); genuine independent
-- expenditures carry EXPN_CODE='IND'. The importer treated every F461 Part 5
-- row as an IE, so 180 contribution rows (~$3.05M) -- e.g. Kyle Vogt's $78,400
-- to Mahan -- landed in ca_independent_expenditures and inflated "IE
-- supporting" totals (and spawned ~73 individual "IE committees").
--
-- Verified against the raw EXPN_CD dump: ZERO of the F461 rows currently in
-- ca_independent_expenditures are EXPN_CODE='IND' -- they are all contributions
-- -- and ~96% already appear in ca_contributions via the candidates' own F460
-- Schedule A. So they are pure duplicates on the wrong side of the ledger;
-- removing them does not drop any candidate's contribution total (those are
-- sourced independently from RCPT_CD/F460, never from F461).
--
-- import_ca_finance.py is updated in the same change to keep only EXPN_CODE='IND'
-- rows on the F461 path going forward (Form 460 Schedule E, FORM_TYPE='E', is a
-- genuine IE schedule and is untouched). This migration removes the rows already
-- loaded, the donor "committees" they created, and adds expn_code for audit.

-- Audit column: why a row is (or isn't) treated as an IE. Backfilled by the
-- importer on its next run; null for rows loaded before this change.
alter table public.ca_independent_expenditures
  add column if not exists expn_code text;

-- All F461 rows in this table are contributions (no EXPN_CODE='IND' among them),
-- so the whole F461 slice is safe to drop.
delete from public.ca_independent_expenditures
  where source_form_type = 'F461';

-- Remove IE committees left with no expenditures, no contributions, and no
-- curated target (the misclassified major donors: VOGT, WANSTRATH,
-- PANISH SHEA & BOYLE, ...). Guards keep allowlisted/curated PACs intact.
delete from public.ca_ie_committees c
  where not exists (
          select 1 from public.ca_independent_expenditures e
          where e.ie_committee_filer_id = c.filer_id)
    and not exists (
          select 1 from public.ca_ie_contributions k
          where k.ie_committee_filer_id = c.filer_id)
    and not exists (
          select 1 from public.ca_ie_committee_targets t
          where t.ie_committee_filer_id = c.filer_id);

-- Recompute latest-amendment flags (from 20260527120000) and refresh the IE
-- rollups so the pages reflect the removal immediately.
select public.recompute_ca_latest_flags();
refresh materialized view public.ca_ie_by_candidate;
refresh materialized view public.ca_top_ie_donors;
