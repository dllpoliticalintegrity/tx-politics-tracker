import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RIVER_PAGE_SIZE, type RiverFilters, type RiverRow } from "@/lib/moneyRiver";

/**
 * One page of the money river (the tx_money_river view: contributions,
 * expenditures, loans and outside spending for Texas candidates, newest
 * transaction first). Filters map straight onto view columns so PostgREST
 * pushes them into the union; `count: "exact"` gives the pager its total.
 */
export function useMoneyRiver(filters: RiverFilters, pageSize = RIVER_PAGE_SIZE) {
  const { race, kind, candidate, page } = filters;
  return useQuery({
    queryKey: ["tx_money_river", race, kind, candidate, page, pageSize],
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    queryFn: async (): Promise<{ rows: RiverRow[]; total: number }> => {
      const from = (page - 1) * pageSize;
      let q = supabase.from("tx_money_river").select("*", { count: "exact" });
      if (race !== "all") q = q.eq("office", race);
      if (kind !== "all") q = q.eq("kind", kind);
      if (candidate) q = q.eq("candidate_id", candidate);
      const { data, error, count } = await q
        .order("txn_date", { ascending: false, nullsFirst: false })
        .order("imported_at", { ascending: false })
        .order("id")
        .range(from, from + pageSize - 1);
      if (error) throw error;
      return {
        rows: (data ?? []).map((r) => ({ ...r, amount: Number(r.amount ?? 0) })) as RiverRow[],
        total: count ?? 0,
      };
    },
  });
}

export type RiverCandidate = { id: string; name: string; slug: string; party: string | null; office: string };

/** Every tracked candidate across the statewide races, for the candidate filter. */
export function useRiverCandidates() {
  return useQuery({
    queryKey: ["tx_candidates", "river-filter"],
    staleTime: 5 * 60_000,
    queryFn: async (): Promise<RiverCandidate[]> => {
      const { data, error } = await supabase
        .from("tx_candidates")
        .select("id,name,slug,party,office")
        .order("office")
        .order("name");
      if (error) throw error;
      return (data ?? []) as RiverCandidate[];
    },
  });
}
