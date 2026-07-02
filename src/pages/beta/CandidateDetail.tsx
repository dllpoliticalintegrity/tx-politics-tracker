import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { BetaLayout } from "@/components/beta/BetaLayout";
import { CandPhoto, WithdrewTag, fmtM, fmtMSigned, isWithdrawn, partyTag } from "@/components/beta/shared";
import {
  useCandidate,
  useCandidateTotals,
  useContributionsSummary,
  useTopDonors,
  useTopIndustries,
  useIEByCandidate,
  useIEForCandidate,
} from "@/hooks/useCandidates";
import { useTxGovPolling, readCandidatePct, parsePollDate } from "@/hooks/usePolling";

export default function BetaCandidateDetail() {
  const { slug } = useParams();
  const { data: candidate, isLoading } = useCandidate(slug);
  const { data: polling } = useTxGovPolling();
  const { data: totals } = useCandidateTotals();
  const { data: ieByCand = [] } = useIEByCandidate();

  if (isLoading || !candidate) {
    return (
      <BetaLayout active="candidates">
        <main>
          <div style={{ padding: 64, textAlign: "center", color: "var(--ink-3)", fontFamily: "var(--f-mono)" }}>
            {isLoading ? "Loading candidate…" : "Candidate not found."}
          </div>
        </main>
      </BetaLayout>
    );
  }

  const pct = polling?.average ? readCandidatePct(polling.average, candidate.name) : null;
  const t = totals?.get(candidate.id);
  const ie = ieByCand.find((r) => r.candidate_id === candidate.id);
  const ieFor = Number(ie?.total_supporting ?? 0);
  const ieAgainst = Number(ie?.total_opposing ?? 0);
  const cmtCount = Number(ie?.committee_count ?? 0);

  return (
    <BetaLayout active="candidates">
      <main>
        <CandHeader
          candidate={candidate}
          pct={pct}
          raised={t?.raised ?? 0}
          cash={t?.cash ?? 0}
          ieFor={ieFor}
          ieAgainst={ieAgainst}
          cmtCount={cmtCount}
        />
        <PollingForCandidate candidateName={candidate.name} pct={pct} />
        <DonorsForCandidate candidateId={candidate.id} />
        <IndustriesAndSources candidateId={candidate.id} />
        <IeForCandidate candidateId={candidate.id} ieFor={ieFor} ieAgainst={ieAgainst} cmtCount={cmtCount} />
      </main>
    </BetaLayout>
  );
}

// ─── HEADER ─────────────────────────────────────────────────
function CandHeader({
  candidate,
  pct,
  raised,
  cash,
  ieFor,
  ieAgainst,
  cmtCount,
}: {
  candidate: ReturnType<typeof useCandidate>["data"] & object;
  pct: number | null;
  raised: number;
  cash: number;
  ieFor: number;
  ieAgainst: number;
  cmtCount: number;
}) {
  const party = partyTag(candidate.party);
  const wd = isWithdrawn(candidate.status);
  const netIe = ieFor - ieAgainst;

  return (
    <>
      <div className="crumb">
        <div className="crumb__inner">
          <Link className="crumb__back" to="/beta/candidates">
            ← All candidates
          </Link>
          <span className="crumb__sep">│</span>
          <span className="crumb__cur">{candidate.name}</span>
          <span className="crumb__right">
            {candidate.filer_ident && (
              <span>
                FILER ID <span className="id">#{candidate.filer_ident}</span>
              </span>
            )}
          </span>
        </div>
      </div>

      <section className="cand-header">
        <div className="cand-header__inner">
          <CandPhoto candidate={candidate} className="cand-photo" />
          <div className="cand-bio">
            <div className="cand-bio__role">
              {wd ? "Withdrew" : pct != null ? "Polled in poll avg" : "Not currently polled"}
            </div>
            <h1>{candidate.name}{wd && <WithdrewTag status={candidate.status} />}</h1>
            <div className="cand-bio__meta">
              <span className={`party-${party}`}>{party === "d" ? "Democrat" : party === "r" ? "Republican" : "Independent / Other"}</span>
              {candidate.title && (
                <>
                  <span className="sep">·</span>
                  {candidate.title}
                </>
              )}
            </div>
            {candidate.bio && <p className="cand-bio__blurb">{candidate.bio}</p>}
            <div className="cand-actions">
              {candidate.website && (
                <a className="btn btn--ghost" href={candidate.website} target="_blank" rel="noopener noreferrer">
                  Official site →
                </a>
              )}
            </div>
          </div>

          <aside className="pos-card">
            <div className="pos-card__head">
              <span>poll avg</span>
              {pct != null && <span className="pos-card__rank">CYCLE TO DATE</span>}
            </div>
            <div className="pos-card__pct">
              {pct != null ? pct.toFixed(1) : "—"}
              <span className="small">%</span>
            </div>
            <div className="pos-card__rows">
              <div className="pos-card__row">
                <span className="pos-card__row-label">Raised</span>
                <span className="pos-card__row-value">{fmtM(raised)}</span>
              </div>
              <div className="pos-card__row">
                <span className="pos-card__row-label">Cash on hand</span>
                <span className="pos-card__row-value green">{fmtM(cash)}</span>
              </div>
              <div className="pos-card__row">
                <span className="pos-card__row-label">IE supporting</span>
                <span className="pos-card__row-value green">+{fmtM(ieFor)}</span>
              </div>
              <div className="pos-card__row">
                <span className="pos-card__row-label">IE opposing</span>
                <span className="pos-card__row-value red">−{fmtM(ieAgainst)}</span>
              </div>
            </div>
          </aside>
        </div>

        <div className="cand-stats">
          <div className="cand-stat">
            <div className="cand-stat__label">Polling avg</div>
            <div className="cand-stat__value blue">
              {pct != null ? pct.toFixed(1) : "—"}
              <span className="cand-stat__value-sub">%</span>
            </div>
            <div className="cand-stat__delta">{pct != null ? "RCP 30-day rolling" : "not polled"}</div>
          </div>
          <div className="cand-stat">
            <div className="cand-stat__label">Total raised</div>
            <div className="cand-stat__value">{fmtM(raised)}</div>
            <div className="cand-stat__delta">cycle to date · TEC</div>
          </div>
          <div className="cand-stat">
            <div className="cand-stat__label">Cash on hand</div>
            <div className="cand-stat__value green">{fmtM(cash)}</div>
            <div className="cand-stat__delta">raised − spent (estimate)</div>
          </div>
          <div className="cand-stat">
            <div className="cand-stat__label">Net IE position</div>
            <div className={`cand-stat__value ${netIe >= 0 ? "green" : "red"}`}>{fmtMSigned(netIe)}</div>
            <div className="cand-stat__delta">
              <strong>{cmtCount}</strong> IE committee{cmtCount === 1 ? "" : "s"} active
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── POLLING (mini chart for this candidate) ────────────────
function PollingForCandidate({ candidateName, pct }: { candidateName: string; pct: number | null }) {
  const { data: polling } = useTxGovPolling();

  const series = useMemo(() => {
    if (!polling) return [];
    const surname = candidateName.trim().split(/\s+/).pop() ?? "";
    const todayIso = new Date().toISOString().slice(0, 10);
    const samples: { iso: string; v: number }[] = [];
    for (const poll of polling.polls) {
      const iso = parsePollDate(poll.Date);
      if (!iso || iso === "0000-00-00" || iso > todayIso) continue;
      const v = (poll as Record<string, string | undefined>)[surname];
      if (v == null || v === "") continue;
      const n = Number(v);
      if (Number.isFinite(n)) samples.push({ iso, v: n });
    }
    samples.sort((a, b) => a.iso.localeCompare(b.iso));
    return samples;
  }, [polling, candidateName]);

  if (series.length === 0) return null;

  return (
    <section className="section">
      <div className="section__inner">
        <div className="section__head" style={{ borderBottom: 0 }}>
          <div>
            <h2 className="section__title">
              {candidateName.split(" ").pop()}'s <em>polling</em>, since launch
            </h2>
            <div className="section__sub">{series.length} POLLS INCLUDE THIS CANDIDATE · CURRENT POLL AVG {pct?.toFixed(1) ?? "—"}%</div>
          </div>
        </div>
        <CandPollingChart series={series} />
      </div>
    </section>
  );
}

function CandPollingChart({ series }: { series: { iso: string; v: number }[] }) {
  const W = 1200;
  const H = 320;
  const m = { l: 60, r: 90, t: 24, b: 48 };
  const pw = W - m.l - m.r;
  const ph = H - m.t - m.b;
  const yMax = Math.max(40, Math.ceil((Math.max(...series.map((s) => s.v)) + 4) / 10) * 10);
  const yToPx = (v: number) => m.t + ph - (v / yMax) * ph;
  const ts = series.map((s) => new Date(s.iso).getTime());
  const tMin = ts[0];
  const tMax = ts[ts.length - 1];
  const tSpan = Math.max(1, tMax - tMin);
  const xToPx = (t: number) => m.l + ((t - tMin) / tSpan) * pw;

  const yTicks: number[] = [];
  for (let v = 0; v <= yMax; v += 10) yTicks.push(v);

  const lastV = series[series.length - 1].v;
  const lastT = ts[series.length - 1];

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
      <line x1={m.l} y1={H - m.b} x2={W - m.r} y2={H - m.b} stroke="var(--rule)" strokeWidth={1} />
      <path
        d={series.map((s, i) => `${i === 0 ? "M" : "L"} ${xToPx(ts[i]).toFixed(1)} ${yToPx(s.v).toFixed(1)}`).join(" ")}
        fill="none"
        stroke="var(--periwinkle)"
        strokeWidth={3}
      />
      {series.map((s, i) => (
        <circle
          key={i}
          cx={xToPx(ts[i]).toFixed(1)}
          cy={yToPx(s.v).toFixed(1)}
          r={3}
          fill="var(--periwinkle)"
          stroke="#fffced"
          strokeWidth={1.2}
        />
      ))}
      <text x={xToPx(lastT) + 8} y={yToPx(lastV) + 4} fontFamily="JetBrains Mono" fontSize={12} fontWeight={800} fill="var(--periwinkle-deep)">
        {lastV}%
      </text>
    </svg>
  );
}

// ─── DONORS ─────────────────────────────────────────────────
function DonorsForCandidate({ candidateId }: { candidateId: string }) {
  const { data: indDonors } = useTopDonors(candidateId, 6, "individual");
  const { data: pacDonors } = useTopDonors(candidateId, 6, "pac");
  const { data: summaryRows } = useContributionsSummary(candidateId);
  const summary = summaryRows?.[0];

  return (
    <section className="section">
      <div className="section__inner">
        <div className="section__head">
          <div>
            <h2 className="section__title">
              Where the <em>money</em> came from
            </h2>
            <div className="section__sub">
              {summary?.individual_donor_count ?? "—"} INDIVIDUAL DONORS · CYCLE TO DATE
            </div>
          </div>
        </div>
      </div>

      <div className="twocol">
        <div>
          <div className="twocol__title">
            Top individual donors <small>cycle to date</small>
          </div>
          <ol className="donors-list">
            {(indDonors ?? []).map((d, i) => {
              const display =
                [d.contributor_first_name, d.contributor_last_name].filter(Boolean).join(" ") || d.contributor_last_name || "—";
              const ctx = [d.employer, d.city].filter(Boolean).join(" · ").toUpperCase();
              return (
                <li key={`${d.candidate_id}-${i}`}>
                  <span className="rank">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <div className="name">{display}</div>
                    <div className="ctx">{ctx || "INDIVIDUAL"} · {d.contribution_count} contribution{d.contribution_count === 1 ? "" : "s"}</div>
                  </div>
                  <span className="amount">{fmtM(Number(d.total_amount))}</span>
                </li>
              );
            })}
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

        <div>
          <div className="twocol__title">
            Top PACs <small>cycle to date</small>
          </div>
          <ol className="donors-list">
            {(pacDonors ?? []).map((d, i) => {
              const display = d.contributor_last_name || "—";
              const ctx = [d.employer, d.city].filter(Boolean).join(" · ").toUpperCase();
              return (
                <li key={`${d.candidate_id}-${i}-pac`}>
                  <span className="rank">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <div className="name">{display}</div>
                    <div className="ctx">{ctx || "PAC"} · {d.contribution_count} contribution{d.contribution_count === 1 ? "" : "s"}</div>
                  </div>
                  <span className="amount">{fmtM(Number(d.total_amount))}</span>
                </li>
              );
            })}
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
        <span>SOURCE: useTopDonors · tx_top_donors view filtered to candidate</span>
      </div>
    </section>
  );
}

// ─── INDUSTRIES + SOURCE MIX ─────────────────────────────
function IndustriesAndSources({ candidateId }: { candidateId: string }) {
  const { data: industries } = useTopIndustries(candidateId, 8);
  const { data: summaryRows } = useContributionsSummary(candidateId);
  const summary = summaryRows?.[0];

  const maxIndustry = useMemo(() => Math.max(...(industries ?? []).map((x) => x.amount), 1), [industries]);

  // Source mix percentages from TxContributionSummary
  const mix = useMemo(() => {
    if (!summary) return null;
    const ind = Number(summary.individual_contributions ?? 0);
    const entity = Number(summary.entity_contributions ?? 0);
    const small = Number(summary.small_dollar_contributions ?? 0);
    const total = Number(summary.total_raised ?? 0) || ind + entity;
    if (total === 0) return null;
    const indNonSmall = Math.max(0, ind - small);
    return {
      total,
      smallPct: Math.round((small / total) * 100),
      indPct: Math.round((indNonSmall / total) * 100),
      pacPct: Math.round((entity / total) * 100),
    };
  }, [summary]);

  return (
    <section className="section">
      <div className="twocol">
        <div>
          <div className="twocol__title">
            Top employers / industries <small>top contributing employers</small>
          </div>
          {(industries ?? []).map((row) => (
            <div className="bar-row" key={row.name}>
              <span className="bar-row__label tech">{row.name.slice(0, 28)}</span>
              <span className="bar-row__track">
                <span className="bar-row__fill tech" style={{ width: `${(row.amount / maxIndustry) * 100}%` }} />
              </span>
              <span className="bar-row__num">{fmtM(row.amount)}</span>
            </div>
          ))}
          {!industries && (
            <div style={{ padding: 16, color: "var(--ink-3)", fontFamily: "var(--f-mono)" }}>Loading…</div>
          )}
        </div>

        <div>
          <div className="twocol__title">
            Contribution sources <small>{mix ? fmtM(mix.total) + " total" : ""}</small>
          </div>
          {mix && (
            <div className="source-mix">
              <div
                className="source-mix__chart"
                style={{
                  background: `conic-gradient(
                    var(--green) 0% ${mix.smallPct}%,
                    var(--periwinkle) ${mix.smallPct}% ${mix.smallPct + mix.indPct}%,
                    var(--sky-deep) ${mix.smallPct + mix.indPct}% 100%
                  )`,
                }}
              />
              <ul className="source-mix__rows" style={{ margin: 0, padding: 0 }}>
                <li>
                  <span className="swatch" style={{ background: "var(--green)" }} />
                  <span className="src">Small-dollar (&lt;$200)</span>
                  <span></span>
                  <span className="pct">{mix.smallPct}%</span>
                </li>
                <li>
                  <span className="swatch" style={{ background: "var(--periwinkle)" }} />
                  <span className="src">Other individuals</span>
                  <span></span>
                  <span className="pct">{mix.indPct}%</span>
                </li>
                <li>
                  <span className="swatch" style={{ background: "var(--sky-deep)" }} />
                  <span className="src">Entities (PACs, firms)</span>
                  <span></span>
                  <span className="pct">{mix.pacPct}%</span>
                </li>
              </ul>
            </div>
          )}
          {!mix && (
            <div style={{ padding: 16, color: "var(--ink-3)", fontFamily: "var(--f-mono)" }}>Loading…</div>
          )}
          <div style={{ marginTop: 18, fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.04em" }}>
            SOURCE: <code>useContributionsSummary</code>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── IE FOR THIS CANDIDATE ──────────────────────────────────
function IeForCandidate({
  candidateId,
  ieFor,
  ieAgainst,
  cmtCount,
}: {
  candidateId: string;
  ieFor: number;
  ieAgainst: number;
  cmtCount: number;
}) {
  const { data: ieRows } = useIEForCandidate(candidateId, 12);

  if (ieFor === 0 && ieAgainst === 0) return null;

  return (
    <section className="section">
      <div className="section__inner">
        <div className="section__head">
          <div>
            <h2 className="section__title">
              Independent <em>expenditures</em>
            </h2>
            <div className="section__sub">
              {cmtCount} IE COMMITTEES · NET POSITION{" "}
              <strong style={{ color: ieFor - ieAgainst >= 0 ? "var(--green-deep)" : "var(--red-deep)" }}>
                {fmtMSigned(ieFor - ieAgainst)}
              </strong>
            </div>
          </div>
        </div>
      </div>

      <div className="twocol">
        <div>
          <div className="twocol__title">Recent IE transactions</div>
          <ul className="ie-tx-list">
            {(ieRows ?? []).slice(0, 8).map((r) => {
              const isSupport = (r.support_oppose ?? "").toUpperCase() === "S";
              const date = r.expenditure_date
                ? new Date(r.expenditure_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                : "—";
              return (
                <li key={r.id}>
                  <span className={`tx-pill ${isSupport ? "s" : "o"}`}>{isSupport ? "SUPPORT" : "OPPOSE"}</span>
                  <div>
                    <div className="tx-cmt">{r.committee_name ?? `Filer ${r.ie_filer_ident}`}</div>
                    <div className="tx-meta">{(r.description ?? "—").toUpperCase()} · {date}</div>
                  </div>
                  <div className="tx-amt">{fmtM(r.amount)}</div>
                </li>
              );
            })}
            {!ieRows && (
              <li>
                <span className="tx-pill s">—</span>
                <div>
                  <div className="tx-cmt">Loading…</div>
                </div>
                <div className="tx-amt">—</div>
              </li>
            )}
          </ul>
        </div>

        <div>
          <div className="twocol__title">Summary</div>
          <div className="ie-cmt">
            <div>
              <div className="ie-cmt__name">Supporting</div>
              <div className="ie-cmt__ctx">
                <span className="for">FOR THIS CANDIDATE</span>
              </div>
            </div>
            <span className="ie-cmt__amt" style={{ color: "var(--green-deep)" }}>+{fmtM(ieFor)}</span>
          </div>
          <div className="ie-cmt">
            <div>
              <div className="ie-cmt__name">Opposing</div>
              <div className="ie-cmt__ctx">
                <span className="against">AGAINST THIS CANDIDATE</span>
              </div>
            </div>
            <span className="ie-cmt__amt" style={{ color: "var(--red-deep)" }}>−{fmtM(ieAgainst)}</span>
          </div>
          <div className="ie-cmt" style={{ borderTop: "2px solid var(--ink)", borderBottom: 0, marginTop: 4 }}>
            <div>
              <div className="ie-cmt__name">Net</div>
              <div className="ie-cmt__ctx">{cmtCount} committee{cmtCount === 1 ? "" : "s"} active</div>
            </div>
            <span className="ie-cmt__amt" style={{ color: ieFor - ieAgainst >= 0 ? "var(--green-deep)" : "var(--red-deep)" }}>
              {fmtMSigned(ieFor - ieAgainst)}
            </span>
          </div>
        </div>
      </div>

      <div className="dt-foot">
        <span>SOURCE: useIEForCandidate + useIEByCandidate · tx_independent_expenditures</span>
        <Link to="/beta/ie">All IE activity →</Link>
      </div>
    </section>
  );
}
