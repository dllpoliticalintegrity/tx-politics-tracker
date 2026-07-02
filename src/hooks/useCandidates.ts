import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type CaCandidate = {
  id: string;
  slug: string;
  name: string;
  party: string | null;
  title: string | null;
  bio: string | null;
  photo_url: string | null;
  photo_url_medium: string | null;
  photo_url_large: string | null;
  photo_url_thumb: string | null;
  website: string | null;
  candidate_filer_id: number;
  committee_filer_id: number | null;
  committee_name: string | null;
  status: string | null;
  featured: boolean;
};

export type CaContributionSummary = {
  candidate_id: string;
  slug: string;
  name: string;
  committee_filer_id: number | null;
  cycle: string;
  individual_donor_count: number | null;
  individual_contributions: number | null;
  pac_contributions: number | null;
  party_contributions: number | null;
  small_dollar_contributions: number | null;
  small_dollar_count: number | null;
  total_raised: number | null;
  as_of: string | null;
};

export type CaIeByCandidate = {
  candidate_id: string;
  slug: string;
  name: string;
  cycle: string;
  total_supporting: number | null;
  total_opposing: number | null;
  supporting_count: number | null;
  opposing_count: number | null;
  committee_count: number | null;
  as_of: string | null;
};

export type CaContribution = {
  id: string;
  candidate_id: string | null;
  contributor_type: string | null;
  contributor_last_name: string | null;
  contributor_first_name: string | null;
  employer: string | null;
  occupation: string | null;
  amount: number;
  contribution_date: string | null;
  city: string | null;
  state: string | null;
  cycle: string | null;
};

export type CaAggregatedDonor = {
  candidate_id: string;
  contributor_last_name: string | null;
  contributor_first_name: string | null;
  contributor_type: string | null;
  employer: string | null;
  occupation: string | null;
  city: string | null;
  state: string | null;
  contribution_count: number;
  total_amount: number;
  last_contribution_date: string | null;
};

export type CaLoan = {
  contributor_last_name: string | null;
  contributor_first_name: string | null;
  contributor_type: string | null;
  employer: string | null;
  occupation: string | null;
  total_amount: number;
  contribution_count: number;
  last_date: string | null;
  source: "loan" | "self";
};

export type CaExpenditureTotals = {
  totalSpent: number;
  cashOnHandEstimate: number;
};

export type CaIeRow = {
  id: string;
  ie_committee_filer_id: number | null;
  target_candidate_id: string | null;
  support_oppose: string | null;
  amount: number;
  expenditure_date: string | null;
  description: string | null;
  cycle: string | null;
  committee_name?: string | null;
};

// ---------------------------------------------------------------------------
// Candidates
// ---------------------------------------------------------------------------

export function useCandidates() {
  return useQuery({
    queryKey: ["ca_candidates"],
    queryFn: async (): Promise<CaCandidate[]> => {
      const { data, error } = await (supabase as any)
        .from("ca_candidates")
        .select(
          "id,slug,name,party,title,bio,photo_url,photo_url_medium,photo_url_large,photo_url_thumb,website,candidate_filer_id,committee_filer_id,committee_name,status,featured",
        )
        .order("name");
      if (error) throw error;
      return (data ?? []) as CaCandidate[];
    },
  });
}

export function useCandidate(slug: string | undefined) {
  return useQuery({
    queryKey: ["ca_candidate", slug],
    enabled: !!slug,
    queryFn: async (): Promise<CaCandidate | null> => {
      const { data, error } = await (supabase as any)
        .from("ca_candidates")
        .select(
          "id,slug,name,party,title,bio,photo_url,photo_url_medium,photo_url_large,photo_url_thumb,website,candidate_filer_id,committee_filer_id,committee_name,status,featured",
        )
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as CaCandidate | null;
    },
  });
}

// ---------------------------------------------------------------------------
// Finance rollup per candidate (view)
// ---------------------------------------------------------------------------

export function useContributionsSummary(candidateId: string | undefined) {
  return useQuery({
    queryKey: ["ca_contributions_summary", candidateId],
    enabled: !!candidateId,
    queryFn: async (): Promise<CaContributionSummary[]> => {
      const { data, error } = await (supabase as any)
        .from("ca_contributions_summary")
        .select("*")
        .eq("candidate_id", candidateId);
      if (error) throw error;
      return (data ?? []) as CaContributionSummary[];
    },
  });
}

export function useAllSummaries() {
  return useQuery({
    queryKey: ["ca_contributions_summary", "all"],
    queryFn: async (): Promise<CaContributionSummary[]> => {
      const { data, error } = await (supabase as any)
        .from("ca_contributions_summary")
        .select("*");
      if (error) throw error;
      return (data ?? []) as CaContributionSummary[];
    },
  });
}

// ---------------------------------------------------------------------------
// Top donors for a candidate
// ---------------------------------------------------------------------------

export type DonorKind = "all" | "individual" | "pac";

// Entities treated as "PAC / institutional": CAL-ACCESS committee types plus
// corporations/LLCs/tribes/unions (OTH) and party committees (PTY).
const PAC_TYPES = ["COM", "SCC", "OTH", "PTY"];

export function useTopDonors(
  candidateId: string | undefined,
  limit = 10,
  kind: DonorKind = "all",
) {
  return useQuery({
    queryKey: ["ca_top_donors", candidateId, limit, kind],
    enabled: !!candidateId,
    queryFn: async (): Promise<CaAggregatedDonor[]> => {
      // Reads from the ca_top_donors view which groups contributions by
      // (candidate_id, normalized name) so self-funders like Tom Steyer show
      // up as one row with their cumulative total, not N separate rows.
      let q = (supabase as any)
        .from("ca_top_donors")
        .select(
          "candidate_id,contributor_last_name,contributor_first_name,contributor_type,employer,occupation,city,state,contribution_count,total_amount,last_contribution_date",
        )
        .eq("candidate_id", candidateId)
        .order("total_amount", { ascending: false })
        .limit(limit);
      if (kind === "individual") q = q.eq("contributor_type", "IND");
      else if (kind === "pac") q = q.in("contributor_type", PAC_TYPES);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as CaAggregatedDonor[];
    },
  });
}

// ---------------------------------------------------------------------------
// Top donors aggregated across ALL candidates (cross-candidate view)
// ---------------------------------------------------------------------------

export type CaCrossCandidateDonorSplit = {
  candidate_id: string;
  contribution_count: number;
  total_amount: number;
  last_contribution_date: string | null;
};

export type CaCrossCandidateDonor = {
  key: string;
  display_name: string;
  contributor_type: string | null;
  employer: string | null;
  occupation: string | null;
  city: string | null;
  state: string | null;
  contribution_count: number;
  total_amount: number;
  last_contribution_date: string | null;
  splits: CaCrossCandidateDonorSplit[];
};

function normalizeNamePart(s: string | null | undefined): string {
  return (s ?? "")
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function useTopAggregatedDonors(limit = 50, kind: DonorKind = "all") {
  return useQuery({
    queryKey: ["ca_top_aggregated_donors", limit, kind],
    queryFn: async (): Promise<CaCrossCandidateDonor[]> => {
      // Pull the top per-candidate rows from the existing ca_top_donors view
      // and re-aggregate client-side across candidates so the same donor
      // giving to multiple campaigns collapses into one row with a per-
      // candidate breakdown.
      let q = (supabase as any)
        .from("ca_top_donors")
        .select(
          "candidate_id,contributor_last_name,contributor_first_name,contributor_type,employer,occupation,city,state,contribution_count,total_amount,last_contribution_date",
        )
        .order("total_amount", { ascending: false })
        .limit(10000);
      if (kind === "individual") q = q.eq("contributor_type", "IND");
      else if (kind === "pac") q = q.in("contributor_type", PAC_TYPES);
      const { data, error } = await q;
      if (error) throw error;

      const rows = (data ?? []) as CaAggregatedDonor[];
      const map = new Map<string, CaCrossCandidateDonor>();
      for (const r of rows) {
        const normLast = normalizeNamePart(r.contributor_last_name);
        const normFirst = normalizeNamePart(r.contributor_first_name);
        // Mirrors the SQL view's grouping: PAC/committee rows have no first
        // name, so they collapse on last-name alone; individuals collapse on
        // the full first+last pair.
        const key = `${r.contributor_type ?? ""}|${normLast}|${normFirst}`;
        if (!normLast && !normFirst) continue;
        const displayName = [r.contributor_first_name, r.contributor_last_name]
          .filter((s) => !!(s ?? "").trim())
          .join(" ")
          .trim() || normLast || normFirst;
        const split: CaCrossCandidateDonorSplit = {
          candidate_id: r.candidate_id,
          contribution_count: Number(r.contribution_count ?? 0),
          total_amount: Number(r.total_amount ?? 0),
          last_contribution_date: r.last_contribution_date,
        };
        const existing = map.get(key);
        if (existing) {
          existing.contribution_count += split.contribution_count;
          existing.total_amount += split.total_amount;
          if (
            split.last_contribution_date &&
            (!existing.last_contribution_date ||
              split.last_contribution_date > existing.last_contribution_date)
          ) {
            existing.last_contribution_date = split.last_contribution_date;
          }
          existing.splits.push(split);
          // Prefer the most recent non-null employer/occupation/city/state.
          if (!existing.employer && r.employer) existing.employer = r.employer;
          if (!existing.occupation && r.occupation) existing.occupation = r.occupation;
          if (!existing.city && r.city) existing.city = r.city;
          if (!existing.state && r.state) existing.state = r.state;
        } else {
          map.set(key, {
            key,
            display_name: displayName,
            contributor_type: r.contributor_type,
            employer: r.employer,
            occupation: r.occupation,
            city: r.city,
            state: r.state,
            contribution_count: split.contribution_count,
            total_amount: split.total_amount,
            last_contribution_date: split.last_contribution_date,
            splits: [split],
          });
        }
      }
      return [...map.values()]
        .map((d) => ({
          ...d,
          splits: d.splits.sort((a, b) => b.total_amount - a.total_amount),
        }))
        .sort((a, b) => b.total_amount - a.total_amount)
        .slice(0, limit);
    },
  });
}

// ---------------------------------------------------------------------------
// Top donors to IE committees (who funds the PACs), aggregated across
// committees by normalized donor name. Cycle-scoped at the ingest layer.
// ---------------------------------------------------------------------------

export type CaIeCommittee = {
  filer_id: number;
  name: string;
  filer_type: string | null;
  status: string | null;
  sponsor: string | null;
  city: string | null;
  state: string | null;
};

export type CaIeAggregatedDonorRow = {
  ie_committee_filer_id: number;
  contributor_last_name: string | null;
  contributor_first_name: string | null;
  contributor_type: string | null;
  employer: string | null;
  occupation: string | null;
  city: string | null;
  state: string | null;
  contribution_count: number;
  total_amount: number;
  last_contribution_date: string | null;
};

export type CaIeDonorSplit = {
  ie_committee_filer_id: number;
  committee_name: string;
  contribution_count: number;
  total_amount: number;
  last_contribution_date: string | null;
};

export type CaIeCrossCommitteeDonor = {
  key: string;
  display_name: string;
  contributor_type: string | null;
  employer: string | null;
  occupation: string | null;
  city: string | null;
  state: string | null;
  contribution_count: number;
  total_amount: number;
  last_contribution_date: string | null;
  splits: CaIeDonorSplit[];
};

export function useTopIeAggregatedDonors(limit = 50, kind: DonorKind = "all") {
  return useQuery({
    queryKey: ["ca_top_ie_donors_aggregated", limit, kind],
    queryFn: async (): Promise<CaIeCrossCommitteeDonor[]> => {
      const [donorsRes, committeesRes] = await Promise.all([
        (() => {
          let q = (supabase as any)
            .from("ca_top_ie_donors")
            .select(
              "ie_committee_filer_id,contributor_last_name,contributor_first_name,contributor_type,employer,occupation,city,state,contribution_count,total_amount,last_contribution_date",
            )
            .order("total_amount", { ascending: false })
            .limit(10000);
          if (kind === "individual") q = q.eq("contributor_type", "IND");
          else if (kind === "pac") q = q.in("contributor_type", PAC_TYPES);
          return q;
        })(),
        (supabase as any).from("ca_ie_committees").select("filer_id,name"),
      ]);
      if (donorsRes.error) throw donorsRes.error;
      if (committeesRes.error) throw committeesRes.error;

      const committeeName = new Map<number, string>();
      for (const c of (committeesRes.data ?? []) as { filer_id: number; name: string }[]) {
        committeeName.set(Number(c.filer_id), c.name ?? `Filer ${c.filer_id}`);
      }

      const rows = (donorsRes.data ?? []) as CaIeAggregatedDonorRow[];
      const map = new Map<string, CaIeCrossCommitteeDonor>();
      for (const r of rows) {
        const normLast = normalizeNamePart(r.contributor_last_name);
        const normFirst = normalizeNamePart(r.contributor_first_name);
        if (!normLast && !normFirst) continue;
        const key = `${r.contributor_type ?? ""}|${normLast}|${normFirst}`;
        const displayName = [r.contributor_first_name, r.contributor_last_name]
          .filter((s) => !!(s ?? "").trim())
          .join(" ")
          .trim() || normLast || normFirst;
        const split: CaIeDonorSplit = {
          ie_committee_filer_id: Number(r.ie_committee_filer_id),
          committee_name:
            committeeName.get(Number(r.ie_committee_filer_id)) ??
            `Filer ${r.ie_committee_filer_id}`,
          contribution_count: Number(r.contribution_count ?? 0),
          total_amount: Number(r.total_amount ?? 0),
          last_contribution_date: r.last_contribution_date,
        };
        const existing = map.get(key);
        if (existing) {
          existing.contribution_count += split.contribution_count;
          existing.total_amount += split.total_amount;
          if (
            split.last_contribution_date &&
            (!existing.last_contribution_date ||
              split.last_contribution_date > existing.last_contribution_date)
          ) {
            existing.last_contribution_date = split.last_contribution_date;
          }
          existing.splits.push(split);
          if (!existing.employer && r.employer) existing.employer = r.employer;
          if (!existing.occupation && r.occupation) existing.occupation = r.occupation;
          if (!existing.city && r.city) existing.city = r.city;
          if (!existing.state && r.state) existing.state = r.state;
        } else {
          map.set(key, {
            key,
            display_name: displayName,
            contributor_type: r.contributor_type,
            employer: r.employer,
            occupation: r.occupation,
            city: r.city,
            state: r.state,
            contribution_count: split.contribution_count,
            total_amount: split.total_amount,
            last_contribution_date: split.last_contribution_date,
            splits: [split],
          });
        }
      }
      return [...map.values()]
        .map((d) => ({
          ...d,
          splits: d.splits.sort((a, b) => b.total_amount - a.total_amount),
        }))
        .sort((a, b) => b.total_amount - a.total_amount)
        .slice(0, limit);
    },
  });
}

export function useTopIndustries(candidateId: string | undefined, limit = 10) {
  return useQuery({
    queryKey: ["ca_contributions_industries", candidateId, limit],
    enabled: !!candidateId,
    queryFn: async (): Promise<{ name: string; amount: number }[]> => {
      // Group client-side — no RPC yet. Cap at 5000 rows to stay snappy.
      const { data, error } = await (supabase as any)
        .from("ca_contributions")
        .select("employer,amount")
        .eq("candidate_id", candidateId)
        .not("employer", "is", null)
        .order("amount", { ascending: false })
        .limit(5000);
      if (error) throw error;
      const totals = new Map<string, number>();
      for (const row of (data ?? []) as { employer: string | null; amount: number }[]) {
        const key = (row.employer ?? "").trim();
        if (!key) continue;
        totals.set(key, (totals.get(key) ?? 0) + Number(row.amount ?? 0));
      }
      return [...totals.entries()]
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, limit);
    },
  });
}

// ---------------------------------------------------------------------------
// Self-funding & loans for a candidate.
//   - "loan": Schedule B (source_form_type starts with "B") — loans received.
//   - "self": Individual contributions where the contributor's first AND last
//     name fuzzily match the candidate's. Last-name match is exact (case-
//     insensitive); first-name match accepts common nicknames (Tom/Thomas,
//     Bill/William, etc.), single-initial matches, or names within edit
//     distance 1 (handles Tony/Toni, Kathy/Cathy). This avoids bucketing
//     unrelated namesakes (e.g., a donor named "Smith" giving to a Smith
//     candidate) while still catching self-contributions.
// Aggregated client-side by contributor name.
// ---------------------------------------------------------------------------

// Common English nickname ↔ formal-name pairs. Bidirectional.
const NICKNAMES: Record<string, string[]> = {
  thomas: ["tom", "tommy"],
  william: ["will", "bill", "billy", "willy"],
  robert: ["rob", "bob", "bobby", "robbie"],
  richard: ["rick", "ricky", "dick"],
  james: ["jim", "jimmy", "jamie"],
  john: ["johnny", "jack"],
  joseph: ["joe", "joey"],
  michael: ["mike", "mikey"],
  charles: ["chuck", "charlie", "chas"],
  edward: ["ed", "eddie", "ted", "teddy"],
  daniel: ["dan", "danny"],
  david: ["dave", "davy"],
  matthew: ["matt", "matty"],
  anthony: ["tony", "ant"],
  christopher: ["chris", "topher"],
  nicholas: ["nick", "nicky"],
  alexander: ["alex", "al", "lex", "xander"],
  benjamin: ["ben", "benji"],
  samuel: ["sam", "sammy"],
  andrew: ["andy", "drew"],
  jonathan: ["jon", "jonny"],
  zachary: ["zach", "zack"],
  patrick: ["pat", "paddy"],
  steven: ["steve", "stevie"],
  stephen: ["steve", "stevie"],
  timothy: ["tim", "timmy"],
  gregory: ["greg"],
  ronald: ["ron", "ronnie"],
  donald: ["don", "donnie"],
  kenneth: ["ken", "kenny"],
  raymond: ["ray"],
  lawrence: ["larry", "lars"],
  frederick: ["fred", "freddy", "rick"],
  francis: ["frank", "frankie"],
  vincent: ["vince", "vinny"],
  peter: ["pete"],
  henry: ["hank", "harry"],
  eugene: ["gene"],
  martin: ["marty"],
  philip: ["phil"],
  phillip: ["phil"],
  douglas: ["doug"],
  rodney: ["rod"],
  // women
  elizabeth: ["liz", "beth", "betsy", "betty", "eliza", "lizzy"],
  katherine: ["kate", "katie", "kathy", "kat", "kitty"],
  catherine: ["cate", "katie", "kathy", "cathy", "cat"],
  margaret: ["maggie", "meg", "peggy", "marge"],
  patricia: ["pat", "patty", "tricia", "trish"],
  jennifer: ["jen", "jenny"],
  jessica: ["jess", "jessie"],
  rebecca: ["becca", "becky"],
  deborah: ["deb", "debbie"],
  barbara: ["barb", "babs"],
  susan: ["sue", "susie", "suzie"],
  nancy: ["nan"],
  victoria: ["vicky", "tori"],
  alexandra: ["alex", "allie", "sasha"],
  samantha: ["sam", "sammy"],
  michelle: ["mich", "shelly"],
  christina: ["chris", "tina"],
  christine: ["chris", "chrissy"],
  amanda: ["mandy"],
  cynthia: ["cindy"],
};

// Build the symmetric closure once.
const FIRST_NAME_GROUPS: string[][] = (() => {
  const groups: string[][] = [];
  for (const [formal, nicks] of Object.entries(NICKNAMES)) {
    groups.push([formal, ...nicks]);
  }
  return groups;
})();

function nicknameMatch(a: string, b: string): boolean {
  const x = a.toLowerCase();
  const y = b.toLowerCase();
  return FIRST_NAME_GROUPS.some((g) => g.includes(x) && g.includes(y));
}

function levenshtein1(a: string, b: string): boolean {
  // Returns true if Levenshtein distance ≤ 1 (and length ≥ 3 to avoid
  // matching arbitrary 2-letter strings).
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  if (a.length < 3 || b.length < 3) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (a.length === b.length) {
      i++;
      j++;
    } else if (a.length > b.length) {
      i++;
    } else {
      j++;
    }
  }
  return true;
}

function firstNameMatches(candidateFirst: string, contributorFirst: string): boolean {
  const c = candidateFirst.trim().toLowerCase().replace(/\.$/, "");
  const d = contributorFirst.trim().toLowerCase().replace(/\.$/, "");
  if (!c || !d) return false;
  if (c === d) return true;
  // Single-initial match (e.g. "T" vs "Tom").
  if (c.length === 1 && d.startsWith(c)) return true;
  if (d.length === 1 && c.startsWith(d)) return true;
  // One name is a prefix of the other (e.g. "Antonio" vs "Anton").
  if (c.length >= 3 && d.length >= 3 && (c.startsWith(d) || d.startsWith(c))) return true;
  if (nicknameMatch(c, d)) return true;
  if (levenshtein1(c, d)) return true;
  return false;
}

export function useCandidateLoans(
  candidateId: string | undefined,
  candidateName: string | undefined,
  limit = 10,
) {
  return useQuery({
    queryKey: ["ca_candidate_loans", candidateId, candidateName, limit],
    enabled: !!candidateId && !!candidateName,
    queryFn: async (): Promise<CaLoan[]> => {
      // Strip middle initials / suffixes ("Jr.", "Sr.", "II", "III").
      const SUFFIXES = new Set(["jr", "jr.", "sr", "sr.", "ii", "iii", "iv"]);
      const parts = (candidateName ?? "")
        .trim()
        .split(/\s+/)
        .filter((p) => !SUFFIXES.has(p.toLowerCase()))
        .filter((p) => !/^[A-Z]\.?$/.test(p)); // drop bare initials like "T."
      const candidateFirst = parts[0] ?? "";
      const candidateLast = parts[parts.length - 1] ?? "";
      // Server-side: pull loans (Schedule B) plus any IND contribution where
      // the contributor's last name equals the candidate's. We then apply the
      // fuzzy first-name check client-side.
      const { data, error } = await (supabase as any)
        .from("ca_contributions_deduped")
        .select(
          "contributor_last_name,contributor_first_name,contributor_type,employer,occupation,amount,contribution_date,source_form_type",
        )
        .eq("candidate_id", candidateId)
        .or(
          `source_form_type.like.B%,and(contributor_type.eq.IND,contributor_last_name.ilike.${candidateLast})`,
        )
        .limit(5000);
      if (error) throw error;
      const map = new Map<string, CaLoan>();
      for (const r of (data ?? []) as any[]) {
        const isLoan = (r.source_form_type ?? "").startsWith("B");
        if (!isLoan) {
          // Self-funding requires BOTH last-name (already filtered) AND a
          // fuzzy first-name match — otherwise it's a namesake donor and
          // should stay in the regular individual donors list.
          const lastOk =
            (r.contributor_last_name ?? "").trim().toLowerCase() ===
            candidateLast.toLowerCase();
          const firstOk = firstNameMatches(candidateFirst, r.contributor_first_name ?? "");
          if (!lastOk || !firstOk) continue;
        }
        const source: "loan" | "self" = isLoan ? "loan" : "self";
        const key = `${source}|${(r.contributor_last_name ?? "").trim().toUpperCase()}|${(r.contributor_first_name ?? "").trim().toUpperCase()}`;
        const existing = map.get(key);
        const amt = Number(r.amount ?? 0);
        if (existing) {
          existing.total_amount += amt;
          existing.contribution_count += 1;
          if (
            r.contribution_date &&
            (!existing.last_date || r.contribution_date > existing.last_date)
          ) {
            existing.last_date = r.contribution_date;
          }
        } else {
          map.set(key, {
            contributor_last_name: r.contributor_last_name,
            contributor_first_name: r.contributor_first_name,
            contributor_type: r.contributor_type,
            employer: r.employer,
            occupation: r.occupation,
            total_amount: amt,
            contribution_count: 1,
            last_date: r.contribution_date,
            source,
          });
        }
      }
      return [...map.values()]
        .sort((a, b) => b.total_amount - a.total_amount)
        .slice(0, limit);
    },
  });
}

// ---------------------------------------------------------------------------
// Expenditures totals for a candidate (so we can derive cash-on-hand / burn)
// ---------------------------------------------------------------------------

export type CandidateTotals = { raised: number; spent: number; cash: number };

/**
 * One-shot: raised + spent + cash-estimate per candidate, keyed by candidate_id.
 * Pulls ca_contributions_summary and ca_expenditures (candidate_id,amount only).
 */
export function useCandidateTotals() {
  return useQuery({
    queryKey: ["ca_candidate_totals"],
    queryFn: async (): Promise<Map<string, CandidateTotals>> => {
      const [summaries, expn] = await Promise.all([
        (supabase as any).from("ca_contributions_summary").select("candidate_id,total_raised"),
        (supabase as any).from("ca_expenditures").select("candidate_id,amount"),
      ]);
      if (summaries.error) throw summaries.error;
      if (expn.error) throw expn.error;
      const raised = new Map<string, number>();
      for (const r of (summaries.data ?? []) as any[]) {
        if (!r.candidate_id) continue;
        raised.set(
          r.candidate_id,
          (raised.get(r.candidate_id) ?? 0) + Number(r.total_raised ?? 0),
        );
      }
      const spent = new Map<string, number>();
      for (const r of (expn.data ?? []) as any[]) {
        if (!r.candidate_id) continue;
        spent.set(
          r.candidate_id,
          (spent.get(r.candidate_id) ?? 0) + Number(r.amount ?? 0),
        );
      }
      const out = new Map<string, CandidateTotals>();
      const keys = new Set<string>([...raised.keys(), ...spent.keys()]);
      for (const k of keys) {
        const r = raised.get(k) ?? 0;
        const s = spent.get(k) ?? 0;
        out.set(k, { raised: r, spent: s, cash: Math.max(0, r - s) });
      }
      return out;
    },
  });
}

export function useExpenditureTotals(candidateId: string | undefined) {
  return useQuery({
    queryKey: ["ca_expenditures_totals", candidateId],
    enabled: !!candidateId,
    queryFn: async (): Promise<{ totalSpent: number }> => {
      const { data, error } = await (supabase as any)
        .from("ca_expenditures")
        .select("amount")
        .eq("candidate_id", candidateId);
      if (error) throw error;
      const totalSpent = (data ?? []).reduce(
        (s: number, r: { amount: number }) => s + Number(r.amount ?? 0),
        0,
      );
      return { totalSpent };
    },
  });
}

// ---------------------------------------------------------------------------
// Independent expenditures
// ---------------------------------------------------------------------------

export function useIEByCandidate() {
  return useQuery({
    queryKey: ["ca_ie_by_candidate"],
    queryFn: async (): Promise<CaIeByCandidate[]> => {
      const { data, error } = await (supabase as any)
        .from("ca_ie_by_candidate")
        .select("*");
      if (error) throw error;
      return (data ?? []) as CaIeByCandidate[];
    },
  });
}

export function useIEForCandidate(candidateId: string | undefined, limit = 50) {
  return useQuery({
    queryKey: ["ca_ie_for_candidate", candidateId, limit],
    enabled: !!candidateId,
    queryFn: async (): Promise<CaIeRow[]> => {
      const { data, error } = await (supabase as any)
        .from("ca_independent_expenditures")
        .select(
          "id,ie_committee_filer_id,target_candidate_id,support_oppose,amount,expenditure_date,description,cycle,ca_ie_committees(name)",
        )
        .eq("target_candidate_id", candidateId)
        .eq("is_latest", true)
        .order("expenditure_date", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return ((data ?? []) as any[]).map((r) => ({
        id: r.id,
        ie_committee_filer_id: r.ie_committee_filer_id,
        target_candidate_id: r.target_candidate_id,
        support_oppose: r.support_oppose,
        amount: Number(r.amount ?? 0),
        expenditure_date: r.expenditure_date,
        description: r.description,
        cycle: r.cycle,
        committee_name: r.ca_ie_committees?.name ?? null,
      }));
    },
  });
}

export function useTopIECommittees(limit = 15) {
  return useQuery({
    queryKey: ["ca_ie_top_committees", limit],
    queryFn: async (): Promise<
      {
        filer_id: number;
        name: string;
        total_amount: number;
        supporting: number;
        opposing: number;
        transaction_count: number;
      }[]
    > => {
      const { data, error } = await (supabase as any)
        .from("ca_independent_expenditures")
        .select("ie_committee_filer_id,support_oppose,amount,ca_ie_committees(name)")
        .eq("is_latest", true)
        .limit(10000);
      if (error) throw error;
      const totals = new Map<
        number,
        { name: string; total: number; sup: number; opp: number; count: number }
      >();
      for (const r of (data ?? []) as any[]) {
        const id = r.ie_committee_filer_id;
        if (id == null) continue;
        const name = r.ca_ie_committees?.name ?? `Filer ${id}`;
        const amount = Number(r.amount ?? 0);
        const existing = totals.get(id) ?? { name, total: 0, sup: 0, opp: 0, count: 0 };
        existing.total += amount;
        existing.count += 1;
        if ((r.support_oppose ?? "").toUpperCase() === "S") existing.sup += amount;
        if ((r.support_oppose ?? "").toUpperCase() === "O") existing.opp += amount;
        totals.set(id, existing);
      }
      return [...totals.entries()]
        .map(([filer_id, v]) => ({
          filer_id,
          name: v.name,
          total_amount: v.total,
          supporting: v.sup,
          opposing: v.opp,
          transaction_count: v.count,
        }))
        .sort((a, b) => b.total_amount - a.total_amount)
        .slice(0, limit);
    },
  });
}
