# Frontend redesign plan — July 2026

Goal: make texaspoliticstracker.com easier to navigate and stop it reading
as an AI-generated dashboard. This doc is the working plan for the
`claude/modern-frontend-redesign-5p8wxu` branch.

## Where we are

Two design systems ship today:

1. **Classic (live) site** — dark "terminal" theme: Orbitron + Jersey 25
   display fonts, JetBrains Mono microlabels, `terminal-glow` text-shadow,
   grid-paper background, `LIVE // 2026 TEXAS GUBERNATORIAL RACE` badges,
   animated ping dots, a per-second election countdown, hardcoded `#fdb417`
   gold next to the token palette.
2. **`/beta`** — a newsprint/editorial redesign (cream paper, Roboto Slab,
   hard offset shadows, contributions ticker) with every page duplicated
   under `src/pages/beta/` and styled by a parallel 1,790-line
   `src/styles/beta.css` that bypasses Tailwind tokens and the shared
   Header/Footer/MobileTabBar. Some beta chrome is unfinished (Subscribe
   goes to `#`, Methodology/Sources link to the old ca-gov-polling repo).

A third set of static HTML drafts lives in `docs/design-drafts/homepage-2026-04/`.

### Why it looks AI-generated

The tells are all in the classic theme, and they're the exact defaults of
one-shot AI dashboards:

- Sci-fi styling with no relationship to the subject: Orbitron, glow
  effects, terminal grid, `//` separators, `LIVE` badges on static data.
- Everything shouts at once — every card has an accent bar, every label is
  uppercase letter-spaced mono, so nothing has hierarchy.
- Decorative "liveness": a seconds-ticking countdown and pulsing dots for
  data that syncs nightly. Readers notice the mismatch.
- Inconsistency between systems: `rounded-sm` cards next to a
  `rounded-2xl` dialog, hardcoded hexes next to CSS variables, three fonts
  doing the job of one.

### Why navigation is hard

- Seven all-caps top-nav items with no grouping; "SUPER PAC SPENDING" is
  the longest label for the least-visited page.
- Money is split across three peer pages (Top Donors, Super PAC Spending,
  and finance sections inside candidate pages) with no cross-links.
- Route names disagree between systems (`/independent-expenditures` vs
  `/beta/ie`); mobile tab bar omits Statewide entirely.
- Two navigation shells exist (Header/MobileTabBar vs BetaLayout), so
  moving between `/` and `/beta` is disorienting.
- A floating donate FAB plus a Givebutter launcher plus a Sign Up button
  compete for the same attention.

## Design direction (recommendation)

Adopt **one editorial / data-journalism identity** — the genre readers
already trust for this content (Texas Tribune, FiveThirtyEight, NYT
Upshot). Nothing about that genre reads as AI-generated, and the `/beta`
newsprint direction is already most of the way there.

**Promote the beta aesthetic to the main site — but rebuilt on the
existing Tailwind/shadcn token system, not by keeping `beta.css`.** The
beta look is right; its implementation (a parallel hand-rolled CSS file
plus duplicated pages) is the thing to retire.

Concretely:

- **Type**: one serif/slab display face for headlines (Roboto Slab is
  already in beta; Fraunces or Source Serif 4 are stronger options), Inter
  for body/UI, mono reserved for tabular figures only. Delete Orbitron and
  Jersey 25.
- **Color**: light-first paper palette (`--background` cream/off-white,
  near-black ink) with party colors (D blue / R red / I amber) as the only
  saturated accents on data. One brand accent for links/CTAs. Keep dark
  mode, but derive it from the same tokens rather than designing it first.
- **Case**: sentence case everywhere; small-caps kickers allowed for
  section labels, used sparingly.
- **Texture**: borders and whitespace instead of glows, grids, and pings.
  "Live" indicators only on things that actually update in-session (the
  contributions ticker qualifies; the countdown does not — render it as
  "126 days to the general · Nov 3, 2026").

## Plan

### Phase 1 — One design system (tokens + typography)

- Rewrite `src/index.css` tokens to the paper/ink palette; add party and
  chart colors as tokens; delete `terminal-glow`, `terminal-grid`,
  `terminal-border` utilities and the Orbitron/Jersey 25 font imports.
- Update `tailwind.config.ts` font families (`display` → slab serif,
  `sans` → Inter, `mono` → JetBrains Mono for numerals).
- Sweep hardcoded colors (`#fdb417`, inline `hsl(var(--border))` styles)
  into tokens.
- Deliverable: the classic pages instantly look calmer with no layout
  changes yet.

### Phase 2 — Navigation & information architecture

- Top nav (5 items, sentence case): **Candidates · Polling · Money ·
  Statewide · About**. Logo is Home.
  - **Money** lands on a hub page with tabs/sections for Top donors,
    Outside spending (rename from "Super PAC Spending"), and latest
    contributions; keep `/top-donors` and `/independent-expenditures` as
    redirects.
  - **About** absorbs FAQ + methodology + data sources (currently the FAQ
    page and scattered footer links).
- Candidate detail: breadcrumb (Candidates → Name), and "related" links
  (their donors, their polling line) so money/polling pages are reachable
  from context, not just the nav.
- Mobile tab bar: 5 items — Home, Candidates, Polling, Money, More
  (Statewide/About in a sheet).
- One donate affordance: quiet header button; remove the floating FAB.
- Fix beta chrome bugs while it still exists: dead `Subscribe` link,
  methodology links pointing at ca-gov-polling.

### Phase 3 — Page rebuilds (merge beta into main, page by page)

Rebuild each classic page using the beta's layout ideas, expressed in
Tailwind + shadcn components. Order by traffic/value:

1. **Home** — lead with the answer: who leads, by how much, trend arrow;
   one hero polling chart; countdown as a single line of text; field
   overview cards below. Keep the contributions ticker from beta (it's
   genuinely live and genuinely interesting).
2. **Candidates + Candidate detail** — beta's card/detail structure.
3. **Polling** — chart + poll table with sortable columns.
4. **Money hub** (new) — consolidates Top Donors + IE pages.
5. **Statewide, About/FAQ.**

As each page reaches parity, delete its `src/pages/beta/` twin and add a
redirect. When the last one lands, delete `BetaLayout`, `beta.css`, and
the `/beta` routes. Net code should go *down* (~2,500 lines of duplicated
pages + 1,790 lines of beta.css removed).

### Phase 4 — Microcopy de-AI pass

- Rewrite labels: `POLLING AVERAGE // TIME-SERIES` → "Polling average",
  `FIELD OVERVIEW` → "The field", `LOADING...` → skeleton components.
- Provenance lines in plain English: "Updated nightly from the Texas
  Ethics Commission and 270toWin", with a real timestamp from the data,
  not a LIVE badge.
- Remove decorative pings; keep one live-dot on the ticker only.

### Phase 5 — Polish & QA

- Responsive audit at 360/768/1280 via Playwright screenshots.
- Accessibility: contrast on party colors over paper, focus states,
  `aria-current` on nav, reduced-motion for the ticker marquee.
- Verify SEO middleware (`functions/`) and PostHog pageview capture still
  work with new routes/redirects; update sitemap.
- Run existing vitest suite; add smoke tests for the new redirects.

## Sequencing & risk

- Phases 1–2 are low-risk and land first (tokens + nav touch no data
  logic). Phase 3 is the bulk of the work and merges page-by-page so the
  site never half-breaks.
- Riskiest piece: retiring `beta.css` — nothing else imports it, but the
  beta pages are the reference design, so port before deleting.
- Open decision: keep dark mode at launch or ship light-only and re-add
  dark from tokens later. Recommendation: light-first, dark kept working
  but not hand-tuned until after Phase 3.
