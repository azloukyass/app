import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { api, formatApiError } from "@/lib/api";
import { toast } from "sonner";
import { CategoryIcon } from "@/lib/icons";
import { useCart } from "@/context/CartContext";

const SECTION_META = {
  mecanique: { label: "Mécanique", color: "text-red-600", accent: "bg-red-50 border-red-100" },
  electrique: { label: "Électrique", color: "text-amber-600", accent: "bg-amber-50 border-amber-100" },
  carrosserie: { label: "Carrosserie", color: "text-slate-700", accent: "bg-slate-50 border-slate-200" },
};

export default function PartsCategory() {
  const { section } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { vehicle } = useCart();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/catalog/${section}`);
        setData(data);
      } catch (err) {
        toast.error(formatApiError(err));
      } finally {
        setLoading(false);
      }
    })();
  }, [section]);

  const meta = SECTION_META[section] || SECTION_META.mecanique;

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center text-slate-500">Chargement…</div>;
  if (!data) return null;

  return (
    <div data-testid={`parts-category-${section}`}>
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
            {vehicle ? (
              <Link to={`/vehicule/${vehicle.vin}`} className="hover:text-red-600 inline-flex items-center gap-1" data-testid="back-to-vehicle">
                <ChevronLeft className="w-4 h-4" /> Retour {vehicle.make} {vehicle.model}
              </Link>
            ) : (
              <Link to="/" className="hover:text-red-600 inline-flex items-center gap-1">
                <ChevronLeft className="w-4 h-4" /> Accueil
              </Link>
            )}
          </div>
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-red-600 mb-2">Catégorie</div>
          <h1 className={`font-display text-4xl sm:text-5xl font-bold tracking-tight ${meta.color}`}>{data.label}</h1>
          <p className="mt-3 text-slate-600 max-w-2xl">{data.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 bn-stagger">
          {data.categories.map((c) => (
            <Link
              key={c.slug}
              to={`/catalogue/${section}/${c.slug}`}
              className="group relative bg-white border border-slate-200 rounded-sm overflow-hidden hover:border-slate-400 hover:shadow-md transition-all"
              data-testid={`subcategory-${c.slug}`}
            >
              <div className="relative h-40 bg-slate-100 overflow-hidden">
                <img src={c.image} alt={c.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
                <div className={`absolute top-3 left-3 p-2 ${meta.accent} border rounded-sm shadow-sm`}>
                  <CategoryIcon name={c.icon} className="w-7 h-7" stroke={section === "mecanique" ? "#dc2626" : section === "electrique" ? "#d97706" : "#334155"} />
                </div>
                <div className="absolute bottom-3 right-3 bn-chip bg-white/95 text-slate-700">
                  {c.count} pièces
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display font-bold text-lg text-slate-900">{c.label}</h3>
                <div className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-red-600 group-hover:gap-2 transition-all">
                  Voir les pièces <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
