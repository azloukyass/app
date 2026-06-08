import { useState } from "react";
import { Search, X, Loader2, CheckCircle2, XCircle, Package, Tag, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";

function formatPrice(n) {
  if (n == null) return "—";
  const v = Number(n);
  const whole = Math.floor(v);
  const dec = Math.round((v - whole) * 1000)
    .toString()
    .padStart(3, "0");
  return { whole: whole.toLocaleString("fr-FR"), dec };
}

function ResultsModal({ open, onClose, query, items, loading, error }) {
  const [designation, setDesignation] = useState("");
  const [fournisseur, setFournisseur] = useState("");
  const [marque, setMarque] = useState("");
  const [dispo, setDispo] = useState("tous");
  const [sortPriceAsc, setSortPriceAsc] = useState(null);
  const [qty, setQty] = useState({});
  const { add: addToCart } = useCart();
  const navigate = useNavigate();

  if (!open) return null;

  let filtered = items || [];
  if (designation.trim())
    filtered = filtered.filter((i) => i.designation?.toLowerCase().includes(designation.toLowerCase()));
  if (fournisseur.trim())
    filtered = filtered.filter((i) => i.fournisseur?.toLowerCase().includes(fournisseur.toLowerCase()));
  if (marque.trim())
    filtered = filtered.filter((i) => i.modele?.toLowerCase().includes(marque.toLowerCase()));
  if (dispo === "stock") filtered = filtered.filter((i) => i.in_stock);
  if (dispo === "hors") filtered = filtered.filter((i) => !i.in_stock);
  if (sortPriceAsc !== null) {
    filtered = [...filtered].sort((a, b) => {
      const pa = a.prix_tnd ?? Infinity;
      const pb = b.prix_tnd ?? Infinity;
      return sortPriceAsc ? pa - pb : pb - pa;
    });
  }

  const adjustQty = (ref, delta) => {
    setQty((s) => ({ ...s, [ref]: Math.max(0, (s[ref] || 0) + delta) }));
  };

  const handleAddToCart = (item) => {
    if (!item.in_stock) {
      toast.error("Article hors stock");
      return;
    }
    const wantedQty = Math.max(1, qty[item.reference] || 1);
    const safeQty = Math.min(wantedQty, item.stock || wantedQty);
    addToCart(
      {
        ref: item.reference,
        name: item.designation || item.reference,
        brand: item.fournisseur || "",
        image: "",
        price_tnd: item.prix_tnd,
        source: "fadpro",
      },
      safeQty
    );
    toast.success(`${safeQty} × ${item.reference} ajouté au panier`);
    setQty((s) => ({ ...s, [item.reference]: 0 }));
  };

  const goToCart = () => {
    onClose();
    navigate("/panier");
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start sm:items-center justify-center p-2 sm:p-6 overflow-y-auto"
      onClick={onClose}
      data-testid="fadpro-modal"
    >
      <div
        className="bg-white w-full max-w-7xl rounded-sm shadow-2xl border border-slate-200 my-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header banner — black/red gradient */}
        <div className="relative bg-gradient-to-r from-black via-zinc-900 to-red-900 px-6 py-5 overflow-hidden">
          <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-72 h-72 bg-red-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-sm bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/40 flex-shrink-0">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-400 mb-0.5">FadPro · Catalogue local</div>
                <h2 className="font-display text-xl sm:text-2xl font-black text-white tracking-tight uppercase" data-testid="fadpro-modal-title">
                  Résultats de recherche
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-sm transition-colors"
              aria-label="Fermer"
              data-testid="fadpro-modal-close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top filter bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 inline-flex items-center gap-1.5">
              <span className="w-3 h-px bg-red-500" /> Filtres rapides
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={query || ""}
                readOnly
                placeholder="Référence ou Origine"
                className="w-full pl-9 pr-3 py-2 text-sm text-slate-700 border border-slate-300 rounded-sm bg-white"
              />
            </div>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="Désignation"
              className="px-3 py-2 text-sm text-slate-900 border border-slate-300 rounded-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 bg-white"
            />
            <input
              type="text"
              value={fournisseur}
              onChange={(e) => setFournisseur(e.target.value)}
              placeholder="Fournisseur"
              className="px-3 py-2 text-sm text-slate-900 border border-slate-300 rounded-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 bg-white"
            />
            <input
              type="text"
              value={marque}
              onChange={(e) => setMarque(e.target.value)}
              placeholder="Modèle"
              className="px-3 py-2 text-sm text-slate-900 border border-slate-300 rounded-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 bg-white"
            />
          </div>
        </div>

        {/* Applied filter chip */}
        {query && (
          <div className="px-6 pt-4">
            <div className="bg-white border-l-4 border-red-600 pl-4 py-3 pr-4 rounded-sm shadow-sm flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Filtre appliqué :
                </div>
                <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-sm">
                  <Tag className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-sm font-mono-vin font-semibold text-slate-800">
                    Référence: {query}
                  </span>
                </div>
              </div>
              <div className="text-xs text-slate-500" data-testid="fadpro-results-count">
                {loading ? "Recherche…" : `${filtered.length} résultat(s) trouvé(s)`}
              </div>
            </div>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-6">
          {loading && (
            <div className="flex items-center justify-center py-20 text-slate-500">
              <Loader2 className="w-7 h-7 animate-spin mr-3 text-red-600" />
              <span>Recherche chez FadPro en cours…</span>
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-sm text-sm" data-testid="fadpro-error">
              {error}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-16 text-slate-500" data-testid="fadpro-empty">
              <Package className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-sm">Aucun article trouvé pour cette référence.</p>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <>
              <div className="overflow-x-auto border border-slate-200 rounded-sm">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold border-b border-slate-200 whitespace-nowrap">Référence</th>
                    <th className="text-left px-4 py-3 font-semibold border-b border-slate-200 whitespace-nowrap">Fournisseur</th>
                    <th className="text-left px-4 py-3 font-semibold border-b border-slate-200">Désignation</th>
                    <th className="text-left px-4 py-3 font-semibold border-b border-slate-200">Modèle</th>
                    <th className="text-left px-4 py-3 font-semibold border-b border-slate-200 whitespace-nowrap">
                      Disponibilité
                    </th>
                    <th className="text-left px-4 py-3 font-semibold border-b border-slate-200 whitespace-nowrap">
                      <button
                        onClick={() => setSortPriceAsc(sortPriceAsc === true ? false : true)}
                        className="inline-flex items-center gap-1 hover:text-red-600"
                      >
                        Prix
                        <span className="text-xs">{sortPriceAsc === true ? "↑" : sortPriceAsc === false ? "↓" : "↕"}</span>
                      </button>
                    </th>
                    <th className="text-left px-4 py-3 font-semibold border-b border-slate-200 whitespace-nowrap">
                      <select
                        value={dispo}
                        onChange={(e) => setDispo(e.target.value)}
                        className="text-xs border border-slate-300 px-2 py-1 rounded-sm bg-white"
                      >
                        <option value="tous">Tous</option>
                        <option value="stock">En stock</option>
                        <option value="hors">Hors stock</option>
                      </select>
                    </th>
                    <th className="text-left px-4 py-3 font-semibold border-b border-slate-200 whitespace-nowrap">Quantité</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, i) => {
                    const p = formatPrice(item.prix_tnd);
                    const highlighted = i === 0 && item.in_stock;
                    return (
                      <tr
                        key={`${item.reference}-${i}`}
                        className={`border-b border-slate-100 transition-colors ${
                          highlighted ? "bg-amber-200/60" : "hover:bg-slate-50"
                        }`}
                        data-testid={`fadpro-row-${i}`}
                      >
                        <td className="px-4 py-3 font-mono-vin font-semibold text-slate-900 whitespace-nowrap" data-testid={`fadpro-ref-${i}`}>
                          {item.reference}
                        </td>
                        <td className="px-4 py-3 text-slate-700 whitespace-nowrap font-semibold">
                          {item.fournisseur || "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-700">{item.designation || "—"}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs leading-relaxed">{item.modele || "—"}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {item.in_stock ? (
                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-sm">
                              <CheckCircle2 className="w-3 h-3" /> En Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-1 rounded-sm">
                              <XCircle className="w-3 h-3" /> Hors Stock
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-mono-vin" data-testid={`fadpro-price-${i}`}>
                          {p === "—" ? (
                            <span className="text-slate-400">—</span>
                          ) : (
                            <>
                              <span className="text-lg font-bold text-green-700">{p.whole}</span>
                              <span className="text-xs text-slate-400">.{p.dec}</span>
                              <span className="text-[10px] text-slate-400 ml-1">DT</span>
                            </>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500">
                          {item.in_stock ? `${item.stock} dispo.` : "—"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className={`inline-flex items-center border border-slate-300 rounded-sm ${!item.in_stock && "opacity-40"}`}>
                              <button
                                onClick={() => item.in_stock && adjustQty(item.reference, -1)}
                                disabled={!item.in_stock}
                                className="px-2 py-1 hover:bg-slate-100 transition-colors disabled:cursor-not-allowed"
                              >
                                –
                              </button>
                              <span className="px-3 text-sm font-semibold w-8 text-center">{qty[item.reference] || 0}</span>
                              <button
                                onClick={() => item.in_stock && adjustQty(item.reference, +1)}
                                disabled={!item.in_stock}
                                className="px-2 py-1 hover:bg-slate-100 transition-colors disabled:cursor-not-allowed"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => handleAddToCart(item)}
                              disabled={!item.in_stock || !item.prix_tnd}
                              className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs font-semibold px-2.5 py-1.5 rounded-sm transition-colors"
                              data-testid={`fadpro-add-cart-${i}`}
                              title="Ajouter au panier"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span className="hidden xl:inline">Panier</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-xs text-slate-500">
                Sélectionnez une quantité puis cliquez sur <ShoppingCart className="inline w-3 h-3 mx-1" /> pour ajouter au panier.
              </div>
              <button
                onClick={goToCart}
                className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-sm transition-colors inline-flex items-center gap-2"
                data-testid="fadpro-go-cart"
              >
                <ShoppingCart className="w-4 h-4" />
                Passer la commande
              </button>
            </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FadProSearch({ inline = true }) {
  const [reference, setReference] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ref = reference.trim();
    if (ref.length < 2) {
      toast.error("Saisissez une référence valide");
      return;
    }
    if (!user) {
      toast.error("Connectez-vous pour rechercher une référence");
      navigate("/connexion");
      return;
    }
    setOpen(true);
    setLoading(true);
    setError("");
    setItems([]);
    setSubmittedQuery(ref);
    try {
      const { data } = await api.get(`/fadpro/search`, { params: { ref } });
      setItems(data.items || []);
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={inline ? "flex items-center gap-2" : "space-y-3"} data-testid="fadpro-search-form">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Référence d'origine (ex: 813317)"
            className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 font-mono-vin"
            data-testid="fadpro-search-input"
          />
        </div>
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-sm transition-colors inline-flex items-center gap-2 whitespace-nowrap"
          data-testid="fadpro-search-btn"
        >
          <Search className="w-4 h-4" /> Rechercher
        </button>
      </form>
      <ResultsModal
        open={open}
        onClose={() => setOpen(false)}
        query={submittedQuery}
        items={items}
        loading={loading}
        error={error}
      />
    </>
  );
}
