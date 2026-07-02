# Parsing Texas Campaign Finance Data (TEC) — Review

How we can ingest Texas campaign finance data from the Texas Ethics Commission
(https://www.ethics.state.tx.us/search/cf/), following the same architecture as
our CAL-ACCESS pipeline (`scripts/data-import/cal-access/import_ca_finance.py`).

**Bottom line: Texas is easier than California.** TEC publishes a single bulk
CSV zip, refreshed daily, with proper quoted CSV + header rows, explicit
candidate/office fields, and a built-in "superseded report" flag. Several of
the hacks we needed for CAL-ACCESS (IE committee name-regex matching, ragged
TSV row skipping, amendment dedup migrations) are unnecessary or much simpler
here.

## 1. Data source

| What | Where |
|---|---|
| Bulk zip | `https://prd.tecprd.ethicsefile.com/public/cf/public/TEC_CF_CSV.zip` (301 → CloudFront `https://dv2dphbeckkgm.cloudfront.net/TEC_CF_CSV.zip`) |
| Size | ~1.0 GB compressed / ~9 GB uncompressed, 136 files (checked 2026‑07‑02) |
| Refresh | Daily (Last-Modified today 10:35 UTC; site says "As of 07/01/2026") |
| Record layouts | `https://www.ethics.state.tx.us/data/search/cf/CFS-ReadMe.txt` |
| Code tables | `https://www.ethics.state.tx.us/data/search/cf/CFS-Codes.txt` |
| Format PDF | `https://www.ethics.state.tx.us/data/search/cf/CampaignFinanceCSVFileFormat.pdf` |
| Coverage | All reports filed **electronically** with TEC since July 1, 2000 |

Note: the old `www.ethics.state.tx.us/data/search/cf/TEC_CF_CSV.zip` URL 404s —
the file moved to the `prd.tecprd.ethicsefile.com` host. Follow redirects.

There are also interactive search endpoints (`/search/cf/SimpleSearch.php`,
`/search/cf/AdvancedSearch.php`, and the custom search SPA) which are useful the
same way CA PowerSearch was for us: manual spot-checking that our aggregated
totals match the official site.

## 2. What's in the zip

Verified against the actual zip central directory + sampled file headers:

| File(s) | Record | Contents | Uncompressed |
|---|---|---|---|
| `filers.csv` | FILER | Filer index (all filer types) | 9 MB |
| `cover.csv`, `cover_ss.csv`, `cover_t.csv` | CVR | Cover sheet: report metadata **+ totals** (total/unitemized contributions, expenditures, loan balance, cash on hand) | 200 MB |
| `contribs_01..100.csv`, `cont_ss.csv`, `cont_t.csv` | RCPT | Itemized contributions (Schedules A/C) | 7.4 GB |
| `expend_01..13.csv`, `expn_t.csv` | EXPN | Itemized expenditures (Schedules F/G/H/I) | 1.2 GB |
| `cand.csv` | CAND | Candidates benefited by **direct campaign expenditures** (TX's independent-expenditure analog) | 56 MB |
| `loans.csv` | LOAN | Loans (Schedule E) | 6 MB |
| `pledges.csv`, `pldg_*.csv` | PLDG | Pledges (Schedule B) | 17 MB |
| `spacs.csv` | SPAC | Index of specific-purpose committees | <1 MB |
| `notices.csv`, `purpose.csv`, `credits.csv`, `debts.csv`, `assets.csv`, `travel.csv`, `finals.csv`, `expn_catg.csv` | — | Cover sheet 2/3, Schedules K/L/M/T, final reports, expenditure category codes | ~75 MB |

Format facts (verified by streaming the first rows of `filers.csv`,
`contribs_100.csv`, `cover.csv` out of the remote zip):

- Proper RFC-style CSV **with a header row** in every file, camelCase column
  names matching `CFS-ReadMe.txt`. No CAL-ACCESS-style unquoted TSV pain, so
  `stream_tsv()`'s NUL-stripping/ragged-row skipping likely isn't needed
  (keep a malformed-row counter anyway).
- Dates are `yyyyMMdd` strings; amounts are plain decimals (`0000000000.00`).
- One layout drift found: `cover.csv` actually has `reportTypeCd1..reportTypeCd10`
  columns where the ReadMe shows a single `reportTypeCd`. Parse by header
  names, never by the ReadMe's positional offsets.
- The `contribs_##` shard count grows over time (100 today). Enumerate zip
  members by pattern (`contribs_\d+\.csv`), don't hardcode.
- The `*_ss` and `*_t` variants are special-session and travel sub-records;
  we can ignore them for a governor's-race pipeline.

## 3. Concept mapping: CAL-ACCESS → TEC

| CA concept (our pipeline) | TX equivalent | Notes |
|---|---|---|
| `CVR_CAMPAIGN_DISCLOSURE_CD` → `ca_filings` | `cover.csv` | `reportInfoIdent` = unique report #, `receivedDt`, `periodStartDt/EndDt`, `filedDt`, `electionDt` |
| `FILERNAME_CD` (filer index) | `filers.csv` | Includes `ctaSeekOfficeCd` — filter `= 'GOVERNOR'` to auto-discover every gubernatorial filer. Office codes: `GOVERNOR`, `LTGOVERNOR`, `ATTYGEN`, `STATESEN`, … |
| `RCPT_CD` → `ca_contributions` | `contribs_##.csv` | Contributor name/city/state/zip/employer/occupation all present, plus `contributorPacFein`, `contributorOosPacFlag` (out-of-state PAC) |
| `EXPN_CD` → `ca_expenditures` | `expend_##.csv` | Payee name/address, `expendCatCd` + category descriptions (`expn_catg.csv`) |
| `SMRY_CD` → `ca_summaries` (unitemized line) | **on the cover sheet** | `cover.csv` carries `unitemizedContribAmount`, `totalContribAmount`, `unitemizedExpendAmount`, `totalExpendAmount`, `loanBalanceAmount`, `contribsMaintainedAmount` (≈ cash on hand). No separate summary file needed. |
| `LOAN_CD` → `ca_loans` | `loans.csv` | |
| F496/F461 IE crawl + name-regex committee matching (`match_committees_by_name`) | `cand.csv` (DCE records) + `spacs.csv` | **Huge simplification.** Every direct-campaign-expenditure row explicitly names the benefited candidate (`candidateNameLast/First`) *and* office sought (`candidateSeekOfficeCd = GOVERNOR`). DCE filers have `formTypeCd = DCE`. Specific-purpose committees (SPACs — TX's "primarily formed" committees) are linked to the candidate they SUPPORT/OPPOSE/ASSIST in `spacs.csv`, maintained by TEC staff. No regex heuristics or allowlist tables required for attribution; a small curated override table is still worth keeping for support/oppose edge cases. |
| `filing_id` + `amend_id` amendment chains (multiple dedup migrations) | `infoOnlyFlag` | Every transactional row carries `infoOnlyFlag = 'Y'` when its report has been **superseded by a later filing**. Skip `Y` rows (or store + exclude in views) and amendments are handled — no latest-version window functions needed. |
| Candidate filer id + separate committee filer id | COH `filerIdent` + principal SPAC `filerIdent` | Two accounts per candidate, same as CA. The candidate/officeholder files under their own COH account, but major campaigns raise through a principal SPAC — verified: Abbott's COH account 19652 shows blank `totalContribAmount` on recent reports and ~$600K cash on hand, while his war chest lives in SPAC 51153 "Texans for Greg Abbott" (linked in `spacs.csv` as SUPPORT). Seed both ids per candidate. |

## 4. Proposed pipeline (`scripts/data-import/tec/import_tx_finance.py`)

Mirror the cal-access importer's shape — same env vars, `--skip-download`,
`--only <stage>` flags, batched Supabase upserts:

1. **Seed** `tx_candidates` (slug, name, party, `filer_ident`) for the 2026
   governor's race. Discovery query: `filers.csv` where
   `ctaSeekOfficeCd = 'GOVERNOR'` and `filerFilerpersStatusCd` active; curate
   the final list manually like we did for CA.
2. **Download** the zip (~1 GB; stream with the same chunked downloader).
   Optionally skip full extraction: `zipfile.ZipFile.open()` lets us stream
   each member, and since contribs is 7.4 GB uncompressed, streaming +
   filtering without writing extracted files to disk is worth doing.
3. **Filings stage** — stream `cover.csv` filtered to seeded `filerIdent`s →
   upsert `tx_filings` (including the cover-sheet totals; that's our
   unitemized/cash-on-hand source).
4. **Contributions stage** — stream `contribs_*.csv` shards, filter
   `filerIdent ∈ seeds` and `infoOnlyFlag != 'Y'` and
   `contributionDt >= cycle start` → `tx_contributions`. Conflict key:
   `(reportInfoIdent, contributionInfoId)`.
5. **Expenditures stage** — same over `expend_*.csv` → `tx_expenditures`,
   key `(reportInfoIdent, expendInfoId)`.
6. **Loans stage** — `loans.csv` → `tx_loans`.
7. **DCE/IE stage** — stream `cand.csv` where
   `candidateSeekOfficeCd = 'GOVERNOR'` and the candidate name matches a seed
   (exact last+first match on structured fields — not free-text regex) →
   `tx_dce_expenditures`, with the DCE filer registered in `tx_ie_committees`.
   Then pull those filers' own `contribs_*` rows for a top-IE-donors view,
   exactly like `ca_ie_contributions`.
8. **Views** — port the materialized views (`top donors`, `total raised`,
   `IE totals`) with the same refresh function pattern. The
   "match official totals" work from `20260504*` migrations is simpler here:
   itemized rows + cover-sheet unitemized line, minus superseded reports.

Cycle dates for filtering (2026 TX governor): primary **2026‑03‑03**, runoff
**2026‑05‑26**, general **2026‑11‑03**; cycle start ~2025‑01‑01 (same
pre-cycle exclusion logic as CA — several TX filers are long-lived
officeholder committees with decades of history).

## 5. Gotchas / open questions

- **Electronic filings only.** The dump has e-filed reports since 2000. Paper
  filers (small local filers with a filing threshold exemption) are absent —
  irrelevant for statewide races, which must e-file.
- **No contribution limits** for non-judicial TX candidates — expect very
  large single transactions (seven figures is normal); `numeric(14,2)` is fine.
- **`infoOnlyFlag` semantics**: flag means "superseded by other report". We
  should verify empirically (pick one amended report and diff) whether the
  superseding report re-lists all transactions — if so, skipping `Y` rows is
  complete; the TEC docs indicate it is.
- **reportTypeCd1..10 drift** between ReadMe and actual `cover.csv` — parse by
  header, and don't be surprised by other minor drifts.
- **Correction affidavits** (`formTypeCd = COR*`) carry no transactions; ignore.
- **Dedup across report types**: daily pre-election reports (`DAILYCCOH`) vs
  8-day/semiannual reports may overlap the same transactions, similar to our
  CA F497-vs-F460 dedup. Needs the same empirical check once data is loaded;
  the `infoOnlyFlag` may already handle it.
- **Sharding**: filtering ~7.4 GB of contribution CSVs for a couple dozen
  filers is I/O-bound but simple; full run should stay well under an hour, in
  line with the CA importer.
- **Verification**: cross-check per-candidate totals against the TEC custom
  search app (like we matched PowerSearch totals in CA) before wiring up
  frontend views.
