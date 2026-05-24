import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Loader2,
  Hash,
  Car,
  Calendar,
  Fuel,
  Database,
  Wrench,
  FolderTree,
  X,
} from "lucide-react";
import { api, formatApiError } from "@/lib/api";
import { useCart } from "@/context/CartContext";

function decodeHref(url) {
  return (url || "").replaceAll("&amp;", "&");
}

function PartsTableModal({ open, subgroup, onClose }) {
  if (!open || !subgroup) return null;
  const { schema_label, schema_url, diagram_url, parts = [], loading, error, label } = subgroup;
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-start sm:items-center justify-center p-2 sm:p-6 overflow-y-auto"
      data-testid="parts-modal"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-5xl rounded-sm shadow-2xl border border-slate-200 my-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 sticky top-0">
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-red-600 mb-1">
              Schéma OEM PartSouq
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900 truncate" data-testid="parts-modal-title">
              {schema_label || label || "Pièces"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-sm transition-colors flex-shrink-0"
            aria-label="Fermer"
            data-testid="parts-modal-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-16 text-slate-500" data-testid="parts-loading">
              <Loader2 className="w-6 h-6 animate-spin mr-3" />
              <span>Récupération des références OEM depuis PartSouq… (~10-20s)</span>
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-sm text-sm" data-testid="parts-error">
              {error}
            </div>
          )}

          {!loading && !error && parts.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-sm" data-testid="parts-empty">
              Aucune pièce trouvée pour cette sous-catégorie.
            </div>
          )}

          {!loading && !error && parts.length > 0 && (
            <>
              {diagram_url && (
                <div className="mb-6 flex justify-center bg-slate-50 border border-slate-200 rounded-sm p-4">
                  <img
                    src={diagram_url}
                    alt="Schéma"
                    className="max-h-80 object-contain"
                    data-testid="parts-diagram"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              )}

              <div className="overflow-x-auto border border-slate-200 rounded-sm">
                <table className="w-full text-sm" data-testid="parts-table">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="text-left px-3 py-2 font-semibold border-b border-slate-200">Numéro</th>
                      <th className="text-left px-3 py-2 font-semibold border-b border-slate-200">Nom</th>
                      <th className="text-left px-3 py-2 font-semibold border-b border-slate-200">Code</th>
                      <th className="text-left px-3 py-2 font-semibold border-b border-slate-200">Remplacement</th>
                      <th className="text-left px-3 py-2 font-semibold border-b border-slate-200">Remarque</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parts.map((p, i) => (
                      <tr
                        key={`${p.number}-${i}`}
                        className="border-b border-slate-100 hover:bg-amber-50/40"
                        data-testid={`parts-row-${i}`}
                      >
                        <td className="px-3 py-2 font-mono-vin text-xs font-semibold text-slate-900 whitespace-nowrap" data-testid={`part-number-${i}`}>
                          {p.number}
                        </td>
                        <td className="px-3 py-2 text-slate-700">{p.name || "—"}</td>
                        <td className="px-3 py-2 text-slate-500 font-mono-vin text-xs">{p.code || "—"}</td>
                        <td className="px-3 py-2 text-slate-600 text-xs">
                          {p.replacement ? (
                            <span className="font-mono-vin">{p.replacement}</span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-3 py-2 text-slate-500 text-xs italic">{p.note || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>{parts.length} référence(s) — Source: PartSouq</span>
                {schema_url && (
                  <a
                    href={schema_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 hover:underline"
                  >
                    Voir sur PartSouq →
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PartsouqCatalog() {
  const { vin } = useParams();
  const navigate = useNavigate();
  const { vehicle, setVehicle } = useCart();
  const [loading, setLoading] = useState(!vehicle || vehicle.vin !== vin);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [search, setSearch] = useState("");
  const [activeSubgroup, setActiveSubgroup] = useState(null);

  // Bootstrap: ensure we have vehicle data with tree
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (vin.startsWith("MAN-")) {
        toast.error("Le catalogue OEM nécessite un VIN valide.");
        navigate("/recherche-vin");
        return;
      }
      if (vehicle && vehicle.vin === vin && Array.isArray(vehicle.partsouq_tree) && vehicle.partsouq_tree.length > 0) {
        setLoading(false);
        return;
      }
      // First call decode (idempotent — returns cached if available)
      try {
        setLoading(true);
        await api.post("/vin/decode", { vin });
      } catch (err) {
        if (!cancelled) toast.error(formatApiError(err));
      }
      // Then poll status until tree is ready
      let attempts = 0;
      const poll = async () => {
        if (cancelled || attempts > 12) {
          setLoading(false);
          return;
        }
        attempts += 1;
        try {
          const { data } = await api.get(`/vin/partsouq-status/${vin}`);
          if (data.ready && Array.isArray(data.partsouq_tree) && data.partsouq_tree.length > 0) {
            setVehicle(data);
            setLoading(false);
            return;
          }
        } catch {}
        setTimeout(poll, 6000);
      };
      poll();
    })();
    return () => {
      cancelled = true;
    };
  }, [vin]);

  const tree = Array.isArray(vehicle?.partsouq_tree) ? vehicle.partsouq_tree : [];

  // Filter tree by search term (matches group or any child label)
  const filteredTree = useMemo(() => {
    if (!search.trim()) return tree;
    const q = search.toLowerCase();
    return tree
      .map((g) => {
        const groupMatch = g.label.toLowerCase().includes(q) || (g.group_num || "").includes(q);
        const matchedChildren = (g.children || []).filter((c) => c.label.toLowerCase().includes(q));
        if (groupMatch) return g;
        if (matchedChildren.length > 0) return { ...g, children: matchedChildren };
        return null;
      })
      .filter(Boolean);
  }, [tree, search]);

  // Auto-expand all when searching
  useEffect(() => {
    if (search.trim()) {
      const all = {};
      filteredTree.forEach((g) => (all[g.id] = true));
      setExpandedGroups(all);
    }
  }, [search, filteredTree]);

  const toggleGroup = (id) => {
    setExpandedGroups((s) => ({ ...s, [id]: !s[id] }));
  };

  const openSubgroup = async (group, child) => {
    if (!child.cid || !child.url) {
      toast.error("Sous-catégorie non disponible");
      return;
    }
    setActiveSubgroup({
      label: child.label,
      group_label: group.label,
      loading: true,
      parts: [],
    });
    try {
      const { data } = await api.post("/partsouq/subgroup", {
        vin,
        cid: child.cid,
        url: decodeHref(child.url),
        label: child.label,
      });
      setActiveSubgroup({
        label: child.label,
        group_label: group.label,
        schema_label: data.schema_label,
        schema_url: data.schema_url,
        diagram_url: data.diagram_url,
        parts: data.parts || [],
        loading: false,
      });
    } catch (err) {
      setActiveSubgroup({
        label: child.label,
        group_label: group.label,
        loading: false,
        parts: [],
        error: formatApiError(err),
      });
    }
  };

  if (loading || !vehicle) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500 px-4">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-red-600" />
        <p className="text-sm">Récupération du catalogue PartSouq en cours… (~30-60s)</p>
      </div>
    );
  }

  if (tree.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <Database className="w-12 h-12 mx-auto text-slate-300 mb-4" />
        <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">Catalogue indisponible</h2>
        <p className="text-slate-500 text-sm mb-6">
          Le catalogue OEM PartSouq pour ce VIN n'est pas encore disponible. Réessayez dans un instant.
        </p>
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
            <span className="text-slate-300 font-bold">Catalogue OEM:</span>
            <span className="bn-chip bg-white/10 text-white border-white/20">
              <Car className="w-3 h-3" /> {vehicle.make}
            </span>
            <span className="bn-chip bg-white/10 text-white border-white/20">{vehicle.model}</span>
            <span className="bn-chip bg-white/10 text-white border-white/20">
              <Calendar className="w-3 h-3" /> {vehicle.year || "—"}
            </span>
            <span className="bn-chip bg-white/10 text-white border-white/20">
              <Fuel className="w-3 h-3" /> {vehicle.fuel}
            </span>
            <span className="bn-chip bg-red-600/30 text-red-200 border-red-500/40 font-mono-vin">
              <Hash className="w-3 h-3" /> {vehicle.vin}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
            Catalogue complet OEM
          </h1>
          <p className="text-slate-300 mt-2 text-sm">
            {tree.length} groupes — Cliquez sur une sous-catégorie pour voir les numéros de pièces officiels
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrer par nom de pièce (ex: pompe à eau, frein…)"
            className="w-full px-4 py-2 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-red-500"
            data-testid="catalog-search"
          />
        </div>
      </div>

      {/* Tree */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border border-slate-200 rounded-sm divide-y divide-slate-100">
          {filteredTree.map((group) => {
            const isOpen = !!expandedGroups[group.id];
            const childCount = (group.children || []).length;
            return (
              <div key={group.id} data-testid={`group-${group.id}`}>
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                  data-testid={`group-toggle-${group.id}`}
                >
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                  {group.group_num && (
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-sm font-mono-vin">
                      {group.group_num}
                    </span>
                  )}
                  <span className="font-semibold text-slate-900 flex-1">{group.label}</span>
                  <span className="text-xs text-slate-400">{childCount} sous-cat.</span>
                </button>
                {isOpen && childCount > 0 && (
                  <div className="bg-slate-50/50 px-4 pb-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
                      {group.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => openSubgroup(group, child)}
                          disabled={!child.has_link}
                          className={`flex items-center gap-2 text-left text-sm px-3 py-2 rounded-sm border transition-colors ${
                            child.has_link
                              ? "border-slate-200 bg-white hover:border-red-300 hover:bg-amber-50 text-slate-700 hover:text-red-700 cursor-pointer"
                              : "border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"
                          }`}
                          data-testid={`subgroup-${child.id}`}
                          title={child.has_link ? "Voir les numéros OEM" : "Sous-catégorie non disponible"}
                        >
                          <Wrench className="w-3.5 h-3.5 flex-shrink-0 opacity-60" />
                          <span className="truncate">{child.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {filteredTree.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-slate-400">
              Aucun groupe ne correspond à votre recherche.
            </div>
          )}
        </div>
      </div>

      <PartsTableModal
        open={!!activeSubgroup}
        subgroup={activeSubgroup}
        onClose={() => setActiveSubgroup(null)}
      />
    </div>
  );
}
