import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Wallet, Users, TrendingUp, Building2 } from "lucide-react";
import {
  useCandidates,
  useTopAggregatedDonors,
  useTopIeAggregatedDonors,
  type CaCrossCandidateDonor,
  type CaIeCrossCommitteeDonor,
  type DonorKind,
} from "@/hooks/useCandidates";
import {
  contributorTypeLabel,
  formatCurrency,
  formatCurrencyFull,
  partyColor,
} from "@/lib/finance";

type Source = "candidate" | "ie";

type UnifiedDonor = {
  key: string;
  display_name: string;
  contributor_type: string | null;
  employer: string | null;
  occupation: string | null;
  city: string | null;
  state: string | null;
  contribution_count: number;
  total_amount: number;
  split_count: number;
};

const KIND_OPTIONS: { value: DonorKind; label: string }[] = [
  { value: "all", label: "ALL" },
  { value: "individual", label: "INDIVIDUALS" },
  { value: "pac", label: "PACS & COMMITTEES" },
];

const SOURCE_OPTIONS: { value: Source; label: string }[] = [
  { value: "candidate", label: "CANDIDATE COMMITTEES" },
  { value: "ie", label: "OUTSIDE (IE) COMMITTEES" },
];

export default function TopDonors() {
  const [source, setSource] = useState<Source>("candidate");
  const [kind, setKind] = useState<DonorKind>("all");
  const [selectedCand, setSelectedCand] = useState<CaCrossCandidateDonor | null>(null);
  const [selectedIe, setSelectedIe] = useState<CaIeCrossCommitteeDonor | null>(null);

  const { data: candidates } = useCandidates();
  const candDonors = useTopAggregatedDonors(50, kind);
  const ieDonors = useTopIeAggregatedDonors(50, kind);

  const candidateById = useMemo(
    () => new Map((candidates ?? []).map((c) => [c.id, c])),
    [candidates],
  );

  const active = source === "candidate" ? candDonors : ieDonors;
  const list: UnifiedDonor[] = useMemo(() => {
    if (source === "candidate") {
      return (candDonors.data ?? []).map((d) => ({
        key: d.key,
        display_name: d.display_name,
        contributor_type: d.contributor_type,
        employer: d.employer,
        occupation: d.occupation,
        city: d.city,
        state: d.state,
        contribution_count: d.contribution_count,
        total_amount: d.total_amount,
        split_count: d.splits.length,
      }));
    }
    return (ieDonors.data ?? []).map((d) => ({
      key: d.key,
      display_name: d.display_name,
      contributor_type: d.contributor_type,
      employer: d.employer,
      occupation: d.occupation,
      city: d.city,
      state: d.state,
      contribution_count: d.contribution_count,
      total_amount: d.total_amount,
      split_count: d.splits.length,
    }));
  }, [source, candDonors.data, ieDonors.data]);

  const totalGiven = list.reduce((s, d) => s + d.total_amount, 0);
  const totalContributions = list.reduce((s, d) => s + d.contribution_count, 0);
  const multiSplitDonors = list.filter((d) => d.split_count > 1).length;

  const splitLabel = source === "candidate" ? "CANDIDATES" : "COMMITTEES";

  const handleSelect = (key: string) => {
    if (source === "candidate") {
      const hit = (candDonors.data ?? []).find((d) => d.key === key) ?? null;
      setSelectedCand(hit);
    } else {
      const hit = (ieDonors.data ?? []).find((d) => d.key === key) ?? null;
      setSelectedIe(hit);
    }
  };

  return (
    <div className="min-h-[80vh] terminal-grid">
      <section className="container pt-12 pb-6 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-primary/20 bg-primary/5 text-primary font-mono text-xs tracking-wider">
          <Wallet className="h-3.5 w-3.5" />
          TOP DONORS
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Aggregated Donors // 2026 CA Governor
        </h1>
        <p className="text-sm text-muted-foreground font-mono">
          Donors ranked by total dollars given. Toggle between money into candidate campaigns and
          money into the outside committees spending for or against them. Click a row to see the
          breakdown.
        </p>
      </section>

      <section className="container pb-4 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] text-muted-foreground tracking-widest">
            SOURCE:
          </span>
          {SOURCE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSource(opt.value)}
              className={`font-mono text-[11px] px-2 py-1 rounded-sm border tracking-widest transition-colors ${
                source === opt.value
                  ? "border-primary text-primary bg-primary/10"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] text-muted-foreground tracking-widest">
            TYPE:
          </span>
          {KIND_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setKind(opt.value)}
              className={`font-mono text-[11px] px-2 py-1 rounded-sm border tracking-widest transition-colors ${
                kind === opt.value
                  ? "border-primary text-primary bg-primary/10"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      <section className="container pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card className="p-4 rounded-sm border-border">
            <TrendingUp className="h-4 w-4 text-primary mb-2" />
            <div className="font-mono font-bold text-xl">{formatCurrency(totalGiven)}</div>
            <div className="font-mono text-[10px] text-muted-foreground tracking-widest">
              TOP 50 TOTAL GIVEN
            </div>
          </Card>
          <Card className="p-4 rounded-sm border-border">
            <Users className="h-4 w-4 text-chart-5 mb-2" />
            <div className="font-mono font-bold text-xl">
              {totalContributions.toLocaleString()}
            </div>
            <div className="font-mono text-[10px] text-muted-foreground tracking-widest">
              TOTAL CONTRIBUTIONS
            </div>
          </Card>
          <Card className="p-4 rounded-sm border-border">
            <Building2 className="h-4 w-4 text-primary mb-2" />
            <div className="font-mono font-bold text-xl">{multiSplitDonors}</div>
            <div className="font-mono text-[10px] text-muted-foreground tracking-widest">
              DONORS TO 2+ {splitLabel}
            </div>
          </Card>
        </div>
      </section>

      <section className="container pb-16 space-y-3">
        <h2 className="font-mono text-xs tracking-widest text-primary uppercase flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-primary" />
          TOP 50 {source === "candidate" ? "DONORS TO CAMPAIGNS" : "DONORS TO IE COMMITTEES"}
        </h2>
        {active.isLoading && (
          <div className="font-mono text-xs text-muted-foreground py-6 text-center">
            LOADING DONOR DATA...
          </div>
        )}
        {active.error && (
          <div className="font-mono text-xs text-destructive py-6 text-center">
            ERROR LOADING DONOR DATA
          </div>
        )}
        {!active.isLoading && !active.error && list.length === 0 && (
          <div className="font-mono text-xs text-muted-foreground py-6 text-center">
            {source === "ie"
              ? "NO IE CONTRIBUTIONS INGESTED YET — RUN THE ca-finance IE-CONTRIBUTIONS STAGE"
              : "NO DONORS FOUND FOR THIS FILTER"}
          </div>
        )}
        <div className="space-y-2">
          {list.map((d, i) => (
            <button
              key={d.key}
              type="button"
              onClick={() => handleSelect(d.key)}
              className="block w-full text-left"
            >
              <Card className="p-4 rounded-sm border-border hover:border-primary/40 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="font-mono text-xs text-muted-foreground tracking-widest w-8 shrink-0">
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate group-hover:text-primary transition-colors">
                      {d.display_name}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono truncate">
                      {contributorTypeLabel(d.contributor_type)}
                      {d.employer ? ` · ${d.employer}` : ""}
                      {d.city ? ` · ${d.city}${d.state ? ", " + d.state : ""}` : ""}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono font-bold text-sm text-primary">
                      {formatCurrencyFull(d.total_amount)}
                    </div>
                    <div className="font-mono text-[10px] text-muted-foreground tracking-widest">
                      {d.contribution_count} gift{d.contribution_count === 1 ? "" : "s"} ·{" "}
                      {d.split_count}{" "}
                      {source === "candidate"
                        ? `candidate${d.split_count === 1 ? "" : "s"}`
                        : `committee${d.split_count === 1 ? "" : "s"}`}
                    </div>
                  </div>
                </div>
              </Card>
            </button>
          ))}
        </div>
      </section>

      {/* Candidate-donor breakdown */}
      <Dialog open={!!selectedCand} onOpenChange={(o) => !o && setSelectedCand(null)}>
        <DialogContent className="w-[95vw] max-w-[560px] rounded-sm">
          <DialogHeader>
            <DialogTitle className="font-mono tracking-wider uppercase">
              {selectedCand?.display_name}
            </DialogTitle>
            <DialogDescription className="font-mono text-[11px]">
              {selectedCand && contributorTypeLabel(selectedCand.contributor_type)}
              {selectedCand?.employer ? ` · ${selectedCand.employer}` : ""}
              {selectedCand?.occupation ? ` · ${selectedCand.occupation}` : ""}
              {selectedCand?.city
                ? ` · ${selectedCand.city}${selectedCand.state ? ", " + selectedCand.state : ""}`
                : ""}
            </DialogDescription>
          </DialogHeader>

          {selectedCand && (
            <>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Card className="p-3 rounded-sm border-border">
                  <div className="font-mono font-bold text-lg">
                    {formatCurrencyFull(selectedCand.total_amount)}
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground tracking-widest">
                    TOTAL GIVEN
                  </div>
                </Card>
                <Card className="p-3 rounded-sm border-border">
                  <div className="font-mono font-bold text-lg">
                    {selectedCand.splits.length} candidate
                    {selectedCand.splits.length === 1 ? "" : "s"}
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground tracking-widest">
                    {selectedCand.contribution_count} contribution
                    {selectedCand.contribution_count === 1 ? "" : "s"}
                  </div>
                </Card>
              </div>

              <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
                <h3 className="font-mono text-[10px] tracking-widest text-muted-foreground pt-2">
                  BREAKDOWN BY CANDIDATE
                </h3>
                {selectedCand.splits.map((s) => {
                  const cand = candidateById.get(s.candidate_id);
                  const row = (
                    <Card className="p-3 rounded-sm border-border hover:border-primary/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <span
                          className="font-mono text-[10px] px-1.5 py-0.5 rounded-sm tracking-widest shrink-0"
                          style={{
                            backgroundColor: partyColor(cand?.party),
                            color: "white",
                          }}
                        >
                          {cand?.party ?? "—"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm truncate">
                            {cand?.name ?? "Unknown candidate"}
                          </div>
                          <div className="text-[11px] text-muted-foreground font-mono">
                            {s.contribution_count} gift{s.contribution_count === 1 ? "" : "s"}
                            {s.last_contribution_date
                              ? ` · last ${s.last_contribution_date}`
                              : ""}
                          </div>
                        </div>
                        <div className="font-mono font-bold text-sm text-primary shrink-0">
                          {formatCurrencyFull(s.total_amount)}
                        </div>
                      </div>
                    </Card>
                  );
                  return cand?.slug ? (
                    <Link
                      key={s.candidate_id}
                      to={`/candidates/${cand.slug}`}
                      onClick={() => setSelectedCand(null)}
                    >
                      {row}
                    </Link>
                  ) : (
                    <div key={s.candidate_id}>{row}</div>
                  );
                })}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* IE-donor breakdown */}
      <Dialog open={!!selectedIe} onOpenChange={(o) => !o && setSelectedIe(null)}>
        <DialogContent className="w-[95vw] max-w-[560px] rounded-sm">
          <DialogHeader>
            <DialogTitle className="font-mono tracking-wider uppercase">
              {selectedIe?.display_name}
            </DialogTitle>
            <DialogDescription className="font-mono text-[11px]">
              {selectedIe && contributorTypeLabel(selectedIe.contributor_type)}
              {selectedIe?.employer ? ` · ${selectedIe.employer}` : ""}
              {selectedIe?.occupation ? ` · ${selectedIe.occupation}` : ""}
              {selectedIe?.city
                ? ` · ${selectedIe.city}${selectedIe.state ? ", " + selectedIe.state : ""}`
                : ""}
            </DialogDescription>
          </DialogHeader>

          {selectedIe && (
            <>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Card className="p-3 rounded-sm border-border">
                  <div className="font-mono font-bold text-lg">
                    {formatCurrencyFull(selectedIe.total_amount)}
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground tracking-widest">
                    TOTAL GIVEN
                  </div>
                </Card>
                <Card className="p-3 rounded-sm border-border">
                  <div className="font-mono font-bold text-lg">
                    {selectedIe.splits.length} committee
                    {selectedIe.splits.length === 1 ? "" : "s"}
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground tracking-widest">
                    {selectedIe.contribution_count} contribution
                    {selectedIe.contribution_count === 1 ? "" : "s"}
                  </div>
                </Card>
              </div>

              <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
                <h3 className="font-mono text-[10px] tracking-widest text-muted-foreground pt-2">
                  BREAKDOWN BY IE COMMITTEE
                </h3>
                {selectedIe.splits.map((s) => (
                  <Card
                    key={s.ie_committee_filer_id}
                    className="p-3 rounded-sm border-border"
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm truncate">{s.committee_name}</div>
                        <div className="text-[11px] text-muted-foreground font-mono">
                          filer {s.ie_committee_filer_id} · {s.contribution_count} gift
                          {s.contribution_count === 1 ? "" : "s"}
                          {s.last_contribution_date ? ` · last ${s.last_contribution_date}` : ""}
                        </div>
                      </div>
                      <div className="font-mono font-bold text-sm text-primary shrink-0">
                        {formatCurrencyFull(s.total_amount)}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
