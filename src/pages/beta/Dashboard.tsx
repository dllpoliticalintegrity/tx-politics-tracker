import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BetaLayout, ELECTION_TARGET, ELECTION_DATE_LABEL } from "@/components/beta/BetaLayout";
import {
  useCandidates,
  useCandidateTotals,
  useIEByCandidate,
  useTopIECommittees,
  useTopAggregatedDonors,
  useAllSummaries,
  type TxCandidate,
  type TxIeByCandidate,
} from "@/hooks/useCandidates";
import { useTxGovPolling, parsePollDate, readCandidatePct } from "@/hooks/usePolling";

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function fmtM(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n >= 100_000_000 ? 0 : 1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${Math.round(n).toLocaleString()}`;
}
function fmtMSigned(n: number): string {
  const s = n >= 0 ? "+" : "−";
  return `${s}${fmtM(Math.abs(n))}`;
}
function partyTag(p: string | null | undefined): "d" | "r" | "i" {
  const s = (p ?? "").trim().toLowerCase();
  if (s.startsWith("d")) return "d";
  if (s.startsWith("r")) return "r";
  return "i";
}
function candidateInitials(name: string | null | undefined): string {
  if (!name) return "?";
  const parts = name.replace(/^(Lt\.|Sen\.|Rep\.|Mayor|Gov\.|Atty\.)\s*/g, "").split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
function candidateShort(name: string | null | undefined): string {
  if (!name) return "—";
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1].toUpperCase();
}
function isWithdrawn(status: string | null | undefined): boolean {
  const s = (status ?? "").toLowerCase();
  return s === "withdrawn" || s === "dropped_out" || s === "dropped out" || s === "eliminated";
}

function inactiveLabel(status: string | null | undefined): string {
  return (status ?? "").toLowerCase() === "eliminated" ? "Lost Primary" : "Withdrew";
}

// Render a candidate photo with the halftone-dot fallback to initials.
function CandPhoto({
  candidate,
  className,
}: {
  candidate: TxCandidate;
  className: string;
}) {
  const src = candidate.photo_url_thumb ?? candidate.photo_url ?? null;
  return (
    <div className={className}>
      {src ? <img src={src} alt={candidate.name} /> : <span>{candidateInitials(candidate.name)}</span>}
    </div>
  );
}

// Tag shown next to withdrawn candidates' names.
function WithdrewTag({ status }: { status?: string | null }) {
  return (
    <span
      style={{
        background: "var(--paper-3)",
        color: "var(--ink-3)",
        fontFamily: "var(--f-mono)",
        fontWeight: 700,
        fontSize: 9,
        letterSpacing: "0.14em",
        padding: "2px 6px",
        marginLeft: 6,
        verticalAlign: "1px",
        textTransform: "uppercase",
      }}
    >
      {inactiveLabel(status)}
    </span>
  );
}

export default function BetaDashboard() {
  return (
    <BetaLayout active="dashboard">
      <main>
        <Hero />
        <PollingChartSection />
        <KpiStrip />
        <FieldStandings />
        <DonorsSection />
        <IeSection />
        <MethodologyPanel />
        <FooterCta />
      </main>
    </BetaLayout>
  );
}

// ─── HERO ──────────────────────────────────────────────────
function Hero() {
  const { data: candidates = [] } = useCandidates();
  const { data: polling } = useTxGovPolling();
  const { data: totals } = useCandidateTotals();
  const { data: ieByCand } = useIEByCandidate();

  const topFour = useMemo(() => buildLeaderboard(candidates, polling, totals, ieByCand, 4), [
    candidates,
    polling,
    totals,
    ieByCand,
  ]);
  const leader = topFour[0];
  const rest = topFour.slice(1);

  return (
    <section className="hero">
      <div className="hero__inner">
        <div className="hero__main">
          <div className="hero__kicker kicker">
            <span className="pulse" />
            2026 Texas Governor · {candidates.length || "—"} candidates · general{" "}
            <strong style={{ color: "var(--periwinkle-deep)", margin: "0 4px" }}>Nov 3, 2026</strong>
          </div>
          <h1 className="hero__title">
            Texas' race for <em>governor</em>, in <span className="cal">real time.</span>
          </h1>
          <p className="hero__deck">
            Polling averages, <strong>every donor, every dollar of independent spending</strong> &mdash; synced
            nightly from 270toWin and the Texas Ethics Commission for all {candidates.length || "—"} declared candidates.
          </p>
          <CountdownBlock />
        </div>

        <Leaderboard leader={leader} rest={rest} />
      </div>
    </section>
  );
}

function CountdownBlock() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  let diff = Math.max(0, ELECTION_TARGET - now);
  const days = Math.floor(diff / 86_400_000);
  diff -= days * 86_400_000;
  const hours = Math.floor(diff / 3_600_000);
  diff -= hours * 3_600_000;
  const mins = Math.floor(diff / 60_000);
  diff -= mins * 60_000;
  const secs = Math.floor(diff / 1000);

  return (
    <div className="hero__countdown" aria-label="Time until Texas gubernatorial general election">
      <div className="hero__countdown-label">
        <span>
          <span className="live-dot blue" /> General &middot; <span className="when">{ELECTION_DATE_LABEL}</span>
        </span>
        <span style={{ color: "var(--ink-3)" }}>Polls open in</span>
      </div>
      <div className="hero__countdown-grid">
        <div className="hero__countdown-cell">
          <div className="hero__countdown-num blue">{days}</div>
          <div className="hero__countdown-cell-label">Days</div>
        </div>
        <div className="hero__countdown-cell">
          <div className="hero__countdown-num">{pad(hours)}</div>
          <div className="hero__countdown-cell-label">Hours</div>
        </div>
        <div className="hero__countdown-cell">
          <div className="hero__countdown-num">{pad(mins)}</div>
          <div className="hero__countdown-cell-label">Minutes</div>
        </div>
        <div className="hero__countdown-cell">
          <div className="hero__countdown-num">{pad(secs)}</div>
          <div className="hero__countdown-cell-label">Seconds</div>
        </div>
      </div>
    </div>
  );
}

// ─── LEADERBOARD CARD ───────────────────────────────────────
type LeaderboardRow = {
  candidate: TxCandidate;
  pct: number | null;
  raised: number;
  cash: number;
  ieFor: number;
  ieAgainst: number;
  ieCmtCount: number;
};

function buildLeaderboard(
  candidates: TxCandidate[],
  polling: ReturnType<typeof useTxGovPolling>["data"] | undefined,
  totals: ReturnType<typeof useCandidateTotals>["data"] | undefined,
  ieByCand: TxIeByCandidate[] | undefined,
  limit: number,
): LeaderboardRow[] {
  if (!candidates.length) return [];
  const ieMap = new Map<string, TxIeByCandidate>();
  (ieByCand ?? []).forEach((r) => ieMap.set(r.candidate_id, r));
  const rows: LeaderboardRow[] = candidates.map((c) => {
    const pct = polling?.average ? readCandidatePct(polling.average, c.name) : null;
    const t = totals?.get(c.id);
    const ie = ieMap.get(c.id);
    return {
      candidate: c,
      pct,
      raised: t?.raised ?? 0,
      cash: t?.cash ?? 0,
      ieFor: Number(ie?.total_supporting ?? 0),
      ieAgainst: Number(ie?.total_opposing ?? 0),
      ieCmtCount: Number(ie?.committee_count ?? 0),
    };
  });
  rows.sort((a, b) => (b.pct ?? -1) - (a.pct ?? -1));
  return rows.slice(0, limit);
}

function Leaderboard({ leader, rest }: { leader: LeaderboardRow | undefined; rest: LeaderboardRow[] }) {
  const { data: polling } = useTxGovPolling();
  if (!leader) {
    return (
      <aside className="hero__leader">
        <div className="hero__leader-head">
          <span className="hero__leader-kicker">
            <span className="live-dot" /> Leaderboard · RCP avg
          </span>
        </div>
        <div style={{ padding: 24, fontFamily: "var(--f-mono)", color: "var(--ink-3)" }}>Loading…</div>
      </aside>
    );
  }
  const c = leader.candidate;
  const updated = polling?.last_updated
    ? `UPDATED ${new Date(polling.last_updated).toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()}`
    : "AWAITING SYNC";
  return (
    <aside className="hero__leader">
      <div className="hero__leader-head">
        <span className="hero__leader-kicker">
          <span className="live-dot" /> Leaderboard · RCP avg
        </span>
        <span className="hero__leader-id">{updated}</span>
      </div>

      <div className="hero__leader-member">
        <CandPhoto candidate={c} className="hero__leader-photo" />
        <div>
          <div className="hero__leader-name">
            {c.name}
            {isWithdrawn(c.status) && <WithdrewTag status={c.status} />}
          </div>
          <div className="hero__leader-meta">
            № 1 ·{" "}
            <span className={`party-${partyTag(c.party)}`}>
              {partyTag(c.party).toUpperCase()}
            </span>
            {c.title ? ` · ${c.title.toUpperCase()}` : ""}
          </div>
        </div>
      </div>

      <div className="hero__leader-stat-row">
        <span className="hero__leader-stat-label">RCP avg</span>
        <span className="hero__leader-stat-value">
          {leader.pct == null ? "—" : leader.pct.toFixed(1)}
          <span style={{ fontSize: 16, fontWeight: 600, color: "var(--ink-3)" }}>%</span>
        </span>
      </div>
      <div className="hero__leader-bar">
        <span style={{ background: "var(--periwinkle)", width: `${leader.pct ?? 0}%` }} />
        <span style={{ background: "var(--paper-3)", flex: 1 }} />
      </div>

      <div className="hero__leader-stat-row">
        <span className="hero__leader-stat-label">Raised · cycle</span>
        <span className="hero__leader-stat-value">{fmtM(leader.raised)}</span>
      </div>

      <div className="hero__leaderboard">
        <div className="hero__leaderboard-head">
          <span>Top 4 · then the rest</span>
          <Link to="/beta/candidates">All →</Link>
        </div>
        {rest.map((r, i) => {
          const rc = r.candidate;
          const party = partyTag(rc.party);
          return (
            <div
              className="hero__leaderboard-row"
              key={rc.id}
              style={isWithdrawn(rc.status) ? { opacity: 0.55 } : undefined}
            >
              <span className="lb-rank">{pad(i + 2)}</span>
              <CandPhoto candidate={rc} className={`lb-photo party-${party}`} />
              <div>
                <div className="lb-name">
                  {rc.name}
                  {isWithdrawn(rc.status) && <WithdrewTag status={rc.status} />}
                </div>
                <div className="lb-meta">
                  <span className={`party-${party}`}>{party.toUpperCase()}</span>
                  {rc.title ? ` · ${rc.title.toUpperCase()}` : ""}
                </div>
              </div>
              <div className="lb-stats">
                <div className="lb-pct">
                  {r.pct == null ? "—" : r.pct.toFixed(1)}
                  <span className="small">%</span>
                </div>
                <div className="lb-raised">{fmtM(r.raised)} raised</div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

// ─── POLLING CHART (simple inline rolling avg) ──────────────────
function PollingChartSection() {
  const { data: polling } = useTxGovPolling();
  const { data: candidates = [] } = useCandidates();

  const chart = useMemo(() => buildRollingAvg(polling, candidates, 5), [polling, candidates]);

  return (
    <section className="section">
      <div className="section__inner">
        <div className="section__head" style={{ borderBottom: 0 }}>
          <div>
            <h2 className="section__title">
              Polling, since the field <em>declared</em>.
            </h2>
            <div className="section__sub">
              30-DAY ROLLING AVG · TOP {chart?.series.length ?? 0} BY CURRENT POSITION · DERIVED FROM {polling?.polls.length ?? 0} POLLS
            </div>
          </div>
        </div>
        <div className="pollchart__layout">
          <div className="pollchart__chart">
            {chart ? <RollingAvgSvg chart={chart} /> : <ChartSkeleton />}
          </div>
          <PollingChartLeaderboard chart={chart} candidates={candidates} polling={polling} />
        </div>
      </div>
    </section>
  );
}

// ─── Right-side leaderboard for the polling chart
function PollingChartLeaderboard({
  chart,
  candidates,
  polling,
}: {
  chart: ChartData | null;
  candidates: TxCandidate[];
  polling: ReturnType<typeof useTxGovPolling>["data"] | undefined;
}) {
  const updated = polling?.last_updated
    ? `Updated ${new Date(polling.last_updated).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
    : "Awaiting sync";

  // Build rows for ALL polled candidates (those with a non-null current RCP value),
  // not just the top 5 plotted on the chart.
  const rows = useMemo(() => {
    if (!polling?.average || candidates.length === 0) return [];
    const surnameOf = (name: string) => name.trim().split(/\s+/).pop() ?? "";
    const series = chart?.series ?? [];

    // For computing 30-day delta we look up each candidate in the chart series
    // (if present) and use the first non-null value as the baseline ~30 days ago.
    const baselineBySlug = new Map<string, number | null>();
    series.forEach((s) => {
      const v = s.values.find((x) => x != null) ?? null;
      baselineBySlug.set(s.slug, v);
    });

    return candidates
      .map((c) => {
        const surname = surnameOf(c.name);
        const pct = readCandidatePct(polling.average, c.name);
        if (pct == null) return null;
        const baseline = baselineBySlug.get(c.slug);
        const delta = baseline != null ? pct - baseline : null;
        // pick a color matching the chart series, or a neutral fallback
        const inChart = series.find((s) => s.slug === c.slug);
        return { candidate: c, surname, pct, delta, color: inChart?.color ?? "var(--ink-3)" };
      })
      .filter((x): x is NonNullable<typeof x> => x != null)
      .sort((a, b) => b.pct - a.pct);
  }, [polling, candidates, chart]);

  return (
    <aside className="pollchart__leaderboard">
      <div className="pollchart__leaderboard-head">
        <span>
          <span className="live-dot" /> RCP avg · {rows.length} polled
        </span>
        <span className="updated">{updated.toUpperCase()}</span>
      </div>
      {rows.length === 0 && (
        <div style={{ padding: 18, fontFamily: "var(--f-mono)", fontSize: 12, color: "var(--ink-3)" }}>
          Awaiting polling data…
        </div>
      )}
      {rows.map((r, i) => {
        const party = partyTag(r.candidate.party);
        return (
          <div className="pollchart__leaderboard-row" key={r.candidate.id}>
            <span className="rank">{pad(i + 1)}</span>
            <CandPhoto candidate={r.candidate} className={`lb-photo party-${party}`} />
            <div className="body">
              <div className="name">
                {r.candidate.name}
                {isWithdrawn(r.candidate.status) && <WithdrewTag status={r.candidate.status} />}
              </div>
              <div className="meta">
                <span className={`party-${party}`}>{party.toUpperCase()}</span>
                {r.candidate.title ? ` · ${r.candidate.title.toUpperCase()}` : ""}
              </div>
            </div>
            <div className="stats">
              <div className="pct">
                {r.pct.toFixed(1)}
                <span className="small">%</span>
              </div>
              {r.delta != null && Math.abs(r.delta) >= 0.05 && (
                <div className={`delta ${r.delta > 0 ? "up" : "down"}`}>
                  {r.delta > 0 ? "▲" : "▼"} {Math.abs(r.delta).toFixed(1)}
                </div>
              )}
            </div>
            <span className="row-color" style={{ background: r.color }} aria-hidden />
          </div>
        );
      })}
      <div className="pollchart__leaderboard-foot">
        <Link to="/beta/polling">All {polling?.polls.length ?? 0} polls →</Link>
      </div>
    </aside>
  );
}

function ChartSkeleton() {
  return (
    <div
      style={{
        height: 360,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--f-mono)",
        color: "var(--ink-3)",
      }}
    >
      Loading polling…
    </div>
  );
}

type ChartData = {
  dates: string[];
  series: { slug: string; name: string; color: string; values: (number | null)[] }[];
};

function buildRollingAvg(
  polling: ReturnType<typeof useTxGovPolling>["data"] | undefined,
  candidates: TxCandidate[],
  topN: number,
): ChartData | null {
  if (!polling || !polling.average || !candidates.length) return null;

  const surnameOf = (name: string) => name.trim().split(/\s+/).pop() ?? "";

  // Top N candidates by current RCP avg
  const ranked = candidates
    .map((c) => ({ c, surname: surnameOf(c.name), pct: readCandidatePct(polling.average, c.name) ?? 0 }))
    .filter((x) => x.pct > 0)
    .sort((a, b) => b.pct - a.pct)
    .slice(0, topN);

  if (ranked.length === 0) return null;

  const todayIso = new Date().toISOString().slice(0, 10);
  type Norm = { iso: string; values: Record<string, number> };
  const normalized: Norm[] = [];
  for (const poll of polling.polls) {
    const iso = parsePollDate(poll.Date);
    if (!iso || iso === "0000-00-00" || iso > todayIso) continue;
    const values: Record<string, number> = {};
    for (const { surname } of ranked) {
      const v = (poll as any)[surname];
      if (v !== undefined && v !== "") {
        const n = Number(v);
        if (Number.isFinite(n)) values[surname] = n;
      }
    }
    if (Object.keys(values).length > 0) normalized.push({ iso, values });
  }
  normalized.sort((a, b) => a.iso.localeCompare(b.iso));
  if (normalized.length === 0) return null;

  const uniqueDates = Array.from(new Set(normalized.map((p) => p.iso))).sort();
  const WINDOW_DAYS = 30;
  const msDay = 86_400_000;

  const series = ranked.map(({ c, surname }, idx) => {
    const colors = ["var(--c-abbott)", "var(--c-hinojosa)", "var(--c-chambers)", "var(--c-cole)", "var(--c-white)"];
    const values = uniqueDates.map((iso) => {
      const end = new Date(iso).getTime();
      const start = end - WINDOW_DAYS * msDay;
      const samples = normalized
        .filter((p) => {
          const t = new Date(p.iso).getTime();
          return t >= start && t <= end;
        })
        .map((p) => p.values[surname])
        .filter((n): n is number => typeof n === "number");
      if (samples.length === 0) return null;
      return samples.reduce((s, n) => s + n, 0) / samples.length;
    });
    return {
      slug: c.slug,
      name: c.name,
      color: colors[idx] ?? "var(--c-other)",
      values,
    };
  });

  return { dates: uniqueDates, series };
}

function RollingAvgSvg({ chart }: { chart: ChartData }) {
  const W = 1200;
  const H = 420;
  const m = { l: 60, r: 150, t: 24, b: 56 };
  const pw = W - m.l - m.r;
  const ph = H - m.t - m.b;
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Y range: cap at sensible max above the highest value, never less than 40
  const allVals = chart.series.flatMap((s) => s.values.filter((v): v is number => v != null));
  const dataMax = allVals.length ? Math.max(...allVals) : 40;
  const yMax = Math.max(40, Math.ceil((dataMax + 4) / 10) * 10);
  const yMin = 0;
  const yToPx = (v: number) => m.t + ph - ((v - yMin) / (yMax - yMin)) * ph;
  const yTicks: number[] = [];
  for (let v = 0; v <= yMax; v += 10) yTicks.push(v);

  // ─── X scale: TIME-PROPORTIONAL (was index-proportional, which clumped polls
  // wherever the cadence was bursty). Map each ISO date to ms-since-epoch and
  // place it as a fraction of (date - tMin) / (tMax - tMin).
  const ts = chart.dates.map((d) => new Date(d).getTime());
  const tMin = ts[0];
  const tMax = ts[ts.length - 1];
  const tSpan = Math.max(1, tMax - tMin);
  const xByIndex = ts.map((t) => m.l + ((t - tMin) / tSpan) * pw);
  const xByDate = (iso: string) => {
    const t = new Date(iso).getTime();
    return m.l + ((t - tMin) / tSpan) * pw;
  };

  // ─── X-axis date labels: pick ~6-8 evenly-time-spaced ticks (NOT every nth row).
  const dateTickCount = 7;
  const dateTicks: { iso: string; px: number; label: string }[] = [];
  for (let i = 0; i <= dateTickCount; i++) {
    const t = tMin + (tSpan * i) / dateTickCount;
    const d = new Date(t);
    const px = m.l + (i / dateTickCount) * pw;
    dateTicks.push({
      iso: d.toISOString(),
      px,
      label: d.toLocaleDateString("en-US", { month: "short", year: tSpan > 180 * 86400000 ? "2-digit" : undefined }),
    });
  }

  // ─── End-of-line labels: stagger vertically so close-together pcts don't overlap.
  // Take each series' final non-null value, sort by Y, then push down any that
  // collide with the one above (min 18px between rows).
  type EndLabel = { color: string; name: string; pct: number; xEnd: number; targetY: number; y: number };
  const endLabels: EndLabel[] = [];
  chart.series.forEach((s) => {
    let lastIdx = -1;
    for (let i = s.values.length - 1; i >= 0; i--) {
      if (s.values[i] != null) { lastIdx = i; break; }
    }
    if (lastIdx < 0) return;
    const v = s.values[lastIdx] as number;
    endLabels.push({
      color: s.color,
      name: candidateShort(s.name),
      pct: v,
      xEnd: xByIndex[lastIdx],
      targetY: yToPx(v),
      y: yToPx(v),
    });
  });
  // Stagger: sort by targetY ascending, then ensure each label's y is at least
  // MIN_GAP px below the previous.
  endLabels.sort((a, b) => a.targetY - b.targetY);
  const MIN_GAP = 26;
  for (let i = 1; i < endLabels.length; i++) {
    const prev = endLabels[i - 1];
    if (endLabels[i].y - prev.y < MIN_GAP) endLabels[i].y = prev.y + MIN_GAP;
  }
  // If the cluster pushes off the bottom, shift the whole stack up.
  if (endLabels.length > 0) {
    const overflow = endLabels[endLabels.length - 1].y - (m.t + ph - 6);
    if (overflow > 0) {
      const shift = Math.min(overflow, m.t + ph - 6);
      endLabels.forEach((e) => (e.y -= shift));
    }
  }

  // map a clientX (px) inside the SVG to the nearest series-index
  function handleMove(e: React.PointerEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const xRel = e.clientX - rect.left;
    const xViewBox = (xRel / rect.width) * W;
    if (xViewBox < m.l - 6 || xViewBox > W - m.r + 6) {
      setHoverIdx(null);
      return;
    }
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < xByIndex.length; i++) {
      const d = Math.abs(xByIndex[i] - xViewBox);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }
    setHoverIdx(bestIdx);
  }

  // Tooltip content: date + each candidate's value at that index
  const hoverTip = useMemo(() => {
    if (hoverIdx == null) return null;
    const iso = chart.dates[hoverIdx];
    const dateLabel = new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const items = chart.series
      .map((s) => ({ name: candidateShort(s.name), pct: s.values[hoverIdx], color: s.color }))
      .filter((x): x is { name: string; pct: number; color: string } => x.pct != null)
      .sort((a, b) => b.pct - a.pct);
    return { dateLabel, items };
  }, [hoverIdx, chart]);

  // Compute tooltip pixel position (inside the wrapper div) so it sits
  // right next to the hovered date.
  const [tipRect, setTipRect] = useState<{ left: number; top: number } | null>(null);
  useEffect(() => {
    if (hoverIdx == null || !svgRef.current || !wrapRef.current) {
      setTipRect(null);
      return;
    }
    const svgRect = svgRef.current.getBoundingClientRect();
    const wrapRect = wrapRef.current.getBoundingClientRect();
    const xVB = xByIndex[hoverIdx];
    const left = (xVB / W) * svgRect.width + (svgRect.left - wrapRect.left);
    const top = svgRect.top - wrapRect.top + 12;
    setTipRect({ left, top });
  }, [hoverIdx]);

  return (
    <div ref={wrapRef} className="pollchart__svg-wrap">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={{ width: "100%", height: H, display: "block", marginTop: 12 }}
        role="img"
        aria-label="Polling averages over time"
        onPointerMove={handleMove}
        onPointerLeave={() => setHoverIdx(null)}
      >
        {/* y-axis grid + labels */}
        {yTicks.map((y) => (
          <g key={y}>
            <line x1={m.l} y1={yToPx(y)} x2={W - m.r} y2={yToPx(y)} stroke="var(--rule-soft)" strokeWidth={1} />
            <text x={m.l - 10} y={yToPx(y) + 4} textAnchor="end" fontFamily="JetBrains Mono" fontSize={11} fill="#5a5a3e" fontWeight={600}>
              {y}%
            </text>
          </g>
        ))}

        {/* x-axis date ticks */}
        {dateTicks.map((t, i) => (
          <g key={i}>
            <line x1={t.px} y1={H - m.b} x2={t.px} y2={H - m.b + 4} stroke="var(--rule)" strokeWidth={1} />
            <text x={t.px} y={H - m.b + 22} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={11} fill="#5a5a3e" fontWeight={600}>
              {t.label}
            </text>
          </g>
        ))}
        <line x1={m.l} y1={H - m.b} x2={W - m.r} y2={H - m.b} stroke="var(--rule)" strokeWidth={1} />

        {/* lines + dots */}
        {chart.series.map((s) => {
          const pts: string[] = [];
          let started = false;
          s.values.forEach((v, i) => {
            if (v == null) return;
            const cmd = started ? "L" : "M";
            pts.push(`${cmd} ${xByIndex[i].toFixed(1)} ${yToPx(v).toFixed(1)}`);
            started = true;
          });
          return (
            <g key={s.slug}>
              <path d={pts.join(" ")} fill="none" stroke={s.color} strokeWidth={2.4} />
              {s.values.map((v, i) =>
                v == null ? null : (
                  <circle
                    key={i}
                    cx={xByIndex[i].toFixed(1)}
                    cy={yToPx(v).toFixed(1)}
                    r={2.5}
                    fill={s.color}
                    stroke="#fffced"
                    strokeWidth={1}
                  />
                ),
              )}
            </g>
          );
        })}

        {/* end-of-line labels with leader lines from the actual end-point to the staggered y */}
        {endLabels.map((el, i) => {
          const labelX = el.xEnd + 12;
          const collapsed = Math.abs(el.y - el.targetY) < 0.5;
          return (
            <g key={i}>
              {!collapsed && (
                <line x1={el.xEnd + 4} y1={el.targetY} x2={labelX - 2} y2={el.y} stroke={el.color} strokeWidth={1} opacity={0.6} />
              )}
              <text x={labelX} y={el.y + 4} fontFamily="Roboto" fontSize={12} fontWeight={700} fill={el.color}>
                {el.name}
              </text>
              <text x={labelX} y={el.y + 18} fontFamily="JetBrains Mono" fontSize={10} fontWeight={600} fill="#5a5a3e">
                {el.pct.toFixed(1)}%
              </text>
            </g>
          );
        })}

        {/* hover guideline + emphasized dots */}
        {hoverIdx != null && (
          <g pointerEvents="none">
            <line
              x1={xByIndex[hoverIdx]}
              y1={m.t}
              x2={xByIndex[hoverIdx]}
              y2={m.t + ph}
              stroke="var(--ink)"
              strokeWidth={1}
              strokeDasharray="3 3"
              opacity={0.4}
            />
            {chart.series.map((s) => {
              const v = s.values[hoverIdx];
              if (v == null) return null;
              return (
                <circle
                  key={s.slug + "-hover"}
                  cx={xByIndex[hoverIdx]}
                  cy={yToPx(v)}
                  r={5}
                  fill={s.color}
                  stroke="#fffced"
                  strokeWidth={2}
                />
              );
            })}
          </g>
        )}
      </svg>
      {hoverTip && tipRect && (
        <div className="pollchart__tooltip" style={{ left: tipRect.left, top: tipRect.top }}>
          <div className="tt-date">{hoverTip.dateLabel}</div>
          <div className="tt-rows">
            {hoverTip.items.map((it, i) => (
              <div className="tt-row" key={i}>
                <span className="tt-swatch" style={{ background: it.color }} />
                <span className="tt-name">{it.name}</span>
                <span className="tt-pct">{it.pct.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div
        style={{
          fontFamily: "var(--f-mono)",
          fontSize: 11,
          color: "var(--ink-3)",
          letterSpacing: "0.04em",
          marginTop: 14,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          paddingTop: 12,
          borderTop: "1px solid var(--rule-soft)",
        }}
      >
        <span>
          <strong style={{ color: "var(--ink-2)" }}>SOURCE:</strong> RealClearPolitics · 30-day trailing mean per candidate · time-proportional X
        </span>
        <span>
          <strong style={{ color: "var(--ink-2)" }}>N =</strong> {chart.series.length} candidates · {chart.dates.length} unique dates
        </span>
      </div>
    </div>
  );
}

// ─── KPI STRIP ──────────────────────────────────────────────
function KpiStrip() {
  const { data: polling } = useTxGovPolling();
  const { data: totals } = useCandidateTotals();
  const { data: ieCmts } = useTopIECommittees(50);
  const { data: candidates = [] } = useCandidates();

  const totalRaised = useMemo(() => {
    if (!totals) return 0;
    let s = 0;
    totals.forEach((t) => (s += t.raised));
    return s;
  }, [totals]);

  const ieTotals = useMemo(() => {
    let total = 0;
    let supporting = 0;
    let opposing = 0;
    (ieCmts ?? []).forEach((c) => {
      total += c.total_amount;
      supporting += c.supporting;
      opposing += c.opposing;
    });
    return { total, supporting, opposing, count: ieCmts?.length ?? 0 };
  }, [ieCmts]);

  // Latest poll = most recent row in polling.polls (already sorted desc)
  const latestPoll = polling?.polls?.[0] ?? null;
  const top3FromLatest = useMemo(() => {
    if (!latestPoll || !candidates.length) return [];
    return candidates
      .map((c) => ({ name: candidateShort(c.name), pct: readCandidatePct(latestPoll, c.name) }))
      .filter((x) => x.pct != null)
      .sort((a, b) => (b.pct! - a.pct!))
      .slice(0, 3);
  }, [latestPoll, candidates]);

  // Days to the general election
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  const days = Math.max(0, Math.floor((ELECTION_TARGET - now) / 86_400_000));

  return (
    <section className="kpis">
      <div className="kpis__inner">
        <div className="kpi">
          <div className="kpi__label">
            <span className="live-dot" />
            Latest poll
          </div>
          <div className="kpi__value">{latestPoll?.Poll?.split(/[/-]/)[0]?.trim() ?? "—"}</div>
          <div className="kpi__delta">
            {latestPoll ? (
              <>
                <strong>{latestPoll.Date}</strong> ·{" "}
                {top3FromLatest.map((t, i) => (
                  <span key={i}>
                    {t.name} {t.pct}
                    {i < top3FromLatest.length - 1 ? " · " : ""}
                  </span>
                ))}
              </>
            ) : (
              "no polls yet"
            )}
          </div>
        </div>

        <div className="kpi">
          <div className="kpi__label">Total raised · cycle</div>
          <div className="kpi__value">{fmtM(totalRaised).replace("$", "$")}</div>
          <div className="kpi__delta">
            <strong>{candidates.length}</strong> candidates · summed via useCandidateTotals
          </div>
        </div>

        <div className="kpi">
          <div className="kpi__label">IE spending · cycle</div>
          <div className="kpi__value red">{fmtM(ieTotals.total)}</div>
          <div className="kpi__delta">
            <strong style={{ color: "var(--red-deep)" }}>{fmtM(ieTotals.opposing)} opposing</strong> ·{" "}
            {fmtM(ieTotals.supporting)} supporting · {ieTotals.count} cmtes
          </div>
        </div>

        <div className="kpi">
          <div className="kpi__label">Days to general</div>
          <div className="kpi__value blue">{days}</div>
          <div className="kpi__delta">
            <strong>Nov 3, 2026</strong> · Abbott vs. Hinojosa
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FIELD STANDINGS (top 10) ──────────────────────────────
function FieldStandings() {
  const { data: candidates = [] } = useCandidates();
  const { data: polling } = useTxGovPolling();
  const { data: totals } = useCandidateTotals();
  const { data: ieByCand } = useIEByCandidate();

  const rows = useMemo(() => buildLeaderboard(candidates, polling, totals, ieByCand, 10), [
    candidates,
    polling,
    totals,
    ieByCand,
  ]);

  return (
    <section className="section">
      <div className="section__inner">
        <div className="section__head">
          <div>
            <h2 className="section__title">
              The <em>field</em>, ranked
            </h2>
            <div className="section__sub">
              <span className="live-dot" />
              {candidates.length} CANDIDATES · SORTED BY RCP AVG
            </div>
          </div>
        </div>
      </div>

      <table className="dt">
        <thead>
          <tr>
            <th>#</th>
            <th>Candidate</th>
            <th className="right">RCP avg</th>
            <th className="right">Raised</th>
            <th className="right">Cash on hand</th>
            <th className="right">IE for / against</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} style={{ color: "var(--ink-3)", textAlign: "center", padding: 32 }}>
                Loading candidates…
              </td>
            </tr>
          )}
          {rows.map((r, i) => {
            const c = r.candidate;
            const party = partyTag(c.party);
            const ieCell =
              r.ieFor === 0 && r.ieAgainst === 0 ? (
                <span style={{ color: "var(--ink-3)" }}>none</span>
              ) : (
                <>
                  <span className="for">{fmtM(r.ieFor)}</span>{" / "}
                  <span className="against">{fmtM(r.ieAgainst)}</span>
                </>
              );
            return (
              <tr key={c.id} style={isWithdrawn(c.status) ? { opacity: 0.55 } : undefined}>
                <td>
                  <span className="cell-rank">{pad(i + 1)}</span>
                </td>
                <td>
                  <div className="cell-cand">
                    <CandPhoto candidate={c} className={`cell-cand__photo party-${party}`} />
                    <div>
                      <div className="cell-cand__name">
                        {c.name}
                        {isWithdrawn(c.status) && <WithdrewTag status={c.status} />}
                      </div>
                      <div className="cell-cand__meta">
                        <span className={`party-${party}`}>{party.toUpperCase()}</span>
                        {c.title ? ` · ${c.title.toUpperCase()}` : ""}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="right">
                  {r.pct == null ? (
                    <span style={{ color: "var(--ink-3)", fontFamily: "var(--f-mono)", fontSize: 12 }}>not polled</span>
                  ) : (
                    <span className="cell-pct">
                      {r.pct.toFixed(1)}
                      <span className="small">%</span>
                    </span>
                  )}
                </td>
                <td className="right cell-money">{fmtM(r.raised)}</td>
                <td className="right cell-money">{fmtM(r.cash)}</td>
                <td className="right cell-ie">{ieCell}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="dt-foot">
        <span>SOURCE: useCandidates · useTxGovPolling · useCandidateTotals · useIEByCandidate</span>
        <Link to="/beta/candidates">See all {candidates.length} →</Link>
      </div>
    </section>
  );
}

// ─── DONORS ──────────────────────────────────────────────────
function DonorsSection() {
  const { data: indDonors } = useTopAggregatedDonors(8, "individual");
  const { data: pacDonors } = useTopAggregatedDonors(5, "pac");
  const { data: candidates = [] } = useCandidates();

  const candNameById = useMemo(() => {
    const m = new Map<string, string>();
    candidates.forEach((c) => m.set(c.id, candidateShort(c.name)));
    return m;
  }, [candidates]);

  return (
    <section className="section">
      <div className="section__inner">
        <div className="section__head">
          <div>
            <h2 className="section__title">
              Where the <em>money</em> comes from
            </h2>
            <div className="section__sub">CROSS-CANDIDATE AGGREGATION · 2025–26 CYCLE</div>
          </div>
        </div>
      </div>

      <div className="donors">
        <div className="donors__col donors__col--left">
          <div className="donors__col-title">
            Top 8 individual donors
            <small>cycle to date</small>
          </div>
          <ol className="donors-list">
            {(indDonors ?? []).map((d, i) => (
              <li key={d.key}>
                <span className="rank">{pad(i + 1)}</span>
                <div>
                  <div className="name">{d.display_name}</div>
                  <div className="ctx">
                    {[d.employer, d.city].filter(Boolean).join(" · ").toUpperCase() || "INDIVIDUAL"}
                    {d.splits.length > 0 && ` · ${d.splits.length} candidate${d.splits.length === 1 ? "" : "s"}`}
                  </div>
                </div>
                <span className="amount">{fmtM(d.total_amount)}</span>
              </li>
            ))}
            {!indDonors && (
              <li>
                <span className="rank">—</span>
                <div>
                  <div className="name">Loading…</div>
                </div>
                <span className="amount">—</span>
              </li>
            )}
          </ol>
        </div>

        <div className="donors__col">
          <div className="donors__col-title">Top 5 PAC contributors</div>
          <ol className="donors-list">
            {(pacDonors ?? []).map((d, i) => (
              <li key={d.key}>
                <span className="rank">{pad(i + 1)}</span>
                <div>
                  <div className="name">{d.display_name}</div>
                  <div className="ctx">
                    {[d.employer, d.city].filter(Boolean).join(" · ").toUpperCase() || "PAC"}
                  </div>
                </div>
                <span className="amount">{fmtM(d.total_amount)}</span>
              </li>
            ))}
            {!pacDonors && (
              <li>
                <span className="rank">—</span>
                <div>
                  <div className="name">Loading…</div>
                </div>
                <span className="amount">—</span>
              </li>
            )}
          </ol>
        </div>
      </div>

      <div className="dt-foot">
        <span>SOURCE: useTopAggregatedDonors · tx_top_donors view re-aggregated client-side</span>
        <Link to="/beta/top-donors">Browse all donors →</Link>
      </div>
    </section>
  );
}

// ─── IE SECTION ─────────────────────────────────────────────
function IeSection() {
  const { data: ieCmts } = useTopIECommittees(8);
  return (
    <section className="section">
      <div className="section__inner">
        <div className="section__head">
          <div>
            <h2 className="section__title">
              Independent <em>expenditures</em>
            </h2>
            <div className="section__sub">TOP COMMITTEES BY CYCLE TOTAL · TEC</div>
          </div>
        </div>
      </div>

      <div className="donors">
        <div className="donors__col" style={{ gridColumn: "1 / -1" }}>
          <div style={{ padding: 0 }}>
            {(ieCmts ?? []).map((c) => {
              const fpct = c.total_amount > 0 ? (c.supporting / c.total_amount) * 100 : 0;
              const apct = c.total_amount > 0 ? (c.opposing / c.total_amount) * 100 : 0;
              return (
                <div className="ie-cmt" key={c.filer_id}>
                  <div>
                    <div className="ie-cmt__name">{c.name}</div>
                    <div className="ie-cmt__ctx">
                      {apct > fpct ? (
                        <>
                          {Math.round(apct)}% <span className="against">AGAINST</span>
                          {fpct > 0 && (
                            <>
                              {" "}/ {Math.round(fpct)}% <span className="for">FOR</span>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          {Math.round(fpct)}% <span className="for">FOR</span>
                          {apct > 0 && (
                            <>
                              {" "}/ {Math.round(apct)}% <span className="against">AGAINST</span>
                            </>
                          )}
                        </>
                      )}
                      {" · "}{c.transaction_count} transactions
                    </div>
                  </div>
                  <span className="ie-cmt__amt">{fmtM(c.total_amount)}</span>
                  <span className="ie-cmt__bar">
                    <span className="fpart" style={{ width: `${fpct}%` }} />
                    <span className="apart" style={{ width: `${apct}%` }} />
                  </span>
                </div>
              );
            })}
            {!ieCmts && (
              <div style={{ padding: 24, color: "var(--ink-3)", fontFamily: "var(--f-mono)" }}>Loading IE…</div>
            )}
          </div>
        </div>
      </div>

      <div className="dt-foot">
        <span>SOURCE: useTopIECommittees · tx_independent_expenditures aggregated by committee</span>
        <Link to="/beta/ie">Full IE breakdown →</Link>
      </div>
    </section>
  );
}

// ─── METHODOLOGY ────────────────────────────────────────────
function MethodologyPanel() {
  return (
    <section className="methodology">
      <div className="methodology__inner">
        <div>
          <div className="methodology__kicker">Methodology · open-source &amp; auditable</div>
          <h2 className="methodology__title">
            How we average <em>polls</em>.
          </h2>
          <p className="methodology__deck">
            We follow RealClearPolitics: trailing public polls, normalized by methodology and recency.
            <strong> The polling pipeline runs nightly.</strong> Campaign-finance data is mirrored from the Texas Ethics Commission bulk data daily.
          </p>
          <div className="methodology__sources">
            <span>270toWin</span>·<span>Wikipedia</span>·<span>Texas Ethics Commission</span>
          </div>
        </div>
        <ol className="methodology__steps">
          <li className="methodology__step">
            <span className="methodology__num">01</span>
            <span className="methodology__step-title">POLLS COLLECTED</span>
            <span className="methodology__step-desc">RCP + Wikipedia, normalized to a common schema</span>
          </li>
          <li className="methodology__step">
            <span className="methodology__num">02</span>
            <span className="methodology__step-title">DEDUPED &amp; STAGED</span>
            <span className="methodology__step-desc">Aggregator rows preferred; raw polls merged when needed</span>
          </li>
          <li className="methodology__step">
            <span className="methodology__num">03</span>
            <span className="methodology__step-title">FINANCE MIRRORED</span>
            <span className="methodology__step-desc">TEC contributions, expenditures, and DCE filings synced; donors normalized</span>
          </li>
          <li className="methodology__step">
            <span className="methodology__num">04</span>
            <span className="methodology__step-title">ROLLUPS COMPUTED</span>
            <span className="methodology__step-desc">Per-candidate raised, spent, cash, IE for/against, top donors</span>
          </li>
          <li className="methodology__step">
            <span className="methodology__num">05</span>
            <span className="methodology__step-title">PUBLISHED</span>
            <span className="methodology__step-desc">Polling avg + finance rollups served via API and UI</span>
          </li>
        </ol>
      </div>
    </section>
  );
}

// ─── FOOTER CTA ─────────────────────────────────────────────
function FooterCta() {
  return (
    <section className="footer-cta">
      <h2 className="footer-cta__title">
        See the <em>race</em>.
        <br />
        Follow the <em>money</em>.
      </h2>
      <p className="footer-cta__deck">Look up a candidate, a donor, or a city. In about ten seconds.</p>
      <div className="footer-cta__row">
        <Link className="btn btn--primary btn--lg" to="/beta/candidates">
          Browse all candidates →
        </Link>
        <Link className="btn btn--lg" to="/beta/top-donors">
          Search a donor
        </Link>
      </div>
    </section>
  );
}
