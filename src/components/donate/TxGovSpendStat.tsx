import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const formatCompact = (n: number) => {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
};

const useCountUp = (target: number, duration = 1500) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.floor(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
};

const fetchTxGovTotal = async (): Promise<number> => {
  const { data: cands, error: e1 } = await supabase
    .from("tx_candidates")
    .select("id")
    .eq("office", "GOVERNOR")
    .eq("election_year", 2026);
  if (e1) throw e1;
  const ids = (cands ?? []).map((c: { id: string }) => c.id);
  if (!ids.length) return 0;

  const { data, error } = await supabase
    .from("tx_contributions_summary")
    .select("total_raised, candidate_id")
    .in("candidate_id", ids);
  if (error) throw error;
  return (data ?? []).reduce(
    (sum, row: { total_raised: number | null }) => sum + (row.total_raised ?? 0),
    0,
  );
};

const TxGovSpendStat = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["tx-gov-2026-total"],
    queryFn: fetchTxGovTotal,
    staleTime: 5 * 60 * 1000,
  });

  const total = data ?? 0;
  const animated = useCountUp(total);

  return (
    <div className="rounded-xl bg-neutral-950 border border-neutral-800 shadow-lg p-5 mb-4 text-center">
      <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-emerald-400 font-semibold mb-2">
        Raised in 2026 TX Governor race
      </div>

      {isLoading ? (
        <div className="h-12 sm:h-14 mx-auto w-40 bg-neutral-800 rounded animate-pulse" />
      ) : isError ? (
        <div className="text-gray-400 text-sm py-3">Unable to load totals</div>
      ) : (
        <div
          className="font-mono font-bold tabular-nums text-white text-4xl sm:text-5xl leading-none"
          style={{ textShadow: "0 1px 0 rgba(255,255,255,0.08)" }}
        >
          {formatCompact(animated)}
        </div>
      )}

      <div className="text-[10px] uppercase tracking-widest text-gray-600 mt-3">
        Source: Texas Ethics Commission
      </div>
    </div>
  );
};

export default TxGovSpendStat;