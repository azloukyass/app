import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, Search, Truck, Shield, Award, ChevronRight, Hash, Zap, Wrench, CarFront, Filter, ListOrdered, ShoppingCart, Package, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";
import { useCart } from "@/context/CartContext";

const HERO_IMG =
  "https://images.pexels.com/photos/10905352/pexels-photo-10905352.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1600";

const MercedesStar = () => (
  <svg viewBox="-50 -50 100 100" className="max-h-10 max-w-[70%]" fill="none" stroke="#0f172a" strokeWidth="6">
    <circle r="44" />
    <path d="M0 -38 L0 0 L-33 19 Z M0 0 L33 19 L0 -38 Z" fill="#0f172a" stroke="none" />
    <path d="M0 0 L-33 19 L33 19 Z" fill="#0f172a" stroke="none" opacity="0.65" />
  </svg>
);

const BRAND_LOGOS = [
  { name: "Volkswagen", slug: "volkswagen" },
  { name: "Mercedes-Benz", slug: "mercedes", custom: <MercedesStar /> },
  { name: "Audi", slug: "audi" },
  { name: "BMW", slug: "bmw" },
  { name: "Peugeot", slug: "peugeot" },
  { name: "Renault", slug: "renault" },
  { name: "Citroën", slug: "citroen" },
  { name: "Toyota", slug: "toyota" },
  { name: "Hyundai", slug: "hyundai" },
  { name: "Kia", slug: "kia" },
  { name: "Dacia", slug: "dacia" },
  { name: "Ford", slug: "ford" },
];

export default function LandingPage() {
  const [vin, setVin] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setVehicle } = useCart();

  // Reset VIN input when landing page mounts (fixes back-navigation bug)
  useEffect(() => {
    setVin("");
  }, []);

  // Manual filter state
  const [catalog, setCatalog] = useState(null);
  const [fMake, setFMake] = useState("");
  const [fModel, setFModel] = useState("");
  const [fYear, setFYear] = useState("");
  const [fFuel, setFFuel] = useState("");
  const [manualLoading, setManualLoading] = useState(false);

  useEffect(() => {
    api.get("/vehicles/catalog").then((r) => setCatalog(r.data)).catch(() => {});
  }, []);

  const brands = catalog?.brands || [];
  const brandData = (fMake && catalog?.data?.[fMake]) || null;
  const models = brandData?.models || [];
  const years = brandData?.years || [];
  const fuels = brandData?.fuels || [];

  const handleManual = async (e) => {
    e.preventDefault();
    if (!fMake || !fModel || !fYear || !fFuel) {
      toast.error("Sélectionnez tous les champs");
      return;
    }
    setManualLoading(true);
    try {
      const { data } = await api.post("/vehicles/manual", {
        make: fMake, model: fModel, year: fYear, fuel: fFuel,
      });
      setVehicle(data);
      navigate(`/vehicule/${data.vin}`);
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setManualLoading(false);
    }
  };

  const handleVin = async (e) => {
    e.preventDefault();
    const v = vin.trim().toUpperCase();
    if (v.length < 11) {
      toast.error("Le VIN doit contenir au moins 11 caractères");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/vin/decode", { vin: v });
      setVehicle(data);
      navigate(`/vehicule/${data.vin}`);
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="landing-page">
      {/* Hero */}
      <section className="relative bn-grid-overlay overflow-hidden" style={{ backgroundImage: `url(${HERO_IMG})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white bn-fade-up">
              <div className="bn-chip bg-red-600/20 text-red-300 border-red-600/30 mb-6" data-testid="hero-chip">
                <Hash className="w-3 h-3" /> Identification 100% précise par VIN
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
                La bonne pièce, <br />
                <span className="text-red-500">à coup sûr.</span>
              </h1>
              <p className="mt-6 text-lg text-slate-200 font-extrabold max-w-xl leading-relaxed">
                Entrez votre numéro de châssis (VIN) et accédez instantanément à l'ensemble du catalogue de pièces compatibles avec votre véhicule — Mécanique, Électrique et Carrosserie.
              </p>
              <div className="mt-8 flex flex-wrap gap-6 text-sm">
                <span className="inline-flex items-center gap-2"><Truck className="w-4 h-4 text-red-500" /> Livraison Tunisie</span>
                <span className="inline-flex items-center gap-2"><Shield className="w-4 h-4 text-red-500" /> Qualité garantie</span>
                <span className="inline-flex items-center gap-2"><Award className="w-4 h-4 text-red-500" /> Marques premium</span>
              </div>
            </div>

            {/* VIN form card */}
            <form
              onSubmit={handleVin}
              className="bg-white rounded-sm shadow-2xl p-8 border-t-4 border-red-600 bn-fade-up"
              data-testid="vin-search-form"
            >
              <h2 className="font-display font-bold text-2xl text-slate-900">Trouvez vos pièces</h2>
              <p className="text-sm text-slate-500 mt-1">Entrez votre numéro VIN (17 caractères en général)</p>

              <label className="block mt-6 text-xs font-semibold uppercase tracking-wider text-slate-700">
                Numéro VIN
              </label>
              <div className="relative mt-2">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={vin}
                  onChange={(e) => setVin(e.target.value.toUpperCase())}
                  placeholder="WVWZZZ1KZ8W123456"
                  maxLength={17}
                  className="w-full pl-12 pr-4 py-4 text-lg font-mono-vin uppercase border-2 border-slate-300 rounded-sm focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-colors"
                  data-testid="landing-vin-input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full bn-btn-primary text-lg py-4 disabled:opacity-60 disabled:cursor-not-allowed"
                data-testid="landing-vin-submit"
              >
                {loading ? "Identification..." : (<>Valider <ArrowRight className="w-5 h-5" /></>)}
              </button>

              <div className="mt-5 pt-5 border-t border-slate-200 text-xs text-slate-500 flex items-start gap-2">
                <Search className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Le VIN se trouve sur la carte grise (champ E) ou gravé sur le châssis. Exemple test : <button type="button" onClick={() => setVin("WVWZZZ1KZ8W123456")} className="font-mono-vin text-slate-700 hover:text-red-600 underline" data-testid="vin-example-btn">WVWZZZ1KZ8W123456</button></span>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Manual vehicle filter */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center mb-8">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-red-600 mb-2 inline-flex items-center gap-2 justify-center"><Filter className="w-3.5 h-3.5" /> Sans VIN ?</div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight">Trouvez des pièces pour votre véhicule</h2>
            <p className="text-slate-500 mt-2 max-w-2xl mx-auto">Sélectionnez votre marque, modèle, année et type de carburant.</p>
          </div>

          <form onSubmit={handleManual} className="bg-white border border-slate-200 rounded-sm p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4" data-testid="manual-filter-form">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Marque</label>
              <select
                value={fMake}
                onChange={(e) => { setFMake(e.target.value); setFModel(""); setFYear(""); setFFuel(""); }}
                className="w-full px-3 py-3 border border-slate-300 rounded-sm focus:border-red-600 outline-none bg-white text-sm"
                data-testid="filter-make"
              >
                <option value="">— Choisir —</option>
                {brands.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Modèle</label>
              <select
                value={fModel}
                onChange={(e) => setFModel(e.target.value)}
                disabled={!fMake}
                className="w-full px-3 py-3 border border-slate-300 rounded-sm focus:border-red-600 outline-none bg-white text-sm disabled:bg-slate-100 disabled:text-slate-400"
                data-testid="filter-model"
              >
                <option value="">— Choisir —</option>
                {models.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Année</label>
              <select
                value={fYear}
                onChange={(e) => setFYear(e.target.value)}
                disabled={!fMake}
                className="w-full px-3 py-3 border border-slate-300 rounded-sm focus:border-red-600 outline-none bg-white text-sm disabled:bg-slate-100 disabled:text-slate-400"
                data-testid="filter-year"
              >
                <option value="">— Choisir —</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Carburant</label>
              <select
                value={fFuel}
                onChange={(e) => setFFuel(e.target.value)}
                disabled={!fMake}
                className="w-full px-3 py-3 border border-slate-300 rounded-sm focus:border-red-600 outline-none bg-white text-sm disabled:bg-slate-100 disabled:text-slate-400"
                data-testid="filter-fuel"
              >
                <option value="">— Choisir —</option>
                {fuels.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={manualLoading}
                className="w-full bn-btn-primary py-3 disabled:opacity-60"
                data-testid="filter-submit"
              >
                {manualLoading ? "…" : (<><Search className="w-4 h-4" /> Rechercher</>)}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Sections cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-red-600 mb-2">Catalogue</div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight">Trois familles, des milliers de pièces</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 bn-stagger">
          {[
            { slug: "mecanique", label: "Mécanique", desc: "Moteur, boîte, freinage, suspension, direction.", icon: Wrench, img: "https://images.pexels.com/photos/4489732/pexels-photo-4489732.jpeg?auto=compress&cs=tinysrgb&w=900&h=600" },
            { slug: "electrique", label: "Électrique", desc: "Batterie, démarrage, éclairage, faisceaux.", icon: Zap, img: "https://images.pexels.com/photos/2127733/pexels-photo-2127733.jpeg?auto=compress&cs=tinysrgb&w=900&h=600" },
            { slug: "carrosserie", label: "Carrosserie", desc: "Pare-chocs, ailes, capots, vitres, rétros.", icon: CarFront, img: "https://images.pexels.com/photos/1638459/pexels-photo-1638459.jpeg?auto=compress&cs=tinysrgb&w=900&h=600" },
          ].map((c) => (
            <Link
              key={c.slug}
              to={`/catalogue/${c.slug}`}
              className="group relative overflow-hidden rounded-sm border border-slate-200 bg-white hover:border-slate-400 transition-all"
              data-testid={`section-card-${c.slug}`}
            >
              <div className="relative h-52 overflow-hidden bg-slate-100">
                <img src={c.img} alt={c.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
                <c.icon className="absolute top-4 right-4 w-9 h-9 text-white bg-red-600 p-1.5 rounded-sm" />
              </div>
              <div className="p-6">
                <h3 className="font-display font-bold text-xl text-slate-900 mb-2">{c.label}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{c.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-red-600 group-hover:gap-2 transition-all">
                  Découvrir <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-red-600 mb-2">Comment ça marche</div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight">Votre pièce en 4 étapes simples</h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto">De l'identification du véhicule à la livraison à domicile — un processus pensé pour vous faire gagner du temps.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 bn-stagger">
            {[
              {
                n: "01",
                Icon: Hash,
                title: "Identifiez votre véhicule",
                desc: "Saisissez votre numéro VIN ou choisissez manuellement la marque, le modèle, l'année et le carburant.",
              },
              {
                n: "02",
                Icon: ListOrdered,
                title: "Choisissez la catégorie",
                desc: "Mécanique, Électrique ou Carrosserie — puis affinez par sous-famille (moteur, freinage, éclairage…).",
              },
              {
                n: "03",
                Icon: ShoppingCart,
                title: "Ajoutez au panier",
                desc: "Sélectionnez les pièces 100% compatibles, vérifiez les marques équipementiers et validez votre commande.",
              },
              {
                n: "04",
                Icon: Package,
                title: "Recevez chez vous",
                desc: "Livraison rapide partout en Tunisie. Paiement à la livraison en toute sécurité.",
              },
            ].map((s) => (
              <div key={s.n} className="relative bg-slate-50 border border-slate-200 p-6 rounded-sm group hover:border-red-600 hover:bg-white transition-all" data-testid={`step-${s.n}`}>
                <div className="absolute top-4 right-4 font-display font-bold text-3xl text-slate-200 group-hover:text-red-100 transition-colors">{s.n}</div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-sm bg-red-600 text-white mb-4">
                  <s.Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid sm:grid-cols-3 gap-4">
            {[
              { Icon: CheckCircle2, t: "Aucun risque d'erreur", s: "Compatibilité garantie via VIN ou modèle exact" },
              { Icon: Truck, t: "Livraison rapide", s: "Délais courts dans toute la Tunisie" },
              { Icon: Shield, t: "Paiement sécurisé", s: "À la livraison ou par carte bancaire" },
            ].map((p, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-sm">
                <p.Icon className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-display font-semibold text-emerald-900 text-sm">{p.t}</div>
                  <div className="text-xs text-emerald-700 mt-0.5">{p.s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-red-600 mb-2">Compatibilité</div>
            <h2 className="font-display font-bold text-3xl text-slate-900">Toutes les grandes marques</h2>
            <p className="text-slate-500 mt-2">Volkswagen, Mercedes, Audi, BMW, Peugeot, Renault et bien plus.</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {BRAND_LOGOS.map((b) => (
              <div key={b.name} className="bn-card aspect-[3/2] flex flex-col items-center justify-center text-center p-4 group" data-testid={`brand-${b.slug}`}>
                {b.custom ? b.custom : (
                  <img
                    src={`https://cdn.simpleicons.org/${b.slug}/0f172a`}
                    alt={b.name}
                    className="max-h-10 max-w-[70%] object-contain opacity-85 group-hover:opacity-100 transition-opacity duration-300"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                )}
                <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-3 font-semibold">{b.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500 mb-3">Pourquoi BENNOURI ?</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight">Le bon mécanicien commence avec la bonne pièce.</h2>
            <p className="mt-4 text-slate-300 leading-relaxed max-w-xl">
              Plus de fausses commandes, plus de pièces incompatibles. Notre système VIN garantit la pièce exacte pour votre véhicule — du joint de culasse au phare arrière.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/recherche-vin" className="bn-btn-primary" data-testid="cta-vin-search">
                Rechercher par VIN <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { v: "10k+", l: "Références" },
              { v: "48h", l: "Livraison max" },
              { v: "200+", l: "Marques" },
              { v: "98%", l: "Clients satisfaits" },
            ].map((s, i) => (
              <div key={i} className="border border-slate-700 p-6 rounded-sm bg-slate-800/50">
                <div className="font-display text-4xl font-bold text-red-500">{s.v}</div>
                <div className="text-sm text-slate-400 mt-1 uppercase tracking-wider">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
