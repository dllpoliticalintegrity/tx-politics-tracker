import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, ExternalLink } from "lucide-react";
import PollingChart from "@/components/PollingChart";
import { useCandidates } from "@/hooks/useCandidates";
import {
  useTxGovPolling,
  useTxGovRacePolls,
  type RacePollRow,
} from "@/hooks/usePolling";
import { partyColor } from "@/lib/finance";

// One row per poll: race_polls stores one row per candidate per poll, so
// group by (pollster, field_end, matchup) and pivot pcts by surname.
type PollGroup = {
  key: string;
  pollster: string;
  field_end: string;
  matchup: string;
  sample: string | null;
  source_url: string | null;
  pcts: Record<string, number>;
};

function groupPolls(rows: RacePollRow[]): PollGroup[] {
  const map = new Map<string, PollGroup>();
  for (const r of rows) {
    const matchup = r.matchup ?? "general";
    const key = `${r.pollster}|${r.field_end}|${matchup}`;
    let g = map.get(key);
    if (!g) {
      g = {
        key,
        pollster: r.pollster,
        field_end: r.field_end,
        matchup,
        sample: null,
        source_url: r.source_url ?? null,
        pcts: {},
      };
      map.set(key, g);
    }
    if (!g.sample && r.sample_size) {
      g.sample = `${r.sample_size}${r.sample_kind ? ` ${r.sample_kind}` : ""}`;
    }
    const surname = r.candidate_name.trim().split(/\s+/).pop() ?? r.candidate_name;
    g.pcts[surname] = Number(r.pct);
  }
  return [...map.values()].sort((a, b) => b.field_end.localeCompare(a.field_end));
}

function matchupLabel(m: string): string {
  if (m === "dem_primary") return "D PRIMARY";
  if (m === "rep_primary") return "R PRIMARY";
  return "GENERAL";
}

function spreadOf(g: PollGroup): string {
  const ranked = Object.entries(g.pcts).sort((a, b) => b[1] - a[1]);
  if (ranked.length < 2) return "—";
  const diff = Math.round((ranked[0][1] - ranked[1][1]) * 10) / 10;
  return diff === 0 ? "TIE" : `${ranked[0][0]} +${diff}`;
}

function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return m && d ? `${Number(m)}/${Number(d)}/${y?.slice(2)}` : iso;
}

export default function Polling() {
  const { data: polling, isLoading, error } = useTxGovPolling();
  const { data: racePolls, isLoading: pollsLoading } = useTxGovRacePolls();
  const { data: candidates } = useCandidates();

  const groups = useMemo(() => groupPolls(racePolls ?? []), [racePolls]);

  // Candidates ordered by polling average %, only those with an averaged %
  const avg = polling?.average;
  const rankedCandidates = (candidates ?? [])
    .map((c) => {
      const surname = c.name.trim().split(/\s+/).pop() ?? "";
      const avgPct = avg && avg[surname] ? Number(avg[surname]) : null;
      return { cand: c, surname, avgPct };
    })
    .filter((x) => x.avgPct !== null)
    .sort((a, b) => (b.avgPct ?? 0) - (a.avgPct ?? 0));

  // Column set: averaged candidates first, then anyone else who shows up in
  // a poll (primary also-rans), capped so the table stays scannable.
  const columnSurnames = useMemo(() => {
    const cols = rankedCandidates.map((x) => x.surname);
    for (const g of groups) {
      for (const s of Object.keys(g.pcts)) {
        if (!cols.includes(s)) cols.push(s);
      }
    }
    return cols.slice(0, 7);
  }, [rankedCandidates, groups]);

  return (
    <div className="min-h-[80vh] terminal-grid">
      <section className="container pt-12 pb-6 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-primary/20 bg-primary/5 text-primary font-mono text-xs tracking-wider">
          <TrendingUp className="h-3.5 w-3.5" />
          POLLING
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Polling // 2026 TX Governor
        </h1>
        <p className="text-sm text-muted-foreground font-mono">
          270toWin aggregate and individual polls. Synced nightly.
        </p>
      </section>

      <section className="container pb-6">
        <Card className="p-4 md:p-6 rounded-sm border-border">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="font-mono text-xs tracking-widest text-primary uppercase flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-primary" />
              POLLING AVERAGE // TIME-SERIES
            </h2>
            <span className="font-mono text-[10px] text-muted-foreground tracking-wider">
              {polling?.spread ? `LEADING: ${polling.spread.toUpperCase()}` : ""}
            </span>
          </div>
          <PollingChart />
        </Card>
      </section>

      {avg && (
        <section className="container pb-6">
          <Card className="p-4 md:p-6 rounded-sm border-border">
            <h2 className="font-mono text-xs tracking-widest text-primary uppercase mb-4">
              270toWin AVERAGE ({avg.Date || "latest"})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {rankedCandidates.map(({ cand, avgPct }) => (
                <div
                  key={cand.slug}
                  className="border border-border rounded-sm p-3 flex items-center gap-3"
                >
                  <span
                    className="font-mono text-[10px] px-1.5 py-0.5 rounded-sm tracking-widest"
                    style={{ backgroundColor: partyColor(cand.party), color: "white" }}
                  >
                    {cand.party ?? "—"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{cand.name}</div>
                    <div className="font-mono font-bold text-primary">{avgPct}%</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      )}

      <section className="container pb-16">
        <Card className="rounded-sm border-border overflow-hidden">
          <div className="p-4 md:p-6 border-b border-border flex items-center justify-between flex-wrap gap-2">
            <h2 className="font-mono text-xs tracking-widest text-primary uppercase">
              ALL POLLS ({groups.length})
            </h2>
            <a
              href="https://www.270towin.com/2026-governor-polls/texas"
              target="_blank"
              rel="noreferrer noopener"
              className="font-mono text-[11px] text-muted-foreground hover:text-primary inline-flex items-center gap-1"
            >
              VIEW ON 270toWin <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          {(isLoading || pollsLoading) && (
            <div className="p-10 font-mono text-xs text-muted-foreground text-center">
              LOADING POLLS...
            </div>
          )}
          {error && (
            <div className="p-10 font-mono text-xs text-destructive text-center">
              ERROR LOADING POLLS
            </div>
          )}

          {/* Mobile: one card per poll — no sideways scrolling needed */}
          {!pollsLoading && groups.length > 0 && (
            <ul className="md:hidden divide-y divide-border/40">
              {groups.map((g) => (
                <li key={g.key} className="px-4 py-3 space-y-1.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-medium truncate">
                      {g.source_url ? (
                        <a
                          href={g.source_url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="hover:text-primary"
                        >
                          {g.pollster}
                        </a>
                      ) : (
                        g.pollster
                      )}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                      {fmtDate(g.field_end)}
                    </span>
                  </div>
                  <div className="flex items-center flex-wrap gap-x-3 gap-y-1 font-mono text-xs">
                    <span className="text-[9px] tracking-widest px-1.5 py-0.5 rounded-sm bg-muted/40 text-muted-foreground">
                      {matchupLabel(g.matchup)}
                    </span>
                    {Object.entries(g.pcts)
                      .sort((a, b) => b[1] - a[1])
                      .map(([s, p]) => (
                        <span key={s}>
                          <span className="text-muted-foreground">{s}</span>{" "}
                          <span className="font-bold">{p}%</span>
                        </span>
                      ))}
                    <span className="text-primary ml-auto">{spreadOf(g)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Desktop: classic pivot table */}
          {!pollsLoading && groups.length > 0 && (
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="text-left px-4 py-2 font-mono text-[10px] tracking-widest text-muted-foreground">
                      POLL
                    </th>
                    <th className="text-left px-4 py-2 font-mono text-[10px] tracking-widest text-muted-foreground">
                      DATE
                    </th>
                    <th className="text-left px-4 py-2 font-mono text-[10px] tracking-widest text-muted-foreground">
                      MATCHUP
                    </th>
                    <th className="text-left px-4 py-2 font-mono text-[10px] tracking-widest text-muted-foreground">
                      N
                    </th>
                    {columnSurnames.map((s) => (
                      <th
                        key={s}
                        className="text-right px-3 py-2 font-mono text-[10px] tracking-widest text-muted-foreground whitespace-nowrap"
                      >
                        {s.toUpperCase()}
                      </th>
                    ))}
                    <th className="text-left px-4 py-2 font-mono text-[10px] tracking-widest text-muted-foreground">
                      SPREAD
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((g) => (
                    <tr key={g.key} className="border-b border-border/40 hover:bg-muted/10">
                      <td className="px-4 py-2 font-medium">
                        {g.source_url ? (
                          <a
                            href={g.source_url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="hover:text-primary"
                          >
                            {g.pollster}
                          </a>
                        ) : (
                          g.pollster
                        )}
                      </td>
                      <td className="px-4 py-2 font-mono text-xs text-muted-foreground whitespace-nowrap">
                        {fmtDate(g.field_end)}
                      </td>
                      <td className="px-4 py-2 font-mono text-[10px] tracking-widest text-muted-foreground whitespace-nowrap">
                        {matchupLabel(g.matchup)}
                      </td>
                      <td className="px-4 py-2 font-mono text-xs text-muted-foreground whitespace-nowrap">
                        {g.sample ?? "—"}
                      </td>
                      {columnSurnames.map((s) => (
                        <td key={s} className="px-3 py-2 text-right font-mono">
                          {g.pcts[s] !== undefined ? `${g.pcts[s]}%` : "—"}
                        </td>
                      ))}
                      <td className="px-4 py-2 font-mono text-xs text-muted-foreground whitespace-nowrap">
                        {spreadOf(g)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!pollsLoading && groups.length === 0 && !error && (
            <div className="p-10 font-mono text-xs text-muted-foreground text-center">
              NO POLLS YET
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
