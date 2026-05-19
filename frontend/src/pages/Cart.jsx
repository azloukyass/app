import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingCart, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { api, formatApiError, formatPrice } from "@/lib/api";
import { toast } from "sonner";

export default function Cart() {
  const { items, updateQty, remove, clear, total, vehicle } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.address || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info("Connectez-vous pour valider votre commande");
      navigate("/connexion", { state: { from: "/panier" } });
      return;
    }
    if (items.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }
    if (!address.trim() || !phone.trim()) {
      toast.error("Adresse et téléphone obligatoires");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/orders", {
        items: items.map((i) => ({ ref: i.ref, quantity: i.quantity })),
        vehicle_vin: vehicle?.vin || "",
        vehicle_label: vehicle ? `${vehicle.make} ${vehicle.model}` : "",
        shipping_address: address,
        phone,
        notes,
      });
      toast.success("Commande passée avec succès !");
      clear();
      navigate("/compte");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" data-testid="cart-page">
      <h1 className="font-display text-4xl font-bold text-slate-900 tracking-tight mb-2">Mon panier</h1>
      <p className="text-slate-500 mb-8">{items.length} article(s) dans votre panier</p>

      {items.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-sm p-16 text-center" data-testid="cart-empty">
          <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="font-display text-xl font-semibold text-slate-700">Votre panier est vide</h2>
          <p className="text-slate-500 mt-2">Trouvez vos pièces grâce au numéro VIN.</p>
          <Link to="/recherche-vin" className="bn-btn-primary inline-flex mt-6" data-testid="cart-go-vin">
            Rechercher par VIN
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            {items.map((p) => (
              <div key={p.ref} className="bg-white border border-slate-200 rounded-sm p-4 flex gap-4" data-testid={`cart-item-${p.ref}`}>
                <img src={p.image} alt={p.name} className="w-24 h-24 object-cover flex-shrink-0 bg-slate-100 rounded-sm" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-mono-vin uppercase text-slate-400 tracking-widest">{p.ref} · {p.brand}</div>
                  <h3 className="font-display font-semibold text-slate-900">{p.name}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <button onClick={() => updateQty(p.ref, p.quantity - 1)} className="p-1 border border-slate-300 hover:bg-slate-100 rounded-sm" data-testid={`qty-minus-${p.ref}`}>
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-mono-vin font-semibold w-8 text-center">{p.quantity}</span>
                    <button onClick={() => updateQty(p.ref, p.quantity + 1)} className="p-1 border border-slate-300 hover:bg-slate-100 rounded-sm" data-testid={`qty-plus-${p.ref}`}>
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="text-right flex flex-col justify-between">
                  <div className="font-display font-bold text-slate-900">{formatPrice(p.price_tnd * p.quantity)}</div>
                  <button onClick={() => remove(p.ref)} className="text-slate-400 hover:text-red-600 self-end" data-testid={`cart-remove-${p.ref}`}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            <button onClick={clear} className="text-xs text-slate-500 hover:text-red-600 underline" data-testid="cart-clear">Vider le panier</button>
          </div>

          <form onSubmit={submitOrder} className="bg-white border border-slate-200 rounded-sm p-6 h-fit sticky top-24" data-testid="cart-summary">
            <h2 className="font-display font-bold text-xl text-slate-900 mb-4">Résumé</h2>

            {vehicle && (
              <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-sm text-xs">
                <div className="text-slate-500 uppercase tracking-wider mb-1">Véhicule</div>
                <div className="font-display font-semibold text-slate-900">{vehicle.make} {vehicle.model}</div>
                <div className="font-mono-vin text-slate-500">{vehicle.vin}</div>
              </div>
            )}

            <div className="space-y-2 text-sm border-t border-slate-200 pt-4">
              <div className="flex justify-between text-slate-600">
                <span>Sous-total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Livraison</span>
                <span className="text-emerald-600 font-medium">Offerte</span>
              </div>
              <div className="flex justify-between text-lg font-display font-bold pt-3 border-t border-slate-200 text-slate-900">
                <span>Total</span>
                <span data-testid="cart-total">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">Téléphone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:border-red-600 outline-none text-sm"
                  placeholder="+216 ..."
                  data-testid="cart-phone-input"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">Adresse de livraison</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:border-red-600 outline-none text-sm"
                  placeholder="Adresse complète"
                  data-testid="cart-address-input"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">Notes (optionnel)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:border-red-600 outline-none text-sm"
                  placeholder="Informations complémentaires"
                  data-testid="cart-notes-input"
                />
              </div>
            </div>

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-sm flex items-start gap-2 text-xs text-amber-900">
              <Truck className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div><strong>Paiement à la livraison</strong> · Vous réglez en espèces ou par carte à la réception.</div>
            </div>

            <button type="submit" disabled={submitting} className="mt-5 w-full bn-btn-primary disabled:opacity-60" data-testid="cart-checkout-button">
              {submitting ? "Validation..." : "Valider la commande"}
            </button>
            {!user && (
              <p className="mt-3 text-xs text-slate-500 text-center">
                <Link to="/connexion" className="text-red-600 hover:underline">Connectez-vous</Link> pour finaliser
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
