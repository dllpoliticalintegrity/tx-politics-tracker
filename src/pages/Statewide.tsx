import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Landmark } from "lucide-react";
import { useCandidates, useCandidateTotals, type TxCandidate } from "@/hooks/useCandidates";
import { formatCurrency, officeLabel, partyColor, partyLabel } from "@/lib/finance";

const RACES = ["LTGOVERNOR", "ATTYGEN"] as const;

function statusTag(status: string | null): string | null {
  const s = (status ?? "").toLowerCase();
  if (s === "withdrawn" || s === "dropped_out" || s === "dropped out") return "Withdrew";
  if (s === "eliminated") return "Lost Primary";
  return null;
}

export default function Statewide() {
  return (
    <div className="min-h-[80vh] terminal-grid">
      <section className="container pt-12 pb-6 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-primary/20 bg-primary/5 text-primary font-mono text-xs tracking-wider">
          <Landmark className="h-3.5 w-3.5" />
          DOWN-BALLOT
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Statewide Races // 2026
        </h1>
        <p className="text-sm text-muted-foreground font-mono max-w-3xl">
          Campaign finance for the other statewide executive races, from the same
          nightly Texas Ethics Commission sync. Click through for donors,
          spending, and filings.
        </p>
      </section>

      {RACES.map((office) => (
        <RaceSection key={office} office={office} />
      ))}
      <div className="pb-10" />
    </div>
  );
}

function RaceSection({ office }: { office: string }) {
  const { data: candidates, isLoading } = useCandidates(office);
  const { data: totalsMap } = useCandidateTotals();

  const rows = (candidates ?? [])
    .map((c) => ({ c, raised: totalsMap?.get(c.id)?.raised ?? 0 }))
    .sort((a, b) => {
      const aOut = statusTag(a.c.status) ? 1 : 0;
      const bOut = statusTag(b.c.status) ? 1 : 0;
      return aOut - bOut || b.raised - a.raised;
    });

  return (
    <section className="container pb-8 space-y-3">
      <h2 className="font-mono text-xs tracking-widest text-primary uppercase flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-primary" />
        {officeLabel(office)} — GENERAL: NOV 3, 2026
      </h2>
      {isLoading && (
        <div className="p-8 font-mono text-xs text-muted-foreground">LOADING…</div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {rows.map(({ c, raised }) => (
          <StatewideCard key={c.slug} candidate={c} raised={raised} />
        ))}
      </div>
    </section>
  );
}

function StatewideCard({ candidate: c, raised }: { candidate: TxCandidate; raised: number }) {
  const tag = statusTag(c.status);
  const pColor = partyColor(c.party);
  const initials = c.name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  return (
    <Link to={`/candidates/${c.slug}`} className="block">
      <div
        className={`relative overflow-hidden rounded-lg border transition-all hover:-translate-y-0.5 hover:border-primary/40 p-4 bg-card ${
          tag ? "opacity-60 grayscale" : ""
        }`}
        style={{ borderColor: "hsl(var(--border))" }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: pColor }} />
        <div className="flex items-center gap-3">
          <div
            className="h-12 w-12 rounded-full overflow-hidden border shrink-0 flex items-center justify-center bg-muted font-mono text-sm"
            style={{ borderColor: pColor }}
          >
            {c.photo_url_thumb || c.photo_url ? (
              <img
                src={c.photo_url_thumb ?? c.photo_url ?? undefined}
                alt={c.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-bold truncate flex items-center gap-2">
              {c.name}
              {tag && (
                <span className="font-mono text-[9px] tracking-[0.15em] uppercase px-1.5 py-0.5 rounded-sm bg-muted text-muted-foreground border border-border">
                  {tag}
                </span>
              )}
            </div>
            <div className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase truncate">
              {partyLabel(c.party)}
              {c.title ? ` · ${c.title}` : ""}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase">
              Raised
            </div>
            <div className="font-mono font-bold text-primary tabular-nums">
              {formatCurrency(raised)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
