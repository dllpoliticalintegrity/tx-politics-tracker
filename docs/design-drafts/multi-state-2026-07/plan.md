# Multi-state politics tracker — draft plan (July 2026)

Goal: generalize the Texas Politics Tracker into a **State Politics
Tracker** that covers any state and lets readers switch between them,
using [hderyke/state-level-campaign-finance](https://github.com/hderyke/state-level-campaign-finance)
(SLCF) as the campaign-finance backbone for states beyond Texas.

This doc is the working plan for the
`claude/multi-state-politics-tracker-1fhk1w` branch. An interactive
mock of the state-switching site lives next to this file in
`multi-state-preview.html` (open it directly in a browser — it is
self-contained and uses mock data).

## What we have vs. what SLCF gives us

Today's site is single-state by construction: `tx_*` tables, a TEC
importer, TX-only routes, and copy that hardcodes "Texas" throughout.
The stack itself (Vite/React/shadcn + Supabase + Cloudflare Pages) needs
no changes to go multi-state.

The SLCF repo is a Python pipeline that scrapes each state's disclosure
site and normalizes everything to one canonical format:

- **Coverage**: 24 states complete (AL, AK, AZ, AR, CA, CO, CT, DE, FL,
  GA, HI, ID, IL, IN, IA, KS, KY, LA, MD, MA, MI, MN, MS, PA), Maine in
  progress. Texas is *not* covered there — our existing TEC importer
  stays the source for TX.
- **Canonical schema**: five tables per state — contributions,
  expenditures, candidates, committees, loans — written to
  `data/{State}/cleaned/*.csv`, per-state SQLite DBs, and a merged
  `data/state-level-cf.db`.
- **Operation**: `python3 src/main.py sync AZ FL GA` (or `sync all`),
  with year-range and data-type flags.

What SLCF does **not** provide: polling (we keep 270toWin per state),
independent/outside spending as a distinct concept in every state, and
candidate curation (photos, slugs, featured flags — still editorial work
per state, as `tx_candidates` is today).

## Site architecture

### State registry

One config module drives everything (`src/states/registry.ts`):

```ts
export interface StateConfig {
  code: string;            // "tx"
  name: string;            // "Texas"
  raceTitle: string;       // "2026 Texas Governor's race"
  generalDate: string;     // "2026-11-03"
  agency: { name: string; url: string };   // e.g. Texas Ethics Commission
  pollingSourceUrl?: string;               // 270toWin state page
  pipeline: "tec" | "slcf";                // which importer feeds it
  status: "live" | "ready" | "planned";    // drives the switcher + landing
}
```

`status` meanings: **live** = dashboard published; **ready** = SLCF
pipeline implemented, data can be imported but no curated dashboard yet;
**planned** = no pipeline yet.

### Routing

State code becomes the first URL segment; existing TX routes become
redirects so nothing breaks:

- `/` — state picker landing (hero + 50-state grid). If the visitor has
  a remembered state (localStorage), offer a one-click "Back to Texas"
  rather than auto-redirecting, so the landing stays shareable.
- `/:state` — state home (today's `Index`)
- `/:state/candidates`, `/:state/candidates/:slug`, `/:state/polling`,
  `/:state/money/donors`, `/:state/money/outside-spending`,
  `/:state/statewide`, `/:state/about`
- Legacy: `/candidates` → `/tx/candidates`, etc.

A `StateProvider` reads `:state` from the route, validates it against
the registry (unknown → NotFound), and exposes `useStateConfig()`. All
hooks (`useCandidates`, `usePolling`, …) take the state from context
instead of hardcoding TX.

### Header / switcher

The header logo becomes "State Politics Tracker"; next to it sits a
state switcher (combobox with search — 24+ entries is too many for a
plain dropdown). Switching preserves the current sub-page
(`/tx/polling` → `/mi/polling`) and records the choice in localStorage.
States with `status: "ready"` appear in the switcher under a "Coming
soon" group; `planned` states appear only on the landing grid.

### SEO / functions

`functions/_middleware.ts` and `sitemap.xml.ts` read the registry to
emit per-state titles, descriptions, and sitemap entries for `live`
states only.

## Data architecture

### Schema: one set of tables, keyed by state

Rename `tx_*` → `cf_*` and add a `state` column (2-letter code) to every
table, mirroring SLCF's canonical five tables plus our editorial layer:

- `cf_candidates` (was `tx_candidates`) — editorial: slug, name, party,
  office, status, featured, headshot, **state**, plus per-pipeline filer
  identifiers in a jsonb `filer_refs` column (TEC needs COH + SPAC pairs;
  SLCF states use their own committee IDs).
- `cf_filings`, `cf_contributions`, `cf_expenditures`, `cf_loans` —
  superset of today's TX columns and SLCF's canonical columns; `state` +
  `source` ("tec" | "slcf") on every row.
- `cf_committees` — new, from SLCF's committees table (TEC rows fold in).
- `cf_independent_expenditures`, `cf_ie_contributions` — keep, TX-only
  until an SLCF state exposes equivalent data.
- Polling tables gain `state` the same way.

Derived views (`refresh_tx_finance_views()` and friends) become
state-parameterized or simply group by state. Migration path: create the
`cf_*` tables, copy TX data across with `state = 'tx'`, repoint the
frontend, drop `tx_*` after a release of soak time.

### Importer

New `scripts/data-import/slcf/import_slcf_finance.py`:

1. Run (or download artifacts from) the SLCF pipeline for the target
   states — the cleaned per-state CSVs are the interface, so we don't
   fork their scrapers.
2. Map canonical columns → `cf_*` and upsert via the Supabase service
   key, batched like the TEC importer.
3. Match contributions/expenditures to curated `cf_candidates` through
   `filer_refs`, exactly as the TEC importer matches COH/SPAC accounts.

A per-state GitHub Actions workflow matrix (like `tx-finance-sync.yml`)
runs nightly for `live` states only.

### Polling

`import-towin-polling` already targets a single 270toWin page; the URL
moves into the registry (`pollingSourceUrl`) and the function loops over
live states. States without a tracked governor's race simply hide the
polling sections (the components already handle empty data).

## Rollout

1. **Phase 0 — this draft**: plan + interactive preview
   (`multi-state-preview.html`) to settle the switcher UX and landing
   page before touching code.
2. **Phase 1 — routing + registry, TX only**: introduce
   `/:state` routes, `StateProvider`, registry with TX as the sole
   `live` state, legacy redirects. Site looks identical; URLs change.
3. **Phase 2 — schema + importer, pilot states**: `cf_*` migration,
   SLCF importer, and 2–3 pilot states with clean 2026 governor races
   and good SLCF data (suggest **FL, MI, GA**; PA/AZ next). Curate
   candidates for each (the real per-state cost).
4. **Phase 3 — open the switcher**: landing grid, switcher, per-state
   SEO; announce.
5. **Phase 4 — scale**: remaining SLCF states as curation capacity
   allows; contribute TX (and any missing states) upstream to SLCF so
   the pipelines converge.

## Open questions

- **Naming/domain**: "State Politics Tracker" is the working title;
  does texaspoliticstracker.com stay as a redirect to `/tx`?
- **One deployment vs. per-state**: this plan assumes one site, one
  Supabase project. Row counts (24 states × contributions) may push us
  to partition `cf_contributions` by state — decide during Phase 2 load
  testing.
- **Donations framing**: the donate panel copy is TX-specific
  (`TxGovSpendStat`); needs a per-state or national variant.
- **SLCF freshness**: TEC refreshes daily; some SLCF scrapers are
  bulk/annual. Show a per-state "last synced" stamp so stale states are
  honest about it.
