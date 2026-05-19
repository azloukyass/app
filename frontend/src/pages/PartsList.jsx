import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ShoppingCart, Plus, Check } from "lucide-react";
import { api, formatApiError, formatPrice } from "@/lib/api";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";

export default function PartsList() {
  const { section, category } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { add, items } = useCart();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/catalog/${section}/${category}`);
        setData(data);
      } catch (err) {
        toast.error(formatApiError(err));
      } finally {
        setLoading(false);
      }
    })();
  }, [section, category]);

  const isInCart = (ref) => items.some((i) => i.ref === ref);

  const addToCart = (part) => {
    add(part);
    toast.success(`${part.name} ajouté au panier`);
  };

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center text-slate-500">Chargement…</div>;
  if (!data) return null;

  return (
    <div data-testid="parts-list-page">
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link to={`/catalogue/${section}`} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-red-600 mb-3" data-testid="back-to-section">
            <ChevronLeft className="w-4 h-4" /> Retour {section}
          </Link>
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-red-600 mb-1">{section}</div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">{data.label}</h1>
          <p className="mt-2 text-slate-500">{data.parts.length} pièces disponibles</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 bn-stagger">
          {data.parts.map((p) => (
            <div key={p.ref} className="bn-card flex flex-col overflow-hidden" data-testid={`part-card-${p.ref}`}>
              <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="text-[10px] font-mono-vin uppercase text-slate-400 tracking-widest">{p.ref} · {p.brand}</div>
                <h3 className="mt-2 font-display font-semibold text-slate-900 leading-snug">{p.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.description}</p>
                <div className="mt-auto pt-4 flex items-center justify-between gap-2">
                  <div className="font-display text-lg font-bold text-slate-900">{formatPrice(p.price_tnd)}</div>
                  <button
                    onClick={() => addToCart(p)}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-sm transition-colors ${
                      isInCart(p.ref) ? "bg-emerald-600 text-white" : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                    data-testid={`add-to-cart-${p.ref}`}
                  >
                    {isInCart(p.ref) ? <><Check className="w-4 h-4" /> Ajouté</> : <><Plus className="w-4 h-4" /> Panier</>}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
