import { Card } from "@/components/ui/card";
import { TrendingUp, ExternalLink } from "lucide-react";
import PollingChart from "@/components/PollingChart";
import { useCandidates } from "@/hooks/useCandidates";
import { useTxGovPolling, type PollRow } from "@/hooks/usePolling";
import { partyColor } from "@/lib/finance";

export default function Polling() {
  const { data: polling, isLoading, error } = useTxGovPolling();
  const { data: candidates } = useCandidates();

  // Candidates ordered by RCP average %, only those with an averaged %
  const avg = polling?.average;
  const rankedCandidates = (candidates ?? [])
    .map((c) => {
      const surname = c.name.trim().split(/\s+/).pop() ?? "";
      const avgPct = avg && avg[surname] ? Number(avg[surname]) : null;
      return { cand: c, surname, avgPct };
    })
    .filter((x) => x.avgPct !== null)
    .sort((a, b) => (b.avgPct ?? 0) - (a.avgPct ?? 0));

  return (
    <div className="min-h-[80vh] terminal-grid">
      <section className="container pt-12 pb-6 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-primary/20 bg-primary/5 text-primary font-mono text-xs tracking-wider">
          <TrendingUp className="h-3.5 w-3.5" />
          POLLING
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Polling // 2026 CA Governor
        </h1>
        <p className="text-sm text-muted-foreground font-mono">
          270toWin aggregate and individual polls. Synced nightly from 270toWin.
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
          <Card className="p-6 rounded-sm border-border">
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
          <div className="p-6 border-b border-border flex items-center justify-between flex-wrap gap-2">
            <h2 className="font-mono text-xs tracking-widest text-primary uppercase">
              ALL POLLS ({(polling?.polls ?? []).length})
            </h2>
            {(
              <a
                href="https://www.270towin.com/2026-governor-polls/texas"
                target="_blank"
                rel="noreferrer noopener"
                className="font-mono text-[11px] text-muted-foreground hover:text-primary inline-flex items-center gap-1"
              >
                VIEW ON 270toWin <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          {isLoading && (
            <div className="p-10 font-mono text-xs text-muted-foreground text-center">
              LOADING POLLS...
            </div>
          )}
          {error && (
            <div className="p-10 font-mono text-xs text-destructive text-center">
              ERROR LOADING POLLS
            </div>
          )}
          {polling && (
            <div className="overflow-x-auto">
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
                      N
                    </th>
                    {rankedCandidates.slice(0, 7).map(({ cand }) => (
                      <th
                        key={cand.slug}
                        className="text-right px-3 py-2 font-mono text-[10px] tracking-widest text-muted-foreground whitespace-nowrap"
                      >
                        {cand.name.split(" ").pop()?.toUpperCase()}
                      </th>
                    ))}
                    <th className="text-left px-4 py-2 font-mono text-[10px] tracking-widest text-muted-foreground">
                      SPREAD
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {polling.polls.map((poll, i) => (
                    <PollTableRow
                      key={`${poll.Poll}-${poll.Date}-${i}`}
                      poll={poll}
                      surnames={rankedCandidates.slice(0, 7).map((x) => x.surname)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}

function PollTableRow({ poll, surnames }: { poll: PollRow; surnames: string[] }) {
  return (
    <tr className="border-b border-border/40 hover:bg-muted/10">
      <td className="px-4 py-2 font-medium">{poll.Poll}</td>
      <td className="px-4 py-2 font-mono text-xs text-muted-foreground whitespace-nowrap">
        {poll.Date}
      </td>
      <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{poll.Sample || "—"}</td>
      {surnames.map((s) => (
        <td key={s} className="px-3 py-2 text-right font-mono">
          {poll[s] ? `${poll[s]}%` : "—"}
        </td>
      ))}
      <td className="px-4 py-2 font-mono text-xs text-muted-foreground whitespace-nowrap">
        {poll.Spread || "—"}
      </td>
    </tr>
  );
}
