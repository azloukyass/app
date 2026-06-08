import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ArrowRight,
  Search,
  Truck,
  Shield,
  Award,
  Headphones,
  Hash,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { BRANDS, logoUrl } from "@/data/brands";
import { OilBottle, BrakeDisc, CarBattery, OilFilter, Engine, ShockAbsorber, SparkPlug } from "@/components/ProductIcons";

const POPULAR_CATEGORIES = [
  { key: "freinage", label: "Freinage", Icon: BrakeDisc, count: "1 200+ pièces" },
  { key: "huiles", label: "Huiles & Liquides", Icon: OilBottle, count: "850+ pièces" },
  { key: "moteur", label: "Moteur", Icon: Engine, count: "3 500+ pièces" },
  { key: "batterie", label: "Batterie", Icon: CarBattery, count: "320+ pièces" },
  { key: "filtres", label: "Filtres", Icon: OilFilter, count: "1 100+ pièces" },
  { key: "suspension", label: "Suspension", Icon: ShockAbsorber, count: "640+ pièces" },
];

const TRUST_BADGES = [
  { Icon: Truck, title: "Livraison rapide", sub: "Partout en Tunisie" },
  { Icon: Shield, title: "Produits originaux", sub: "Qualité garantie" },
  { Icon: Award, title: "Meilleurs prix", sub: "Offres imbattables" },
  { Icon: Headphones, title: "Support client", sub: "À votre écoute" },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { setVehicle } = useCart();
  const [vin, setVin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVin = async (e) => {
    e.preventDefault();
    const v = vin.trim().toUpperCase();
    if (v.length < 11) {
      toast.error("Le VIN doit contenir au moins 11 caractères");
      return;
    }
    setLoading(true);
    try {
      // Try TecDoc first via RapidAPI
      try {
        const { data: td } = await api.get(`/rapidapi/vin/${v}`);
        // Build a vehicle object compatible with VehicleDetail
        const vehicle = {
          vin: v,
          make: td.manu_name,
          model: td.model_name,
          year: "—",
          fuel: "—",
          engine: "—",
          trim: "—",
          source: "tecdoc",
          tecdoc_model_id: td.model_id,
        };
        setVehicle(vehicle);
        navigate(`/vehicule/${v}`);
        return;
      } catch (_) {
        // Fallback to NHTSA / WMI decoder
        const { data } = await api.post("/vin/decode", { vin: v });
        setVehicle(data);
        navigate(`/vehicule/${data.vin}`);
      }
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white" data-testid="landing-page">
      {/* Hero */}
      <section className="relative overflow-hidden bg-black" data-testid="hero-section">
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }} />
        {/* Soft red glow */}
        <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 grid lg:grid-cols-12 gap-10 items-center">
          {/* Left: Big title + small VIN form */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.4em] text-red-500 mb-4">
              <span className="w-6 h-px bg-red-500"></span> Pièces auto en Tunisie
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight">
              PIÈCES AUTO<br />
              <span className="text-red-600">ORIGINALES</span>
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/90 font-semibold">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-red-500" /> Qualité garantie</span>
              <span className="text-white/30">|</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-red-500" /> Meilleurs prix</span>
              <span className="text-white/30">|</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-red-500" /> Livraison rapide</span>
            </div>

            {/* Small VIN search */}
            <form onSubmit={handleVin} className="mt-8 max-w-xl" data-testid="hero-vin-form">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500 mb-2">
                Trouvez vos pièces · Saisissez votre VIN
              </div>
              <div className="flex bg-white rounded-sm overflow-hidden shadow-lg">
                <div className="flex items-center pl-3 text-black/40">
                  <Hash className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={vin}
                  onChange={(e) => setVin(e.target.value.toUpperCase())}
                  placeholder="Ex: VF15R0K0H48649991"
                  maxLength={17}
                  className="flex-1 px-2 py-2.5 text-sm font-mono text-black focus:outline-none placeholder:text-black/30"
                  data-testid="hero-vin-input"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 px-5 text-white text-sm font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
                  data-testid="hero-vin-submit"
                >
                  {loading ? "..." : <>Rechercher <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>
              <div className="mt-2 text-[11px] text-white/50">
                17 caractères en général · {vin.length}/17
              </div>
            </form>

            <div className="mt-8">
              <Link
                to="/recherche-vin"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold uppercase text-sm tracking-wider px-6 py-3 rounded-sm transition-colors shadow-lg shadow-red-900/30"
                data-testid="hero-cta-discover"
              >
                Découvrir nos produits <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right: Hero image / product showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[5/4] rounded-sm overflow-hidden border border-white/10 bg-gradient-to-br from-black via-zinc-900 to-black">
              {/* Background SVG composition */}
              <div className="absolute inset-0 grid grid-cols-3 gap-2 p-4 opacity-90">
                <div className="flex items-end justify-center">
                  <BrakeDisc className="w-full max-w-[180px] drop-shadow-2xl" />
                </div>
                <div className="flex items-center justify-center">
                  <Engine className="w-full max-w-[200px] drop-shadow-2xl" />
                </div>
                <div className="flex items-end justify-center">
                  <OilBottle className="w-full max-w-[150px] drop-shadow-2xl" />
                </div>
                <div className="flex items-start justify-center">
                  <OilFilter className="w-full max-w-[140px] drop-shadow-2xl" />
                </div>
                <div className="flex items-center justify-center">
                  <CarBattery className="w-full max-w-[170px] drop-shadow-2xl" />
                </div>
                <div className="flex items-start justify-center">
                  <ShockAbsorber className="w-full max-w-[120px] drop-shadow-2xl" />
                </div>
              </div>
              {/* Red shine corner */}
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-red-600/30 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-red-600/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges row */}
      <section className="bg-zinc-950 border-y border-white/10" data-testid="trust-badges">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_BADGES.map((b) => (
            <div key={b.title} className="flex items-center gap-4">
              <div className="w-14 h-14 bg-red-600/10 border border-red-600/30 rounded-full flex items-center justify-center flex-shrink-0">
                <b.Icon className="w-6 h-6 text-red-500" strokeWidth={1.8} />
              </div>
              <div>
                <div className="font-display font-bold text-white uppercase text-sm tracking-wide">{b.title}</div>
                <div className="text-xs text-white/60 mt-0.5">{b.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Catégories populaires */}
      <section className="bg-black" data-testid="popular-categories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500 mb-2">Découvrez nos catégories</div>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
                Catégories populaires
              </h2>
            </div>
            <Link to="/recherche-vin" className="text-sm font-semibold text-red-500 hover:text-red-400 inline-flex items-center gap-1">
              Voir toutes les catégories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {POPULAR_CATEGORIES.map((c) => (
              <Link
                key={c.key}
                to="/recherche-vin"
                className="group relative bg-zinc-900 border border-white/10 hover:border-red-600/60 rounded-sm overflow-hidden aspect-square flex flex-col items-center justify-center p-4 transition-all hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-red-900/30"
                data-testid={`popular-cat-${c.key}`}
              >
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-red-600/10 rounded-full blur-2xl group-hover:bg-red-600/30 transition-colors" />
                <div className="relative w-full h-2/3 flex items-center justify-center">
                  <c.Icon className="w-full h-full max-w-[80px] group-hover:scale-110 transition-transform" />
                </div>
                <div className="relative mt-2 text-center">
                  <div className="font-display font-bold text-white text-sm uppercase tracking-wide">{c.label}</div>
                  <div className="text-[10px] text-red-400 mt-0.5">{c.count}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Constructeurs / Brands */}
      <section className="bg-zinc-950 border-t border-white/10" data-testid="brands-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500 mb-2">Constructeurs</div>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
                Constructeurs automobile
              </h2>
              <p className="text-white/50 mt-2 text-sm">
                {BRANDS.length} marques · plus de {BRANDS.reduce((s, b) => s + b.models.length, 0)} modèles couverts
              </p>
            </div>
            <div className="text-xs text-white/40 italic">
              Survolez un logo pour voir la couleur de la marque
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10" data-testid="brands-grid">
            {BRANDS.map((b) => (
              <Link
                key={b.slug}
                to={`/marque/${b.slug}`}
                className="brand-card group flex flex-col items-center justify-center p-3 transition-all duration-300"
                style={{ "--brand-color": b.color }}
                data-testid={`brand-card-${b.slug}`}
              >
                <div className="brand-logo-wrap relative w-full h-20 sm:h-24 flex items-center justify-center">
                  <img
                    src={logoUrl(b.slug)}
                    alt={b.name}
                    className="brand-logo max-h-full max-w-[80%] object-contain transition-all duration-300"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = "none";
                      const fb = e.target.parentNode.querySelector(".brand-logo-fallback");
                      if (fb) fb.style.display = "block";
                    }}
                  />
                  <span className="brand-logo-fallback font-display font-bold text-white/80 group-hover:text-[color:var(--brand-color)] transition-colors text-lg" style={{ display: "none" }}>
                    {b.name}
                  </span>
                </div>
                <div className="mt-3 text-[10px] sm:text-xs font-semibold text-white/60 group-hover:text-[color:var(--brand-color)] transition-colors uppercase tracking-wider text-center truncate w-full">
                  {b.name}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <style>{`
          .brand-card { will-change: transform; }
          .brand-card .brand-logo {
            filter: grayscale(1) brightness(1.4) contrast(0.8);
            opacity: 0.55;
          }
          .brand-card:hover .brand-logo {
            filter: brightness(1.1);
            opacity: 1;
            transform: scale(1.12);
          }
        `}</style>
      </section>

      {/* Final CTA strip */}
      <section className="bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/80 mb-2">Besoin d'aide ?</div>
            <h3 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight">
              Notre équipe est à votre service
            </h3>
            <p className="text-white/90 text-sm mt-1">Du lundi au samedi · 8h00 - 20h00 · Tunis, Tunisie</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="tel:+21671123456" className="bg-black text-white font-bold uppercase text-sm tracking-wider px-6 py-3 rounded-sm hover:bg-zinc-900 transition-colors inline-flex items-center gap-2">
              <Headphones className="w-4 h-4" /> +216 71 123 456
            </a>
            <Link to="/contact" className="border border-white text-white font-bold uppercase text-sm tracking-wider px-6 py-3 rounded-sm hover:bg-white hover:text-red-600 transition-colors">
              Nous écrire
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
