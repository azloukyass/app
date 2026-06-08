import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  LogOut,
  Shield,
  Menu,
  X,
  Search,
  Truck,
  Facebook,
  Instagram,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

// Inline WhatsApp icon (lucide doesn't ship one)
const WhatsAppIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

// New logo: stylized car silhouette with red BENOURI PIASUTO text
const BenouriLogo = ({ className = "" }) => (
  <svg viewBox="0 0 320 110" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Car silhouette (red) */}
    <g transform="translate(0,0)">
      <path d="M8 38 Q 18 22 35 18 L 75 18 Q 90 18 100 30 L 120 38 L 138 38 L 145 28 L 152 38 L 138 38" stroke="#DC2626" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 38 L 152 38" stroke="#DC2626" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="35" cy="38" r="8" fill="#0F0F0F" stroke="#DC2626" strokeWidth="3" />
      <circle cx="35" cy="38" r="3" fill="#DC2626" />
      <circle cx="105" cy="38" r="8" fill="#0F0F0F" stroke="#DC2626" strokeWidth="3" />
      <circle cx="105" cy="38" r="3" fill="#DC2626" />
      {/* Speed lines */}
      <line x1="115" y1="22" x2="135" y2="22" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="118" y1="28" x2="138" y2="28" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
    </g>
    {/* Text BENOURI */}
    <text x="6" y="78" fill="#ffffff" fontFamily="'Outfit', sans-serif" fontWeight="900" fontSize="32" letterSpacing="-1">BENOURI</text>
    {/* Red gear */}
    <g transform="translate(170,55)">
      <circle r="14" fill="#DC2626" />
      <circle r="6" fill="#0F0F0F" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
        <rect
          key={i}
          x="-2"
          y="-18"
          width="4"
          height="6"
          fill="#DC2626"
          transform={`rotate(${deg})`}
        />
      ))}
    </g>
    {/* Text PIASUTO */}
    <text x="190" y="78" fill="#DC2626" fontFamily="'Outfit', sans-serif" fontWeight="900" fontSize="32" letterSpacing="-1">PIASUTO</text>
    {/* Subline */}
    <line x1="6" y1="92" x2="40" y2="92" stroke="#DC2626" strokeWidth="2" />
    <text x="48" y="98" fill="#ffffff" fontFamily="'Outfit', sans-serif" fontWeight="600" fontSize="11" letterSpacing="5">PIÈCES AUTO ORIGINALES</text>
    <line x1="266" y1="92" x2="300" y2="92" stroke="#DC2626" strokeWidth="2" />
  </svg>
);

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

  const navLink = ({ isActive }) =>
    `text-sm font-semibold tracking-wide uppercase transition-colors ${
      isActive ? "text-red-500" : "text-white hover:text-red-400"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-black border-b border-red-600/30" data-testid="site-header">
      {/* Top utility bar */}
      <div className="bg-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-10 text-xs text-white">
          <div className="inline-flex items-center gap-2 font-medium">
            <Truck className="w-3.5 h-3.5 text-red-500" />
            <span>Livraison rapide dans toute la Tunisie</span>
          </div>
          <div className="flex items-center gap-5 font-medium">
            <Link to="/a-propos" className="text-white hover:text-red-500 transition-colors hidden sm:inline">À propos de nous</Link>
            <Link to="/contact" className="text-white hover:text-red-500 transition-colors">Contactez-nous</Link>
            <div className="flex items-center gap-3 pl-2 border-l border-white/15">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-red-500" aria-label="Facebook"><Facebook className="w-4 h-4" /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-red-500" aria-label="Instagram"><Instagram className="w-4 h-4" /></a>
              <a href="https://wa.me/21671123456" target="_blank" rel="noopener noreferrer" className="text-white hover:text-red-500" aria-label="WhatsApp"><WhatsAppIcon className="w-4 h-4" /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Main header row */}
      <div className="bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-6">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0" data-testid="logo-link">
            <BenouriLogo className="h-14 sm:h-16 w-auto" />
          </Link>

          {/* Search bar with categories */}
          <form onSubmit={submitSearch} className="hidden md:flex flex-1 max-w-3xl bg-white rounded-sm overflow-hidden shadow-sm" data-testid="header-search">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher une pièce, une marque..."
              className="flex-1 px-4 py-3 text-sm text-black focus:outline-none"
              data-testid="header-search-input"
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 px-6 flex items-center justify-center transition-colors"
              data-testid="header-search-btn"
            >
              <Search className="w-5 h-5 text-white" />
            </button>
          </form>

          {/* Account & cart */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {user ? (
              <Link to="/compte" className="hidden sm:inline-flex items-center gap-2 text-white hover:text-red-500 transition-colors" data-testid="header-account">
                <div className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="leading-tight">
                  <div className="text-[10px] uppercase tracking-wider text-white/80">Mon compte</div>
                  <div className="text-sm font-semibold flex items-center gap-1 text-white">{user.name?.split(" ")[0]} <ChevronDown className="w-3 h-3" /></div>
                </div>
              </Link>
            ) : (
              <Link to="/connexion" className="hidden sm:inline-flex items-center gap-2 text-white hover:text-red-500 text-sm font-semibold" data-testid="header-login">
                <User className="w-5 h-5" /> Connexion
              </Link>
            )}
            <Link to="/panier" className="relative inline-flex items-center gap-2 text-white" data-testid="header-cart">
              <div className="relative w-10 h-10 rounded-full border border-white/40 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center" data-testid="cart-count">{count}</span>
                )}
              </div>
              <div className="hidden sm:block leading-tight">
                <div className="text-[10px] uppercase tracking-wider text-white/80">Panier</div>
                <div className="text-sm font-semibold text-white">{count} article{count !== 1 && "s"}</div>
              </div>
            </Link>
            {user?.role === "admin" && (
              <Link to="/admin" className="hidden lg:inline-flex items-center gap-1 text-xs text-white border border-white/20 hover:border-red-500 px-3 py-2 rounded-sm" data-testid="header-admin">
                <Shield className="w-3.5 h-3.5" /> Admin
              </Link>
            )}
            {user && (
              <button onClick={logout} className="hidden xl:inline-flex items-center gap-1 text-xs text-white/70 hover:text-red-400" data-testid="header-logout">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              className="md:hidden text-white"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              data-testid="header-menu-toggle"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black border-t border-white/10" data-testid="mobile-menu">
          <form onSubmit={submitSearch} className="p-4 border-b border-white/10">
            <div className="flex bg-white rounded-sm overflow-hidden">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher..."
                className="flex-1 px-3 py-2 text-sm text-black focus:outline-none"
              />
              <button type="submit" className="bg-red-600 px-4">
                <Search className="w-4 h-4 text-white" />
              </button>
            </div>
          </form>
          <div className="px-4 py-3 space-y-2">
            <Link to="/" onClick={() => setOpen(false)} className="block py-2 text-white">Accueil</Link>
            <Link to="/contact" onClick={() => setOpen(false)} className="block py-2 text-white">Contact</Link>
            {user ? (
              <>
                <Link to="/compte" onClick={() => setOpen(false)} className="block py-2 text-white">Mon compte</Link>
                <button onClick={() => { logout(); setOpen(false); }} className="block w-full text-left py-2 text-red-400">Déconnexion</button>
              </>
            ) : (
              <Link to="/connexion" onClick={() => setOpen(false)} className="block py-2 text-red-400 font-semibold">Connexion</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
