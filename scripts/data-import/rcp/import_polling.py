#!/usr/bin/env python3
"""
RCP Polling Data Importer - Auto-discovery version

Scans RCP's JSON API to discover all 2026 polls, matches them
to our Supabase races, and upserts polling averages.

Usage:
    pip install supabase
    export SUPABASE_URL="https://your-project.supabase.co"
    export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
    python import_polling.py [--scan-start 8700] [--scan-end 8960]
"""

import os
import sys
import json
import re
import logging
import argparse
from datetime import datetime, timezone

import urllib3

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# RCP JSON helpers
# ---------------------------------------------------------------------------

def fetch_rcp_json(poll_id):
    """Fetch polling data from RCP's JSON API."""
    url = f"https://www.realclearpolitics.com/poll/race/{poll_id}/polling_data.json"
    with urllib3.PoolManager() as mgr:
        res = mgr.request("GET", url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
        if res.status != 200:
            return None
        return json.loads(res.data)


def extract_average_from_json(data):
    """Extract the RCP Average from JSON poll data."""
    polls = data.get("poll", [])
    if not polls:
        return None, []
    avg = None
    regular_polls = []
    for p in polls:
        if p.get("type") == "rcp_average":
            avg = p
        else:
            regular_polls.append(p)
    return avg, regular_polls


def extract_candidates_from_poll(poll_entry):
    """Extract candidate names and percentages from a poll entry."""
    candidate_data = poll_entry.get("candidate", [])
    candidates = []
    for c in candidate_data:
        name = c.get("name", "")
        value = c.get("value", "")
        party = c.get("party", "")
        affil = c.get("affil", "")
        try:
            pct = float(value) if value else 0
        except (ValueError, TypeError):
            pct = 0
        if name and pct > 0:
            candidates.append({
                "name": name,
                "pct": pct,
                "party": party or affil or None,
            })
    candidates.sort(key=lambda c: c["pct"], reverse=True)
    return candidates


def format_spread(candidates):
    """Calculate spread string."""
    if len(candidates) < 2:
        return None
    diff = candidates[0]["pct"] - candidates[1]["pct"]
    if abs(diff) < 0.1:
        return "Tie"
    leader = candidates[0]["name"].split()[-1]
    return f"{leader} +{abs(diff):.1f}"


def normalize_party(p):
    if not p:
        return None
    p = p.strip().upper()
    if p in ("D", "DEM", "DEMOCRAT"):
        return "Democrat"
    if p in ("R", "REP", "REPUBLICAN", "GOP"):
        return "Republican"
    return p


def build_raw_data(avg, regular_polls):
    """Build the raw_data JSONB field."""
    rows = []

    def poll_to_row(p):
        row = {
            "Poll": p.get("pollster", ""),
            "Date": p.get("date", ""),
            "Sample": p.get("sampleSize", ""),
            "MoE": p.get("marginError", ""),
        }
        for c in p.get("candidate", []):
            row[c.get("name", "Unknown")] = c.get("value", "")
        row["Spread"] = format_spread(extract_candidates_from_poll(p)) or ""
        return row

    if avg:
        row = poll_to_row(avg)
        row["Poll"] = "RCP Average"
        rows.append(row)

    for p in regular_polls:
        rows.append(poll_to_row(p))

    return rows


# ---------------------------------------------------------------------------
# Poll title parsing – extract state + race type from RCP title
# ---------------------------------------------------------------------------

STATE_NAMES = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
    "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
    "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
    "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
    "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
    "New Hampshire", "New Jersey", "New Mexico", "New York",
    "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
    "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
    "West Virginia", "Wisconsin", "Wyoming",
]


def parse_rcp_title(title, link):
    """Parse an RCP poll title to extract state, race_type, and whether it's a primary.
    
    Returns dict with: state, race_type ('Senate', 'Governor', 'House'), 
                       district (for House), is_primary
    """
    if not title:
        return None

    # Skip non-2026 polls
    if "2026" not in title and "2026" not in (link or ""):
        return None

    is_primary = "primary" in title.lower()

    # Detect race type
    title_lower = title.lower()
    if "senate" in title_lower:
        race_type = "Senate"
    elif "governor" in title_lower:
        race_type = "Governor"
    elif "district" in title_lower:
        race_type = "House"
    else:
        return None

    # Extract state
    state = None
    for s in sorted(STATE_NAMES, key=len, reverse=True):
        if s in title:
            state = s
            break

    if not state:
        return None

    # Extract district number for House races
    district = None
    if race_type == "House":
        m = re.search(r'(\d+)\w*\s*district', title_lower)
        if not m:
            m = re.search(r'district\s*(\d+)', title_lower)
        if m:
            district = m.group(1)

    return {
        "state": state,
        "race_type": race_type,
        "district": district,
        "is_primary": is_primary,
    }


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Import RCP polling data")
    parser.add_argument("--scan-start", type=int, default=8600, help="Start of RCP ID range")
    parser.add_argument("--scan-end", type=int, default=8960, help="End of RCP ID range")
    parser.add_argument("--primaries", action="store_true", help="Include primary polls")
    args = parser.parse_args()

    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not supabase_url or not supabase_key:
        logger.error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set")
        sys.exit(1)

    from supabase import create_client
    sb = create_client(supabase_url, supabase_key)

    # ---- Load races from DB ----
    races_result = sb.table("races").select("race_id, state, district, slug").eq("year", 2026).execute()
    races = races_result.data or []

    # Build lookup: (state, race_type) -> race_id
    # For Senate: key is (state, "Senate")
    # House races would need (state, district_number)
    race_lookup = {}
    for r in races:
        state = r["state"]
        district = r.get("district", "")
        if "Senate" in district:
            race_lookup[(state, "Senate")] = r["race_id"]
        elif district == "Governor":
            race_lookup[(state, "Governor")] = r["race_id"]
        elif district == "AL":
            race_lookup[(state, "House", "AL")] = r["race_id"]
        elif district and district.isdigit():
            race_lookup[(state, "House", district)] = r["race_id"]

    logger.info(
        f"Loaded {len(races)} races from DB "
        f"({sum(1 for k in race_lookup if k[1] == 'Senate')} Senate, "
        f"{sum(1 for k in race_lookup if k[1] == 'Governor')} Governor)"
    )

    # ---- Scan RCP API ----
    logger.info(f"Scanning RCP poll IDs {args.scan_start} to {args.scan_end}...")
    
    # Collect: race_key -> list of (rcp_id, n_polls, data, title, link)
    candidates_by_race = {}
    scan_count = 0

    for rcp_id in range(args.scan_start, args.scan_end + 1):
        data = fetch_rcp_json(rcp_id)
        if data is None:
            continue

        info = data.get("moduleInfo", {})
        title = info.get("title", "")
        link = info.get("link", "")
        n_polls = len(data.get("poll", []))

        parsed = parse_rcp_title(title, link)
        if not parsed:
            continue

        if parsed["is_primary"] and not args.primaries:
            continue

        # Must have actual polls
        if n_polls == 0:
            continue

        scan_count += 1

        # Build race key
        if parsed["race_type"] == "Senate":
            race_key = (parsed["state"], "Senate")
        elif parsed["race_type"] == "House" and parsed["district"]:
            race_key = (parsed["state"], "House", parsed["district"])
        elif parsed["race_type"] == "Governor":
            race_key = (parsed["state"], "Governor")
        else:
            continue

        race_id = race_lookup.get(race_key)
        if not race_id:
            continue

        if race_key not in candidates_by_race:
            candidates_by_race[race_key] = []
        candidates_by_race[race_key].append((rcp_id, n_polls, data, title, link))

    logger.info(f"Scanned {scan_count} polls with data, matched {len(candidates_by_race)} races")

    # ---- Pick best poll per race and upsert ----
    success_count = 0
    error_count = 0
    skip_count = 0

    for race_key, polls in candidates_by_race.items():
        # Pick the poll with the most individual polls (best average)
        polls.sort(key=lambda x: x[1], reverse=True)
        rcp_id, n_polls, data, title, link = polls[0]
        race_id = race_lookup[race_key]

        try:
            race_slug = "senate" if race_key[1] == "Senate" else ("governor" if race_key[1] == "Governor" else "house")
            rcp_link = link or f"https://www.realclearpolitics.com/epolls/2026/{race_slug}/{rcp_id}.html"
            avg, regular_polls = extract_average_from_json(data)

            if not avg:
                logger.warning(f"No RCP average for {title} (rcp:{rcp_id})")
                skip_count += 1
                continue

            cands = extract_candidates_from_poll(avg)
            if len(cands) < 2:
                logger.warning(f"<2 candidates for {title}")
                skip_count += 1
                continue

            spread = format_spread(cands)
            raw = build_raw_data(avg, regular_polls)

            record = {
                "race_id": race_id,
                "rcp_url": rcp_link,
                "candidate_a_name": cands[0]["name"],
                "candidate_a_party": normalize_party(cands[0].get("party")),
                "candidate_a_pct": cands[0]["pct"],
                "candidate_b_name": cands[1]["name"],
                "candidate_b_party": normalize_party(cands[1].get("party")),
                "candidate_b_pct": cands[1]["pct"],
                "spread": spread,
                "last_updated": datetime.now(timezone.utc).isoformat(),
                "raw_data": raw,
            }

            sb.table("race_polling").upsert(record, on_conflict="race_id").execute()
            sb.table("races").update({"rcp_url": rcp_link}).eq("race_id", race_id).execute()

            logger.info(
                f"✓ {title}: {cands[0]['name']} {cands[0]['pct']}% vs "
                f"{cands[1]['name']} {cands[1]['pct']}% ({spread}) [{n_polls} polls]"
            )
            success_count += 1

        except Exception as e:
            logger.error(f"Error upserting {title}: {e}")
            error_count += 1

    logger.info(f"\nDone. {success_count} updated, {error_count} errors, {skip_count} skipped.")


if __name__ == "__main__":
    main()
