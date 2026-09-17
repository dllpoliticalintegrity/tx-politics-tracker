import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * All polling on this site comes from FiftyPlusOne
 * (supabase/functions/import-fiftyplusone-polling). The importer writes two
 * things per run: a `race_polling` snapshot (source = 'fiftyplusone') whose
 * raw_data.all_candidates carries the current average per candidate, and
 * one `race_polls` row per candidate per poll for the trend chart. Nothing
 * here reads any other source.
 */
export const POLL_SOURCE = "fiftyplusone";

/** A surname → pct map, e.g. { Abbott: "48.2", Hinojosa: "41.5" }. */
export type PollRow = {
  Poll: string;
  Date: string;
  Sample: string;
  MoE: string;
  Spread?: string;
  [candidateLastName: string]: string | undefined;
};

export type PollingBundle = {
  source_url: string | null;
  last_updated: string | null;
  spread: string | null;
  average: PollRow | null;
};

const GOV_RACE_SLUG = "texas-governor-2026";

async function fetchRacePolling(slug: string): Promise<PollingBundle | null> {
  const { data: race, error: raceErr } = await (supabase as any)
    .from("races")
    .select("race_id")
    .eq("slug", slug)
    .maybeSingle();
  if (raceErr) throw raceErr;
  if (!race) return null;

  const { data: row, error } = await (supabase as any)
    .from("race_polling")
    .select("source_url,last_updated,spread,raw_data")
    .eq("race_id", race.race_id)
    .eq("source", POLL_SOURCE)
    .maybeSingle();
  if (error) throw error;
  if (!row) return null;

  // Synthesize a single "average" row keyed by surname → pct so
  // readCandidatePct can look a candidate up by name.
  const raw = row.raw_data;
  let average: PollRow | null = null;
  if (raw && Array.isArray(raw.all_candidates)) {
    const avgRow: PollRow = { Poll: "Polling Average", Date: "", Sample: "", MoE: "" };
    for (const c of raw.all_candidates as Array<{ name: string; avg_pct: number }>) {
      const surname = c.name.trim().split(/\s+/).pop() ?? "";
      avgRow[surname] = String(c.avg_pct);
    }
    average = avgRow;
  }

  return {
    source_url: row.source_url ?? null,
    last_updated: row.last_updated,
    spread: row.spread,
    average,
  };
}

export function useTxGovPolling() {
  return useQuery({
    queryKey: ["race_polling", GOV_RACE_SLUG],
    queryFn: () => fetchRacePolling(GOV_RACE_SLUG),
  });
}

/** Per-poll rows from the FiftyPlusOne importer (one row per candidate per poll). */
export type RacePollRow = {
  candidate_name: string;
  candidate_party: string | null;
  pct: number;
  pollster: string;
  field_end: string;
  sample_size: number | null;
  sample_kind: string | null;
  source_url: string | null;
  matchup: string | null;
};

/** General-election rows only — primary-matchup polls would contaminate the
 * head-to-head trend series and 90-day deltas. */
export function isGeneralMatchup(m: string | null | undefined): boolean {
  const s = (m ?? "general").toLowerCase();
  return s === "general" || s.startsWith("h2h");
}

export function useTxGovRacePolls() {
  return useQuery({
    queryKey: ["race_polls", GOV_RACE_SLUG],
    queryFn: async (): Promise<RacePollRow[]> => {
      const { data: race } = await (supabase as any)
        .from("races")
        .select("race_id")
        .eq("slug", GOV_RACE_SLUG)
        .maybeSingle();
      if (!race) return [];
      const { data, error } = await (supabase as any)
        .from("race_polls")
        .select(
          "candidate_name,candidate_party,pct,pollster,field_end,sample_size,sample_kind,source_url,matchup",
        )
        .eq("race_id", race.race_id)
        .eq("source", POLL_SOURCE)
        .order("field_end", { ascending: false });
      if (error) throw error;
      return (data ?? []) as RacePollRow[];
    },
  });
}

/**
 * Extracts per-candidate pct from the average row by matching on the
 * candidate's surname (the keys the importer writes).
 */
export function readCandidatePct(row: PollRow | null | undefined, fullName: string): number | null {
  if (!row) return null;
  const surname = fullName.trim().split(/\s+/).pop() ?? "";
  const val = row[surname];
  if (val === undefined || val === "") return null;
  const n = Number(val);
  return Number.isFinite(n) ? n : null;
}
