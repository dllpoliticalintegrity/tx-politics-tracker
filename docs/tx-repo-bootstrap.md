# Bootstrapping `tx-politics-tracker` from this repo

Everything TX-specific staged so far lives on the
`claude/texas-campaign-finance-parsing-rm5bvi` branch:

- `docs/tx-campaign-finance-parsing.md` — TEC data-source review
- `scripts/data-import/tec/import_tx_finance.py` — TEC → Supabase importer
  (mirrors `scripts/data-import/cal-access/import_ca_finance.py`)
- `scripts/data-import/tec/schema.sql` — `tx_*` tables + materialized views
- this checklist

## 1. Create the repo (manual — one time)

Claude Code sessions on this repo are access-scoped to `ca-gov-polling` and
cannot create org repositories, so:

1. On GitHub: **New repository** → done: `dllpoliticalintegrity/tx-politics-tracker`.
2. From any machine with access to both repos:

   ```sh
   git clone git@github.com:dllpoliticalintegrity/ca-gov-polling.git tx-politics-tracker
   cd tx-politics-tracker
   git checkout claude/texas-campaign-finance-parsing-rm5bvi
   git checkout -b main                       # TX branch becomes the new main
   git remote set-url origin git@github.com:dllpoliticalintegrity/tx-politics-tracker.git
   git push -u origin main
   ```

   (If you'd rather not carry the CA git history, use
   `git checkout --orphan main` + a single initial commit instead.)
3. Start a Claude Code session **on the new repo** for the porting work below —
   that session will have full access to it.

## 2. New Supabase project

The frontend reads the project from env (`VITE_SUPABASE_URL`,
`VITE_SUPABASE_PUBLISHABLE_KEY` — see `src/integrations/supabase/client.ts`),
so a fresh Supabase project is config, not code:

1. Create the project; set the env vars in `.env` / hosting.
2. Move `scripts/data-import/tec/schema.sql` to
   `supabase/migrations/<timestamp>_tx_campaign_finance.sql` and apply. Keep or
   drop the CA-era migrations in `supabase/migrations/` depending on whether
   the new project also needs the polling/auth tables (`races`, `race_polls`,
   auth functions) — most are still wanted; only the `ca_*` finance migrations
   should be dropped in favor of the TX schema.
3. Seed `tx_candidates`. Find active filers with:

   ```sh
   python scripts/data-import/tec/import_tx_finance.py --discover
   ```

   The output ranks GOVERNOR-CTA filers by money raised this cycle and lists
   the SPACs TEC links to each. Seed **both** accounts per candidate where a
   principal committee exists — e.g. Abbott is COH `19652`, but his money is
   in SPAC `51153` "Texans for Greg Abbott" (his COH account's recent cover
   sheets show blank contribution totals). Outside SPACs (e.g. opposing PACs)
   are auto-registered as IE committees from `spacs.csv` during the `ie`
   stage; override attribution in `tx_ie_committee_targets` if needed.
4. Run the import: `python scripts/data-import/tec/import_tx_finance.py`,
   then `select refresh_tx_finance_views();`.
5. Regenerate the typed client (`src/integrations/supabase/types.ts`) from the
   new project.

## 3. Frontend port (mechanical rename + copy tweaks)

Current `ca_*` references in `src/` (from a grep on 2026-07-02): 
`ca_candidates`, `ca_contributions`, `ca_contributions_summary`,
`ca_contributions_deduped`, `ca_expenditures`, `ca_filings`,
`ca_top_donors`, `ca_latest_contributions`, `ca_top_aggregated_donors`,
`ca_ie_committees`, `ca_ie_by_candidate`, `ca_independent_expenditures`,
`ca_ie_for_candidate`, `ca_ie_top_committees`, `ca_top_ie_donors`,
`ca_top_ie_donors_aggregated`, plus FK hint strings like
`ca_contributions_candidate_id_fkey`.

- Rename to the `tx_*` equivalents. `schema.sql` covers the base tables +
  the two core matviews; the derived donor views (`*_top_donors*`,
  `*_deduped`, `*_latest_contributions`, `*_ie_for_candidate`,
  `*_ie_top_committees`) should be ported from their CA migrations
  (`20260421180020`, `20260423220000`, `20260504*`, `20260527*`) as needed —
  most of their *dedup* complexity exists because of CAL-ACCESS amendment
  semantics and may collapse to simple aggregates in TX (superseded reports
  are already excluded at import).
- Contributor-type filters change: CA codes (`IND`/`COM`/`PTY`/`SCC`/`OTH`)
  → TEC's `INDIVIDUAL`/`ENTITY`. Any UI that breaks out "PAC vs party" money
  needs rethinking — TEC identifies PACs by filer type and
  `contributorPacFein`, not a receipt-level code.
- Cycle labels: `primary-2026` (≤ Mar 3), `runoff-2026` (≤ May 26),
  `general-2026` (≤ Nov 3), per `classify_cycle` in the importer.
- Copy/branding: CA Governor → TX Governor everywhere (`index.html`, pages in
  `src/pages/`, FAQ content, sitemap in `functions/sitemap.xml.ts`).

## 4. Polling data sources

- `scripts/data-import/rcp/` and `scripts/data-import/270towin/` plus the
  `import-rcp-polling` / `import-towin-polling` edge functions are
  race-agnostic in mechanism but CA-configured — point them at the TX
  governor race pages and reseed `races`.

## 5. Verification (before shipping numbers)

- Cross-check per-candidate totals against the TEC search app
  (`https://www.ethics.state.tx.us/search/cf/`) — same discipline as the CA
  "match PowerSearch totals" migrations.
- Empirically confirm `infoOnlyFlag` semantics on one amended report (does the
  superseding report re-list all transactions? TEC docs say yes).
- Check whether daily pre-election reports (`DAILYCCOH`) duplicate
  transactions later re-reported on 8-day/semiannual reports — the CA
  F497-vs-F460 problem. If they do, exclude daily-report rows whose
  transactions reappear, or exclude the daily forms from aggregates.
- Decide SPAC expenditure attribution: the importer counts DCE rows
  (`cand.csv`, per-candidate) as IE spending and imports linked SPACs'
  *donors*, but does not yet attribute outside SPACs' own expenditures to a
  candidate (their `expend_##.csv` rows carry no target). The CA equivalent
  used per-row Schedule E candidate names; for TX the `spacs.csv` link is the
  natural attribution once a SPAC targets exactly one candidate.
