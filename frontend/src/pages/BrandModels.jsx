import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ArrowRight, MapPin, Search } from "lucide-react";
import { toast } from "sonner";
import { BRAND_BY_SLUG, logoUrl } from "@/data/brands";
import { api, formatApiError } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import ModelSilhouette from "@/components/ModelSilhouette";

export default function BrandModels() {
  const { brand } = useParams();
  const navigate = useNavigate();
  const { setVehicle } = useCart();
  const data = BRAND_BY_SLUG[brand];

  const [search, setSearch] = useState("");
  const [pendingModel, setPendingModel] = useState(null);
  const [year, setYear] = useState("2018");
  const [fuel, setFuel] = useState("Essence");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [brand]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    if (!q) return data.models;
    return data.models.filter((m) => m.name.toLowerCase().includes(q));
  }, [data, search]);

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">Marque inconnue</h2>
        <Link to="/" className="text-red-600 hover:underline text-sm">← Retour à l'accueil</Link>
      </div>
    );
  }

  const handleSelectModel = (model) => {
    setPendingModel(model);
  };

  const handleConfirm = async () => {
    if (!pendingModel) return;
    setLoading(true);
    try {
      const { data: vehicle } = await api.post("/vehicles/manual", {
        make: data.name,
        model: pendingModel.name,
        year: String(year),
        fuel,
      });
      setVehicle(vehicle);
      navigate(`/vehicule/${vehicle.vin}`);
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="brand-models-page">
      {/* Header w/ brand color band */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${data.color} 0%, ${data.color}DD 50%, #0F172A 100%)`,
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white mb-6"
            data-testid="back-to-home"
          >
            <ChevronLeft className="w-4 h-4" /> Retour aux constructeurs
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            <div
              className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-sm flex items-center justify-center p-4 shadow-2xl flex-shrink-0"
              data-testid="brand-logo-big"
            >
              <img
                src={logoUrl(data.slug)}
                alt={data.name}
                className="w-full h-full object-contain"
                onError={(e) => (e.target.style.opacity = 0)}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60 mb-2">
                <MapPin className="w-3 h-3" /> {data.country}
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight" data-testid="brand-title">
                {data.name}
              </h1>
              <p className="text-white/80 mt-2 text-sm">
                {data.models.length} modèles disponibles — sélectionnez le vôtre pour accéder au catalogue de pièces
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search filter */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Filtrer parmi ${data.models.length} modèles ${data.name}…`}
            className="flex-1 px-2 py-1.5 text-sm focus:outline-none placeholder:text-slate-400"
            data-testid="brand-models-search"
          />
        </div>
      </div>

      {/* Models grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-sm">
            Aucun modèle ne correspond à votre recherche.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {filtered.map((model) => (
              <button
                key={model.name}
                onClick={() => handleSelectModel(model)}
                className="model-card group flex flex-col items-center bg-white border border-slate-200 hover:border-[color:var(--brand-color)] rounded-sm p-4 transition-all duration-200"
                data-testid={`brand-model-${model.name.replace(/\s+/g, "-")}`}
                style={{ "--brand-color": data.color }}
              >
                <div className="w-full h-20 sm:h-24 flex items-center justify-center">
                  <ModelSilhouette
                    kind={model.kind}
                    color="#94A3B8"
                    className="model-silhouette w-full h-full max-w-[180px] transition-colors duration-200"
                  />
                </div>
                <div className="mt-3 text-center w-full">
                  <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-0.5">
                    {data.name}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-[color:var(--brand-color)] transition-colors leading-snug">
                    {model.name}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .model-card:hover .model-silhouette path {
          fill: var(--brand-color);
        }
        .model-card:hover .model-silhouette circle:nth-child(odd) {
          fill: var(--brand-color);
        }
      `}</style>

      {/* Year/Fuel selection modal */}
      {pendingModel && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPendingModel(null)}
          data-testid="model-modal"
        >
          <div
            className="bg-white w-full max-w-md rounded-sm shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.3em] mb-1" style={{ color: data.color }}>
                  {data.name}
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900">{pendingModel.name}</h3>
                <p className="text-xs text-slate-500 mt-1">Précisez l'année et le carburant pour continuer</p>
              </div>
              <button
                onClick={() => setPendingModel(null)}
                className="text-slate-400 hover:text-slate-700 text-2xl leading-none"
                aria-label="Fermer"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Année
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-red-500 rounded-sm"
                  data-testid="model-year-select"
                >
                  {Array.from({ length: 26 }, (_, i) => 2024 - i).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Carburant
                </label>
                <select
                  value={fuel}
                  onChange={(e) => setFuel(e.target.value)}
                  className="w-full border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-red-500 rounded-sm"
                  data-testid="model-fuel-select"
                >
                  {["Essence", "Diesel", "Diesel HDI", "GPL", "Hybride", "Électrique"].map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold py-3 rounded-sm transition-colors flex items-center justify-center gap-2"
                data-testid="model-confirm-btn"
              >
                {loading ? "Préparation…" : "Voir les pièces compatibles"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
