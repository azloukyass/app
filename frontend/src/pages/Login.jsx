import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function Login() {
  const { login, formatApiError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Bienvenue ${user.name} !`);
      navigate(user.role === "admin" ? "/admin" : from);
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16" data-testid="login-page">
      <div className="text-center mb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900">Connexion</h1>
        <p className="mt-2 text-slate-500">Accédez à votre compte BENNOURI</p>
      </div>

      <form onSubmit={submit} className="bg-white border border-slate-200 rounded-sm p-8 shadow-sm">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-sm focus:border-red-600 outline-none"
            placeholder="email@exemple.com"
            required
            data-testid="login-email-input"
          />
        </div>

        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1 mt-4">Mot de passe</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-sm focus:border-red-600 outline-none"
            placeholder="••••••••"
            required
            data-testid="login-password-input"
          />
        </div>

        <button type="submit" disabled={loading} className="mt-6 w-full bn-btn-primary disabled:opacity-60" data-testid="login-submit-button">
          {loading ? "Connexion..." : (<><LogIn className="w-4 h-4" /> Se connecter</>)}
        </button>

        <p className="mt-6 text-sm text-center text-slate-500">
          Pas encore de compte ?{" "}
          <Link to="/inscription" className="text-red-600 hover:underline font-medium" data-testid="login-to-register">S'inscrire</Link>
        </p>
      </form>
    </div>
  );
}
