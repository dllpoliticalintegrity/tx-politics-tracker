import { Users } from "lucide-react";
import { useCandidates, useCandidateTotals } from "@/hooks/useCandidates";
import { isGeneralMatchup, useTxGovPolling, useTxGovRacePolls } from "@/hooks/usePolling";
import CandidateCard, { type CandidateCardStats } from "@/components/CandidateCard";

const DAY_MS = 24 * 60 * 60 * 1000;

export default function Candidates() {
  const { data: candidates, isLoading, error } = useCandidates();
  const { data: totalsMap } = useCandidateTotals();
  const { data: polling } = useTxGovPolling();
  const { data: racePollsAll } = useTxGovRacePolls();
  const racePolls = (racePollsAll ?? []).filter((r) => isGeneralMatchup(r.matchup));

  const today = new Date();
  const todayIso = today.toISOString().slice(0, 10);
  const ninetyDaysAgo = new Date(today.getTime() - 90 * DAY_MS)
    .toISOString()
    .slice(0, 10);

  const statsBySlug = new Map<string, CandidateCardStats>();
  for (const c of candidates ?? []) {
    const surname = c.name.trim().split(/\s+/).pop() ?? "";
    const rawSeries = (racePolls ?? [])
      .filter((r) => (r.candidate_name.trim().split(/\s+/).pop() ?? "") === surname)
      .map((r) => {
        const iso = (r.field_end ?? "").slice(0, 10);
        const n = Number(r.pct);
        if (!iso || iso > todayIso || !Number.isFinite(n)) return null;
        return { iso, pct: n };
      })
      .filter((x): x is { iso: string; pct: number } => x !== null)
      .sort((a, b) => a.iso.localeCompare(b.iso));
    const pollSeries = rawSeries.map((r) => r.pct);
    const avgRaw = polling?.average?.[surname];
    const avgPct =
      avgRaw !== undefined && avgRaw !== "" ? Number(avgRaw) : null;
    const validAvg =
      avgPct !== null && Number.isFinite(avgPct) && avgPct > 0 ? avgPct : null;

    let pollDelta: number | null = null;
    if (validAvg !== null && rawSeries.length >= 2) {
      const earlier = rawSeries.filter((r) => r.iso <= ninetyDaysAgo);
      if (earlier.length > 0) {
        const earlyMean =
          earlier.reduce((s, r) => s + r.pct, 0) / earlier.length;
        pollDelta = Math.round((validAvg - earlyMean) * 10) / 10;
      }
    }

    const totals = totalsMap?.get(c.id) ?? { raised: 0, spent: 0, cash: 0 };
    statsBySlug.set(c.slug, {
      pollPct: validAvg,
      pollDelta,
      pollSeries,
      raised: totals.raised,
    });
  }

  const ranked = (candidates ?? [])
    .map((c) => ({ c, stats: statsBySlug.get(c.slug)! }))
    .filter((x) => x.stats?.pollPct !== null && x.stats?.pollPct !== undefined)
    .sort(
      (a, b) =>
        (b.stats?.pollPct ?? -1) - (a.stats?.pollPct ?? -1) ||
        (b.stats?.raised ?? 0) - (a.stats?.raised ?? 0),
    );

  return (
    <div className="min-h-[80vh] terminal-grid">
      <section className="container pt-12 pb-6 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-primary/20 bg-primary/5 text-primary font-mono text-xs tracking-wider">
          <Users className="h-3.5 w-3.5" />
          ALL CANDIDATES
        </div>
        <h1 className="font-display text-3xl md:text-4xl tracking-tight">
          2026 <span className="text-primary">TX Governor</span> Candidates
        </h1>
        <p className="text-sm text-muted-foreground font-mono">
          Ranked by polling average, then total raised.
        </p>
      </section>

      <section className="container pb-16">
        {isLoading && (
          <div className="font-mono text-xs text-muted-foreground py-10 text-center">
            LOADING CANDIDATES...
          </div>
        )}
        {error && (
          <div className="font-mono text-xs text-destructive py-10 text-center">
            ERROR LOADING CANDIDATES
          </div>
        )}
        {!isLoading && !error && ranked.length === 0 && (
          <div className="font-mono text-xs text-muted-foreground py-10 text-center">
            NO CANDIDATES LOADED YET
          </div>
        )}
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
          {ranked.map(({ c, stats }, idx) => (
            <CandidateCard key={c.slug} candidate={c} stats={stats} rank={idx + 1} />
          ))}
        </div>
      </section>
    </div>
  );
}
