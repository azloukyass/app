import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  MapPin,
  UserCircle,
  Lock,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Truck,
  Mail,
  Phone,
  Calendar,
  ClipboardCheck,
  Headphones,
  Edit2,
  ShoppingCart,
  Star,
  Package,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api, formatApiError, formatPrice } from "@/lib/api";

const STATUS_COLOR = {
  "En attente": "bg-amber-100 text-amber-800 border-amber-200",
  "Confirmée": "bg-blue-100 text-blue-800 border-blue-200",
  "Expédiée": "bg-purple-100 text-purple-800 border-purple-200",
  "Livrée": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Annulée": "bg-slate-100 text-slate-700 border-slate-200",
};

const STAT_DEFS = [
  { key: "orders", label: "Commandes", Icon: ShoppingBag, bg: "bg-red-50", iconColor: "text-red-600", link: "/compte/commandes" },
  { key: "in_progress", label: "En cours", Icon: ClipboardCheck, bg: "bg-emerald-50", iconColor: "text-emerald-600", link: "/compte/commandes?status=encours" },
  { key: "delivered", label: "Livrées", Icon: Truck, bg: "bg-sky-50", iconColor: "text-sky-600", link: "/compte/commandes?status=livrees" },
  { key: "favorites", label: "Favoris", Icon: Heart, bg: "bg-amber-50", iconColor: "text-amber-600", link: "/compte/favoris" },
];

const MENU = [
  { key: "dashboard", label: "Tableau de bord", Icon: LayoutDashboard, view: "dashboard" },
  { key: "orders", label: "Mes commandes", Icon: ShoppingBag, view: "orders" },
  { key: "favorites", label: "Mes favoris", Icon: Heart, view: "favorites" },
  { key: "addresses", label: "Mes adresses", Icon: MapPin, view: "addresses" },
  { key: "personal", label: "Mes informations personnelles", Icon: UserCircle, view: "personal" },
  { key: "password", label: "Changer le mot de passe", Icon: Lock, view: "password" },
];

const RECOMMENDED = [
  { ref: "shell-helix-5w30", name: "Huile Moteur Shell Helix Ultra", sub: "5W-30 - 4L", rating: 4.5, reviews: 128, price: 85, img: "https://images.unsplash.com/photo-1635260629849-3bba29e9c4dc?auto=format&fit=crop&w=400&q=70" },
  { ref: "brembo-kit-front", name: "Kit Freinage Brembo", sub: "Avant - Disques + Plaquettes", rating: 4.5, reviews: 96, price: 245, img: "https://images.unsplash.com/photo-1583836631265-058486cd0b29?auto=format&fit=crop&w=400&q=70" },
  { ref: "bosch-s5-a08", name: "Batterie Bosch S5 A08", sub: "70Ah - 12V", rating: 4.5, reviews: 74, price: 310, img: "https://images.unsplash.com/photo-1614026480418-bd11fde6f8d6?auto=format&fit=crop&w=400&q=70" },
  { ref: "bosch-kit-filtres", name: "Kit Filtres BOSCH", sub: "Clio 4 1.5 dCi", rating: 4.5, reviews: 53, price: 68, img: "https://images.unsplash.com/photo-1635764186984-7cea30c2d2cf?auto=format&fit=crop&w=400&q=70" },
  { ref: "kyb-amortisseur", name: "Amortisseur KYB", sub: "Avant - Gaz", rating: 4.5, reviews: 41, price: 120, img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=400&q=70" },
];

function StarRating({ value = 4.5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= Math.round(value) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
        />
      ))}
    </div>
  );
}

function StatCard({ def, value }) {
  return (
    <Link
      to={def.link}
      className="bg-white border border-slate-100 rounded-md p-5 hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-4"
      data-testid={`stat-${def.key}`}
    >
      <div className={`${def.bg} rounded-md w-14 h-14 flex items-center justify-center flex-shrink-0`}>
        <def.Icon className={`w-6 h-6 ${def.iconColor}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs text-slate-500 font-medium">{def.label}</div>
        <div className="font-display text-3xl font-bold text-slate-900 leading-none mt-1">{value}</div>
        <div className="text-[11px] text-slate-400 mt-1">
          {def.key === "favorites" ? "Voir tous" : "Voir toutes"}
        </div>
      </div>
    </Link>
  );
}

function RecommendedCarousel() {
  const [start, setStart] = useState(0);
  const visible = 5;
  const canPrev = start > 0;
  const canNext = start + visible < RECOMMENDED.length;
  const slice = RECOMMENDED.slice(start, start + visible);

  return (
    <div className="bg-white border border-slate-100 rounded-md p-6" data-testid="recommended-section">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-lg font-bold text-slate-900">Recommandé pour vous</h3>
        <div className="flex gap-1">
          <button
            onClick={() => canPrev && setStart((s) => s - 1)}
            disabled={!canPrev}
            className="w-8 h-8 border border-slate-200 rounded-sm flex items-center justify-center hover:bg-slate-50 disabled:opacity-30"
            data-testid="reco-prev"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => canNext && setStart((s) => s + 1)}
            disabled={!canNext}
            className="w-8 h-8 border border-slate-200 rounded-sm flex items-center justify-center hover:bg-slate-50 disabled:opacity-30"
            data-testid="reco-next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {slice.map((p) => (
          <div key={p.ref} className="border border-slate-100 rounded-md overflow-hidden hover:shadow-sm transition-all">
            <div className="h-32 bg-slate-50 flex items-center justify-center overflow-hidden">
              <img
                src={p.img}
                alt={p.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </div>
            <div className="p-3">
              <div className="font-semibold text-slate-900 text-sm leading-tight mb-1 line-clamp-1">{p.name}</div>
              <div className="text-xs text-slate-500 mb-2">{p.sub}</div>
              <div className="flex items-center gap-1.5 mb-2">
                <StarRating value={p.rating} />
                <span className="text-[10px] text-slate-400">({p.reviews})</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="font-bold text-slate-900 text-sm">{p.price.toFixed(3).replace(".", ",")} DT</span>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-sm transition-colors"
                  aria-label="Ajouter au panier"
                  data-testid={`reco-add-${p.ref}`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardView({ user, orders }) {
  const stats = useMemo(() => {
    const total = orders.length;
    const inProgress = orders.filter((o) => ["En attente", "Confirmée", "Expédiée"].includes(o.status)).length;
    const delivered = orders.filter((o) => o.status === "Livrée").length;
    return { orders: total, in_progress: inProgress, delivered, favorites: 0 };
  }, [orders]);

  const lastOrder = orders[0];

  return (
    <>
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_DEFS.map((d) => (
          <StatCard key={d.key} def={d} value={stats[d.key] ?? 0} />
        ))}
      </div>

      {/* Two-column section */}
      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        {/* Last order */}
        <div className="bg-white border border-slate-100 rounded-md p-6" data-testid="last-order-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold text-slate-900">Ma dernière commande</h3>
            <Link to="/compte/commandes" className="text-xs font-semibold text-red-600 hover:text-red-700">
              Voir toutes mes commandes
            </Link>
          </div>

          {!lastOrder ? (
            <div className="text-center py-10 text-sm text-slate-500">
              <Package className="w-10 h-10 mx-auto text-slate-200 mb-2" />
              Aucune commande pour l'instant
            </div>
          ) : (
            <div className="border border-slate-200 rounded-md p-5">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <h4 className="font-display text-xl font-bold text-slate-900">
                  Commande #{lastOrder.id.slice(0, 13).toUpperCase()}
                </h4>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded ${STATUS_COLOR[lastOrder.status] || "bg-slate-100 text-slate-700"}`}>
                  {lastOrder.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-between text-sm text-slate-600 mb-4">
                <span>
                  Passée le {new Date(lastOrder.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                  {" à "}
                  {new Date(lastOrder.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </span>
                <span className="font-semibold text-slate-900">
                  Total : {formatPrice(lastOrder.total_tnd)}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {lastOrder.items.slice(0, 4).map((it, i) => (
                  <div key={i} className="aspect-square bg-slate-50 rounded-sm overflow-hidden">
                    {it.image ? (
                      <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Package className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                ))}
                {lastOrder.items.length > 4 && (
                  <div className="aspect-square bg-slate-100 rounded-sm flex items-center justify-center text-slate-500 text-sm font-semibold">
                    +{lastOrder.items.length - 4}
                  </div>
                )}
              </div>
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-sm">
                <span className="text-slate-500 inline-flex items-center gap-1.5">
                  <Truck className="w-4 h-4" />
                  {lastOrder.status === "Livrée"
                    ? `Livrée le ${new Date(lastOrder.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}`
                    : "En préparation"}
                </span>
                <button className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-semibold text-xs px-3 py-1.5 border border-slate-200 rounded-sm">
                  Détails de la commande <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Account info */}
        <div className="bg-white border border-slate-100 rounded-md p-6" data-testid="account-info-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold text-slate-900">Informations du compte</h3>
            <button className="text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-sm inline-flex items-center gap-1">
              <Edit2 className="w-3 h-3" /> Modifier
            </button>
          </div>

          <div className="space-y-5">
            <div className="flex gap-3">
              <UserCircle className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-slate-500">Nom complet</div>
                <div className="font-semibold text-slate-900">{user?.name || "—"}</div>
              </div>
            </div>
            <div className="flex gap-3">
              <Mail className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="text-xs text-slate-500">Email</div>
                <div className="font-semibold text-slate-900 truncate">{user?.email}</div>
              </div>
            </div>
            <div className="flex gap-3">
              <Phone className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-slate-500">Téléphone</div>
                <div className="font-semibold text-slate-900">{user?.phone || "—"}</div>
              </div>
            </div>
            <div className="flex gap-3">
              <Calendar className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-slate-500">Date d'inscription</div>
                <div className="font-semibold text-slate-900">
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
                    : "—"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <RecommendedCarousel />
      </div>
    </>
  );
}

function OrdersView({ orders }) {
  return (
    <div className="bg-white border border-slate-100 rounded-md p-6" data-testid="orders-view">
      <h3 className="font-display text-xl font-bold text-slate-900 mb-4">Mes commandes</h3>
      {orders.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <Package className="w-12 h-12 mx-auto text-slate-200 mb-3" />
          Aucune commande pour l'instant
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="border border-slate-200 rounded-md p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">#{o.id.slice(0, 8)}</div>
                  <div className="text-sm text-slate-600">{new Date(o.created_at).toLocaleString("fr-FR")}</div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded ${STATUS_COLOR[o.status] || "bg-slate-100"}`}>
                  {o.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">{o.items.length} article(s)</span>
                <span className="font-bold text-slate-900">{formatPrice(o.total_tnd)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PlaceholderView({ title, message }) {
  return (
    <div className="bg-white border border-slate-100 rounded-md p-10 text-center" data-testid="placeholder-view">
      <h3 className="font-display text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}

function PersonalView({ user }) {
  return (
    <div className="bg-white border border-slate-100 rounded-md p-6 max-w-2xl" data-testid="personal-view">
      <h3 className="font-display text-xl font-bold text-slate-900 mb-5">Mes informations personnelles</h3>
      <div className="space-y-4 text-sm">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Nom complet</label>
          <div className="px-3 py-2 border border-slate-200 rounded-sm bg-slate-50">{user?.name || "—"}</div>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Email</label>
          <div className="px-3 py-2 border border-slate-200 rounded-sm bg-slate-50">{user?.email}</div>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Téléphone</label>
          <div className="px-3 py-2 border border-slate-200 rounded-sm bg-slate-50">{user?.phone || "—"}</div>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Adresse</label>
          <div className="px-3 py-2 border border-slate-200 rounded-sm bg-slate-50">{user?.address || "—"}</div>
        </div>
      </div>
    </div>
  );
}

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState("dashboard");
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

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Déconnecté");
      navigate("/");
    } catch {}
  };

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
    : "—";

  return (
    <div className="bg-slate-50 min-h-screen" data-testid="espace-client-page">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar */}
        <aside className="lg:w-72 bg-slate-900 text-white flex-shrink-0 flex flex-col" data-testid="account-sidebar">
          {/* Profile block */}
          <div className="p-6 border-b border-slate-800">
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-md p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-slate-600 flex items-center justify-center flex-shrink-0">
                <UserCircle className="w-7 h-7 text-slate-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-white truncate" data-testid="sidebar-username">{user?.name || "—"}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Client depuis : <span className="text-slate-300">{memberSince}</span>
                </div>
                <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-red-600/20 text-red-300 rounded-sm border border-red-500/30">
                  Client fidèle
                </span>
              </div>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-4 space-y-1" data-testid="account-menu">
            {MENU.map((m) => {
              const isActive = view === m.view;
              return (
                <button
                  key={m.key}
                  onClick={() => setView(m.view)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-sm text-sm font-medium transition-all ${
                    isActive
                      ? "bg-red-600 text-white shadow-md"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                  data-testid={`menu-${m.key}`}
                >
                  <m.Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{m.label}</span>
                </button>
              );
            })}

            <div className="pt-3 mt-3 border-t border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-sm text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
                data-testid="menu-logout"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </nav>

          {/* Help block */}
          <div className="p-4 border-t border-slate-800">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-md p-4">
              <div className="flex items-center gap-2 mb-2">
                <Headphones className="w-5 h-5 text-red-400" />
                <h4 className="font-semibold text-white text-sm">Besoin d'aide ?</h4>
              </div>
              <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
                Notre service client est à votre disposition
              </p>
              <a
                href="tel:+21671123456"
                className="block text-red-400 hover:text-red-300 font-bold text-sm font-mono"
              >
                +216 71 123 456
              </a>
              <div className="text-[10px] text-slate-500 mt-1">
                Lun - Sam : 08h00 - 18h00
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-10 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 uppercase tracking-tight">
                Espace client
              </h1>
              <nav className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <Link to="/" className="hover:text-red-600">Accueil</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-700">Espace client</span>
              </nav>
            </div>

            {loading ? (
              <div className="bg-white border border-slate-100 rounded-md p-10 text-center text-slate-500">
                Chargement…
              </div>
            ) : (
              <>
                {view === "dashboard" && <DashboardView user={user} orders={orders} />}
                {view === "orders" && <OrdersView orders={orders} />}
                {view === "favorites" && (
                  <PlaceholderView
                    title="Mes favoris"
                    message="Vous n'avez pas encore d'articles favoris."
                  />
                )}
                {view === "addresses" && (
                  <PlaceholderView
                    title="Mes adresses"
                    message="Aucune adresse enregistrée pour le moment."
                  />
                )}
                {view === "personal" && <PersonalView user={user} />}
                {view === "password" && (
                  <PlaceholderView
                    title="Changer le mot de passe"
                    message="Fonctionnalité disponible prochainement."
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
