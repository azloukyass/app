import { useEffect, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight, Headphones, ShieldCheck, Truck, Wallet } from "lucide-react";
import { api, formatPrice } from "@/lib/api";

function formatDateFr(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}

function deliveryLabel(code) {
  return {
    domicile: "24h - 48h",
    express: "Le jour même",
    relais: "24h - 48h",
  }[code] || "24h - 48h";
}

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (order) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get(`/orders/mine`);
        const found = (data || []).find((o) => o.id === orderId);
        if (!cancelled && found) setOrder(found);
      } catch (_) { /* ignore – fallback shows error message */ }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [orderId, order]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-black text-white">
        <p className="text-sm text-slate-300">Chargement de votre confirmation…</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-black text-white px-4 text-center">
        <p className="text-sm text-slate-300 mb-4">Commande introuvable.</p>
        <button onClick={() => navigate("/")} className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-sm font-bold uppercase text-sm">Retour à l&apos;accueil</button>
      </div>
    );
  }

  const orderNum = order.order_number || `BC${(order.id || "").slice(0, 6).toUpperCase()}`;

  return (
    <div className="bg-black text-white" data-testid="order-confirmation-page">
      {/* Hero confirmation banner */}
      <section className="relative overflow-hidden min-h-[640px] flex items-center">
        {/* Truck background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=2000&q=80"
            alt="Livraison BENOURI"
            className="absolute inset-0 w-full h-full object-cover object-center"
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/10" />
          <div className="absolute inset-y-0 left-0 w-1/2 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
          <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          <div className="max-w-2xl">
            {/* Success badge */}
            <div className="flex items-center gap-5 mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-red-600 flex items-center justify-center shadow-2xl shadow-red-900/60 flex-shrink-0">
                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight uppercase text-white leading-[1]" data-testid="confirmation-title">
                  Merci pour votre commande&nbsp;!
                </h1>
                <p className="text-sm sm:text-base text-slate-300 mt-3">
                  Votre commande a été passée avec succès.
                </p>
              </div>
            </div>

            {/* Order number card */}
            <div className="bg-black/70 backdrop-blur-sm border border-red-600/40 rounded-sm p-5 sm:p-6 mb-6 max-w-md">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-400 mb-2">Numéro de commande</div>
              <div className="font-mono-vin font-black text-3xl sm:text-4xl text-white tracking-wider" data-testid="confirmation-order-number">
                #{orderNum}
              </div>
              <div className="text-xs text-slate-400 mt-3">
                Un email de confirmation vous a été envoyé.
              </div>
            </div>

            {/* Info grid: Date | Livraison | Paiement | Total */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 border border-white/20 rounded-sm overflow-hidden max-w-2xl mb-7">
              <Cell label="Date" value={formatDateFr(order.created_at)} />
              <Cell label="Livraison" value={deliveryLabel(order.delivery_method)} />
              <Cell label="Paiement" value={order.payment_method || "À la livraison"} />
              <Cell label="Total" value={formatPrice(order.total_tnd)} highlight />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/compte"
                className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-sm tracking-wider px-6 py-3.5 rounded-sm transition-colors shadow-lg shadow-red-900/30"
                data-testid="confirmation-track-btn"
              >
                Suivre ma commande <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center border-2 border-white/30 hover:border-white text-white font-bold uppercase text-sm tracking-wider px-6 py-3.5 rounded-sm transition-colors"
                data-testid="confirmation-home-btn"
              >
                Retour à l&apos;accueil
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip dark variant */}
      <section className="bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4">
          {[
            { Icon: Truck, title: "Livraison rapide", sub: "Partout en Tunisie" },
            { Icon: Wallet, title: "Paiement à la livraison", sub: "Payez à réception" },
            { Icon: Headphones, title: "Support client", sub: "À votre écoute" },
            { Icon: ShieldCheck, title: "Produits originaux", sub: "Qualité garantie" },
          ].map((b) => (
            <div key={b.title} className="flex items-center gap-3">
              <div className="w-12 h-14 flex items-center justify-center text-red-500">
                <svg viewBox="0 0 64 80" className="w-10 h-12">
                  <path
                    d="M32 4 C 44 4, 56 18, 56 38 C 56 56, 44 74, 32 76 C 20 74, 8 56, 8 38 C 8 18, 20 4, 32 4 Z"
                    fill="none" stroke="currentColor" strokeWidth="2.5"
                  />
                </svg>
                <b.Icon className="w-5 h-5 -ml-9" />
              </div>
              <div>
                <div className="font-display font-black uppercase text-sm text-white">{b.title}</div>
                <div className="text-xs text-slate-400">{b.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Cell({ label, value, highlight }) {
  return (
    <div className="bg-black/80 backdrop-blur-sm px-4 py-3">
      <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-1">{label}</div>
      <div className={`font-display font-black text-sm sm:text-base ${highlight ? "text-red-500" : "text-white"}`}>
        {value}
      </div>
    </div>
  );
}
