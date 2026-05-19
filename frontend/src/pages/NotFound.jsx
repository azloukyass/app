import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center" data-testid="not-found">
        <div className="font-display text-7xl font-bold text-slate-900">404</div>
        <p className="mt-3 text-slate-500">Page introuvable</p>
        <Link to="/" className="bn-btn-primary mt-6 inline-flex">
          <Home className="w-4 h-4" /> Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
