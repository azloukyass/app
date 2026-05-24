"""
PartSouq scraper via ScrapingBee with stealth_proxy.
Each request costs 75 ScrapingBee credits.
Results are cached in MongoDB to minimize cost.
"""

import os
import re
import logging
import urllib.parse
from typing import Optional

import httpx

logger = logging.getLogger(__name__)

SCRAPINGBEE_URL = "https://app.scrapingbee.com/api/v1/"


def _api_key() -> str:
    key = os.environ.get("SCRAPINGBEE_API_KEY", "")
    if not key:
        raise RuntimeError("SCRAPINGBEE_API_KEY non configurée")
    return key


async def _fetch(target_url: str, wait_ms: int = 8000) -> Optional[str]:
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
        async with httpx.AsyncClient(timeout=90.0) as cl:
            r = await cl.get(url)
            if r.status_code == 200 and len(r.text) > 5000:
                return r.text
            logger.warning(f"ScrapingBee returned {r.status_code} (size={len(r.text)})")
            return None
    except Exception as e:
        logger.warning(f"ScrapingBee fetch error: {e}")
        return None


# Title example: "Access.,Infotainment,Miscell. | Volkswagen Golf/Variant/4Motion 06.10.2007 2008 Parts Catalogs | PartSouq"
TITLE_RE = re.compile(r"<title>([^<]+)</title>", re.I)
H1_RE = re.compile(r"<h1[^>]*>(.*?)</h1>", re.I | re.S)
LINK_RE = re.compile(r'<a[^>]*href="([^"]*catalog[^"]*)"[^>]*>([^<]+)</a>', re.I)
META_DESC_RE = re.compile(r'<meta\s+name="description"\s+content="([^"]+)"', re.I)


def _strip(s: str) -> str:
    return re.sub(r"<[^>]+>", "", s).strip()


def _parse_title(title: str) -> dict:
    """Extract make/model/year from PartSouq title."""
    info = {"make": "", "model": "", "year": "", "raw_title": title}
    # Find segment between pipes: "... | Volkswagen Golf/Variant/4Motion 06.10.2007 2008 Parts Catalogs | PartSouq"
    parts = [p.strip() for p in title.split("|")]
    vehicle_part = ""
    for p in parts:
        if "Parts Catalogs" in p or "parts" in p.lower():
            vehicle_part = p.replace("Parts Catalogs", "").strip()
            break
    if not vehicle_part and len(parts) >= 2:
        vehicle_part = parts[1].replace("Parts Catalogs", "").strip()

    # Extract year (4-digit number)
    year_match = re.search(r"\b(19|20)\d{2}\b", vehicle_part)
    info["year"] = year_match.group(0) if year_match else ""

    # Remove date patterns like "06.10.2007"
    cleaned = re.sub(r"\d{2}\.\d{2}\.\d{4}", "", vehicle_part)
    # Remove year
    cleaned = re.sub(r"\b(19|20)\d{2}\b", "", cleaned).strip()
    tokens = [t for t in cleaned.split() if t]

    # Known makes (first token usually)
    KNOWN_MAKES = {
        "Volkswagen", "Audi", "Mercedes", "Mercedes-Benz", "BMW", "Peugeot",
        "Renault", "Citroen", "Citroën", "Toyota", "Lexus", "Nissan", "Infiniti",
        "Mitsubishi", "Subaru", "Hyundai", "Kia", "Suzuki", "Mazda", "Honda",
        "Ford", "Opel", "Fiat", "Seat", "Skoda", "Dacia", "Chevrolet", "Volvo",
    }
    if tokens and tokens[0] in KNOWN_MAKES:
        info["make"] = tokens[0]
        info["model"] = " ".join(tokens[1:]).strip()
    elif tokens:
        info["model"] = " ".join(tokens).strip()
    return info


def _parse_categories(html: str) -> list:
    """Extract the list of catalog groups (categories) from page."""
    # Find catalog links that point to deeper PartSouq URLs
    links = LINK_RE.findall(html)
    cats = []
    seen = set()
    BLACKLIST = {
        "genuine parts catalogs", "volkswagen", "audi", "bmw", "mercedes-benz",
        "peugeot", "citroen", "renault", "toyota", "lexus", "nissan",
        "infiniti", "mitsubishi", "subaru", "hyundai", "kia", "suzuki",
        "mazda", "honda", "ford", "opel", "fiat", "seat", "skoda", "dacia",
    }
    for href, text in links:
        label = text.strip()
        key = label.lower()
        if not label or key in seen or key in BLACKLIST or len(label) < 3:
            continue
        if "?c=" in href and href.count("&") < 1:  # marque-level link, skip
            continue
        seen.add(key)
        cats.append({
            "label": label,
            "url": href if href.startswith("http") else f"https://partsouq.com{href}",
        })
    return cats[:40]


def _parse_part_numbers(html: str) -> list:
    """Extract OEM part numbers (best-effort)."""
    # Common OEM formats: 1K0 615 301, 06A 109 119, etc.
    candidates = set()
    for m in re.finditer(r"\b([0-9][A-Z0-9]{2}\s?\d{3}\s?\d{3}[A-Z]?)\b", html):
        candidates.add(m.group(1).strip())
    for m in re.finditer(r"\b(\d{9,12})\b", html):
        candidates.add(m.group(1))
    # Filter out obvious non-OEMs (timestamps, ids)
    blacklist = {"1778840246"}  # known noise
    return sorted([c for c in candidates if c not in blacklist])[:30]


async def scrape_vin(vin: str) -> Optional[dict]:
    """Scrape PartSouq for a given VIN. Returns vehicle info + categories + OEM numbers."""
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
    categories = _parse_categories(html)
    part_numbers = _parse_part_numbers(html)

    h1_m = H1_RE.search(html)
    h1 = _strip(h1_m.group(1)) if h1_m else ""

    return {
        "vin": vin,
        "make": info["make"],
        "model": info["model"],
        "year": info["year"],
        "title": title,
        "h1": h1,
        "categories": categories,
        "categories_count": len(categories),
        "part_numbers": part_numbers,
        "part_numbers_count": len(part_numbers),
        "source": "partsouq",
    }
