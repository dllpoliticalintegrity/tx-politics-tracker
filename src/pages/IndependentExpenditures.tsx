import { Link } from "react-router-dom";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Megaphone, TrendingUp, Building2 } from "lucide-react";
import { useCandidates, useIEByCandidate, useTopIECommittees } from "@/hooks/useCandidates";
import { formatCurrency, formatCurrencyFull, partyColor } from "@/lib/finance";

export default function IndependentExpenditures() {
  const { data: candidates } = useCandidates();
  const { data: ieByCand, isLoading: ieLoading, error: ieError } = useIEByCandidate();
  const { data: topCommittees } = useTopIECommittees(20);
  const [cycleFilter, setCycleFilter] = useState<string>("all");

  const candidateById = new Map((candidates ?? []).map((c) => [c.id, c]));

  const perCandidate = (ieByCand ?? [])
    .filter((r) => cycleFilter === "all" || r.cycle === cycleFilter)
    .map((r) => {
      const cand = candidateById.get(r.candidate_id);
      return {
        ...r,
        name: cand?.name ?? r.name,
        party: cand?.party ?? null,
        slug: cand?.slug ?? r.slug,
        net: Number(r.total_supporting ?? 0) - Number(r.total_opposing ?? 0),
        total: Number(r.total_supporting ?? 0) + Number(r.total_opposing ?? 0),
      };
    })
    .filter((r) => r.total > 0)
    .sort((a, b) => b.total - a.total);

  const grandTotalSupporting = perCandidate.reduce(
    (s, r) => s + Number(r.total_supporting ?? 0),
    0,
  );
  const grandTotalOpposing = perCandidate.reduce(
    (s, r) => s + Number(r.total_opposing ?? 0),
    0,
  );

  const cycleOptions = ["all", "primary-2026", "general-2026"];

  return (
    <div className="min-h-[80vh] terminal-grid">
      <section className="container pt-12 pb-6 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-primary/20 bg-primary/5 text-primary font-mono text-xs tracking-wider">
          <Megaphone className="h-3.5 w-3.5" />
          INDEPENDENT EXPENDITURES
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Outside Spending // 2026 TX Governor
        </h1>
        <p className="text-sm text-muted-foreground font-mono">
          Independent expenditures by PACs and committees supporting or opposing gubernatorial
          candidates. Sourced from TEC direct-campaign-expenditure (DCE) filings.
        </p>
      </section>

      <section className="container pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] text-muted-foreground tracking-widest">
            CYCLE:
          </span>
          {cycleOptions.map((c) => (
            <button
              key={c}
              onClick={() => setCycleFilter(c)}
              className={`font-mono text-[11px] px-2 py-1 rounded-sm border tracking-widest transition-colors ${
                cycleFilter === c
                  ? "border-primary text-primary bg-primary/10"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {c === "all" ? "ALL" : c.toUpperCase()}
            </button>
          ))}
        </div>
      </section>

      <section className="container pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card className="p-4 rounded-sm border-border">
            <TrendingUp className="h-4 w-4 text-chart-5 mb-2" />
            <div className="font-mono font-bold text-xl">{formatCurrency(grandTotalSupporting)}</div>
            <div className="font-mono text-[10px] text-muted-foreground tracking-widest">
              TOTAL SUPPORTING
            </div>
          </Card>
          <Card className="p-4 rounded-sm border-border">
            <TrendingUp className="h-4 w-4 text-destructive mb-2 rotate-180" />
            <div className="font-mono font-bold text-xl">{formatCurrency(grandTotalOpposing)}</div>
            <div className="font-mono text-[10px] text-muted-foreground tracking-widest">
              TOTAL OPPOSING
            </div>
          </Card>
          <Card className="p-4 rounded-sm border-border">
            <Building2 className="h-4 w-4 text-primary mb-2" />
            <div className="font-mono font-bold text-xl">{(topCommittees ?? []).length}</div>
            <div className="font-mono text-[10px] text-muted-foreground tracking-widest">
              ACTIVE IE COMMITTEES
            </div>
          </Card>
        </div>
      </section>

      <section className="container pb-10 space-y-3">
        <h2 className="font-mono text-xs tracking-widest text-primary uppercase flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-primary" />
          BY CANDIDATE
        </h2>
        {ieLoading && (
          <div className="font-mono text-xs text-muted-foreground py-6 text-center">
            LOADING IE DATA...
          </div>
        )}
        {ieError && (
          <div className="font-mono text-xs text-destructive py-6 text-center">
            ERROR LOADING IE DATA
          </div>
        )}
        {!ieLoading && !ieError && perCandidate.length === 0 && (
          <div className="font-mono text-xs text-muted-foreground py-6 text-center">
            NO IE ACTIVITY FOR THIS CYCLE YET
          </div>
        )}
        <div className="space-y-2">
          {perCandidate.map((r) => (
            <Link key={r.candidate_id} to={`/candidates/${r.slug}`}>
              <Card className="p-4 rounded-sm border-border hover:border-primary/40 transition-colors group">
                <div className="flex items-center gap-4">
                  <span
                    className="font-mono text-[10px] px-1.5 py-0.5 rounded-sm tracking-widest shrink-0"
                    style={{ backgroundColor: partyColor(r.party), color: "white" }}
                  >
                    {r.party ?? "—"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate group-hover:text-primary transition-colors">
                      {r.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono">
                      {(r.supporting_count ?? 0)} support · {(r.opposing_count ?? 0)} oppose · {r.committee_count ?? 0}{" "}
                      committees
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono text-xs text-chart-5">
                      +{formatCurrency(Number(r.total_supporting ?? 0))}
                    </div>
                    <div className="font-mono text-xs text-destructive">
                      -{formatCurrency(Number(r.total_opposing ?? 0))}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="container pb-16 space-y-3">
        <h2 className="font-mono text-xs tracking-widest text-primary uppercase flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-primary" />
          TOP IE COMMITTEES
        </h2>
        <div className="space-y-2">
          {(topCommittees ?? []).length === 0 && (
            <div className="font-mono text-xs text-muted-foreground py-6 text-center">
              NO IE COMMITTEES TO LIST YET
            </div>
          )}
          {(topCommittees ?? []).map((c, i) => (
            <Card key={c.filer_id} className="p-4 rounded-sm border-border">
              <div className="flex items-center gap-4">
                <div className="font-mono text-xs text-muted-foreground tracking-widest w-8">
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{c.name}</div>
                  <div className="text-[11px] text-muted-foreground font-mono">
                    {c.transaction_count} transactions · filer {c.filer_id}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono font-bold text-sm text-primary">
                    {formatCurrencyFull(c.total_amount)}
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground tracking-widest">
                    +{formatCurrency(c.supporting)} / -{formatCurrency(c.opposing)}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
