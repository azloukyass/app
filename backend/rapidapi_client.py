"""
RapidAPI · Auto Parts Catalog (TecDoc) client.
- VIN → modelId
- modelId + search-param → OEM articles
"""

import os
import logging
import httpx
from typing import Optional, List, Dict

logger = logging.getLogger(__name__)

API_HOST = "auto-parts-catalog.p.rapidapi.com"
API_BASE = f"https://{API_HOST}"
LANG_FR = 6  # TecDoc language id for French
TYPE_ID = 1  # passenger car


def _api_key() -> str:
    k = os.environ.get("RAPIDAPI_KEY", "")
    if not k:
        raise RuntimeError("RAPIDAPI_KEY non configurée")
    return k


def _headers() -> dict:
    return {
        "x-rapidapi-key": _api_key(),
        "x-rapidapi-host": API_HOST,
        "Content-Type": "application/json",
    }


async def vin_lookup(vin: str) -> Optional[Dict]:
    """Look up a VIN → returns {manuId, manuName, modelId, modelName} or None."""
    vin = (vin or "").strip().upper()
    if len(vin) < 11:
        return None
    url = f"{API_BASE}/vin/tecdoc-vin-check/{vin}"
    try:
        async with httpx.AsyncClient(timeout=30.0) as cl:
            r = await cl.get(url, headers=_headers())
            if r.status_code != 200:
                logger.warning(f"RapidAPI vin lookup {vin} → {r.status_code}: {r.text[:200]}")
                return None
            payload = r.json()
            data = (payload or {}).get("data") or {}
            manus = (data.get("matchingManufacturers") or {}).get("array") or []
            models = (data.get("matchingModels") or {}).get("array") or []
            if not models:
                return None
            m = models[0]
            manu = next((x for x in manus if x.get("manuId") == m.get("manuId")), {})
            return {
                "vin": vin,
                "manu_id": m.get("manuId"),
                "manu_name": manu.get("manuName") or m.get("manuName") or "",
                "model_id": m.get("modelId"),
                "model_name": m.get("modelName") or "",
            }
    except Exception as e:
        logger.warning(f"RapidAPI vin error: {e}")
        return None


async def search_oem(model_id: int, search_param: str, lang_id: int = LANG_FR) -> List[Dict]:
    """Search OEM parts for a vehicle by free-text search-param.
    Returns list of {articleOemNo, articleProductName} normalized to {ref, name}."""
    sp = (search_param or "").strip()
    if not sp or not model_id:
        return []
    # URL-encode the search-param to be safe (spaces, accents)
    sp_enc = httpx.QueryParams({"q": sp}).get("q")  # safe-ish quoting
    import urllib.parse
    sp_enc = urllib.parse.quote(sp, safe="")
    url = (
        f"{API_BASE}/articles-oem/selecting-oem-parts-vehicle-modification-description-product-group"
        f"/type-id/{TYPE_ID}/vehicle-id/{model_id}/lang-id/{lang_id}/search-param/{sp_enc}"
    )
    try:
        async with httpx.AsyncClient(timeout=30.0) as cl:
            r = await cl.get(url, headers=_headers())
            if r.status_code != 200:
                logger.warning(f"RapidAPI search-oem → {r.status_code}: {r.text[:200]}")
                return []
            data = r.json()
            if not isinstance(data, list):
                return []
            out = []
            for item in data:
                oem = (item.get("articleOemNo") or "").strip()
                name = (item.get("articleProductName") or "").strip()
                if oem:
                    out.append({"ref": oem, "name": name})
            return out
    except Exception as e:
        logger.warning(f"RapidAPI search-oem error: {e}")
        return []


async def find_article_by_oem(article_oem_no: str, lang_id: int = 4) -> Optional[Dict]:
    """Step 1: POST /articles-oem/article-oem-search-no with the OEM reference.
    Returns the FIRST matching article (with articleId) or None.
    """
    ref = (article_oem_no or "").strip()
    if not ref:
        return None
    url = f"{API_BASE}/articles-oem/article-oem-search-no"
    headers = {
        "x-rapidapi-key": _api_key(),
        "x-rapidapi-host": API_HOST,
        "Content-Type": "application/x-www-form-urlencoded",
    }
    try:
        async with httpx.AsyncClient(timeout=30.0) as cl:
            r = await cl.post(url, headers=headers, data={"langId": lang_id, "articleOemNo": ref})
            if r.status_code != 200:
                logger.warning(f"RapidAPI article-oem-search → {r.status_code}: {r.text[:200]}")
                return None
            data = r.json()
            if not isinstance(data, list) or not data:
                return None
            return data[0]
    except Exception as e:
        logger.warning(f"RapidAPI article-oem-search error: {e}")
        return None


async def article_complete_details(article_id: int, type_id: int = 1, lang_id: int = 4,
                                    country_filter_id: int = 63) -> Optional[Dict]:
    """Step 2: POST /articles/article-id-complete-details. Returns the full
    article dict {articleId, articleNo, articleProductName, supplierName,
    s3image, allSpecifications, oemNo, compatibleCars, …} or None."""
    if not article_id:
        return None
    url = f"{API_BASE}/articles/article-id-complete-details"
    headers = {
        "x-rapidapi-key": _api_key(),
        "x-rapidapi-host": API_HOST,
        "Content-Type": "application/x-www-form-urlencoded",
    }
    try:
        async with httpx.AsyncClient(timeout=30.0) as cl:
            r = await cl.post(url, headers=headers, data={
                "typeId": type_id,
                "langId": lang_id,
                "countryFilterId": country_filter_id,
                "articleId": article_id,
            })
            if r.status_code != 200:
                logger.warning(f"RapidAPI article-details → {r.status_code}: {r.text[:200]}")
                return None
            payload = r.json() or {}
            return payload.get("article") or None
    except Exception as e:
        logger.warning(f"RapidAPI article-details error: {e}")
        return None
