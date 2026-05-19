import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Wrench, Zap, CarFront, ArrowRight, ChevronLeft, Car, Fuel, Calendar, Hash } from "lucide-react";
import { api, formatApiError } from "@/lib/api";
import { useCart } from "@/context/CartContext";

const SECTIONS = [
  { slug: "mecanique", label: "Mécanique", desc: "Moteur, transmission, freinage, suspension", Icon: Wrench, color: "from-red-600 to-red-700", img: "https://images.unsplash.com/photo-1632733711450-c0c08aacaaca?w=900&h=600&fit=crop" },
  { slug: "electrique", label: "Électrique", desc: "Batterie, démarrage, éclairage, faisceaux", Icon: Zap, color: "from-amber-500 to-amber-600", img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&h=600&fit=crop" },
  { slug: "carrosserie", label: "Carrosserie", desc: "Pare-chocs, ailes, capots, vitres, rétros", Icon: CarFront, color: "from-slate-700 to-slate-900", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&h=600&fit=crop" },
];

export default function VehicleDetail() {
  const { vin } = useParams();
  const navigate = useNavigate();
  const { vehicle, setVehicle } = useCart();
  const [loading, setLoading] = useState(!vehicle || vehicle.vin !== vin);

  useEffect(() => {
    if (!vehicle || vehicle.vin !== vin) {
      (async () => {
        setLoading(true);
        try {
          const { data } = await api.post("/vin/decode", { vin });
          setVehicle(data);
        } catch (err) {
          toast.error(formatApiError(err));
          navigate("/recherche-vin");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [vin, vehicle, setVehicle, navigate]);

  if (loading || !vehicle) {
    return <div className="min-h-[60vh] flex items-center justify-center text-slate-500">Chargement du véhicule…</div>;
  }

  return (
    <div data-testid="vehicle-detail-page">
      {/* Breadcrumb / vehicle header */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link to="/recherche-vin" className="inline-flex items-center gap-1 text-sm text-slate-300 hover:text-white mb-4" data-testid="back-to-vin-search">
            <ChevronLeft className="w-4 h-4" /> Nouvelle recherche
          </Link>

          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider mb-4" data-testid="vehicle-breadcrumb">
            <span className="bn-chip bg-white/10 text-white border-white/20"><Car className="w-3 h-3" /> {vehicle.make}</span>
            <span className="text-slate-500">/</span>
            <span className="bn-chip bg-white/10 text-white border-white/20">{vehicle.model}</span>
            <span className="text-slate-500">/</span>
            <span className="bn-chip bg-white/10 text-white border-white/20"><Calendar className="w-3 h-3" /> {vehicle.year || "—"}</span>
            <span className="text-slate-500">/</span>
            <span className="bn-chip bg-white/10 text-white border-white/20"><Fuel className="w-3 h-3" /> {vehicle.fuel}</span>
            <span className="text-slate-500">/</span>
            <span className="bn-chip bg-red-600/30 text-red-200 border-red-500/40 font-mono-vin"><Hash className="w-3 h-3" /> {vehicle.vin}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
            {vehicle.make} {vehicle.model}
          </h1>
          <p className="text-slate-300 mt-2">
            {vehicle.engine && vehicle.engine !== "—" ? `Moteur ${vehicle.engine} · ` : ""}
            {vehicle.trim && vehicle.trim !== "—" ? `Finition ${vehicle.trim} · ` : ""}
            Choisissez la famille de pièces ci-dessous
          </p>
        </div>
      </div>

      {/* 3 category cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-6 bn-stagger">
          {SECTIONS.map(({ slug, label, desc, Icon, color, img }) => (
            <Link
              key={slug}
              to={`/catalogue/${slug}`}
              className="group relative overflow-hidden border border-slate-200 bg-white hover:border-slate-400 transition-all"
              data-testid={`vehicle-section-${slug}`}
            >
              <div className="relative h-64 overflow-hidden">
                <img src={img} alt={label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className={`absolute inset-0 bg-gradient-to-tr ${color} opacity-70`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon className="w-24 h-24 text-white drop-shadow-2xl" strokeWidth={1.4} />
                </div>
              </div>
              <div className="p-6">
                <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400 mb-2">Famille de pièces</div>
                <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">{label}</h2>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-red-600 group-hover:gap-3 transition-all">
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
