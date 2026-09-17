# Texas Politics Tracker

Public-interest dashboard tracking money and polling in the **2026 Texas
Governor's race** — plus campaign finance for the other statewide races
(Lt. Governor, Attorney General) — from the Texas Ethics Commission (TEC),
polling from FiftyPlusOne, and direct-campaign-expenditure (outside) spending.

Ported from our [ca-gov-polling](https://github.com/dllpoliticalintegrity/ca-gov-polling)
project; see `docs/tx-repo-bootstrap.md` for the port checklist and
`docs/tx-campaign-finance-parsing.md` for the TEC data-source review.

## Stack

- Vite + React + TypeScript + shadcn-ui + Tailwind CSS
- Supabase (Postgres + edge functions); schema in `supabase/migrations/`
  — **the project is shared with the multi-state governor tracker**, which
  keeps its own races (and their 270toWin polling) in the same `races` /
  `race_polling` / `race_polls` tables. Data fixes here must be scoped to
  Texas races (`races.state = 'Texas'`); never purge by source alone.
- Cloudflare Pages functions (`functions/`) for SEO middleware + sitemap

## Data pipelines

| What | Where | Source |
|---|---|---|
| Campaign finance | `scripts/data-import/tec/import_tx_finance.py` | TEC bulk CSV (~1 GB, refreshed daily) |
| Polling | `supabase/functions/import-fiftyplusone-polling` | FiftyPlusOne CSV API (`governor_general`) |

The **River** tab (`/money/river`) reads the `tx_money_river` view: every
itemized contribution, expenditure, loan and outside expenditure for tracked
candidates in one feed, newest first, paginated and filterable by race /
type / candidate. It is a plain (non-materialized) view, so it is live the
moment an import lands.

The TEC importer discovers active GOVERNOR filers with `--discover`, then
fills `tx_filings`, `tx_contributions`, `tx_expenditures`, `tx_loans`,
`tx_independent_expenditures` (DCE rows from `cand.csv`), and
`tx_ie_contributions` for the candidates seeded in `tx_candidates` — any
office in `TARGET_OFFICES` (Governor, Lt. Governor, Attorney General). Each
candidate carries two TEC filer accounts: their candidate/officeholder (COH)
account plus their principal specific-purpose committee (e.g. Abbott is COH
`19652`, war chest in SPAC `51153` "Texans for Greg Abbott"). Superseded
reports (`infoOnlyFlag = 'Y'`) are skipped at import. Special pre-election
("daily", 48-hour) and special session reports are imported from TEC's
separate `_t` / `_ss` files flagged `special`; because their transactions are
re-reported on the next regular report, `refresh_tx_special_supersession()`
marks them `rereported` once that report lands and every view excludes those
rows. After an import, run `select refresh_tx_finance_views();` (which does
that first).

## Editing candidates (names, headshots, links)

The `tx_candidates` rows the site renders — display name, slug, party,
office, status, headshot URLs, website and social handles, TEC filer
accounts — are edited from the org's admin console
([data-diamine](https://github.com/dllpoliticalintegrity/data-diamine)):
product dropdown → **TX Politics Tracker** → **Candidates**. The console
writes through its `tx-tracker-admin` edge function, which holds this
project's service-role key; nothing in this repo needs to change for a
content edit, and the site picks the change up on its next load. The seed
migrations under `supabase/migrations/` are the initial roster only.

## Local development

```sh
npm i
npm run dev
```

Supabase connection is read from `.env` (`VITE_SUPABASE_URL`,
`VITE_SUPABASE_PUBLISHABLE_KEY`).

To run the finance importer:

```sh
pip install -r scripts/data-import/tec/requirements.txt
export SUPABASE_URL=...            # project URL
export SUPABASE_SERVICE_ROLE_KEY=...
python scripts/data-import/tec/import_tx_finance.py            # full pipeline
python scripts/data-import/tec/import_tx_finance.py --discover # list GOVERNOR filers
```
