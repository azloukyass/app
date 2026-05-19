import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, Shield, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const LOGO_URL =
  "https://customer-assets.emergentagent.com/job_5600b1e5-a62c-421b-898c-63f49ca272d0/artifacts/ewc8z695_logo.jpeg";

export default function Header() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const submitSearch = (e) => {
    e.preventDefault();
    const v = q.trim();
    if (!v) return;
    navigate(`/recherche?q=${encodeURIComponent(v)}`);
    setOpen(false);
  };

  const navLink = (active) =>
    `text-sm font-medium tracking-wide transition-colors ${
      active ? "text-red-600" : "text-slate-700 hover:text-slate-900"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200" data-testid="site-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3" data-testid="logo-link">
            <img src={LOGO_URL} alt="BENNOURI" className="h-12 w-12 object-contain" />
            <div className="leading-tight">
              <div className="font-display font-bold text-slate-900 text-lg tracking-tight">
                BENNOURI
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                Pièces Auto
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" end className={({ isActive }) => navLink(isActive)} data-testid="nav-home">
              Accueil
            </NavLink>
            <NavLink to="/recherche-vin" className={({ isActive }) => navLink(isActive)} data-testid="nav-vin">
              Recherche VIN
            </NavLink>
            {user && user.role === "admin" && (
              <NavLink to="/admin" className={({ isActive }) => navLink(isActive)} data-testid="nav-admin">
                <span className="inline-flex items-center gap-1">
                  <Shield className="w-4 h-4" /> Admin
                </span>
              </NavLink>
            )}
          </nav>

          {/* Search input */}
          <form onSubmit={submitSearch} className="hidden lg:block flex-1 max-w-md mx-6" data-testid="header-search-form">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher par référence, nom, marque…"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-sm focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-colors bg-slate-50 focus:bg-white"
                data-testid="header-search-input"
              />
            </div>
          </form>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/panier")}
              className="relative inline-flex items-center gap-2 px-3 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-sm transition-colors"
              data-testid="header-cart-button"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">Panier</span>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] inline-flex items-center justify-center px-1" data-testid="cart-count-badge">
                  {count}
                </span>
              )}
            </button>

            {user && user !== false ? (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/compte" className="inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-sm" data-testid="header-account-link">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{user.name.split(" ")[0]}</span>
                </Link>
                <button onClick={logout} className="p-2 text-slate-600 hover:text-red-600 hover:bg-slate-100 rounded-sm" title="Se déconnecter" data-testid="header-logout-button">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/connexion" className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-2" data-testid="header-login-link">
                  Connexion
                </Link>
                <Link to="/inscription" className="bn-btn-primary text-sm" data-testid="header-register-link">
                  S'inscrire
                </Link>
              </div>
            )}

            <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-sm text-slate-700 hover:bg-slate-100" data-testid="header-mobile-toggle">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t border-slate-200 py-4 space-y-2">
            <form onSubmit={submitSearch} className="px-1 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Rechercher une pièce…"
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-sm focus:border-red-600 outline-none bg-slate-50"
                  data-testid="header-mobile-search-input"
                />
              </div>
            </form>
            <Link to="/" onClick={() => setOpen(false)} className="block px-3 py-2 hover:bg-slate-100 rounded-sm">Accueil</Link>
            <Link to="/recherche-vin" onClick={() => setOpen(false)} className="block px-3 py-2 hover:bg-slate-100 rounded-sm">Recherche VIN</Link>
            {user && user.role === "admin" && (
              <Link to="/admin" onClick={() => setOpen(false)} className="block px-3 py-2 hover:bg-slate-100 rounded-sm">Admin</Link>
            )}
            {user && user !== false ? (
              <>
                <Link to="/compte" onClick={() => setOpen(false)} className="block px-3 py-2 hover:bg-slate-100 rounded-sm">Mon compte</Link>
                <button onClick={() => { setOpen(false); logout(); }} className="block w-full text-left px-3 py-2 hover:bg-slate-100 rounded-sm text-red-600">Se déconnecter</button>
              </>
            ) : (
              <>
                <Link to="/connexion" onClick={() => setOpen(false)} className="block px-3 py-2 hover:bg-slate-100 rounded-sm">Connexion</Link>
                <Link to="/inscription" onClick={() => setOpen(false)} className="block px-3 py-2 bg-red-600 text-white rounded-sm">S'inscrire</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
