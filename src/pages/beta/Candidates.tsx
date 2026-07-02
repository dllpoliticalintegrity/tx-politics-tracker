import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BetaLayout } from "@/components/beta/BetaLayout";
import {
  CandPhoto,
  WithdrewTag,
  TagChip,
  pad,
  fmtM,
  partyTag,
  isWithdrawn,
} from "@/components/beta/shared";
import {
  useCandidates,
  useCandidateTotals,
  useIEByCandidate,
  type TxCandidate,
  type TxIeByCandidate,
} from "@/hooks/useCandidates";
import { useTxGovPolling, readCandidatePct } from "@/hooks/usePolling";

type SortKey = "pct" | "raised" | "cash" | "ie" | "name";
type PartyFilter = "all" | "d" | "r" | "i";

export default function BetaCandidates() {
  const { data: candidates = [] } = useCandidates();
  const { data: polling } = useTxGovPolling();
  const { data: totals } = useCandidateTotals();
  const { data: ieByCand } = useIEByCandidate();

  const [sortBy, setSortBy] = useState<SortKey>("pct");
  const [partyFilter, setPartyFilter] = useState<PartyFilter>("all");
  const [showWithdrawn, setShowWithdrawn] = useState(true);

  const ieMap = useMemo(() => {
    const m = new Map<string, TxIeByCandidate>();
    (ieByCand ?? []).forEach((r) => m.set(r.candidate_id, r));
    return m;
  }, [ieByCand]);

  type Row = {
    candidate: TxCandidate;
    pct: number | null;
    raised: number;
    cash: number;
    ieFor: number;
    ieAgainst: number;
  };

  const allRows: Row[] = useMemo(() => {
    return candidates.map((c) => {
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
      };
    });
  }, [candidates, polling, totals, ieMap]);

  const filtered = useMemo(() => {
    let rows = allRows;
    if (partyFilter !== "all") rows = rows.filter((r) => partyTag(r.candidate.party) === partyFilter);
    if (!showWithdrawn) rows = rows.filter((r) => !isWithdrawn(r.candidate.status));
    return [...rows].sort((a, b) => {
      switch (sortBy) {
        case "raised":
          return b.raised - a.raised;
        case "cash":
          return b.cash - a.cash;
        case "ie":
          return b.ieFor + b.ieAgainst - (a.ieFor + a.ieAgainst);
        case "name":
          return a.candidate.name.localeCompare(b.candidate.name);
        case "pct":
        default:
          return (b.pct ?? -1) - (a.pct ?? -1);
      }
    });
  }, [allRows, partyFilter, showWithdrawn, sortBy]);

  const partyCounts = useMemo(() => {
    const c = { d: 0, r: 0, i: 0 };
    allRows.forEach((r) => c[partyTag(r.candidate.party)]++);
    return c;
  }, [allRows]);

  const totalRaised = useMemo(() => allRows.reduce((s, r) => s + r.raised, 0), [allRows]);
  const totalIe = useMemo(() => allRows.reduce((s, r) => s + r.ieFor + r.ieAgainst, 0), [allRows]);
  const polledCount = useMemo(() => allRows.filter((r) => r.pct != null).length, [allRows]);
  const withdrawnCount = useMemo(() => allRows.filter((r) => isWithdrawn(r.candidate.status)).length, [allRows]);

  return (
    <BetaLayout active="candidates">
      <main>
        <PageHero
          total={candidates.length}
          totalRaised={totalRaised}
          totalIe={totalIe}
          polledCount={polledCount}
          withdrawnCount={withdrawnCount}
        />

        <div className="filters-bar">
          <div className="filters-bar__inner">
            <span className="filters-bar__label">Filter</span>
            <TagChip active={partyFilter === "all"} onClick={() => setPartyFilter("all")} count={candidates.length}>
              All
            </TagChip>
            <TagChip active={partyFilter === "d"} dot="d" onClick={() => setPartyFilter("d")} count={partyCounts.d}>
              Democrat
            </TagChip>
            <TagChip active={partyFilter === "r"} dot="r" onClick={() => setPartyFilter("r")} count={partyCounts.r}>
              Republican
            </TagChip>
            <TagChip active={partyFilter === "i"} dot="i" onClick={() => setPartyFilter("i")} count={partyCounts.i}>
              Independent / other
            </TagChip>
            <span className="crumb__sep" style={{ margin: "0 8px" }}>
              │
            </span>
            <TagChip active={!showWithdrawn} onClick={() => setShowWithdrawn(!showWithdrawn)}>
              {showWithdrawn ? "Hide withdrawn" : "Show withdrawn"} ({withdrawnCount})
            </TagChip>
            <span className="filters-bar__count">
              SHOWING <strong>{filtered.length}</strong> · SORTED BY {sortLabel(sortBy)}
            </span>
          </div>
        </div>

        <section className="section">
          <div className="section__inner">
            <div className="section__head">
              <div>
                <h2 className="section__title">
                  All <em>{candidates.length}</em> candidates
                </h2>
                <div className="section__sub">RANKED BY {sortLabel(sortBy)} · ↓ DESCENDING</div>
              </div>
              <div className="section__seg">
                <SortBtn sortBy={sortBy} value="pct" onClick={setSortBy}>Poll avg</SortBtn>
                <SortBtn sortBy={sortBy} value="raised" onClick={setSortBy}>Raised</SortBtn>
                <SortBtn sortBy={sortBy} value="cash" onClick={setSortBy}>Cash on hand</SortBtn>
                <SortBtn sortBy={sortBy} value="ie" onClick={setSortBy}>IE exposure</SortBtn>
                <SortBtn sortBy={sortBy} value="name" onClick={setSortBy}>Alphabetical</SortBtn>
              </div>
            </div>
          </div>

          <table className="dt">
            <thead>
              <tr>
                <th>#</th>
                <th>Candidate</th>
                <th className="right">poll avg</th>
                <th className="right">Raised</th>
                <th className="right">Cash on hand</th>
                <th className="right">IE for / against</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ color: "var(--ink-3)", textAlign: "center", padding: 32 }}>
                    No candidates match these filters.
                  </td>
                </tr>
              )}
              {filtered.map((r, i) => {
                const c = r.candidate;
                const party = partyTag(c.party);
                const wd = isWithdrawn(c.status);
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
                  <tr key={c.id} style={wd ? { opacity: 0.55 } : undefined}>
                    <td>
                      <span className="cell-rank">{pad(i + 1)}</span>
                    </td>
                    <td>
                      <Link
                        to={`/beta/candidates/${c.slug}`}
                        className="cell-cand"
                        style={{ display: "flex", alignItems: "center", gap: 12 }}
                      >
                        <CandPhoto candidate={c} className={`cell-cand__photo party-${party}`} />
                        <div>
                          <div className="cell-cand__name">
                            {c.name}
                            {wd && <WithdrewTag status={r.candidate.status} />}
                          </div>
                          <div className="cell-cand__meta">
                            <span className={`party-${party}`}>{party.toUpperCase()}</span>
                            {c.title ? ` · ${c.title.toUpperCase()}` : ""}
                          </div>
                        </div>
                      </Link>
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
                    <td className="right">
                      <span className="row-chev">→</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="dt-foot">
            <span>SOURCE: useCandidates · useTxGovPolling · useCandidateTotals · useIEByCandidate</span>
            <Link to="/beta/polling">All polls →</Link>
          </div>
        </section>
      </main>
    </BetaLayout>
  );
}

function SortBtn({
  sortBy,
  value,
  onClick,
  children,
}: {
  sortBy: SortKey;
  value: SortKey;
  onClick: (v: SortKey) => void;
  children: React.ReactNode;
}) {
  return (
    <button className={sortBy === value ? "active" : ""} onClick={() => onClick(value)}>
      {children}
    </button>
  );
}

function sortLabel(s: SortKey): string {
  switch (s) {
    case "pct": return "POLL AVG";
    case "raised": return "TOTAL RAISED";
    case "cash": return "CASH ON HAND";
    case "ie": return "TOTAL IE EXPOSURE";
    case "name": return "NAME (A→Z)";
  }
}

function PageHero({
  total,
  totalRaised,
  totalIe,
  polledCount,
  withdrawnCount,
}: {
  total: number;
  totalRaised: number;
  totalIe: number;
  polledCount: number;
  withdrawnCount: number;
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
            {total} declared candidates · top-2 advance from primary
          </div>
          <h1 className="page-hero__title">
            Every candidate in the <em>field</em>.
          </h1>
          <p className="page-hero__deck">
            Sortable, searchable. Each candidate's <strong>RCP polling average, total raised, cash on hand, and
            independent-expenditure exposure</strong> &mdash; rebuilt from the Texas Ethics Commission and 270toWin.
          </p>
        </div>
        <div className="page-hero__stats">
          <div className="stat">
            <div className="stat-label">Total raised · cycle</div>
            <div className="stat-value">{fmtM(totalRaised)}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Total IE spending</div>
            <div className="stat-value red">{fmtM(totalIe)}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Polled by RCP</div>
            <div className="stat-value">
              {polledCount}
              <span style={{ fontSize: 16, color: "var(--ink-3)" }}>/{total}</span>
            </div>
          </div>
          <div className="stat">
            <div className="stat-label">Withdrawn</div>
            <div className="stat-value" style={{ color: "var(--ink-3)" }}>{withdrawnCount}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
