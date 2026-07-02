import { Card } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  useCandidates,
  useCandidateTotals,
} from "@/hooks/useCandidates";
import { useTxGovPolling, useTxGovRacePolls } from "@/hooks/usePolling";
import PollingChart from "@/components/PollingChart";
import PollingAveragesList from "@/components/PollingAveragesList";
import CandidateCard, { type CandidateCardStats } from "@/components/CandidateCard";
import { formatCurrency } from "@/lib/finance";

const GENERAL_DATE = new Date("2026-11-03T00:00:00");
const DAY_MS = 24 * 60 * 60 * 1000;

export default function Index() {
  const { data: candidates, isLoading } = useCandidates();
  const { data: totalsMap } = useCandidateTotals();
  const { data: polling } = useTxGovPolling();
  const { data: racePolls } = useTxGovRacePolls();

  // ---------- Per-candidate polling stats ----------
  const today = new Date();
  const todayIso = today.toISOString().slice(0, 10);
  const ninetyDaysAgo = new Date(today.getTime() - 90 * DAY_MS).toISOString().slice(0, 10);

  const statsBySlug = new Map<string, CandidateCardStats>();
  if (polling && candidates) {
    for (const c of candidates) {
      const surname = c.name.trim().split(/\s+/).pop() ?? "";
      // Collect all per-poll rows for this candidate from the 270toWin backfill.
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
      const avgPct =
        polling.average && polling.average[surname] !== undefined
          ? Number(polling.average[surname])
          : null;
      const validAvg = avgPct !== null && Number.isFinite(avgPct) && avgPct > 0 ? avgPct : null;

      // 90-day delta: current avg minus mean of polls from ≥90 days ago
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
  } else if (candidates) {
    // Polling not loaded yet — render with finance only
    for (const c of candidates) {
      const totals = totalsMap?.get(c.id) ?? { raised: 0, spent: 0, cash: 0 };
      statsBySlug.set(c.slug, {
        pollPct: null,
        pollDelta: null,
        pollSeries: [],
        raised: totals.raised,
      });
    }
  }

  // Rank candidates: by poll % desc, then by total raised.
  // Hide candidates who aren't carried in the RCP polling averages — the hero
  // grid is labelled "ranked by polling," so minor candidates with no poll
  // data would be rank-ordered arbitrarily and confuse the reader.
  const ranked = (candidates ?? [])
    .map((c) => ({ c, stats: statsBySlug.get(c.slug)! }))
    .filter((x) => x.stats?.pollPct !== null && x.stats?.pollPct !== undefined)
    .sort(
      (a, b) =>
        (b.stats?.pollPct ?? -1) - (a.stats?.pollPct ?? -1) ||
        (b.stats?.raised ?? 0) - (a.stats?.raised ?? 0),
    );

  // ---------- Hero stats ----------
  const daysToGeneral = Math.max(
    0,
    Math.ceil((GENERAL_DATE.getTime() - today.getTime()) / DAY_MS),
  );
  const totalCandidates = candidates?.length ?? 0;
  const demCount = (candidates ?? []).filter((c) => c.party === "D").length;
  const repCount = (candidates ?? []).filter((c) => c.party === "R").length;
  const totalRaised = [...(totalsMap?.values() ?? [])].reduce(
    (s, t) => s + t.raised,
    0,
  );

  return (
    <div className="min-h-[80vh] terminal-grid">
      {/* Hero wordmark */}
      <section className="container pt-10 md:pt-12 pb-4 text-center space-y-3">
        <div className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-primary/20 bg-primary/5 text-primary font-mono text-xs tracking-wider">
          <Activity className="h-3.5 w-3.5" />
          LIVE // 2026 TEXAS GUBERNATORIAL RACE
        </div>
        <h1 className="font-orbitron font-bold uppercase md:text-6xl leading-tight tracking-tight text-4xl">
          TRACKING THE <span className="terminal-glow text-[#fdb417]">TEXAS</span> GOVERNOR'S RACE
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto font-mono">
          Polling averages, campaign finance, and independent expenditures — synced nightly from
          270toWin and the Texas Ethics Commission.
        </p>
      </section>

      {/* Hero stat strip — 4 cards with green accent bar */}
      <section className="container pt-4 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <LiveCountdown target={GENERAL_DATE} />
          <HeroStat
            label="Total Raised (Cycle)"
            value={formatCurrency(totalRaised)}
            sub="Across all committees"
          />
        </div>
      </section>

      {/* Polling chart */}
      <section className="container pb-6">
        <Card className="p-4 md:p-6 rounded-sm border-border">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="font-mono text-xs tracking-widest text-primary uppercase flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-primary" />
              POLLING AVERAGE // TIME-SERIES
            </h2>
            <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground tracking-wider">
              {polling?.spread && (
                <span>LEADING: {polling.spread.toUpperCase()}</span>
              )}
              <a
                href="https://www.270towin.com/2026-governor-polls/texas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                SOURCE: 270toWin ↗
              </a>
            </div>
          </div>
          {/* Desktop: chart + sidebar list */}
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <PollingChart />
            </div>
            <div className="md:col-span-1 md:border-l md:border-border/60 md:pl-6">
              <PollingAveragesList />
            </div>
          </div>
          {/* Mobile: tabbed view, list default */}
          <div className="md:hidden">
            <Tabs defaultValue="list" className="w-full">
              <TabsList className="grid grid-cols-2 w-full h-8 rounded-sm font-mono text-[11px] tracking-wider mb-3">
                <TabsTrigger value="list" className="rounded-sm">LIST</TabsTrigger>
                <TabsTrigger value="chart" className="rounded-sm">CHART</TabsTrigger>
              </TabsList>
              <TabsContent value="list" className="mt-0">
                <PollingAveragesList />
              </TabsContent>
              <TabsContent value="chart" className="mt-0">
                <PollingChart />
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </section>

      {/* Field overview */}
      <section className="container pb-16 pt-4">
        <div className="flex items-baseline justify-between pb-2.5 border-b border-border/60 mb-5">
          <h2 className="font-display text-xl md:text-2xl uppercase tracking-wide">
            Field <span className="text-primary">Overview</span>
          </h2>
          <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-muted-foreground">
            Ranked by current poll average
          </div>
        </div>
        {isLoading && (
          <div className="font-mono text-xs text-muted-foreground py-10 text-center">
            LOADING...
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

function HeroStat({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-lg border bg-card px-4 py-4"
      style={{ borderColor: "hsl(var(--border))" }}
    >
      <div className="absolute top-0 left-0 h-full w-[3px] bg-primary" />
      <div className="font-mono font-bold text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-2">
        {label}
      </div>
      <div
        className={`font-display text-3xl md:text-4xl leading-none mb-1.5 ${
          accent ? "text-primary" : ""
        }`}
      >
        {value}
      </div>
      {sub && (
        <div className="font-mono text-[11px] text-muted-foreground tracking-wide">{sub}</div>
      )}
    </div>
  );
}

function LiveCountdown({ target }: { target: Date }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      className="relative overflow-hidden rounded-lg border bg-card px-4 py-4"
      style={{ borderColor: "hsl(var(--border))" }}
    >
      <div className="absolute top-0 left-0 h-full w-[3px] bg-primary" />
      <div className="flex items-center justify-between mb-2">
        <div className="font-mono font-bold text-[10px] tracking-[0.18em] uppercase text-muted-foreground">
          General Election Countdown
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.18em] uppercase text-primary">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
          </span>
          LIVE
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-2">
        {[
          { v: days, l: "Days" },
          { v: hours, l: "Hrs" },
          { v: minutes, l: "Min" },
          { v: seconds, l: "Sec" },
        ].map((u, i) => (
          <div key={u.l} className="text-center">
            <div
              className={`font-display text-3xl leading-none tabular-nums ${
                i === 0 ? "text-primary terminal-glow" : "text-foreground"
              }`}
            >
              {i === 0 ? u.v : pad(u.v)}
            </div>
            <div className="font-mono text-[9px] tracking-[0.18em] uppercase text-muted-foreground mt-1">
              {u.l}
            </div>
          </div>
        ))}
      </div>
      <div className="font-mono text-[10px] text-muted-foreground tracking-wider text-center pt-1 border-t border-border/50">
        TUE · JUN 2, 2026
      </div>
    </div>
  );
}
