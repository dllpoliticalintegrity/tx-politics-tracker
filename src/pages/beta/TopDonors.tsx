import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BetaLayout } from "@/components/beta/BetaLayout";
import { fmtM, pad, partyTag } from "@/components/beta/shared";
import {
  useTopAggregatedDonors,
  useCandidates,
  useAllSummaries,
  type DonorKind,
} from "@/hooks/useCandidates";

export default function BetaTopDonors() {
  const [kind, setKind] = useState<DonorKind>("all");
  const { data: donors, isLoading } = useTopAggregatedDonors(50, kind);
  const { data: candidates = [] } = useCandidates();
  const { data: summaries } = useAllSummaries();

  const candById = useMemo(() => {
    const m = new Map<string, { name: string; party: string | null; slug: string }>();
    candidates.forEach((c) => m.set(c.id, { name: c.name, party: c.party, slug: c.slug }));
    return m;
  }, [candidates]);

  const cycleStats = useMemo(() => {
    let totalRaised = 0;
    let indCount = 0;
    let smallDollar = 0;
    (summaries ?? []).forEach((s) => {
      totalRaised += Number(s.total_raised ?? 0);
      indCount += Number(s.individual_donor_count ?? 0);
      smallDollar += Number(s.small_dollar_contributions ?? 0);
    });
    const smallPct = totalRaised > 0 ? Math.round((smallDollar / totalRaised) * 100) : 0;
    return { totalRaised, indCount, smallDollar, smallPct };
  }, [summaries]);

  const top10 = useMemo(() => (donors ?? []).slice(0, 10), [donors]);

  return (
    <BetaLayout active="donors">
      <main>
        <PageHero stats={cycleStats} pacCount={(donors ?? []).filter((d) => d.contributor_type !== "INDIVIDUAL").length} />

        {/* filter tabs */}
        <div className="donor-tabs">
          <div className="donor-tabs__inner">
            <span className="donor-tabs__label">Type</span>
            <button
              className={`tag-chip ${kind === "all" ? "active" : ""}`}
              onClick={() => setKind("all")}
              type="button"
            >
              All
            </button>
            <button
              className={`tag-chip ${kind === "individual" ? "active" : ""}`}
              onClick={() => setKind("individual")}
              type="button"
            >
              <span className="tag-chip__dot" style={{ background: "var(--green)" }} />
              Individuals
            </button>
            <button
              className={`tag-chip ${kind === "pac" ? "active" : ""}`}
              onClick={() => setKind("pac")}
              type="button"
            >
              <span className="tag-chip__dot" style={{ background: "var(--periwinkle)" }} />
              PACs &amp; committees
            </button>
            <span className="donor-tabs__count">
              SHOWING TOP <strong>{top10.length}</strong> · SORTED BY $ TOTAL
            </span>
          </div>
        </div>

        <section className="section">
          <div className="section__inner">
            <div className="section__head">
              <div>
                <h2 className="section__title">
                  Top <em>10</em> donors · cycle
                </h2>
                <div className="section__sub">CROSS-CANDIDATE AGGREGATION · TOTAL $ ACROSS ALL CAMPAIGNS</div>
              </div>
            </div>
          </div>

          <div>
            {isLoading && (
              <div style={{ padding: 32, color: "var(--ink-3)", fontFamily: "var(--f-mono)", textAlign: "center" }}>
                Loading donors…
              </div>
            )}
            {top10.map((d, i) => {
              const isPac = (d.contributor_type ?? "").toUpperCase() !== "INDIVIDUAL";
              const ctxParts: string[] = [];
              if (d.employer) ctxParts.push(d.employer.toUpperCase());
              if (d.city) ctxParts.push(d.city.toUpperCase());
              ctxParts.push(`${d.contribution_count} contribution${d.contribution_count === 1 ? "" : "s"}`);
              if (d.last_contribution_date) ctxParts.push(`last ${formatShortDate(d.last_contribution_date)}`);

              return (
                <article className="donor-card" key={d.key}>
                  <div className="rank">{pad(i + 1)}</div>
                  <span className={`type-pill ${isPac ? "pac" : "ind"}`}>{isPac ? "PAC" : "IND"}</span>
                  <div className="body">
                    <div className="name">{d.display_name}</div>
                    <div className="ctx">{ctxParts.join(" · ")}</div>
                    <div className="splits">
                      {d.splits.slice(0, 5).map((s) => {
                        const cand = candById.get(s.candidate_id);
                        if (!cand) return null;
                        const party = partyTag(cand.party);
                        const surname = cand.name.trim().split(/\s+/).pop()?.toUpperCase() ?? "—";
                        const sharePct = d.total_amount > 0 ? Math.round((s.total_amount / d.total_amount) * 100) : 0;
                        return (
                          <Link
                            to={`/beta/candidates/${cand.slug}`}
                            key={s.candidate_id}
                            className={`split party-${party}`}
                            title={`${s.contribution_count} contribution${s.contribution_count === 1 ? "" : "s"}`}
                          >
                            {surname} <span className="pct">{fmtM(s.total_amount)} · {sharePct}%</span>
                          </Link>
                        );
                      })}
                      {d.splits.length > 5 && (
                        <span className="split" style={{ color: "var(--ink-3)" }}>
                          +{d.splits.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="total">{fmtM(d.total_amount)}</div>
                    <div className="total-meta">CYCLE TOTAL</div>
                  </div>
                </article>
              );
            })}
            {!isLoading && top10.length === 0 && (
              <div style={{ padding: 32, color: "var(--ink-3)", fontFamily: "var(--f-mono)", textAlign: "center" }}>
                No donors match this filter.
              </div>
            )}
          </div>

          <div className="dt-foot">
            <span>SOURCE: useTopAggregatedDonors · tx_top_donors view re-aggregated client-side</span>
            <Link to="/beta/candidates">All candidates →</Link>
          </div>
        </section>
      </main>
    </BetaLayout>
  );
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function PageHero({
  stats,
  pacCount,
}: {
  stats: { totalRaised: number; indCount: number; smallDollar: number; smallPct: number };
  pacCount: number;
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
            Aggregated across all candidates · 2025–26 cycle
          </div>
          <h1 className="page-hero__title">
            Every <em>donor</em>, ranked.
          </h1>
          <p className="page-hero__deck">
            Cross-candidate aggregation: when one donor backs multiple candidates, their contributions are rolled into a single
            row. Per-candidate splits show underneath each row.
          </p>
        </div>
        <div className="page-hero__stats">
          <div className="stat">
            <div className="stat-label">Cycle total</div>
            <div className="stat-value">{fmtM(stats.totalRaised)}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Individual donors</div>
            <div className="stat-value">{stats.indCount.toLocaleString()}</div>
          </div>
          <div className="stat">
            <div className="stat-label">PAC entries</div>
            <div className="stat-value blue">{pacCount}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Small-dollar (&lt;$200)</div>
            <div className="stat-value green">
              {stats.smallPct}
              <span style={{ fontSize: 16, color: "var(--ink-3)" }}>%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
