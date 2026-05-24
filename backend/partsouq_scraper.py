"""
PartSouq scraper via ScrapingBee with stealth_proxy.
Each request costs 75 ScrapingBee credits.
Results are cached in MongoDB to minimize cost.
"""

import os
import re
import html as html_lib
import logging
import urllib.parse
from typing import Optional, List, Dict

import httpx

logger = logging.getLogger(__name__)

SCRAPINGBEE_URL = "https://app.scrapingbee.com/api/v1/"


def _api_key() -> str:
    key = os.environ.get("SCRAPINGBEE_API_KEY", "")
    if not key:
        raise RuntimeError("SCRAPINGBEE_API_KEY non configurée")
    return key


async def _fetch(target_url: str, wait_ms: int = 10000) -> Optional[str]:
    """Fetch a URL via ScrapingBee stealth_proxy. Returns HTML or None."""
    params = {
        "api_key": _api_key(),
        "url": target_url,
        "stealth_proxy": "true",
        "country_code": "us",
        "wait": str(wait_ms),
    }
    url = f"{SCRAPINGBEE_URL}?{urllib.parse.urlencode(params)}"
    try:
        async with httpx.AsyncClient(timeout=140.0) as cl:
            r = await cl.get(url)
            if r.status_code == 200 and len(r.text) > 5000:
                return r.text
            logger.warning(f"ScrapingBee returned {r.status_code} (size={len(r.text)})")
            return None
    except Exception as e:
        logger.warning(f"ScrapingBee fetch error: {e}")
        return None


# ---------- HTML helpers ----------

TITLE_RE = re.compile(r"<title>([^<]+)</title>", re.I)
H1_RE = re.compile(r"<h1[^>]*>(.*?)</h1>", re.I | re.S)


def _strip(s: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", s)).strip()


def _abs(url: str) -> str:
    url = html_lib.unescape(url or "")
    if url.startswith("http"):
        return url
    if url.startswith("/"):
        return f"https://partsouq.com{url}"
    return url


# ---------- VIN search title parsing ----------

KNOWN_MAKES = {
    "Volkswagen", "Audi", "Mercedes", "Mercedes-Benz", "BMW", "Peugeot",
    "Renault", "Citroen", "Citroën", "Toyota", "Lexus", "Nissan", "Infiniti",
    "Mitsubishi", "Subaru", "Hyundai", "Kia", "Suzuki", "Mazda", "Honda",
    "Ford", "Opel", "Fiat", "Seat", "Skoda", "Dacia", "Chevrolet", "Volvo",
    "Land Rover", "Porsche", "Chrysler", "Isuzu",
}


def _parse_title(title: str) -> dict:
    """Extract make/model/year from PartSouq title."""
    info = {"make": "", "model": "", "year": "", "raw_title": title}
    parts = [p.strip() for p in title.split("|")]
    vehicle_part = ""
    for p in parts:
        if "Parts Catalogs" in p or "parts catalogs" in p.lower():
            vehicle_part = p.replace("Parts Catalogs", "").replace("parts catalogs", "").strip()
            break
    if not vehicle_part and len(parts) >= 2:
        vehicle_part = parts[1].replace("Parts Catalogs", "").strip()

    year_match = re.search(r"\b(19|20)\d{2}\b", vehicle_part)
    info["year"] = year_match.group(0) if year_match else ""
    cleaned = re.sub(r"\d{2}\.\d{2}\.\d{4}", "", vehicle_part)
    cleaned = re.sub(r"\b(19|20)\d{2}\b", "", cleaned).strip()
    tokens = [t for t in cleaned.split() if t]
    if tokens and tokens[0] in KNOWN_MAKES:
        info["make"] = tokens[0]
        info["model"] = " ".join(tokens[1:]).strip()
    elif tokens:
        info["model"] = " ".join(tokens).strip()
    return info


# ---------- Catalog tree parsing (groups + subgroups) ----------

# Matches a <tr> with the treegrid id (and optional parent reference)
TREE_ROW_RE = re.compile(
    r'<tr[^>]*class="[^"]*treegrid-(\d+)(?:[^"]*treegrid-parent-(\d+))?[^"]*"[^>]*>(.*?)</tr>',
    re.S,
)
TREE_LINK_RE = re.compile(
    r'<a[^>]+href="([^"]+cid=(\d+)[^"]*)"[^>]*>(.*?)</a>',
    re.S,
)


def _parse_tree(html: str) -> List[Dict]:
    """Parse the vehicle treegrid into a flat list with parent/child relationships.

    Returns a list of: {id, parent_id, label, cid, url, group_num, has_link}
    Root nodes (groups) have parent_id = None.
    """
    # Locate the vehicle treegrid table only
    table_m = re.search(r'<table\s+class="vehicle-tg[^"]*"[^>]*>(.*?)</table>', html, re.S)
    if not table_m:
        return []
    table = table_m.group(1)

    rows = []
    for row_m in TREE_ROW_RE.finditer(table):
        row_id = row_m.group(1)
        parent_id = row_m.group(2)
        body = row_m.group(3)

        link_m = TREE_LINK_RE.search(body)
        if link_m:
            href = link_m.group(1)
            cid = link_m.group(2)
            link_inner = link_m.group(3)
            # Extract group number from <b|span class="bpill">XX</b|span>
            num_m = re.search(
                r'<(?:b|span)[^>]*class="[^"]*bpill[^"]*"[^>]*>([^<]+)</(?:b|span)>',
                link_inner,
            )
            group_num = num_m.group(1).strip() if num_m else ""
            # Remove bpill, then strip remaining tags
            cleaned = re.sub(
                r'<(?:b|span)[^>]*class="[^"]*bpill[^"]*"[^>]*>[^<]+</(?:b|span)>',
                "",
                link_inner,
            )
            label = _strip(cleaned)
            url = _abs(href)
            has_link = True
        else:
            # Non-clickable entries (e.g., group header without a link on the VIN search page)
            # Try to find bpill first
            num_m = re.search(
                r'<(?:b|span)[^>]*class="[^"]*bpill[^"]*"[^>]*>([^<]+)</(?:b|span)>',
                body,
            )
            group_num = num_m.group(1).strip() if num_m else ""
            # Strip everything to text, then strip bpill text from front
            full_text = _strip(body)
            if group_num and full_text.startswith(group_num):
                label = full_text[len(group_num):].strip()
            else:
                label = full_text
            cid = ""
            url = ""
            has_link = False

        if not label:
            continue
        rows.append({
            "id": row_id,
            "parent_id": parent_id,
            "label": label,
            "cid": cid,
            "url": url,
            "group_num": group_num,
            "has_link": has_link,
        })
    return rows


def _build_tree(flat: List[Dict]) -> List[Dict]:
    """Build a 2-level tree from flat rows. Root = groups, children = subgroups."""
    by_id = {r["id"]: {**r, "children": []} for r in flat}
    roots = []
    for r in flat:
        node = by_id[r["id"]]
        if r["parent_id"] and r["parent_id"] in by_id:
            by_id[r["parent_id"]]["children"].append(node)
        else:
            roots.append(node)
    return roots


# ---------- Parts table parsing (unit page) ----------

TABLE_BLOCK_RE = re.compile(
    r'<table[^>]*class="[^"]*pop-vin[^"]*"[^>]*>(.*?)</table>',
    re.S | re.I,
)


def _parse_parts_table(html: str) -> List[Dict]:
    """Parse the parts list table on a unit page.

    Returns list of dicts: {number, name, code, replacement, note}
    """
    m = TABLE_BLOCK_RE.search(html)
    if not m:
        return []
    body = m.group(1)

    # Identify header order to be safe
    thead_m = re.search(r"<thead[^>]*>(.*?)</thead>", body, re.S)
    headers = []
    if thead_m:
        headers = [
            _strip(th).lower()
            for th in re.findall(r"<th[^>]*>(.*?)</th>", thead_m.group(1), re.S)
        ]

    # Map header label to standard key
    def _key(h: str) -> str:
        h = h.lower()
        if "number" in h or "numéro" in h or "numero" in h:
            return "number"
        if "name" in h or "nom" in h:
            return "name"
        if "code" in h or "ref" in h:
            return "code"
        if "replacement" in h or "remplacement" in h:
            return "replacement"
        if "note" in h or "remark" in h or "remarque" in h:
            return "note"
        return h or "extra"

    keys = [_key(h) for h in headers] or ["number", "name", "code", "replacement", "note"]

    # Extract rows from tbody (or fallback to all trs)
    tbody_m = re.search(r"<tbody[^>]*>(.*?)</tbody>", body, re.S)
    rows_html = tbody_m.group(1) if tbody_m else body
    parts = []
    for tr in re.findall(r"<tr[^>]*>(.*?)</tr>", rows_html, re.S):
        cells = re.findall(r"<td[^>]*>(.*?)</td>", tr, re.S)
        if not cells:
            continue
        values = [_strip(c) for c in cells]
        # Expect at least Number column to contain something like an OEM
        if not values[0]:
            continue
        # Skip header rows that ended up here
        if values[0].lower() in {"number", "numéro", "numero"}:
            continue
        row = {keys[i] if i < len(keys) else f"col{i}": v for i, v in enumerate(values)}
        # Sanity: must look like a part row (number not too long, has some digits)
        num = row.get("number", "")
        if not num or len(num) > 30 or not re.search(r"[0-9A-Z]", num):
            continue
        # Skip vehicle info row (RENAULT, Clio IV, etc.)
        if num.upper() in KNOWN_MAKES or num.upper() == "RENAULT":
            continue
        parts.append(row)
    return parts


# ---------- Public scraping API ----------

async def scrape_vin(vin: str) -> Optional[Dict]:
    """Scrape PartSouq for a given VIN. Returns vehicle info + full catalog tree."""
    vin = (vin or "").strip().upper()
    if len(vin) < 11:
        return None

    target = f"https://partsouq.com/en/search/all?q={urllib.parse.quote(vin)}"
    html = await _fetch(target, wait_ms=10000)
    if not html:
        return None

    title_m = TITLE_RE.search(html)
    title = title_m.group(1).strip() if title_m else ""
    if not title or "partsouq" not in title.lower():
        return None

    info = _parse_title(title)
    flat = _parse_tree(html)
    tree = _build_tree(flat)

    # Compatibility: also produce a flat list of "categories" (subgroups w/ link)
    categories = [
        {"label": r["label"], "url": r["url"], "cid": r["cid"]}
        for r in flat
        if r["has_link"] and r["parent_id"]
    ]

    h1_m = H1_RE.search(html)
    h1 = _strip(h1_m.group(1)) if h1_m else ""

    return {
        "vin": vin,
        "make": info["make"],
        "model": info["model"],
        "year": info["year"],
        "title": title,
        "h1": h1,
        "tree": tree,
        "categories": categories,
        "categories_count": len(categories),
        "source": "partsouq",
    }


async def scrape_subgroup_parts(subgroup_url: str) -> Optional[Dict]:
    """Given a subgroup URL (vehicle?cid=...), fetch its first unit and return parts table.

    Performs 2 ScrapingBee fetches (150 credits total).
    Result: {schema_label, schema_url, headers, parts:[{number, name, code, replacement, note}]}
    """
    if not subgroup_url:
        return None

    # Step 1: fetch subgroup page to find the unit (schema) URL
    html = await _fetch(subgroup_url, wait_ms=10000)
    if not html:
        return None

    # Find first unit link on the page
    unit_m = re.search(
        r'<a[^>]*href="(/en/catalog/genuine/unit[^"]+)"[^>]*>(.*?)</a>',
        html,
        re.S,
    )
    if not unit_m:
        # Subgroup might not have a single schema — return empty result with empty parts
        title_m = TITLE_RE.search(html)
        return {
            "schema_label": _strip(title_m.group(1).split("|")[0]) if title_m else "",
            "schema_url": "",
            "parts": [],
        }

    unit_url = _abs(unit_m.group(1))
    schema_label = _strip(unit_m.group(2))

    # Step 2: fetch unit page to get the parts table
    unit_html = await _fetch(unit_url, wait_ms=12000)
    if not unit_html:
        return None

    parts = _parse_parts_table(unit_html)

    # Also collect "diagram image" URL if present
    img_m = re.search(r'<img[^>]+src="([^"]*/scheme[^"]*)"', unit_html, re.I)
    diagram = _abs(img_m.group(1)) if img_m else ""

    return {
        "schema_label": schema_label,
        "schema_url": unit_url,
        "diagram_url": diagram,
        "parts": parts,
        "parts_count": len(parts),
    }
