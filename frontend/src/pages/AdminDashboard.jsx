import { useEffect, useState } from "react";
import { Users, Package, AlertCircle, TrendingUp, Mail, Phone, MapPin, MessageSquare, Check } from "lucide-react";
import { api, formatApiError, formatPrice } from "@/lib/api";
import { toast } from "sonner";

const STATUS_OPTIONS = ["En attente", "Confirmée", "Expédiée", "Livrée", "Annulée"];

export default function AdminDashboard() {
  const [tab, setTab] = useState("orders");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [s, u, o, m] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users"),
        api.get("/admin/orders"),
        api.get("/admin/messages"),
      ]);
      setStats(s.data);
      setUsers(u.data);
      setOrders(o.data);
      setMessages(m.data);
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/orders/${id}`, { status });
      toast.success("Statut mis à jour");
      load();
    } catch (err) {
      toast.error(formatApiError(err));
    }
  };

  const markMessageRead = async (id) => {
    try {
      await api.patch(`/admin/messages/${id}/read`);
      load();
    } catch (err) {
      toast.error(formatApiError(err));
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" data-testid="admin-dashboard">
      <div className="mb-8">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-red-600 mb-2">Tableau de bord</div>
        <h1 className="font-display text-4xl font-bold text-slate-900 tracking-tight">Administration</h1>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Utilisateurs" value={stats?.users ?? "…"} color="text-blue-600" testid="stat-users" />
        <StatCard icon={Package} label="Commandes" value={stats?.orders ?? "…"} color="text-emerald-600" testid="stat-orders" />
        <StatCard icon={AlertCircle} label="En attente" value={stats?.pending_orders ?? "…"} color="text-amber-600" testid="stat-pending" />
        <StatCard icon={TrendingUp} label="Chiffre d'affaires" value={stats ? formatPrice(stats.revenue_tnd) : "…"} color="text-red-600" testid="stat-revenue" />
      </div>

      <div className="bg-white border border-slate-200 rounded-sm">
        <div className="border-b border-slate-200 flex">
          <TabButton active={tab === "orders"} onClick={() => setTab("orders")} testid="admin-tab-orders">
            Commandes ({orders.length})
          </TabButton>
          <TabButton active={tab === "users"} onClick={() => setTab("users")} testid="admin-tab-users">
            Utilisateurs ({users.length})
          </TabButton>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500">Chargement…</div>
        ) : tab === "orders" ? (
          <OrdersTable orders={orders} onStatusChange={updateStatus} />
        ) : (
          <UsersTable users={users} />
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, testid }) {
  return (
    <div className="bg-white border border-slate-200 rounded-sm p-5 flex items-center gap-4" data-testid={testid}>
      <div className={`p-3 bg-slate-50 rounded-sm ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="text-xs text-slate-500 uppercase tracking-wider">{label}</div>
        <div className="font-display text-2xl font-bold text-slate-900">{value}</div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children, testid }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
        active ? "border-red-600 text-red-600" : "border-transparent text-slate-500 hover:text-slate-900"
      }`}
      data-testid={testid}
    >
      {children}
    </button>
  );
}

function OrdersTable({ orders, onStatusChange }) {
  if (orders.length === 0)
    return <div className="p-10 text-center text-slate-500">Aucune commande pour le moment.</div>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3 text-left">#</th>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Client</th>
            <th className="px-4 py-3 text-left">Véhicule</th>
            <th className="px-4 py-3 text-right">Total</th>
            <th className="px-4 py-3 text-left">Statut</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o, idx) => (
            <tr key={o.id} className={`border-t border-slate-100 ${idx % 2 ? "bg-slate-50/50" : ""}`} data-testid={`admin-order-${o.id}`}>
              <td className="px-4 py-3 font-mono-vin text-xs text-slate-500">{o.id.slice(0, 8)}</td>
              <td className="px-4 py-3 text-slate-600">{new Date(o.created_at).toLocaleDateString("fr-FR")}</td>
              <td className="px-4 py-3">
                <div className="font-medium text-slate-800">{o.user_name}</div>
                <div className="text-xs text-slate-500">{o.user_email}</div>
              </td>
              <td className="px-4 py-3">
                <div className="text-slate-700">{o.vehicle_label || "—"}</div>
                <div className="text-xs font-mono-vin text-slate-500">{o.vehicle_vin}</div>
              </td>
              <td className="px-4 py-3 text-right font-semibold text-slate-900">{formatPrice(o.total_tnd)}</td>
              <td className="px-4 py-3">
                <select
                  value={o.status}
                  onChange={(e) => onStatusChange(o.id, e.target.value)}
                  className="text-xs border border-slate-300 rounded-sm px-2 py-1.5 focus:border-red-600 outline-none bg-white"
                  data-testid={`order-status-${o.id}`}
                >
                  {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UsersTable({ users }) {
  if (users.length === 0)
    return <div className="p-10 text-center text-slate-500">Aucun utilisateur.</div>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3 text-left">Nom</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Téléphone</th>
            <th className="px-4 py-3 text-left">Adresse</th>
            <th className="px-4 py-3 text-left">Rôle</th>
            <th className="px-4 py-3 text-left">Inscrit le</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, idx) => (
            <tr key={u.id} className={`border-t border-slate-100 ${idx % 2 ? "bg-slate-50/50" : ""}`} data-testid={`admin-user-${u.id}`}>
              <td className="px-4 py-3 font-medium text-slate-800">{u.name}</td>
              <td className="px-4 py-3 text-slate-600"><span className="inline-flex items-center gap-1"><Mail className="w-3 h-3" /> {u.email}</span></td>
              <td className="px-4 py-3 text-slate-600">{u.phone ? <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" /> {u.phone}</span> : "—"}</td>
              <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{u.address ? <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {u.address}</span> : "—"}</td>
              <td className="px-4 py-3">
                <span className={`bn-chip ${u.role === "admin" ? "bg-red-100 text-red-700 border-red-200" : ""}`}>{u.role}</span>
              </td>
              <td className="px-4 py-3 text-slate-500 text-xs">{new Date(u.created_at).toLocaleDateString("fr-FR")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MessagesTable({ messages, onMarkRead }) {
  if (messages.length === 0)
    return <div className="p-10 text-center text-slate-500">Aucun message pour le moment.</div>;
  return (
    <div className="divide-y divide-slate-100">
      {messages.map((m) => (
        <div key={m.id} className={`p-5 sm:p-6 ${!m.read ? "bg-red-50/40" : ""}`} data-testid={`admin-message-${m.id}`}>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <div className="flex items-center gap-2">
                {!m.read && <span className="inline-block w-2 h-2 bg-red-600 rounded-full" title="Non lu" />}
                <h3 className="font-display font-bold text-slate-900">{m.subject}</h3>
              </div>
              <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1"><Mail className="w-3 h-3" /> <a href={`mailto:${m.email}`} className="hover:text-red-600">{m.email}</a></span>
                <span>·</span>
                <span>{m.name}</span>
                <span>·</span>
                <span>{new Date(m.created_at).toLocaleString("fr-FR")}</span>
              </div>
            </div>
            {!m.read && (
              <button onClick={() => onMarkRead(m.id)} className="text-xs inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-sm hover:bg-slate-700" data-testid={`mark-read-${m.id}`}>
                <Check className="w-3 h-3" /> Marquer lu
              </button>
            )}
          </div>
          <p className="mt-3 text-sm text-slate-700 leading-relaxed whitespace-pre-line">{m.message}</p>
        </div>
      ))}
    </div>
  );
}
