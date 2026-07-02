# TX Gov Tracker

Public-interest dashboard tracking money and polling in the **2026 Texas
Governor's race** — campaign finance from the Texas Ethics Commission (TEC),
polling from 270toWin, and direct-campaign-expenditure (outside) spending.

Ported from our [ca-gov-polling](https://github.com/dllpoliticalintegrity/ca-gov-polling)
project; see `docs/tx-repo-bootstrap.md` for the port checklist and
`docs/tx-campaign-finance-parsing.md` for the TEC data-source review.

## Stack

- Vite + React + TypeScript + shadcn-ui + Tailwind CSS
- Supabase (Postgres + edge functions); schema in `supabase/migrations/`
- Cloudflare Pages functions (`functions/`) for SEO middleware + sitemap

## Data pipelines

| What | Where | Source |
|---|---|---|
| Campaign finance | `scripts/data-import/tec/import_tx_finance.py` | TEC bulk CSV (~1 GB, refreshed daily) |
| Polling | `supabase/functions/import-towin-polling` + `scripts/data-import/270towin/` | 270toWin Texas governor page |

The TEC importer discovers active GOVERNOR filers with `--discover`, then
fills `tx_filings`, `tx_contributions`, `tx_expenditures`, `tx_loans`,
`tx_independent_expenditures` (DCE rows from `cand.csv`), and
`tx_ie_contributions` for the candidates seeded in `tx_candidates`. Each
candidate carries two TEC filer accounts: their candidate/officeholder (COH)
account plus their principal specific-purpose committee (e.g. Abbott is COH
`19652`, war chest in SPAC `51153` "Texans for Greg Abbott"). Superseded
reports (`infoOnlyFlag = 'Y'`) are skipped at import. After an import, run
`select refresh_tx_finance_views();`.

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
