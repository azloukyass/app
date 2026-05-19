import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, Check, Search } from "lucide-react";
import { api, formatApiError, formatPrice } from "@/lib/api";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { add, items } = useCart();

  useEffect(() => {
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/catalog-search", { params: { q } });
        setResults(data);
      } catch (err) {
        toast.error(formatApiError(err));
      } finally {
        setLoading(false);
      }
    })();
  }, [q]);

  const isInCart = (ref) => items.some((i) => i.ref === ref);
  const addToCart = (p) => { add(p); toast.success(`${p.name} ajouté au panier`); };

  return (
    <div data-testid="search-results-page">
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-red-600 mb-2">Recherche</div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight inline-flex items-center gap-3">
            <Search className="w-7 h-7 text-slate-400" />
            <span className="font-mono-vin">{q || "—"}</span>
          </h1>
          {!loading && (
            <p className="mt-2 text-slate-500" data-testid="search-results-count">
              {results.length} résultat(s) trouvé(s)
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="text-slate-500">Recherche en cours…</div>
        ) : results.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-sm p-16 text-center" data-testid="search-empty">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h2 className="font-display text-xl font-semibold text-slate-700">Aucune pièce trouvée</h2>
            <p className="text-slate-500 mt-2">Essayez avec une autre référence, nom ou marque.</p>
            <div className="mt-5 text-xs text-slate-400 font-mono-vin uppercase tracking-widest">Exemples : MOT-1001 · BREMBO · alternateur</div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 bn-stagger">
            {results.map((p) => (
              <div key={p.ref} className="bn-card flex flex-col overflow-hidden" data-testid={`search-result-${p.ref}`}>
                <Link to={`/catalogue/${p.section}/${p.category}`} className="block aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </Link>
                <div className="p-4 flex flex-col flex-1">
                  <div className="text-[10px] font-mono-vin uppercase text-slate-400 tracking-widest">{p.ref} · {p.brand}</div>
                  <h3 className="mt-2 font-display font-semibold text-slate-900 leading-snug">{p.name}</h3>
                  <Link to={`/catalogue/${p.section}/${p.category}`} className="mt-1 text-xs text-slate-500 hover:text-red-600">
                    {p.section_label} › {p.category_label}
                  </Link>
                  <div className="mt-auto pt-4 flex items-center justify-between gap-2">
                    <div className="font-display text-lg font-bold text-slate-900">{formatPrice(p.price_tnd)}</div>
                    <button
                      onClick={() => addToCart(p)}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-sm transition-colors ${
                        isInCart(p.ref) ? "bg-emerald-600 text-white" : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
                      data-testid={`search-add-${p.ref}`}
                    >
                      {isInCart(p.ref) ? <><Check className="w-4 h-4" /> Ajouté</> : <><Plus className="w-4 h-4" /> Panier</>}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
