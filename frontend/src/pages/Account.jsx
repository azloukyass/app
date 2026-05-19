import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api, formatApiError, formatPrice } from "@/lib/api";
import { toast } from "sonner";
import { Package, User } from "lucide-react";

const STATUS_COLOR = {
  "En attente": "bg-amber-100 text-amber-800 border-amber-200",
  "Confirmée": "bg-blue-100 text-blue-800 border-blue-200",
  "Expédiée": "bg-purple-100 text-purple-800 border-purple-200",
  "Livrée": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Annulée": "bg-slate-100 text-slate-700 border-slate-200",
};

export default function Account() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/orders/mine");
        setOrders(data);
      } catch (err) {
        toast.error(formatApiError(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12" data-testid="account-page">
      <div className="flex items-center gap-3 mb-2">
        <User className="w-7 h-7 text-red-600" />
        <h1 className="font-display text-3xl font-bold text-slate-900">Bonjour {user?.name}</h1>
      </div>
      <p className="text-slate-500 mb-8">{user?.email}</p>

      <h2 className="font-display text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Package className="w-5 h-5" /> Mes commandes
      </h2>

      {loading ? (
        <div className="text-slate-500">Chargement…</div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-sm p-12 text-center text-slate-500" data-testid="account-no-orders">
          Aucune commande pour le moment.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="bg-white border border-slate-200 rounded-sm p-5" data-testid={`order-${o.id}`}>
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="text-[10px] font-mono-vin uppercase tracking-widest text-slate-400">Commande #{o.id.slice(0, 8)}</div>
                  <div className="text-sm text-slate-600">{new Date(o.created_at).toLocaleString("fr-FR")}</div>
                </div>
                <span className={`bn-chip ${STATUS_COLOR[o.status] || ""}`}>{o.status}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm">
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Véhicule</div>
                  <div>{o.vehicle_label || "—"} <span className="font-mono-vin text-slate-500">{o.vehicle_vin}</span></div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Livraison</div>
                  <div>{o.shipping_address}</div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {o.items.map((it) => (
                  <div key={it.ref} className="flex items-center gap-3 text-sm">
                    <img src={it.image} alt={it.name} className="w-12 h-12 object-cover rounded-sm bg-slate-100" />
                    <div className="flex-1">
                      <div className="font-medium text-slate-800">{it.name}</div>
                      <div className="text-xs text-slate-500">{it.brand} · ×{it.quantity}</div>
                    </div>
                    <div className="font-mono-vin text-slate-700">{formatPrice(it.line_total_tnd)}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm text-slate-500">{o.payment_method}</span>
                <span className="font-display font-bold text-lg text-slate-900">{formatPrice(o.total_tnd)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
