import { useCandidates } from "@/hooks/useCandidates";
import { useCaGovPolling } from "@/hooks/usePolling";
import { partyColor } from "@/lib/finance";

const CANDIDATE_COLORS: Record<string, string> = {
  "steve-hilton": "#D55E00",
  "chad-bianco": "#E69F00",
  "katie-porter": "#56B4E9",
  "tom-steyer": "#CC79A7",
  "eric-swalwell": "#0072B2",
  "antonio-villaraigosa": "#009E73",
  "tony-thurmond": "#B276B2",
  "xavier-becerra": "#F0E442",
  "betty-yee": "#7DCEA0",
  "matt-mahan": "#BEBEBE",
};

export default function PollingAveragesList() {
  const { data: polling, isLoading } = useCaGovPolling();
  const { data: candidates } = useCandidates();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center font-mono text-xs text-muted-foreground">
        LOADING...
      </div>
    );
  }
  if (!polling?.average || !candidates) {
    return (
      <div className="h-full flex items-center justify-center font-mono text-xs text-muted-foreground">
        No data
      </div>
    );
  }

  const avg = polling.average;
  const rows = candidates
    .map((c) => {
      const surname = c.name.trim().split(/\s+/).pop() ?? "";
      const pct = avg[surname] ? Number(avg[surname]) : 0;
      return {
        slug: c.slug,
        lastName: surname,
        party: c.party,
        pct,
        color: CANDIDATE_COLORS[c.slug] ?? partyColor(c.party),
        photo: c.photo_url_thumb ?? c.photo_url ?? null,
        withdrawn: c.status === "withdrawn" || c.status === "dropped_out",
      };
    })
    .filter((r) => r.pct > 0)
    .sort((a, b) => b.pct - a.pct);

  const max = rows[0]?.pct ?? 1;

  return (
    <div className="h-full flex flex-col">
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-3 pb-2 border-b border-border/60 flex items-center justify-between">
        <span>Current Averages</span>
        <span>%</span>
      </div>
      <ol className="flex-1 space-y-1.5 overflow-y-auto">
        {rows.map((r, i) => (
          <li
            key={r.slug}
            className={`relative flex items-center gap-2.5 px-2 py-1.5 rounded-sm hover:bg-muted/40 transition-colors ${
              r.withdrawn ? "opacity-50 grayscale" : ""
            }`}
          >
            <span className="font-mono text-[10px] text-muted-foreground tabular-nums w-4">
              {i + 1}
            </span>
            {r.photo ? (
              <img
                src={r.photo}
                alt=""
                className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                style={{ border: `1.5px solid ${r.color}` }}
              />
            ) : (
              <div
                className="w-7 h-7 rounded-full bg-muted flex-shrink-0"
                style={{ border: `1.5px solid ${r.color}` }}
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-mono text-xs text-foreground truncate">
                {r.lastName}{" "}
                <span className="text-muted-foreground">({r.party ?? "—"})</span>
                {r.withdrawn && (
                  <span className="ml-1 text-[9px] tracking-[0.18em] uppercase text-muted-foreground">
                    · out
                  </span>
                )}
              </div>
              <div className="h-1 mt-1 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(r.pct / max) * 100}%`,
                    backgroundColor: r.color,
                  }}
                />
              </div>
            </div>
            <span
              className="font-display text-sm tabular-nums"
              style={{ color: r.color }}
            >
              {r.pct.toFixed(1)}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}