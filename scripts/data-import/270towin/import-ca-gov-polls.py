#!/usr/bin/env python3
"""
Import 2026 California Governor polls from 270toWin.

Source:   https://www.270towin.com/2026-governor-polls/california
Tables:   race_polls           (one row per candidate per poll)
          race_polling         (top-2 aggregate per race, source = '270towin')

Patterned after the vote-integrity senate importer. 270toWin has no public
API, so this scrapes the per-state HTML page. Idempotent: deletes prior
source='270towin' rows for the race before re-inserting.
"""

import datetime as _dt
import os
import re
import sys
from collections import defaultdict
from typing import Optional

import requests
from bs4 import BeautifulSoup
from supabase import create_client

SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
SOURCE = "270towin"
RACE_SLUG = "california-governor-2026"
SOURCE_URL = "https://www.270towin.com/2026-governor-polls/california"
USER_AGENT = (
    "Mozilla/5.0 (compatible; cagovtracker-importer/1.0; "
    "+https://cagovtracker.com)"
)

GENERIC_CHOICE = {
    "other", "someone else", "undecided", "neither", "none", "nobody",
    "dem", "democrat", "democratic", "rep", "republican", "gop",
    "ind", "independent",
}

POPULATION_LABEL = {"lv": "LV", "rv": "RV", "a": "All", "v": "Voters"}


def fetch_html(url: str) -> str:
    r = requests.get(
        url,
        headers={"User-Agent": USER_AGENT, "Accept": "text/html"},
        timeout=30,
    )
    r.raise_for_status()
    return r.text


def parse_date(raw: str) -> Optional[str]:
    raw = raw.strip()
    for fmt in ("%m/%d/%Y", "%m/%d/%y"):
        try:
            return _dt.datetime.strptime(raw, fmt).date().isoformat()
        except ValueError:
            continue
    return None


_SAMPLE_RE = re.compile(r"^\s*([\d,]+)\s*([A-Za-z]+)?(?:\s*±[\d.]+%?)?\s*$")


def parse_sample(raw: str) -> tuple[Optional[int], Optional[str]]:
    if not raw:
        return None, None
    m = _SAMPLE_RE.match(raw.replace("\xa0", " "))
    if not m:
        return None, None
    try:
        size = int(m.group(1).replace(",", ""))
    except ValueError:
        size = None
    kind_raw = (m.group(2) or "").lower().strip()
    kind = POPULATION_LABEL.get(kind_raw) or (kind_raw.upper() if kind_raw else None)
    return size, kind


def parse_pct(raw: str) -> Optional[float]:
    raw = raw.strip().rstrip("%").strip()
    if not raw or raw == "-":
        return None
    try:
        return float(raw)
    except ValueError:
        return None


def normalize_candidate_label(label: str) -> str:
    return label.replace("*", "").strip()


def classify_matchup(heading: str, candidate_labels: list[str]) -> str:
    """California has a jungle/'All Party' primary, so we treat every table
    as a single 'general' matchup unless 270toWin starts publishing party-
    specific primary tables (in which case we tag dem_primary / rep_primary).
    """
    h = (heading or "").strip().lower()
    if "democratic primary" in h or "dem primary" in h:
        return "dem_primary"
    if "republican primary" in h or "gop primary" in h or "rep primary" in h:
        return "rep_primary"
    if " vs" in h or " vs." in h:
        names = sorted(
            c.split()[-1].lower().strip(",")
            for c in candidate_labels
            if c and c.lower() not in GENERIC_CHOICE
        )
        if len(names) >= 2:
            return "h2h:" + "-".join(names[:2])
    return "general"


def parse_polls(html: str) -> list[dict]:
    soup = BeautifulSoup(html, "html.parser")
    rows: list[dict] = []

    for table in soup.find_all("table"):
        all_trs = table.find_all("tr")
        if not all_trs:
            continue
        first_tr = all_trs[0]
        thead_cells = [c.get_text(" ", strip=True) for c in first_tr.find_all(["th", "td"])]
        if len(thead_cells) < 5 or thead_cells[0].lower() != "source":
            continue

        candidate_labels = [normalize_candidate_label(c) for c in thead_cells[3:]]

        heading_el = table.find_previous(["h1", "h2", "h3", "h4", "h5"])
        heading_text = heading_el.get_text(" ", strip=True) if heading_el else ""
        matchup = classify_matchup(heading_text, candidate_labels)

        for tr in all_trs[1:]:
            tds = tr.find_all("td")
            if len(tds) < 4:
                continue

            first_text = tds[0].get_text(" ", strip=True)
            if first_text.lower().startswith("average of"):
                continue

            offset = 0
            if first_text == "" and len(tds) > len(thead_cells):
                offset = 1

            source_cell = tds[0 + offset]
            date_cell = tds[1 + offset]
            sample_cell = tds[2 + offset]
            pct_cells = tds[3 + offset:]

            link = source_cell.find("a")
            pollster = (
                link.get_text(" ", strip=True) if link else source_cell.get_text(" ", strip=True)
            ).strip()
            source_url = link["href"] if (link and link.has_attr("href")) else None
            field_end = parse_date(date_cell.get_text(" ", strip=True))
            sample_size, sample_kind = parse_sample(sample_cell.get_text(" ", strip=True))

            if not pollster or not field_end:
                continue

            for i, cand in enumerate(candidate_labels):
                if i >= len(pct_cells):
                    break
                if not cand or cand.lower() in GENERIC_CHOICE:
                    continue
                pct = parse_pct(pct_cells[i].get_text(" ", strip=True))
                if pct is None:
                    continue
                rows.append({
                    "candidate_label": cand,
                    "pct": pct,
                    "pollster": pollster,
                    "field_end": field_end,
                    "sample_size": sample_size,
                    "sample_kind": sample_kind,
                    "source_url": source_url,
                    "matchup": matchup,
                })
    return rows


def load_candidate_roster(supabase) -> dict[str, tuple[str, Optional[str]]]:
    """Map last-name (lower) -> (full_name, party) for active CA Gov candidates."""
    cands = (
        supabase.table("ca_candidates")
        .select("name,party,status")
        .execute()
    )
    out: dict[str, tuple[str, Optional[str]]] = {}
    for c in cands.data or []:
        name = (c.get("name") or "").strip()
        if not name:
            continue
        last = name.split()[-1].lower().strip(",")
        if last in out:
            continue  # first wins
        party = c.get("party") if c.get("party") and c["party"] != "UNK" else None
        out[last] = (name, party)
    return out


def aggregate(rows: list[dict], race_id: str, source_url: str) -> Optional[dict]:
    if not rows:
        return None

    cutoff = (_dt.date.today() - _dt.timedelta(days=60)).isoformat()
    recent = [r for r in rows if (r.get("field_end") or "") >= cutoff]
    if not recent:
        recent = rows

    by_cand: dict[str, list[dict]] = defaultdict(list)
    for r in recent:
        by_cand[r["candidate_name"]].append(r)

    cand_summary = []
    for name, rs in by_cand.items():
        avg = sum(x["pct"] for x in rs) / len(rs)
        party = next((x["candidate_party"] for x in rs if x["candidate_party"]), None)
        cand_summary.append({
            "name": name, "party": party,
            "avg_pct": round(avg, 2), "polls": len(rs),
        })
    cand_summary.sort(key=lambda x: x["avg_pct"], reverse=True)

    if len(cand_summary) < 2:
        return None

    a, b = cand_summary[0], cand_summary[1]
    spread_val = round(a["avg_pct"] - b["avg_pct"], 1)
    spread_str = (
        f"{a['name'].split()[-1]} +{spread_val}"
        if spread_val >= 0
        else f"{b['name'].split()[-1]} +{abs(spread_val)}"
    )
    distinct_polls = {(r["pollster"], r["field_end"]) for r in recent}

    return {
        "race_id": race_id,
        "source": SOURCE,
        "candidate_a_name": a["name"],
        "candidate_a_party": a["party"],
        "candidate_a_pct": a["avg_pct"],
        "candidate_b_name": b["name"],
        "candidate_b_party": b["party"],
        "candidate_b_pct": b["avg_pct"],
        "spread": spread_str,
        "poll_count": len(distinct_polls),
        "as_of": max(r["field_end"] for r in recent if r.get("field_end")),
        "source_url": source_url,
        "raw_data": {"all_candidates": cand_summary},
    }


def main():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set", file=sys.stderr)
        sys.exit(1)

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    race = (
        supabase.table("races")
        .select("race_id")
        .eq("slug", RACE_SLUG)
        .single()
        .execute()
    )
    race_id = race.data["race_id"]
    print(f"race_id={race_id}")

    print(f"GET {SOURCE_URL}")
    html = fetch_html(SOURCE_URL)
    raw_rows = parse_polls(html)
    print(f"  parsed {len(raw_rows)} candidate-rows from page")

    roster = load_candidate_roster(supabase)

    rows: list[dict] = []
    unresolved: set[str] = set()
    for r in raw_rows:
        last = r["candidate_label"].split()[-1].lower().strip(",")
        match = roster.get(last)
        if not match:
            unresolved.add(r["candidate_label"])
            continue
        full_name, party = match
        rows.append({
            "race_id": race_id,
            "candidate_name": full_name,
            "candidate_party": party,
            "pct": r["pct"],
            "pollster": r["pollster"],
            "field_start": None,
            "field_end": r["field_end"],
            "sample_size": r["sample_size"],
            "sample_kind": r["sample_kind"],
            "source": SOURCE,
            "source_url": r["source_url"],
            "matchup": r["matchup"],
        })

    if unresolved:
        print(f"  unresolved candidate labels (skipped): {sorted(unresolved)}")

    # Dedupe by (pollster, date, candidate, matchup)
    deduped: dict[tuple, dict] = {}
    for r in rows:
        key = (r["pollster"], r["field_end"], r["candidate_name"], r["matchup"])
        existing = deduped.get(key)
        if existing is None:
            deduped[key] = {**r, "_count": 1, "_pct_sum": r["pct"]}
        else:
            existing["_count"] += 1
            existing["_pct_sum"] += r["pct"]
            existing["pct"] = round(existing["_pct_sum"] / existing["_count"], 2)
    clean: list[dict] = []
    for v in deduped.values():
        v.pop("_count", None)
        v.pop("_pct_sum", None)
        clean.append(v)

    print(f"  inserting {len(clean)} race_polls rows")

    # Idempotent replace
    supabase.table("race_polls").delete().eq("race_id", race_id).eq("source", SOURCE).execute()
    if clean:
        CHUNK = 500
        for i in range(0, len(clean), CHUNK):
            supabase.table("race_polls").insert(clean[i:i + CHUNK]).execute()

    agg_url = max(clean, key=lambda r: r.get("field_end") or "").get("source_url") if clean else SOURCE_URL
    agg = aggregate(clean, race_id, agg_url or SOURCE_URL)
    if agg:
        supabase.table("race_polling").upsert(agg, on_conflict="race_id,source").execute()
        print(f"  upserted aggregate: {agg['spread']} (poll_count={agg['poll_count']})")
    else:
        print("  no aggregate (need >= 2 candidates)")

    print("Done.")


if __name__ == "__main__":
    main()