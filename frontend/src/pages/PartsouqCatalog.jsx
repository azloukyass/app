import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ChevronLeft,
  Loader2,
  Hash,
  Car,
  Calendar,
  Fuel,
  Search,
  Package,
  Sparkles,
} from "lucide-react";
import { api, formatApiError } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import FadProSearch from "@/components/FadProSearch";

const SUGGESTIONS = [
  "frein", "pompe", "filtre", "huile", "courroie", "bougie",
  "amortisseur", "embrayage", "alternateur", "démarreur",
  "phare", "rétroviseur", "radiateur", "thermostat",
];

export default function PartsouqCatalog() {
  const { vin } = useParams();
  const navigate = useNavigate();
  const { vehicle, setVehicle } = useCart();
  const [tecdoc, setTecdoc] = useState(null);
  const [loadingVin, setLoadingVin] = useState(true);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState("");

  // Resolve VIN via RapidAPI TecDoc
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (vin.startsWith("MAN-")) {
        toast.error("Le catalogue OEM nécessite un VIN valide.");
        navigate("/recherche-vin");
        return;
      }
      setLoadingVin(true);
      try {
        const { data } = await api.get(`/rapidapi/vin/${vin}`);
        if (!cancelled) {
          setTecdoc(data);
          // Sync vehicle context (e.g. when user arrived via a deep link)
          if (!vehicle || vehicle.vin !== vin) {
            setVehicle({
              vin,
              make: data.manu_name,
              model: data.model_name,
              year: vehicle?.year || "—",
              fuel: vehicle?.fuel || "—",
              engine: vehicle?.engine || "—",
              trim: vehicle?.trim || "—",
              source: "tecdoc",
            });
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(formatApiError(err));
          toast.error(formatApiError(err));
        }
      } finally {
        if (!cancelled) setLoadingVin(false);
      }
    })();
    return () => { cancelled = true; };
  }, [vin]); // eslint-disable-line react-hooks/exhaustive-deps

  const runSearch = async (q) => {
    const query = (q || search).trim();
    if (query.length < 2) {
      toast.error("Saisissez au moins 2 caractères");
      return;
    }
    if (!tecdoc?.model_id) {
      toast.error("Véhicule non identifié");
      return;
    }
    setLoadingSearch(true);
    setError("");
    try {
      const { data } = await api.get(`/rapidapi/oem-search`, {
        params: { model_id: tecdoc.model_id, q: query, lang_id: 6 },
      });
      setResults(data);
    } catch (err) {
      setError(formatApiError(err));
      setResults(null);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch();
  };

  const handleSuggestion = (s) => {
    setSearch(s);
    runSearch(s);
  };

  // Group results by product name for cleaner display
  const grouped = results?.items
    ? Object.entries(
        results.items.reduce((acc, it) => {
          (acc[it.name] = acc[it.name] || []).push(it);
          return acc;
        }, {})
      ).sort((a, b) => b[1].length - a[1].length)
    : [];

  if (loadingVin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500 px-4">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-red-600" />
        <p className="text-sm">Identification du véhicule…</p>
      </div>
    );
  }

  if (!tecdoc) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <Package className="w-12 h-12 mx-auto text-slate-300 mb-4" />
        <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">Véhicule non trouvé</h2>
        <p className="text-slate-500 text-sm mb-6">Aucune correspondance dans la base TecDoc pour ce VIN.</p>
        <Link to={`/vehicule/${vin}`} className="text-red-600 hover:underline text-sm">
          ← Retour au véhicule
        </Link>
      </div>
    );
  }

  return (
    <div data-testid="partsouq-catalog-page">
      {/* Header */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to={`/vehicule/${vin}`}
            className="inline-flex items-center gap-1 text-sm text-slate-300 hover:text-white mb-4"
            data-testid="back-to-vehicle"
          >
            <ChevronLeft className="w-4 h-4" /> Retour au véhicule
          </Link>

          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider mb-4">
            <span className="text-slate-300 font-bold">Catalogue OEM TecDoc:</span>
            <span className="bn-chip bg-white/10 text-white border-white/20">
              <Car className="w-3 h-3" /> {tecdoc.manu_name}
            </span>
            <span className="bn-chip bg-white/10 text-white border-white/20">{tecdoc.model_name}</span>
            {vehicle?.year && vehicle.year !== "—" && (
              <span className="bn-chip bg-white/10 text-white border-white/20">
                <Calendar className="w-3 h-3" /> {vehicle.year}
              </span>
            )}
            {vehicle?.fuel && vehicle.fuel !== "—" && (
              <span className="bn-chip bg-white/10 text-white border-white/20">
                <Fuel className="w-3 h-3" /> {vehicle.fuel}
              </span>
            )}
            <span className="bn-chip bg-red-600/30 text-red-200 border-red-500/40 font-mono-vin">
              <Hash className="w-3 h-3" /> {vin}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            Catalogue OEM officiel
          </h1>
          <p className="text-slate-300 mt-2 text-sm">
            Recherchez une pièce par nom (en français) — modelId TecDoc&nbsp;:{" "}
            <span className="font-mono-vin text-red-300">{tecdoc.model_id}</span>
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-2" data-testid="oem-search-form">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une pièce (ex: frein, pompe, filtre, huile…)"
                className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                data-testid="oem-search-input"
              />
            </div>
            <button
              type="submit"
              disabled={loadingSearch}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold px-5 py-2.5 rounded-sm transition-colors inline-flex items-center gap-2 whitespace-nowrap"
              data-testid="oem-search-btn"
            >
              {loadingSearch ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Rechercher
            </button>
          </form>
          {!results && !loadingSearch && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Suggestions :
              </span>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestion(s)}
                  className="text-xs px-2.5 py-1 border border-slate-200 rounded-sm bg-white hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors"
                  data-testid={`suggestion-${s}`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-sm text-sm" data-testid="oem-error">
            {error}
          </div>
        )}

        {loadingSearch && (
          <div className="flex items-center justify-center py-20 text-slate-500" data-testid="oem-loading">
            <Loader2 className="w-7 h-7 animate-spin mr-3 text-red-600" />
            <span>Recherche TecDoc en cours…</span>
          </div>
        )}

        {!loadingSearch && !results && !error && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 text-sm">
              Saisissez le nom d'une pièce pour afficher les références OEM compatibles
            </p>
          </div>
        )}

        {!loadingSearch && results && (
          <>
            <div className="bg-white border-l-4 border-red-600 pl-4 py-3 pr-4 rounded-sm shadow-sm flex items-center justify-between mb-6" data-testid="oem-summary">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Résultats pour
                </div>
                <div className="font-mono-vin font-semibold text-slate-800 text-sm">"{search}"</div>
              </div>
              <div className="text-right">
                <div className="font-display text-2xl font-bold text-red-600">{results.count}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500">références OEM</div>
              </div>
            </div>

            {results.count === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <Package className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="text-sm">Aucune pièce trouvée pour cette recherche.</p>
                <p className="text-xs mt-2">Essayez un autre terme (ex: frein, pompe, filtre, embrayage…)</p>
              </div>
            ) : (
              <div className="space-y-6">
                {grouped.map(([name, items]) => (
                  <div
                    key={name}
                    className="bg-white border border-slate-200 rounded-sm overflow-hidden"
                    data-testid={`oem-group-${name.replace(/\s+/g, "-")}`}
                  >
                    <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                      <h3 className="font-display font-bold text-slate-900 text-base">{name}</h3>
                      <span className="text-xs font-semibold bg-red-100 text-red-700 px-2.5 py-0.5 rounded-sm">
                        {items.length} référence{items.length > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100">
                          <tr>
                            <th className="text-left px-4 py-2.5 font-semibold w-1/3">Référence OEM</th>
                            <th className="text-left px-4 py-2.5 font-semibold">Désignation</th>
                            <th className="text-right px-4 py-2.5 font-semibold">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((it, i) => (
                            <tr
                              key={`${it.ref}-${i}`}
                              className="border-b border-slate-50 hover:bg-amber-50/40 transition-colors"
                              data-testid={`oem-row-${name.replace(/\s+/g, "-")}-${i}`}
                            >
                              <td className="px-4 py-2.5 font-mono-vin font-semibold text-slate-900 whitespace-nowrap">
                                {it.ref}
                              </td>
                              <td className="px-4 py-2.5 text-slate-600 text-xs">{it.name}</td>
                              <td className="px-4 py-2.5 text-right">
                                <button
                                  onClick={() => {
                                    navigator.clipboard?.writeText(it.ref);
                                    toast.success(`Référence ${it.ref} copiée. Collez-la dans la recherche FadPro.`);
                                    // Smooth scroll to FadPro search
                                    const el = document.querySelector('[data-testid="fadpro-search-input"]');
                                    if (el) {
                                      el.scrollIntoView({ behavior: "smooth", block: "center" });
                                      el.focus();
                                    }
                                  }}
                                  className="text-xs font-semibold bg-slate-900 hover:bg-red-600 text-white px-3 py-1.5 rounded-sm transition-colors"
                                  data-testid={`oem-find-stock-${it.ref}`}
                                  title="Copier la référence et vérifier le stock chez FadPro"
                                >
                                  Vérifier stock →
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Hidden FadPro instance that listens to global events */}
      <FadProAutoOpen />
    </div>
  );
}

/**
 * Renders FadProSearch in a hidden form, listens for "fadpro-search" event and
 * auto-fills + submits when an OEM "Vérifier stock" button is clicked.
 */
function FadProAutoOpen() {
  const [pendingRef, setPendingRef] = useState("");

  useEffect(() => {
    const handler = (e) => {
      const ref = e?.detail?.ref;
      if (!ref) return;
      setPendingRef(ref);
    };
    window.addEventListener("fadpro-search", handler);
    return () => window.removeEventListener("fadpro-search", handler);
  }, []);

  useEffect(() => {
    if (!pendingRef) return;
    const input = document.querySelector('[data-testid="fadpro-search-input"]');
    const btn = document.querySelector('[data-testid="fadpro-search-btn"]');
    if (input && btn) {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      setter.call(input, pendingRef);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      setTimeout(() => btn.click(), 50);
    }
    setPendingRef("");
  }, [pendingRef]);

  return (
    <div className="fixed -bottom-1 -right-1 opacity-0 pointer-events-none" aria-hidden="true">
      <FadProSearch inline />
    </div>
  );
}
