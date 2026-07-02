import { useParams, Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Users,
  Building2,
  Megaphone,
  Landmark,
} from "lucide-react";
import {
  useCandidate,
  useContributionsSummary,
  useTopDonors,
  useTopIndustries,
  useExpenditureTotals,
  useIEForCandidate,
  useIEByCandidate,
  useCandidateLoans,
} from "@/hooks/useCandidates";
import { useTxGovPolling, readCandidatePct } from "@/hooks/usePolling";
import CandidatePollingChart from "@/components/CandidatePollingChart";
import {
  formatCurrency,
  formatCurrencyFull,
  partyColor,
  partyLabel,
  contributorTypeLabel,
} from "@/lib/finance";

export default function CandidateDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: candidate, isLoading: candLoading, error: candError } = useCandidate(slug);
  const { data: summaries } = useContributionsSummary(candidate?.id);
  const { data: topIndividualDonors } = useTopDonors(candidate?.id, 10, "individual");
  const { data: topPacDonors } = useTopDonors(candidate?.id, 500, "pac");
  const [pacPage, setPacPage] = useState(0);
  const PAC_PAGE_SIZE = 10;
  const { data: topIndustries } = useTopIndustries(candidate?.id, 10);
  const { data: loans } = useCandidateLoans(candidate?.id, candidate?.name, 10);
  const { data: expn } = useExpenditureTotals(candidate?.id);
  const { data: ieRows } = useIEForCandidate(candidate?.id, 10);
  const { data: ieByCand } = useIEByCandidate();
  const { data: polling } = useTxGovPolling();

  if (candLoading) {
    return (
      <div className="container py-20 font-mono text-xs text-muted-foreground text-center">
        LOADING CANDIDATE...
      </div>
    );
  }
  if (candError || !candidate) return <Navigate to="/candidates" replace />;

  // Aggregate across cycles
  const totals = (summaries ?? []).reduce(
    (acc, s) => {
      acc.totalRaised += Number(s.total_raised ?? 0);
      acc.individual += Number(s.individual_contributions ?? 0);
      acc.pac += Number(s.entity_contributions ?? 0);
      acc.smallDollar += Number(s.small_dollar_contributions ?? 0);
      acc.smallDollarCount += Number(s.small_dollar_count ?? 0);
      acc.individualCount += Number(s.individual_donor_count ?? 0);
      acc.asOf = [acc.asOf, s.as_of].sort().reverse()[0] ?? null;
      return acc;
    },
    {
      totalRaised: 0,
      individual: 0,
      pac: 0,
      smallDollar: 0,
      smallDollarCount: 0,
      individualCount: 0,
      asOf: null as string | null,
    },
  );

  const totalSpent = expn?.totalSpent ?? 0;
  const ieForThis = (ieByCand ?? []).find((r) => r.candidate_id === candidate.id);
  const ieSupporting = Number(ieForThis?.total_supporting ?? 0);
  const ieOpposing = Number(ieForThis?.total_opposing ?? 0);

  const hasFinanceData = totals.totalRaised > 0 || totalSpent > 0;

  // Names that appear in loans — filtered out of the individual donors list
  // so that loans (Schedule B) and outright gifts (Schedule A) don't
  // double-count for self-funders / lenders.
  const loanNameKeys = new Set(
    (loans ?? []).map(
      (l) =>
        `${(l.contributor_last_name ?? "").trim().toUpperCase()}|${(l.contributor_first_name ?? "").trim().toUpperCase()}`,
    ),
  );
  const individualDonorsFiltered = (topIndividualDonors ?? []).filter((d) => {
    const key = `${(d.contributor_last_name ?? "").trim().toUpperCase()}|${(d.contributor_first_name ?? "").trim().toUpperCase()}`;
    return !loanNameKeys.has(key);
  });
  const totalLoans = (loans ?? []).reduce((s, l) => s + l.total_amount, 0);

  // Self-funded portion (excludes Schedule B "loan" rows so we don't subtract
  // loan principal from the individual-donor bar — loans aren't in the
  // individual_contributions sum to begin with).
  const selfFundedFromIndividuals = (loans ?? [])
    .filter((l) => l.source === "self")
    .reduce((s, l) => s + l.total_amount, 0);

  // Strip self-funding out of "individual contributions" so the bar reflects
  // money raised from other people.
  const individualExSelf = Math.max(0, totals.individual - selfFundedFromIndividuals);

  const indPct =
    totals.totalRaised > 0
      ? Math.round((individualExSelf / totals.totalRaised) * 100)
      : 0;
  const pacPct =
    totals.totalRaised > 0 ? Math.round((totals.pac / totals.totalRaised) * 100) : 0;
  const smallDollarPct =
    totals.totalRaised > 0
      ? Math.round((totals.smallDollar / totals.totalRaised) * 100)
      : 0;

  return (
    <div className="min-h-[80vh] terminal-grid">
      <div className="container py-8 space-y-6">
        <Link to="/candidates">
          <Button variant="ghost" size="sm" className="font-mono text-xs gap-1.5 rounded-sm h-8">
            <ArrowLeft className="h-3.5 w-3.5" /> ALL CANDIDATES
          </Button>
        </Link>

        {/* Header card */}
        <Card className="p-6 rounded-sm border-border">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {candidate.photo_url ? (
              <img
                src={candidate.photo_url_large ?? candidate.photo_url}
                alt={candidate.name}
                className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover shrink-0 border-[3px]"
                style={{ borderColor: partyColor(candidate.party) }}
              />
            ) : (
              <div
                className="w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center font-display text-3xl shrink-0 border-[3px]"
                style={{
                  borderColor: partyColor(candidate.party),
                  backgroundColor: "hsl(var(--muted))",
                }}
              >
                {candidate.name
                  .trim()
                  .split(/\s+/)
                  .filter(Boolean)
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="font-mono text-[10px] px-1.5 py-0.5 rounded-sm tracking-widest"
                  style={{ backgroundColor: partyColor(candidate.party), color: "white" }}
                >
                  {candidate.party ?? "—"}
                </span>
                <span className="font-mono text-xs text-muted-foreground tracking-widest">
                  {partyLabel(candidate.party).toUpperCase()}
                </span>
                {(candidate.status === "withdrawn" ||
                  candidate.status === "dropped_out") && (
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase px-1.5 py-0.5 rounded-sm bg-muted text-muted-foreground border border-border">
                    Withdrawn
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{candidate.name}</h1>
              {candidate.title && (
                <p className="font-mono text-sm text-muted-foreground">{candidate.title}</p>
              )}
              {candidate.committee_name && (
                <p className="font-mono text-xs text-muted-foreground">
                  Committee: {candidate.committee_name}
                </p>
              )}
              {candidate.bio && (
                <p className="text-sm text-muted-foreground max-w-2xl pt-2">{candidate.bio}</p>
              )}
            </div>
            <div className="flex gap-4 md:gap-6">
              {(() => {
                const pct = readCandidatePct(polling?.average, candidate.name);
                return <Stat label="POLL AVG" value={pct !== null ? `${pct}%` : "—"} />;
              })()}
              <Stat label="RAISED" value={formatCurrency(totals.totalRaised)} />
            </div>
          </div>
          {totals.asOf && (
            <div className="font-mono text-[10px] text-muted-foreground tracking-widest mt-4">
              DATA AS OF {new Date(totals.asOf).toLocaleDateString()}
            </div>
          )}
        </Card>

        {/* Per-candidate polling trajectory */}
        <Card className="p-6 rounded-sm border-border">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="font-mono text-xs tracking-widest text-primary uppercase flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5" /> POLLING HISTORY
            </h2>
            <span className="font-mono text-[10px] text-muted-foreground tracking-wider">
              SOURCE: 270TOWIN AGGREGATE
            </span>
          </div>
          <CandidatePollingChart
            candidate={{ slug: candidate.slug, name: candidate.name, party: candidate.party }}
          />
        </Card>

        {!hasFinanceData && (
          <Card className="p-8 rounded-sm border-dashed border-border">
            <p className="font-mono text-xs text-muted-foreground text-center">
              No filings yet for this candidate. Data will appear after the next TEC sync.
            </p>
          </Card>
        )}

        {hasFinanceData && (
          <>
            {/* Finance overview */}
            <div className="grid grid-cols-2 gap-3">
              <FinanceStat icon={DollarSign} label="TOTAL RAISED" value={formatCurrency(totals.totalRaised)} />
              <FinanceStat
                icon={Users}
                label="SMALL DONORS"
                value={`${smallDollarPct}%`}
                sub={`${totals.smallDollarCount.toLocaleString()} gifts < $200`}
              />
            </div>

            {/* Funding source breakdown */}
            <Card className="p-6 rounded-sm border-border space-y-4">
              <h2 className="font-mono text-xs tracking-widest text-primary uppercase flex items-center gap-2">
                <DollarSign className="h-3.5 w-3.5" /> FUNDING SOURCES
              </h2>
              <div className="space-y-3">
                <SourceBar
                  label="Individual contributions"
                  value={individualExSelf}
                  pct={indPct}
                  color="hsl(var(--chart-5))"
                />
                <SourceBar
                  label="Entity contributions (PACs, firms)"
                  value={totals.pac}
                  pct={pacPct}
                  color="hsl(var(--chart-3))"
                />
                {totalLoans > 0 && (
                  <SourceBar
                    label="Self-funded & loans"
                    value={totalLoans}
                    pct={
                      totals.totalRaised > 0
                        ? Math.round((totalLoans / totals.totalRaised) * 100)
                        : 0
                    }
                    color="hsl(var(--chart-2))"
                  />
                )}
              </div>
            </Card>
          </>
        )}

        {/* Independent expenditures banner */}
        {(ieSupporting > 0 || ieOpposing > 0) && (
          <Card className="p-6 rounded-sm border-border">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="font-mono text-xs tracking-widest text-primary uppercase flex items-center gap-2">
                  <Megaphone className="h-3.5 w-3.5" /> INDEPENDENT EXPENDITURES
                </h2>
                <p className="font-mono text-[11px] text-muted-foreground mt-1">
                  Outside spending by IE committees targeting this candidate.
                </p>
              </div>
              <div className="flex gap-6">
                <div className="text-right">
                  <div className="font-mono font-bold text-xl text-chart-5">
                    {formatCurrency(ieSupporting)}
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground tracking-widest">
                    SUPPORTING
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-xl text-destructive">
                    {formatCurrency(ieOpposing)}
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground tracking-widest">
                    OPPOSING
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to="/independent-expenditures"
                className="text-xs font-mono text-primary hover:underline"
              >
                VIEW ALL IE ACTIVITY →
              </Link>
            </div>
          </Card>
        )}

        {/* Top donors / PACs / employers */}
        {hasFinanceData && (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            <Card className="p-4 md:p-6 rounded-sm border-border">
              <h2 className="font-mono text-xs tracking-widest text-primary uppercase mb-4 flex items-center gap-2">
                <Users className="h-3.5 w-3.5" /> TOP INDIVIDUAL DONORS
              </h2>
              <div className="space-y-2">
                {individualDonorsFiltered.length === 0 && (
                  <div className="font-mono text-[11px] text-muted-foreground">
                    No individual donor data yet.
                  </div>
                )}
                {individualDonorsFiltered.map((d, i) => (
                  <div
                    key={`ind-${d.contributor_last_name ?? ""}|${d.contributor_first_name ?? ""}|${i}`}
                    className="flex items-center justify-between text-sm border-b border-border/50 pb-2 last:border-0 gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">
                        {[d.contributor_first_name, d.contributor_last_name]
                          .filter(Boolean)
                          .join(" ") || "—"}
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground tracking-widest">
                        {d.employer ?? d.occupation ?? "—"}
                        {d.contribution_count > 1
                          ? ` · ${d.contribution_count} GIFTS`
                          : ""}
                      </div>
                    </div>
                    <div className="font-mono font-bold text-primary shrink-0 text-xs md:text-sm tabular-nums">
                      {formatCurrencyFull(Number(d.total_amount))}
                    </div>
                  </div>
                ))}
                {loans && loans.length > 0 && (
                  <div className="font-mono text-[10px] text-muted-foreground pt-1">
                    Loans listed separately →
                  </div>
                )}
              </div>
            </Card>
            <Card className="p-4 md:p-6 rounded-sm border-border">
              <h2 className="font-mono text-xs tracking-widest text-primary uppercase mb-4 flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5" /> TOP PAC / COMMITTEE DONORS
                <span className="ml-auto font-mono text-[10px] text-muted-foreground tabular-nums normal-case tracking-wider">
                  {(topPacDonors ?? []).length} total
                </span>
              </h2>
              <div className="space-y-2">
                {(topPacDonors ?? []).length === 0 && (
                  <div className="font-mono text-[11px] text-muted-foreground">
                    No PAC contributions yet.
                  </div>
                )}
                {(topPacDonors ?? [])
                  .slice(pacPage * PAC_PAGE_SIZE, (pacPage + 1) * PAC_PAGE_SIZE)
                  .map((d, i) => (
                  <div
                    key={`pac-${d.contributor_last_name ?? ""}|${d.contributor_first_name ?? ""}|${i}`}
                    className="flex items-center justify-between text-sm border-b border-border/50 pb-2 last:border-0 gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">
                        {[d.contributor_first_name, d.contributor_last_name]
                          .filter(Boolean)
                          .join(" ") || "—"}
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground tracking-widest">
                        {contributorTypeLabel(d.contributor_type).toUpperCase()}
                        {d.contribution_count > 1
                          ? ` · ${d.contribution_count} GIFTS`
                          : ""}
                      </div>
                    </div>
                    <div className="font-mono font-bold text-primary shrink-0 text-xs md:text-sm tabular-nums">
                      {formatCurrencyFull(Number(d.total_amount))}
                    </div>
                  </div>
                ))}
              </div>
              {(topPacDonors ?? []).length > PAC_PAGE_SIZE && (
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-mono text-[11px] tracking-widest h-7 rounded-sm"
                    disabled={pacPage === 0}
                    onClick={() => setPacPage((p) => Math.max(0, p - 1))}
                  >
                    ← PREV
                  </Button>
                  <div className="font-mono text-[10px] text-muted-foreground tracking-widest tabular-nums">
                    PAGE {pacPage + 1} / {Math.max(1, Math.ceil((topPacDonors ?? []).length / PAC_PAGE_SIZE))}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-mono text-[11px] tracking-widest h-7 rounded-sm"
                    disabled={(pacPage + 1) * PAC_PAGE_SIZE >= (topPacDonors ?? []).length}
                    onClick={() => setPacPage((p) => p + 1)}
                  >
                    NEXT →
                  </Button>
                </div>
              )}
            </Card>
            <Card className="p-4 md:p-6 rounded-sm border-border">
              <h2 className="font-mono text-xs tracking-widest text-primary uppercase mb-4 flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5" /> TOP EMPLOYERS
              </h2>
              <div className="space-y-2">
                {(topIndustries ?? []).length === 0 && (
                  <div className="font-mono text-[11px] text-muted-foreground">
                    No employer data yet.
                  </div>
                )}
                {(topIndustries ?? []).map((d, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm border-b border-border/50 pb-2 last:border-0 gap-2"
                  >
                    <div className="font-medium truncate">{d.name}</div>
                    <div className="font-mono font-bold text-primary shrink-0 text-xs md:text-sm tabular-nums">
                      {formatCurrency(d.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            {loans && loans.length > 0 && (
              <Card className="p-4 md:p-6 rounded-sm border-border">
                <h2 className="font-mono text-xs tracking-widest text-primary uppercase mb-4 flex items-center gap-2">
                  <Landmark className="h-3.5 w-3.5" /> SELF-FUNDING & LOANS
                  <span className="ml-auto font-mono text-[10px] text-muted-foreground tabular-nums">
                    {formatCurrencyFull(totalLoans)}
                  </span>
                </h2>
                <div className="space-y-2">
                  {loans.map((l, i) => (
                    <div
                      key={`loan-${l.contributor_last_name ?? ""}|${l.contributor_first_name ?? ""}|${i}`}
                      className="flex items-center justify-between text-sm border-b border-border/50 pb-2 last:border-0 gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">
                          {[l.contributor_first_name, l.contributor_last_name]
                            .filter(Boolean)
                            .join(" ") || "—"}
                        </div>
                        <div className="font-mono text-[10px] text-muted-foreground tracking-widest">
                          {l.source === "loan" ? "LOAN" : "SELF-FUNDED"}
                          {l.contribution_count > 1
                            ? ` · ${l.contribution_count} ${l.source === "loan" ? "LOANS" : "GIFTS"}`
                            : ""}
                        </div>
                      </div>
                      <div className="font-mono font-bold text-primary shrink-0 text-xs md:text-sm tabular-nums">
                        {formatCurrencyFull(Number(l.total_amount))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="font-mono text-[10px] text-muted-foreground tracking-widest mt-3 pt-2 border-t border-border/50">
                  Schedule B loans + candidate self-contributions
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Recent IE transactions */}
        {ieRows && ieRows.length > 0 && (
          <Card className="p-6 rounded-sm border-border">
            <h2 className="font-mono text-xs tracking-widest text-primary uppercase mb-4 flex items-center gap-2">
              <Megaphone className="h-3.5 w-3.5" /> RECENT IE ACTIVITY
            </h2>
            <div className="space-y-2">
              {ieRows.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between text-sm border-b border-border/50 pb-2 last:border-0 gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{r.committee_name ?? "—"}</div>
                    <div className="font-mono text-[10px] text-muted-foreground tracking-widest">
                      {r.expenditure_date ? new Date(r.expenditure_date).toLocaleDateString() : "—"}
                      {r.description ? ` · ${r.description}` : ""}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div
                      className={`font-mono font-bold ${
                        r.support_oppose === "S" ? "text-chart-5" : "text-destructive"
                      }`}
                    >
                      {r.support_oppose === "S" ? "+" : "-"}
                      {formatCurrencyFull(r.amount)}
                    </div>
                    <div className="font-mono text-[10px] text-muted-foreground tracking-widest">
                      {r.support_oppose === "S" ? "SUPPORT" : "OPPOSE"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <p className="text-[10px] font-mono text-muted-foreground text-center pt-2">
          SOURCE: TEXAS ETHICS COMMISSION
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="font-mono font-bold text-2xl text-primary">{value}</div>
      <div className="font-mono text-[10px] text-muted-foreground tracking-widest">{label}</div>
    </div>
  );
}

function FinanceStat({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: any;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <Card className="p-4 rounded-sm border-border">
      <Icon className="h-4 w-4 text-primary mb-2" />
      <div className="font-mono font-bold text-xl">{value}</div>
      <div className="font-mono text-[10px] text-muted-foreground tracking-widest">{label}</div>
      {sub && <div className="font-mono text-[10px] text-muted-foreground mt-0.5">{sub}</div>}
    </Card>
  );
}

function SourceBar({
  label,
  value,
  pct,
  color,
}: {
  label: string;
  value: number;
  pct: number;
  color: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="font-mono">
          <span className="font-bold">{formatCurrency(value)}</span>
          <span className="text-muted-foreground ml-2">{pct}%</span>
        </span>
      </div>
      <div className="h-2 bg-muted rounded-sm overflow-hidden">
        <div className="h-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
