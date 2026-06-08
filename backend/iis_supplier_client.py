"""
Generic IIS-MVC supplier client.

Both Copia (port 8091) and PartsPro (port 8090) expose the same ASP.NET MVC
backend with the following pattern:

  1. GET  /Home/Login                            → returns HTML containing
                                                    __RequestVerificationToken
                                                    and sets initial cookies
  2. POST /Home/Login (form-urlencoded)           → authenticates
                                                    (`username`, `pwd`,
                                                    `__RequestVerificationToken`)
  3. POST /Recherche/SaveMot (JSON)              → stores the search term
                                                    in the server-side session
                                                    {"mot": "REF"}
  4. POST /Recherche/FindItembyCodeArticle (JSON) → returns items based on
                                                    the saved search term

This client maintains an aiohttp session per supplier instance and lazily
re-authenticates when the session expires.

Price logic (consistent with FadPro):
    final_tnd = prix_origine + 19% + 35% = prix_origine * 1.54
"""

from __future__ import annotations

import asyncio
import logging
import os
import re
from typing import Any, Dict, List, Optional

import httpx
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("iis_supplier")

_TOKEN_RE = re.compile(
    r'name="__RequestVerificationToken"[^>]*value="([^"]+)"', re.IGNORECASE
)


def _to_float_eu(value: Any) -> float:
    """Parse a European-style number with a comma decimal separator."""
    if value is None:
        return 0.0
    if isinstance(value, (int, float)):
        return float(value)
    s = str(value).strip().replace(" ", "")
    if not s:
        return 0.0
    # Replace comma with dot as decimal separator
    if "," in s and "." in s:
        # 1.234,56 → 1234.56 (assume comma is decimal, dot is thousands)
        s = s.replace(".", "").replace(",", ".")
    else:
        s = s.replace(",", ".")
    try:
        return float(s)
    except ValueError:
        return 0.0


class IISSupplierClient:
    """One client instance per supplier (Copia / PartsPro)."""

    def __init__(self, name: str, base_url: str, username: str, password: str):
        self.name = name
        self.base_url = base_url.rstrip("/")
        self.username = username
        self.password = password
        self._client: Optional[httpx.AsyncClient] = None
        self._lock = asyncio.Lock()
        self._authenticated = False

    def _new_client(self) -> httpx.AsyncClient:
        return httpx.AsyncClient(
            base_url=self.base_url,
            timeout=httpx.Timeout(20.0),
            follow_redirects=False,
            headers={
                "User-Agent": "Mozilla/5.0 (compatible; BennouriBot/1.0)",
                "Accept": "*/*",
            },
        )

    async def _ensure_auth(self) -> None:
        """Login once, reuse session cookies for subsequent requests."""
        if self._client is None:
            self._client = self._new_client()
        if self._authenticated:
            return

        # 1. Fetch the login page to grab the antiforgery token + initial cookie
        r = await self._client.get("/Home/Login")
        html = r.text or ""
        m = _TOKEN_RE.search(html)
        if not m:
            raise RuntimeError(f"{self.name}: token __RequestVerificationToken introuvable")
        token = m.group(1)

        # 2. POST credentials
        r = await self._client.post(
            "/Home/Login",
            data={
                "__RequestVerificationToken": token,
                "username": self.username,
                "pwd": self.password,
                "rememberme": "false",
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        # A successful login redirects (302) to "/" — anything else means failure
        if r.status_code not in (302, 200):
            raise RuntimeError(f"{self.name}: échec d'authentification (HTTP {r.status_code})")
        # If we get a 200 back the credentials were wrong (the form re-renders)
        if r.status_code == 200 and "Recherche" not in (r.text or ""):
            # Accept anyway — some IIS apps re-render the form even on success
            logger.warning(f"{self.name}: 200 on login — checking session validity downstream")
        self._authenticated = True

    async def _post_json(self, path: str, payload: Optional[Dict] = None) -> httpx.Response:
        assert self._client is not None
        return await self._client.post(
            path,
            json=payload if payload is not None else {},
            headers={"Content-Type": "application/json"},
        )

    async def search_reference(self, ref: str) -> List[Dict[str, Any]]:
        """Search the supplier for a part reference.

        Returns a normalised list of items shaped to match FadPro:
            {
              "reference":      str (ItemNo),
              "designation":    str,
              "fournisseur":    str (supplier name, e.g. "COPIA"),
              "stock":          int,
              "in_stock":       bool,
              "prix_origine":   float (UnitPrice, raw),
              "prix_tnd":       float (with margin + VAT),
              "marque":         str (best-effort, derived from ItemNo prefix),
              "modele":         str,
              "categorie":      str,
              "source":         self.name,
            }
        """
        ref = (ref or "").strip()
        if len(ref) < 2:
            return []

        async with self._lock:
            await self._ensure_auth()
            try:
                # Step A: save the search term in session
                r1 = await self._post_json("/Recherche/SaveMot", {"mot": ref})
                if r1.status_code in (302, 401, 403):
                    # Session expired — re-auth and retry once
                    self._authenticated = False
                    await self._ensure_auth()
                    r1 = await self._post_json("/Recherche/SaveMot", {"mot": ref})
                if r1.status_code != 200:
                    logger.warning(f"{self.name}: SaveMot HTTP {r1.status_code} for ref={ref}")
                    return []

                # Step B: fetch items based on session
                r2 = await self._post_json("/Recherche/FindItembyCodeArticle", {})
                if r2.status_code != 200:
                    logger.warning(f"{self.name}: FindItem HTTP {r2.status_code} for ref={ref}")
                    return []
                raw = r2.json()
            except (httpx.HTTPError, ValueError) as e:
                logger.warning(f"{self.name}: erreur réseau pour ref={ref}: {e}")
                return []

        if not isinstance(raw, list):
            return []

        results: List[Dict[str, Any]] = []
        for it in raw:
            try:
                unit_ht = _to_float_eu(it.get("UnitPrice"))
                if unit_ht <= 0:
                    continue
                stock_main = int(_to_float_eu(it.get("StockMagasin")))
                stock_other = int(_to_float_eu(it.get("StockAutresMagasin")))
                stock_total = stock_main + stock_other
                # Pricing: prix + 19% + 35% = prix * 1.54 (unified across all suppliers)
                prix_tnd = round(unit_ht * 1.54, 3)

                item_no = (it.get("ItemNo") or "").strip()
                description = (it.get("Description") or "").strip()
                results.append({
                    "reference": item_no,
                    "designation": description,
                    "fournisseur": self.name.upper(),
                    "marque": "",
                    "modele": "",
                    "categorie": "",
                    "stock": stock_total,
                    "in_stock": stock_total > 0,
                    "prix_origine": unit_ht,
                    "prix_tnd": prix_tnd,
                    "source": self.name,
                })
            except Exception as e:
                logger.debug(f"{self.name}: parse error: {e}")
                continue

        return results

    async def close(self) -> None:
        if self._client is not None:
            await self._client.aclose()
            self._client = None
            self._authenticated = False


# Module-level singletons (one per supplier)
_copia_client: Optional[IISSupplierClient] = None
_partspro_client: Optional[IISSupplierClient] = None


def get_copia() -> IISSupplierClient:
    global _copia_client
    if _copia_client is None:
        _copia_client = IISSupplierClient(
            name="copia",
            base_url=os.environ["COPIA_BASE_URL"],
            username=os.environ["COPIA_USER"],
            password=os.environ["COPIA_PASSWORD"],
        )
    return _copia_client


def get_partspro() -> IISSupplierClient:
    global _partspro_client
    if _partspro_client is None:
        _partspro_client = IISSupplierClient(
            name="partspro",
            base_url=os.environ["PARTSPRO_BASE_URL"],
            username=os.environ["PARTSPRO_USER"],
            password=os.environ["PARTSPRO_PASSWORD"],
        )
    return _partspro_client


async def search_all_suppliers(ref: str) -> List[Dict[str, Any]]:
    """Run Copia + PartsPro in parallel and return a deduped combined list."""
    copia = get_copia()
    pp = get_partspro()
    copia_results, pp_results = await asyncio.gather(
        copia.search_reference(ref),
        pp.search_reference(ref),
        return_exceptions=True,
    )
    out: List[Dict[str, Any]] = []
    seen = set()
    for batch in (copia_results, pp_results):
        if isinstance(batch, Exception):
            logger.warning(f"supplier batch error: {batch}")
            continue
        for item in batch:
            key = (item["source"], item["reference"])
            if key in seen:
                continue
            seen.add(key)
            out.append(item)
    return out
