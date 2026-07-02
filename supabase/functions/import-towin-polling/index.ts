// Edge function: scrape 2026 Texas Governor polls from 270toWin and
// upsert them into race_polls + race_polling (source='270towin').
// Mirrors scripts/data-import/270towin/import-tx-gov-polls.py.
// v3: redeploy trigger 2026-04-26.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { parseHTML } from "https://esm.sh/linkedom@0.16.11";

// Minimal Element shim so existing helpers keep their types.
type Element = any;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SOURCE = "270towin";
const RACE_SLUG = "texas-governor-2026";
const SOURCE_URL = "https://www.270towin.com/2026-governor-polls/texas";
const UA =
  "Mozilla/5.0 (compatible; texaspoliticstracker-importer/1.0; +https://texaspoliticstracker.com)";

const GENERIC_CHOICE = new Set([
  "other","someone else","undecided","neither","none","nobody",
  "dem","democrat","democratic","rep","republican","gop",
  "ind","independent",
]);
const POPULATION_LABEL: Record<string, string> = { lv: "LV", rv: "RV", a: "All", v: "Voters" };

function parseDate(raw: string): string | null {
  const s = raw.trim();
  // 270toWin uses M/D/YYYY or M/D/YY
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (!m) return null;
  const mm = m[1].padStart(2, "0");
  const dd = m[2].padStart(2, "0");
  let yy = m[3];
  if (yy.length === 2) yy = (Number(yy) > 50 ? "19" : "20") + yy;
  const iso = `${yy}-${mm}-${dd}`;
  return Number.isNaN(Date.parse(iso)) ? null : iso;
}

function parseSample(raw: string): { size: number | null; kind: string | null } {
  if (!raw) return { size: null, kind: null };
  const m = raw.replace(/\u00a0/g, " ").trim().match(/^([\d,]+)\s*([A-Za-z]+)?(?:\s*±[\d.]+%?)?$/);
  if (!m) return { size: null, kind: null };
  const size = parseInt(m[1].replace(/,/g, ""), 10);
  const k = (m[2] ?? "").toLowerCase().trim();
  const kind = POPULATION_LABEL[k] ?? (k ? k.toUpperCase() : null);
  return { size: Number.isFinite(size) ? size : null, kind };
}

function parsePct(raw: string): number | null {
  const s = raw.trim().replace(/%$/, "").trim();
  if (!s || s === "-") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function classifyMatchup(heading: string, candidateLabels: string[]): string {
  const h = (heading || "").toLowerCase();
  if (h.includes("democratic primary") || h.includes("dem primary")) return "dem_primary";
  if (h.includes("republican primary") || h.includes("gop primary") || h.includes("rep primary")) return "rep_primary";
  if (h.includes(" vs")) {
    const names = candidateLabels
      .filter(c => c && !GENERIC_CHOICE.has(c.toLowerCase()))
      .map(c => c.split(/\s+/).pop()!.toLowerCase().replace(/,$/, ""))
      .sort();
    if (names.length >= 2) return "h2h:" + names.slice(0, 2).join("-");
  }
  return "general";
}

function txt(el: Element | null | undefined): string {
  return (el?.textContent ?? "").replace(/\s+/g, " ").trim();
}

function findPrevHeading(table: Element): string {
  // Walk previous siblings / parents to find a heading.
  let node: Element | null = table;
  while (node) {
    let prev = node.previousElementSibling as Element | null;
    while (prev) {
      if (/^H[1-5]$/.test(prev.tagName)) return txt(prev);
      const inner = prev.querySelector?.("h1,h2,h3,h4,h5") as Element | null;
      if (inner) return txt(inner);
      prev = prev.previousElementSibling as Element | null;
    }
    node = node.parentElement as Element | null;
  }
  return "";
}

type RawRow = {
  candidate_label: string;
  pct: number;
  pollster: string;
  field_end: string;
  sample_size: number | null;
  sample_kind: string | null;
  source_url: string | null;
  matchup: string;
};

function parsePolls(html: string): RawRow[] {
  const doc = (parseHTML(html) as any).document;
  if (!doc) return [];
  const rows: RawRow[] = [];
  const tables = Array.from(doc.querySelectorAll("table")) as Element[];

  for (const table of tables) {
    const trs = Array.from(table.querySelectorAll("tr")) as Element[];
    if (trs.length === 0) continue;
    const headCells = Array.from(trs[0].querySelectorAll("th,td")).map(c => txt(c as Element));
    if (headCells.length < 5 || headCells[0].toLowerCase() !== "source") continue;

    const candidateLabels = headCells.slice(3).map(c => c.replace(/\*/g, "").trim());
    const heading = findPrevHeading(table);
    const matchup = classifyMatchup(heading, candidateLabels);

    for (let i = 1; i < trs.length; i++) {
      const tr = trs[i];
      const tds = Array.from(tr.querySelectorAll("td")) as Element[];
      if (tds.length < 4) continue;

      const firstText = txt(tds[0]);
      if (firstText.toLowerCase().startsWith("average of")) continue;

      let offset = 0;
      if (firstText === "" && tds.length > headCells.length) offset = 1;

      const sourceCell = tds[0 + offset];
      const dateCell = tds[1 + offset];
      const sampleCell = tds[2 + offset];
      const pctCells = tds.slice(3 + offset);

      const link = sourceCell.querySelector("a") as Element | null;
      const pollster = (link ? txt(link) : txt(sourceCell)).trim();
      const sourceUrl = link?.getAttribute("href") ?? null;
      const fieldEnd = parseDate(txt(dateCell));
      const { size, kind } = parseSample(txt(sampleCell));
      if (!pollster || !fieldEnd) continue;

      for (let j = 0; j < candidateLabels.length; j++) {
        if (j >= pctCells.length) break;
        const cand = candidateLabels[j];
        if (!cand || GENERIC_CHOICE.has(cand.toLowerCase())) continue;
        const pct = parsePct(txt(pctCells[j]));
        if (pct == null) continue;
        rows.push({
          candidate_label: cand,
          pct,
          pollster,
          field_end: fieldEnd,
          sample_size: size,
          sample_kind: kind,
          source_url: sourceUrl,
          matchup,
        });
      }
    }
  }
  return rows;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(url, key);

    const { data: race, error: raceErr } = await supabase
      .from("races")
      .select("race_id")
      .eq("slug", RACE_SLUG)
      .single();
    if (raceErr || !race) throw new Error(`race not found: ${raceErr?.message}`);
    const race_id = race.race_id as string;

    const html = await fetch(SOURCE_URL, {
      headers: { "User-Agent": UA, "Accept": "text/html" },
    }).then((r) => {
      if (!r.ok) throw new Error(`fetch ${SOURCE_URL} -> ${r.status}`);
      return r.text();
    });

    const raw = parsePolls(html);

    // Build candidate roster from tx_candidates: surname -> {name, party}
    const { data: cands, error: candErr } = await supabase
      .from("tx_candidates")
      .select("name,party");
    if (candErr) throw candErr;
    const roster = new Map<string, { name: string; party: string | null }>();
    for (const c of (cands ?? []) as Array<{ name: string; party: string | null }>) {
      const last = (c.name ?? "").trim().split(/\s+/).pop()?.toLowerCase().replace(/,$/, "") ?? "";
      if (!last || roster.has(last)) continue;
      roster.set(last, { name: c.name, party: c.party && c.party !== "UNK" ? c.party : null });
    }

    type Clean = {
      race_id: string; candidate_name: string; candidate_party: string | null;
      pct: number; pollster: string; field_start: null; field_end: string;
      sample_size: number | null; sample_kind: string | null; source: string;
      source_url: string | null; matchup: string;
    };
    const dedup = new Map<string, Clean & { _n: number; _sum: number }>();
    const unresolved = new Set<string>();
    for (const r of raw) {
      const last = r.candidate_label.split(/\s+/).pop()?.toLowerCase().replace(/,$/, "") ?? "";
      const match = roster.get(last);
      if (!match) { unresolved.add(r.candidate_label); continue; }
      const key = `${r.pollster}|${r.field_end}|${match.name}|${r.matchup}`;
      const existing = dedup.get(key);
      if (!existing) {
        dedup.set(key, {
          race_id, candidate_name: match.name, candidate_party: match.party,
          pct: r.pct, pollster: r.pollster, field_start: null, field_end: r.field_end,
          sample_size: r.sample_size, sample_kind: r.sample_kind, source: SOURCE,
          source_url: r.source_url, matchup: r.matchup, _n: 1, _sum: r.pct,
        });
      } else {
        existing._n += 1;
        existing._sum += r.pct;
        existing.pct = Math.round((existing._sum / existing._n) * 100) / 100;
      }
    }
    const clean: Clean[] = Array.from(dedup.values()).map(({ _n, _sum, ...rest }) => rest);

    // Idempotent replace
    await supabase.from("race_polls").delete().eq("race_id", race_id).eq("source", SOURCE);
    if (clean.length) {
      const CHUNK = 500;
      for (let i = 0; i < clean.length; i += CHUNK) {
        const { error } = await supabase.from("race_polls").insert(clean.slice(i, i + CHUNK));
        if (error) throw error;
      }
    }

    // Aggregate (last 60 days), top-2 + raw_data.all_candidates
    const cutoff = new Date(Date.now() - 60 * 86400_000).toISOString().slice(0, 10);
    let recent = clean.filter(r => r.field_end >= cutoff);
    if (recent.length === 0) recent = clean;

    const byCand = new Map<string, Clean[]>();
    for (const r of recent) {
      const arr = byCand.get(r.candidate_name) ?? [];
      arr.push(r); byCand.set(r.candidate_name, arr);
    }
    const summary = Array.from(byCand.entries()).map(([name, rs]) => {
      const avg = rs.reduce((a, x) => a + x.pct, 0) / rs.length;
      const party = rs.find(x => x.candidate_party)?.candidate_party ?? null;
      return { name, party, avg_pct: Math.round(avg * 100) / 100, polls: rs.length };
    }).sort((a, b) => b.avg_pct - a.avg_pct);

    let aggregateSpread: string | null = null;
    let aggUpsert: any = null;
    if (summary.length >= 2) {
      const a = summary[0], b = summary[1];
      const diff = Math.round((a.avg_pct - b.avg_pct) * 10) / 10;
      aggregateSpread = diff >= 0
        ? `${a.name.split(/\s+/).pop()} +${diff}`
        : `${b.name.split(/\s+/).pop()} +${Math.abs(diff)}`;
      const distinct = new Set(recent.map(r => `${r.pollster}|${r.field_end}`));
      const asOf = recent.map(r => r.field_end).sort().pop()!;
      const lastUrl = clean.slice().sort((x, y) => (x.field_end < y.field_end ? 1 : -1))[0]?.source_url ?? SOURCE_URL;
      aggUpsert = {
        race_id,
        source: SOURCE,
        candidate_a_name: a.name, candidate_a_party: a.party, candidate_a_pct: a.avg_pct,
        candidate_b_name: b.name, candidate_b_party: b.party, candidate_b_pct: b.avg_pct,
        spread: aggregateSpread,
        poll_count: distinct.size,
        as_of: asOf,
        source_url: lastUrl,
        rcp_url: lastUrl, // legacy NOT-NULL safety; harmless duplicate
        raw_data: { all_candidates: summary },
        last_updated: new Date().toISOString(),
      };
      const { error } = await supabase
        .from("race_polling")
        .upsert(aggUpsert, { onConflict: "race_id,source" });
      if (error) throw error;
    }

    return new Response(
      JSON.stringify({
        ok: true,
        race_id,
        parsed_rows: raw.length,
        inserted: clean.length,
        unresolved: Array.from(unresolved).sort(),
        spread: aggregateSpread,
        summary,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({ ok: false, error: e instanceof Error ? e.message : String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});