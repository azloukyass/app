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
import { OilBottle, BrakeDisc, CarBattery, OilFilter, Engine, ShockAbsorber } from "@/components/ProductIcons";

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
        {/* Hero — full-width banner with real auto parts photo */}
        <section className="relative overflow-hidden bg-black"
                 style={{aspectRatio: "3/1"}}
                 data-testid="hero-section">
          {/* Background image — full bleed, parts on the right, dark fade to the left */}
          <div className="absolute inset-0 z-0">
            <img
                src="/body_image.jpg"
                alt="Pièces auto originales"
                className="absolute inset-0 w-full h-full object-cover object-center"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1920&q=80";
                  e.target.onerror = null;
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20"/>

          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex items-center"
               style={{minHeight: "100%"}}>
            <div className="max-w-2xl">
              <div
                  className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.4em] text-red-500 mb-4">
                <span className="w-6 h-px bg-red-500"></span> Pièces auto en Tunisie
              </div>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.95] tracking-tight text-white">
                PIÈCES AUTO<br/>
                <span className="text-red-600">ORIGINALES</span>
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white font-semibold">
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-red-500"/> Qualité garantie</span>
                <span className="text-white/40">|</span>
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-red-500"/> Meilleurs prix</span>
                <span className="text-white/40">|</span>
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-red-500"/> Livraison rapide</span>
              </div>

              {/* VIN search */}
              <form onSubmit={handleVin} className="mt-8 max-w-xl" data-testid="hero-vin-form">
                <div
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-red-500 mb-3">
                  <span className="w-4 h-px bg-red-500"></span>
                  <Hash className="w-3 h-3"/>
                  Trouvez vos pièces par VIN
                </div>
                <div
                    className="group flex items-stretch bg-white rounded-sm overflow-hidden shadow-2xl shadow-red-900/40 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-red-500 transition-all">
                  <div className="flex items-center pl-4 pr-2 text-black/30 border-r border-zinc-100">
                    <Hash className="w-4 h-4"/>
                  </div>
                  <input
                      type="text"
                      value={vin}
                      onChange={(e) => setVin(e.target.value.toUpperCase())}
                      placeholder="VF15R0K0H48649991"
                      maxLength={17}
                      className="flex-1 px-3 py-3 text-sm font-mono tracking-wider text-black focus:outline-none placeholder:text-black/25"
                      data-testid="hero-vin-input"
                  />
                  <button
                      type="submit"
                      disabled={loading}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 px-6 text-white text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-2 group-focus-within:bg-red-700"
                      data-testid="hero-vin-submit"
                  >
                    {loading ? (
                        <>
                          <span
                              className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                          Recherche
                        </>
                    ) : (
                        <>
                          <Search className="w-4 h-4"/>
                          Rechercher
                        </>
                    )}
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-white/60">17 caractères en général · <span
                      className="text-red-400 font-semibold">{vin.length}/17</span></span>
                  <a
                      href="#brands-section"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById("brands-section")?.scrollIntoView({behavior: "smooth", block: "start"});
                      }}
                      className="text-red-400 hover:text-red-300 font-semibold uppercase tracking-wider"
                      data-testid="hero-brand-link"
                  >
                    Recherche par marque →
                  </a>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Trust badges row — WHITE bg, polished marker badges */}
        <section className="bg-zinc-900 text-white" data-testid="trust-badges">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 divide-x-0 sm:divide-x divide-zinc-700">

              {/* Card 1 — Promo */}
              <div className="relative flex items-center gap-4 p-6 overflow-hidden">
                <img src="/brake_disc.jpg" alt=""
                     className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-20"/>
                <div className="relative z-10">
                  <div className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Promo du mois</div>
                  <div className="text-3xl font-black text-red-500">-20%</div>
                  <div className="text-xs text-zinc-400 uppercase mt-1">Sur une sélection<br/>de pièces</div>
                  <Link to="/recherche-vin"
                        className="mt-3 inline-block bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 transition-colors">
                    Profiter
                  </Link>
                </div>
              </div>

              {/* Card 2 — Livraison */}
              <div className="relative flex items-center gap-4 p-6 overflow-hidden">
                <img src="/truck.jpg" alt="" className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-20"/>
                <div className="relative z-10">
                  <div className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Livraison</div>
                  <div className="text-3xl font-black text-red-500">EN 24H</div>
                  <div className="text-xs text-zinc-400 uppercase mt-1">Sur toute<br/>la Tunisie</div>
                  <Link to="/contact"
                        className="mt-3 inline-block bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 transition-colors">
                    En savoir +
                  </Link>
                </div>
              </div>

              {/* Card 3 — Paiement */}
              <div className="relative flex items-center gap-4 p-6 overflow-hidden">
                <img src="/secure.jpg" alt="" className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-20"/>
                <div className="relative z-10">
                  <div className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Paiement</div>
                  <div className="text-3xl font-black text-red-500">SÉCURISÉ</div>
                  <div className="text-xs text-zinc-400 uppercase mt-1">100% sûr</div>
                  <Link to="/contact"
                        className="mt-3 inline-block bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 transition-colors">
                    En savoir +
                  </Link>
                </div>
              </div>

              {/* Card 4 — Support */}
              <div className="relative flex items-center gap-4 p-6 overflow-hidden">
                <img src="/headphones.jpg" alt=""
                     className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-20"/>
                <div className="relative z-10">
                  <div className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Besoin d'aide ?</div>
                  <div className="text-lg font-black text-white leading-tight uppercase">Notre équipe est<br/>à votre
                    disposition
                  </div>
                  <div className="text-red-500 font-bold text-sm mt-1">☎ +216 54 643 643</div>
                  <Link to="/contact"
                        className="mt-3 inline-block bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 transition-colors">
                    Contacter
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>
        {/* Catégories populaires — WHITE bg */}
        <section className="bg-white text-black" data-testid="popular-categories">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-600 mb-2">Découvrez nos
                  catégories
                </div>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-black tracking-tight uppercase">
                  Catégories populaires
                </h2>
              </div>
              <Link to="/recherche-vin"
                    className="text-sm font-semibold text-red-600 hover:text-red-700 inline-flex items-center gap-1">
                Voir toutes les catégories <ArrowRight className="w-4 h-4"/>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {POPULAR_CATEGORIES.map((c) => (
                  <Link
                      key={c.key}
                      to="/recherche-vin"
                      className="group relative bg-zinc-50 border border-zinc-200 hover:border-red-600 rounded-sm overflow-hidden aspect-square flex flex-col items-center justify-center p-4 transition-all hover:bg-white hover:shadow-xl"
                      data-testid={`popular-cat-${c.key}`}
                  >
                    <div
                        className="absolute -right-4 -bottom-4 w-20 h-20 bg-red-600/0 group-hover:bg-red-600/10 rounded-full blur-2xl transition-colors"/>
                    <div className="relative w-full h-2/3 flex items-center justify-center">
                      <c.Icon className="w-full h-full max-w-[80px] group-hover:scale-110 transition-transform"/>
                    </div>
                    <div className="relative mt-2 text-center">
                      <div className="font-display font-bold text-black text-sm uppercase tracking-wide">{c.label}</div>
                      <div className="text-[10px] text-red-600 mt-0.5 font-semibold">{c.count}</div>
                    </div>
                  </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Constructeurs / Brands — WHITE bg */}
        <section id="brands-section" className="bg-zinc-50 text-black border-y border-zinc-200"
                 data-testid="brands-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-600 mb-2">Constructeurs</div>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-black tracking-tight uppercase">
                  Constructeurs automobile
                </h2>
                <p className="text-zinc-600 mt-2 text-sm">
                  {BRANDS.length} marques · plus de {BRANDS.reduce((s, b) => s + b.models.length, 0)} modèles couverts
                </p>
              </div>
            </div>

            <div
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10"
                data-testid="brands-grid">
              {BRANDS.map((b) => (
                  <Link
                      key={b.slug}
                      to={`/marque/${b.slug}`}
                      className="brand-card-light group flex flex-col items-center justify-center p-3 transition-all duration-300"
                      style={{"--brand-color": b.color}}
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
                      <span
                          className="brand-logo-fallback font-display font-bold text-zinc-700 group-hover:text-[color:var(--brand-color)] transition-colors text-lg"
                          style={{display: "none"}}>
                    {b.name}
                  </span>
                    </div>
                    <div
                        className="mt-3 text-[10px] sm:text-xs font-semibold text-zinc-600 group-hover:text-[color:var(--brand-color)] transition-colors uppercase tracking-wider text-center truncate w-full">
                      {b.name}
                    </div>
                  </Link>
              ))}
            </div>
          </div>

          <style>{`
          .brand-card-light .brand-logo {
            filter: grayscale(1) brightness(0.7);
            opacity: 0.6;
          }
          .brand-card-light:hover .brand-logo {
            filter: none;
            opacity: 1;
            transform: scale(1.12);
          }
        `}</style>
        </section>

        {/* Final CTA strip — RED */}
        <section className="bg-red-600 text-white">
          <div
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/80 mb-2">Besoin d&apos;aide
                ?
              </div>
              <h3 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight">
                Notre équipe est à votre service
              </h3>
              <p className="text-white/90 text-sm mt-1">Du lundi au samedi · 8h00 - 20h00 · Tunis, Tunisie</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="tel:+21671123456"
                 className="bg-black text-white font-bold uppercase text-sm tracking-wider px-6 py-3 rounded-sm hover:bg-zinc-900 transition-colors inline-flex items-center gap-2">
                <Headphones className="w-4 h-4"/> +216 54 643 643
              </a>
              <Link to="/contact"
                    className="border-2 border-white text-white font-bold uppercase text-sm tracking-wider px-6 py-3 rounded-sm hover:bg-white hover:text-red-600 transition-colors">
                Nous écrire
              </Link>
            </div>
          </div>
        </section>
      </div>
  );
}
