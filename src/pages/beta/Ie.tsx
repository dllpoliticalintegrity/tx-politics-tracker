import { useMemo } from "react";
import { Link } from "react-router-dom";
import { BetaLayout } from "@/components/beta/BetaLayout";
import { CandPhoto, fmtM, fmtMSigned, pad, partyTag } from "@/components/beta/shared";
import {
  useCandidates,
  useIEByCandidate,
  useTopIECommittees,
  type CaIeByCandidate,
} from "@/hooks/useCandidates";

export default function BetaIe() {
  const { data: candidates = [] } = useCandidates();
  const { data: ieByCand = [] } = useIEByCandidate();
  const { data: cmts, isLoading: cmtsLoading } = useTopIECommittees(20);

  const candById = useMemo(() => {
    const m = new Map(candidates.map((c) => [c.id, c]));
    return m;
  }, [candidates]);

  type Pos = {
    row: CaIeByCandidate;
    forAmt: number;
    againstAmt: number;
    net: number;
    cmts: number;
  };
  const positions: Pos[] = useMemo(() => {
    return ieByCand
      .map((r) => {
        const forAmt = Number(r.total_supporting ?? 0);
        const againstAmt = Number(r.total_opposing ?? 0);
        return {
          row: r,
          forAmt,
          againstAmt,
          net: forAmt - againstAmt,
          cmts: Number(r.committee_count ?? 0),
        };
      })
      .filter((p) => p.forAmt > 0 || p.againstAmt > 0)
      .sort((a, b) => b.net - a.net);
  }, [ieByCand]);

  // top-line stats
  const totals = useMemo(() => {
    let total = 0;
    let supporting = 0;
    let opposing = 0;
    (cmts ?? []).forEach((c) => {
      total += c.total_amount;
      supporting += c.supporting;
      opposing += c.opposing;
    });
    const oppPct = total > 0 ? Math.round((opposing / total) * 100) : 0;
    return { total, supporting, opposing, oppPct, count: cmts?.length ?? 0 };
  }, [cmts]);

  const targetCount = positions.length;

  return (
    <BetaLayout active="ie">
      <main>
        <PageHero totals={totals} targetCount={targetCount} />

        {/* by target candidate */}
        <section className="section">
          <div className="section__inner">
            <div className="section__head">
              <div>
                <h2 className="section__title">
                  By <em>target</em> candidate
                </h2>
                <div className="section__sub">NET POSITION = TOTAL SUPPORTING − TOTAL OPPOSING · CYCLE TO DATE</div>
              </div>
            </div>
          </div>

          <div>
            {positions.length === 0 && (
              <div style={{ padding: 32, color: "var(--ink-3)", fontFamily: "var(--f-mono)", textAlign: "center" }}>
                No IE activity yet.
              </div>
            )}
            <CandIePositions positions={positions} candById={candById} />
          </div>

          <div className="dt-foot">
            <span>SOURCE: useIEByCandidate · ca_ie_by_candidate view (total_supporting, total_opposing, committee_count)</span>
            <Link to="/beta/candidates">All candidates →</Link>
          </div>
        </section>

        {/* by committee */}
        <section className="section">
          <div className="section__inner">
            <div className="section__head">
              <div>
                <h2 className="section__title">
                  By <em>committee</em>
                </h2>
                <div className="section__sub">{totals.count} ACTIVE IE COMMITTEES · CYCLE SPENDING</div>
              </div>
            </div>
          </div>

          <div>
            {cmtsLoading && (
              <div style={{ padding: 32, color: "var(--ink-3)", fontFamily: "var(--f-mono)", textAlign: "center" }}>
                Loading committees…
              </div>
            )}
            {(cmts ?? []).map((c, i) => {
              const fpct = c.total_amount > 0 ? (c.supporting / c.total_amount) * 100 : 0;
              const apct = c.total_amount > 0 ? (c.opposing / c.total_amount) * 100 : 0;
              return (
                <article className="ie-cmt-card" key={c.filer_id}>
                  <div className="rank">{pad(i + 1)}</div>
                  <div className="body">
                    <div className="name">{c.name}</div>
                    <div className="meta">
                      {apct >= fpct ? (
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
                      {" · "}
                      {c.transaction_count} transactions
                    </div>
                    <div className="ratio">
                      {fpct > 0 && <span className="fpart" style={{ width: `${fpct}%` }} />}
                      {apct > 0 && <span className="apart" style={{ width: `${apct}%` }} />}
                    </div>
                  </div>
                  <div>
                    <div className="total">{fmtM(c.total_amount)}</div>
                    <div
                      style={{
                        fontFamily: "var(--f-mono)",
                        fontSize: 9.5,
                        fontWeight: 700,
                        color: "var(--ink-3)",
                        letterSpacing: "0.08em",
                        marginTop: 4,
                        textAlign: "right",
                      }}
                    >
                      CYCLE TOTAL
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="dt-foot">
            <span>SOURCE: useTopIECommittees · ca_independent_expenditures aggregated by committee</span>
            <Link to="/beta">Back to dashboard →</Link>
          </div>
        </section>
      </main>
    </BetaLayout>
  );
}

function CandIePositions({
  positions,
  candById,
}: {
  positions: { row: CaIeByCandidate; forAmt: number; againstAmt: number; net: number; cmts: number }[];
  candById: Map<string, ReturnType<typeof useCandidates>["data"] extends (infer T)[] | undefined ? T : never>;
}) {
  const maxAbs = Math.max(...positions.map((p) => Math.max(p.forAmt, p.againstAmt)), 1);
  return (
    <div>
      {positions.map((p, i) => {
        const cand = candById.get(p.row.candidate_id);
        if (!cand) return null;
        const party = partyTag(cand.party);
        const netCls = p.net > 0 ? "pos" : p.net < 0 ? "neg" : "zero";
        const forPct = (p.forAmt / maxAbs) * 100;
        const aPct = (p.againstAmt / maxAbs) * 100;
        const nonePct = Math.max(0, 100 - forPct - aPct);
        return (
          <div className="ie-pos-row" key={p.row.candidate_id}>
            <div className="rank">{pad(i + 1)}</div>
            <CandPhoto candidate={cand} className={`cell-cand__photo party-${party}`} />
            <div>
              <Link to={`/beta/candidates/${cand.slug}`} className="name">
                {cand.name}
              </Link>
              <div className="meta">
                <span className={`party-${party}`}>{party.toUpperCase()}</span>
                {cand.title ? ` · ${cand.title.toUpperCase()}` : ""}
                {" · "}
                {p.cmts} IE committee{p.cmts === 1 ? "" : "s"}
              </div>
              <div className="bar">
                {forPct > 0 && <span className="for" style={{ width: `${forPct}%` }} />}
                {aPct > 0 && <span className="against" style={{ width: `${aPct}%` }} />}
                {nonePct > 0 && <span className="none" style={{ width: `${nonePct}%` }} />}
              </div>
            </div>
            <div className="splits">
              <span className="for-amt">+{fmtM(p.forAmt)}</span>
              <span style={{ color: "var(--rule-3)", margin: "0 4px" }}>/</span>
              <span className="against-amt">−{fmtM(p.againstAmt)}</span>
            </div>
            <div>
              <div className={`net ${netCls}`}>{fmtMSigned(p.net)}</div>
              <div className="net-meta">NET</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PageHero({
  totals,
  targetCount,
}: {
  totals: { total: number; supporting: number; opposing: number; oppPct: number; count: number };
  targetCount: number;
}) {
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
            Outside money · cycle to date · 2025–26
          </div>
          <h1 className="page-hero__title">
            Independent <em>expenditures</em>, by side.
          </h1>
          <p className="page-hero__deck">
            Every dollar spent supporting or opposing a CA governor candidate by an independent committee &mdash; not coordinated
            with any campaign.{" "}
            <strong>{totals.oppPct}% of cycle IE money is opposing a candidate</strong>.
          </p>
        </div>
        <div className="page-hero__stats">
          <div className="stat">
            <div className="stat-label">Total IE · cycle</div>
            <div className="stat-value red">{fmtM(totals.total)}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Active committees</div>
            <div className="stat-value">{totals.count}</div>
          </div>
          <div className="stat">
            <div className="stat-label">% opposing</div>
            <div className="stat-value red">
              {totals.oppPct}
              <span style={{ fontSize: 16, color: "var(--ink-3)" }}>%</span>
            </div>
          </div>
          <div className="stat">
            <div className="stat-label">Candidates targeted</div>
            <div className="stat-value">{targetCount}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
