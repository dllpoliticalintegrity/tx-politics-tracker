import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Latest individual + PAC contributions across the cycle, joined to the
 * recipient candidate's name + party. Powers the top "Latest Contributions"
 * ticker on the beta dashboard.
 */
export type LatestContribution = {
  id: string;
  amount: number;
  contribution_date: string | null;
  contributor_type: string | null; // IND / COM / PAC / etc.
  contributor_first_name: string | null;
  contributor_last_name: string | null;
  employer: string | null;
  city: string | null;
  state: string | null;
  candidate_id: string | null;
  candidate_name: string | null;
  candidate_party: string | null; // 'D' / 'R' / 'I' / etc., normalized
};

const PAC_TYPES = ["COM", "PAC", "PTY", "SCC", "IND_PAC"];

export function useLatestContributions(limit = 20, minAmount = 30_000) {
  return useQuery({
    queryKey: ["ca_latest_contributions", limit, minAmount],
    queryFn: async (): Promise<LatestContribution[]> => {
      const { data, error } = await (supabase as any)
        .from("ca_contributions")
        .select(
          "id,amount,contribution_date,contributor_type,contributor_first_name,contributor_last_name,employer,city,state,candidate_id,ca_candidates(name,party)",
        )
        .not("contribution_date", "is", null)
        .gte("amount", minAmount)
        .order("contribution_date", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return ((data ?? []) as any[]).map((r) => ({
        id: r.id,
        amount: Number(r.amount ?? 0),
        contribution_date: r.contribution_date,
        contributor_type: r.contributor_type,
        contributor_first_name: r.contributor_first_name,
        contributor_last_name: r.contributor_last_name,
        employer: r.employer,
        city: r.city,
        state: r.state,
        candidate_id: r.candidate_id,
        candidate_name: r.ca_candidates?.name ?? null,
        candidate_party: normalizeParty(r.ca_candidates?.party),
      }));
    },
    staleTime: 60_000,
  });
}

function normalizeParty(p: string | null | undefined): string {
  if (!p) return "";
  const s = p.trim().toLowerCase();
  if (s.startsWith("d")) return "D";
  if (s.startsWith("r")) return "R";
  if (s.startsWith("i") || s === "no party preference") return "I";
  return p[0]?.toUpperCase() ?? "";
}

/** Classify into the brand's IND / PAC / LOAN / COM verb pill colors. */
export function contributionVerb(c: LatestContribution): {
  verb: "ind" | "pac" | "loan" | "com";
  label: "IND" | "PAC" | "LOAN" | "COM";
} {
  const t = (c.contributor_type ?? "").toUpperCase();
  if (t === "IND") return { verb: "ind", label: "IND" };
  if (PAC_TYPES.includes(t)) return { verb: "pac", label: "PAC" };
  // SLF / loans typically come from Schedule B; we don't have form-type here,
  // so any non-IND, non-PAC contributor_type falls through to COM.
  return { verb: "com", label: "COM" };
}

/** Pretty $ formatter — $5,000 / $1.2M / $250K. */
export function formatContributionAmount(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(amount >= 10_000_000 ? 0 : 1)}M`;
  if (amount >= 10_000) return `$${Math.round(amount / 1000)}K`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
  return `$${Math.round(amount).toLocaleString()}`;
}

/** Relative time — "2h ago" / "3d ago". */
export function relativeAgo(iso: string | null): string {
  if (!iso) return "";
  const t = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - t);
  const days = Math.floor(diff / 86_400_000);
  if (days >= 1) return `${days}d ago`;
  const hours = Math.floor(diff / 3_600_000);
  if (hours >= 1) return `${hours}h ago`;
  const mins = Math.floor(diff / 60_000);
  return `${mins}m ago`;
}

/** Donor display name — falls back to last_name only for PACs (no first name). */
export function donorDisplayName(c: LatestContribution): string {
  const first = (c.contributor_first_name ?? "").trim();
  const last = (c.contributor_last_name ?? "").trim();
  if (first && last) return `${first[0]}. ${last}`; // initial + last for individuals
  return last || first || "—";
}

/** "EMPLOYER · CITY" for context line, with sensible falls-throughs. */
export function donorContext(c: LatestContribution): string {
  const parts: string[] = [];
  if (c.employer) parts.push(c.employer.toUpperCase());
  if (c.city) parts.push(c.city.toUpperCase());
  return parts.join(" · ");
}

/** Last-name surname extraction for the recipient candidate display. */
export function candidateShort(name: string | null): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  // For "Lt. Gov. Gavin Newsom" -> "NEWSOM"; for "Steve Hilton" -> "HILTON"
  return (parts[parts.length - 1] || name).toUpperCase();
}
