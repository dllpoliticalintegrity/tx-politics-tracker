import { useMemo } from "react";
import { Link } from "react-router-dom";
import { BetaLayout } from "@/components/beta/BetaLayout";
import { candidateShort } from "@/components/beta/shared";
import { useCandidates, type TxCandidate } from "@/hooks/useCandidates";
import { useTxGovPolling, parsePollDate, readCandidatePct, type PollRow } from "@/hooks/usePolling";

export default function BetaPolling() {
  const { data: polling } = useTxGovPolling();
  const { data: candidates = [] } = useCandidates();

  const pollsterCount = useMemo(() => {
    if (!polling) return 0;
    const set = new Set<string>();
    polling.polls.forEach((p) => p.Poll && set.add(p.Poll.split(/[/-]/)[0].trim()));
    return set.size;
  }, [polling]);

  // Top candidates that the RCP average actually has values for, sorted by current pct.
  const rankedCands = useMemo(() => {
    if (!polling?.average || candidates.length === 0) return [];
    return candidates
      .map((c) => ({ c, surname: c.name.trim().split(/\s+/).pop() ?? "", pct: readCandidatePct(polling.average, c.name) }))
      .filter((x): x is { c: TxCandidate; surname: string; pct: number } => x.pct != null && x.pct > 0)
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 5);
  }, [polling, candidates]);

  const leader = rankedCands[0];

  return (
    <BetaLayout active="polling">
      <main>
        <PageHero polling={polling} pollsterCount={pollsterCount} leader={leader} />
        <ChartSection polling={polling} cands={rankedCands} />
        <PollsTable polling={polling} cands={rankedCands} />
      </main>
    </BetaLayout>
  );
}

function PageHero({
  polling,
  pollsterCount,
  leader,
}: {
  polling: ReturnType<typeof useTxGovPolling>["data"];
  pollsterCount: number;
  leader: { c: TxCandidate; surname: string; pct: number } | undefined;
}) {
  const pollCount = polling?.polls.length ?? 0;
  const latest = polling?.polls?.[0];
  return (
    <section className="page-hero">
      <div className="page-hero__inner">
        <div className="page-hero__main">
          <div className="page-hero__kicker kicker">
            <span
              style={{
                width: 7,
                height: 7,
                background: "var(--green)",
                borderRadius: "50%",
                display: "inline-block",
                marginRight: 4,
              }}
            />
            Every public poll
          </div>
          <h1 className="page-hero__title">
            {pollCount} polls, <em>one</em> picture.
          </h1>
          <p className="page-hero__deck">
            Every public horse-race poll in the 270toWin feed since launch &mdash; aggregated into a{" "}
            <strong>270toWin polling average</strong>, plus the raw rows so you can audit the math.
          </p>
        </div>
        <div className="page-hero__stats">
          <div className="stat">
            <div className="stat-label">Polls collected</div>
            <div className="stat-value">{pollCount}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Pollsters</div>
            <div className="stat-value">{pollsterCount}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Latest poll</div>
            <div className="stat-value">
              {latest?.Poll?.split(/[/-]/)[0]?.trim() ?? "—"}
              {latest?.Date && (
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--ink-3)", marginLeft: 6, letterSpacing: "0.06em" }}>
                  {latest.Date}
                </span>
              )}
            </div>
          </div>
          <div className="stat">
            <div className="stat-label">Front-runner</div>
            <div className="stat-value blue">
              {leader ? leader.pct.toFixed(1) : "—"}
              <span style={{ fontSize: 16, color: "var(--ink-3)" }}>%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChartSection({
  polling,
  cands,
}: {
  polling: ReturnType<typeof useTxGovPolling>["data"];
  cands: { c: TxCandidate; surname: string; pct: number }[];
}) {
  const chart = useMemo(() => buildRollingChart(polling, cands), [polling, cands]);

  return (
    <section className="section">
      <div className="section__inner">
        <div className="section__head" style={{ borderBottom: 0 }}>
          <div>
            <h2 className="section__title">
              Rolling <em>average</em>, since launch
            </h2>
            <div className="section__sub">30-DAY TRAILING WINDOW · TOP {cands.length} BY CURRENT POSITION</div>
          </div>
        </div>
        {chart ? (
          <RollingChart chart={chart} />
        ) : (
          <div style={{ padding: 32, color: "var(--ink-3)", fontFamily: "var(--f-mono)", textAlign: "center" }}>
            Loading polling…
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
            <strong style={{ color: "var(--ink-2)" }}>SOURCE:</strong> 270toWin ·{" "}
            {polling?.polls.length ?? 0} polls aggregated · time-proportional X axis
          </span>
          <span>
            <strong style={{ color: "var(--ink-2)" }}>N =</strong> {cands.length} of polled candidates
          </span>
        </div>
      </div>
    </section>
  );
}

function PollsTable({
  polling,
  cands,
}: {
  polling: ReturnType<typeof useTxGovPolling>["data"];
  cands: { c: TxCandidate; surname: string; pct: number }[];
}) {
  const rows = useMemo(() => {
    if (!polling) return [];
    const list: { row: PollRow; rcp: boolean }[] = [];
    if (polling.average) list.push({ row: polling.average, rcp: true });
    polling.polls.forEach((p) => list.push({ row: p, rcp: false }));
    return list;
  }, [polling]);

  return (
    <section className="section">
      <div className="section__inner">
        <div className="section__head">
          <div>
            <h2 className="section__title">
              Every <em>poll</em>, every row
            </h2>
            <div className="section__sub">270toWin RAW DATA · MOST-RECENT FIRST · TOP {cands.length} CANDIDATES</div>
          </div>
        </div>
      </div>

      <table className="polls-table">
        <thead>
          <tr>
            <th>Poll</th>
            <th className="right">Date</th>
            <th className="right">Sample</th>
            <th className="right">MoE</th>
            {cands.map(({ surname }) => (
              <th key={surname} className="right">
                {surname}
              </th>
            ))}
            <th className="right">Spread</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={5 + cands.length} style={{ color: "var(--ink-3)", textAlign: "center", padding: 32 }}>
                Loading polls…
              </td>
            </tr>
          )}
          {rows.map(({ row, rcp }, i) => {
            const vals = cands.map(({ surname }) => {
              const v = (row as Record<string, string | undefined>)[surname];
              if (v === undefined || v === "") return null;
              const n = Number(v);
              return Number.isFinite(n) ? n : null;
            });
            const lead = Math.max(...(vals.filter((v): v is number => v != null)));
            return (
              <tr key={`${row.Poll}-${row.Date}-${i}`} className={rcp ? "rcp" : ""}>
                <td>
                  <div className="poll-name">{row.Poll}</div>
                  <div className="poll-meta">{rcp ? "270toWin AVERAGE" : "PUBLIC POLL"}</div>
                </td>
                <td>{row.Date}</td>
                <td>{row.Sample || "—"}</td>
                <td>{row.MoE || "—"}</td>
                {vals.map((v, idx) => (
                  <td key={idx} className={`pct-cell ${v == null ? "dash" : v === lead ? "lead" : ""}`}>
                    {v == null ? "—" : v}
                  </td>
                ))}
                <td>
                  <span className="spread">{row.Spread ?? "—"}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="dt-foot">
        <span>
          SOURCE: <code>race_polling.raw_data</code> · Poll · Date · Sample · MoE · per-surname columns
        </span>
        {polling?.rcp_url && (
          <a href={polling.rcp_url} target="_blank" rel="noopener noreferrer">
            270toWin page ↗
          </a>
        )}
      </div>
    </section>
  );
}

// ─── chart helpers (time-proportional X, label staggering) ──
type Series = { slug: string; name: string; color: string; values: (number | null)[] };
type ChartData = { dates: string[]; series: Series[] };

function buildRollingChart(
  polling: ReturnType<typeof useTxGovPolling>["data"],
  cands: { c: TxCandidate; surname: string; pct: number }[],
): ChartData | null {
  if (!polling || cands.length === 0) return null;

  const todayIso = new Date().toISOString().slice(0, 10);
  type Norm = { iso: string; values: Record<string, number> };
  const normalized: Norm[] = [];
  for (const poll of polling.polls) {
    const iso = parsePollDate(poll.Date);
    if (!iso || iso === "0000-00-00" || iso > todayIso) continue;
    const values: Record<string, number> = {};
    for (const { surname } of cands) {
      const v = (poll as Record<string, string | undefined>)[surname];
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
  const colors = ["var(--c-abbott)", "var(--c-hinojosa)", "var(--c-chambers)", "var(--c-cole)", "var(--c-white)"];

  const series: Series[] = cands.map(({ c, surname }, idx) => ({
    slug: c.slug,
    name: c.name,
    color: colors[idx] ?? "var(--c-other)",
    values: uniqueDates.map((iso) => {
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
    }),
  }));

  return { dates: uniqueDates, series };
}

function RollingChart({ chart }: { chart: ChartData }) {
  const W = 1200;
  const H = 420;
  const m = { l: 60, r: 150, t: 24, b: 56 };
  const pw = W - m.l - m.r;
  const ph = H - m.t - m.b;
  const allVals = chart.series.flatMap((s) => s.values.filter((v): v is number => v != null));
  const dataMax = allVals.length ? Math.max(...allVals) : 40;
  const yMax = Math.max(40, Math.ceil((dataMax + 4) / 10) * 10);
  const yToPx = (v: number) => m.t + ph - (v / yMax) * ph;
  const yTicks: number[] = [];
  for (let v = 0; v <= yMax; v += 10) yTicks.push(v);

  const ts = chart.dates.map((d) => new Date(d).getTime());
  const tMin = ts[0];
  const tMax = ts[ts.length - 1];
  const tSpan = Math.max(1, tMax - tMin);
  const xByIndex = ts.map((t) => m.l + ((t - tMin) / tSpan) * pw);

  const dateTickCount = 7;
  const dateTicks = Array.from({ length: dateTickCount + 1 }, (_, i) => {
    const t = tMin + (tSpan * i) / dateTickCount;
    const d = new Date(t);
    const px = m.l + (i / dateTickCount) * pw;
    return {
      px,
      label: d.toLocaleDateString("en-US", {
        month: "short",
        year: tSpan > 180 * 86400000 ? "2-digit" : undefined,
      }),
    };
  });

  type EndLabel = { color: string; name: string; pct: number; xEnd: number; targetY: number; y: number };
  const endLabels: EndLabel[] = [];
  chart.series.forEach((s) => {
    let lastIdx = -1;
    for (let i = s.values.length - 1; i >= 0; i--) {
      if (s.values[i] != null) {
        lastIdx = i;
        break;
      }
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
  endLabels.sort((a, b) => a.targetY - b.targetY);
  const MIN_GAP = 26;
  for (let i = 1; i < endLabels.length; i++) {
    const prev = endLabels[i - 1];
    if (endLabels[i].y - prev.y < MIN_GAP) endLabels[i].y = prev.y + MIN_GAP;
  }
  if (endLabels.length > 0) {
    const overflow = endLabels[endLabels.length - 1].y - (m.t + ph - 6);
    if (overflow > 0) {
      const shift = Math.min(overflow, m.t + ph - 6);
      endLabels.forEach((e) => (e.y -= shift));
    }
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: "100%", height: H, display: "block", marginTop: 12 }}>
      {yTicks.map((y) => (
        <g key={y}>
          <line x1={m.l} y1={yToPx(y)} x2={W - m.r} y2={yToPx(y)} stroke="var(--rule-soft)" strokeWidth={1} />
          <text x={m.l - 10} y={yToPx(y) + 4} textAnchor="end" fontFamily="JetBrains Mono" fontSize={11} fill="#5a5a3e" fontWeight={600}>
            {y}%
          </text>
        </g>
      ))}
      {dateTicks.map((t, i) => (
        <text
          key={i}
          x={t.px}
          y={H - m.b + 22}
          textAnchor="middle"
          fontFamily="JetBrains Mono"
          fontSize={11}
          fill="#5a5a3e"
          fontWeight={600}
        >
          {t.label}
        </text>
      ))}
      <line x1={m.l} y1={H - m.b} x2={W - m.r} y2={H - m.b} stroke="var(--rule)" strokeWidth={1} />
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
                <circle key={i} cx={xByIndex[i].toFixed(1)} cy={yToPx(v).toFixed(1)} r={2.5} fill={s.color} stroke="#fffced" strokeWidth={1} />
              ),
            )}
          </g>
        );
      })}
      {endLabels.map((el, i) => (
        <g key={i}>
          {Math.abs(el.y - el.targetY) >= 0.5 && (
            <line x1={el.xEnd + 4} y1={el.targetY} x2={el.xEnd + 10} y2={el.y} stroke={el.color} strokeWidth={1} opacity={0.6} />
          )}
          <text x={el.xEnd + 12} y={el.y + 4} fontFamily="Roboto" fontSize={12} fontWeight={700} fill={el.color}>
            {el.name}
          </text>
          <text x={el.xEnd + 12} y={el.y + 18} fontFamily="JetBrains Mono" fontSize={10} fontWeight={600} fill="#5a5a3e">
            {el.pct.toFixed(1)}%
          </text>
        </g>
      ))}
    </svg>
  );
}
