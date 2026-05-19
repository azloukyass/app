import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Shield, Truck, Award } from "lucide-react";

const LOGO_URL =
  "https://customer-assets.emergentagent.com/job_5600b1e5-a62c-421b-898c-63f49ca272d0/artifacts/ewc8z695_logo.jpeg";

function VisaIcon() {
  return (
    <svg viewBox="0 0 48 32" className="h-8 w-12" aria-label="Visa">
      <rect width="48" height="32" rx="3" fill="#1A1F71" />
      <text x="24" y="22" textAnchor="middle" fontFamily="Arial Black, Arial" fontSize="14" fontWeight="900" fill="#FFFFFF" fontStyle="italic">VISA</text>
    </svg>
  );
}

function MastercardIcon() {
  return (
    <svg viewBox="0 0 48 32" className="h-8 w-12" aria-label="Mastercard">
      <rect width="48" height="32" rx="3" fill="#000000" />
      <circle cx="20" cy="16" r="8" fill="#EB001B" />
      <circle cx="28" cy="16" r="8" fill="#F79E1B" />
      <path d="M24 10.5a8 8 0 0 1 0 11 8 8 0 0 1 0-11z" fill="#FF5F00" />
    </svg>
  );
}

function CashIcon() {
  return (
    <svg viewBox="0 0 48 32" className="h-8 w-12" aria-label="Espèces">
      <rect width="48" height="32" rx="3" fill="#16A34A" />
      <text x="24" y="21" textAnchor="middle" fontFamily="Arial Black, Arial" fontSize="11" fontWeight="900" fill="#FFFFFF">CASH</text>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20" data-testid="site-footer">
      {/* Trust strip */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Truck, t: "Livraison rapide", s: "Toute la Tunisie" },
            { icon: Shield, t: "Pièces garanties", s: "Qualité OEM" },
            { icon: Award, t: "Marques premium", s: "Bosch, Valeo, Bilstein" },
            { icon: Clock, t: "Support 7j/7", s: "8h - 20h" },
          ].map((it, i) => (
            <div key={i} className="flex items-center gap-3">
              <it.icon className="w-7 h-7 text-red-500 flex-shrink-0" />
              <div>
                <div className="text-white font-medium text-sm">{it.t}</div>
                <div className="text-slate-400 text-xs">{it.s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <img src={LOGO_URL} alt="BENNOURI" className="h-14 w-14 object-contain bg-white p-1 rounded-sm" />
            <div>
              <div className="font-display text-xl font-bold text-white tracking-tight">BENNOURI</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Pièces Auto</div>
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Le spécialiste des pièces détachées automobiles en Tunisie. Identification par VIN, livraison rapide, qualité garantie.
          </p>
        </div>

        <div>
          <h4 className="text-white font-display font-semibold text-sm uppercase tracking-wider mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0" />
              <span>Avenue Habib Bourguiba, Tunis 1001, Tunisie</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-red-500 flex-shrink-0" />
              <a href="tel:+21671123456" className="hover:text-white">+216 71 123 456</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-red-500 flex-shrink-0" />
              <a href="mailto:contact@bennouri.com" className="hover:text-white">contact@bennouri.com</a>
            </li>
            <li className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>Lun - Sam: 8h00 - 20h00</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-display font-semibold text-sm uppercase tracking-wider mb-4">Liens rapides</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/recherche-vin" className="hover:text-white">Recherche par VIN</Link></li>
            <li><Link to="/catalogue/mecanique" className="hover:text-white">Pièces Mécanique</Link></li>
            <li><Link to="/catalogue/electrique" className="hover:text-white">Pièces Électrique</Link></li>
            <li><Link to="/catalogue/carrosserie" className="hover:text-white">Pièces Carrosserie</Link></li>
            <li><Link to="/compte" className="hover:text-white">Mon compte</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-display font-semibold text-sm uppercase tracking-wider mb-4">Paiement</h4>
          <p className="text-sm text-slate-400 mb-4">Paiement sécurisé à la livraison ou par carte bancaire.</p>
          <div className="flex items-center gap-2" data-testid="footer-payment-icons">
            <VisaIcon />
            <MastercardIcon />
            <CashIcon />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>© {new Date().getFullYear()} BENNOURI Pièces Auto — Tous droits réservés.</div>
          <div className="font-mono-vin uppercase tracking-widest">Tunis · Tunisie</div>
        </div>
      </div>
    </footer>
  );
}
