import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, MapPin, UserPlus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function Register() {
  const { register, formatApiError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Bienvenue ${user.name} !`);
      navigate("/");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16" data-testid="register-page">
      <div className="text-center mb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900">Créer un compte</h1>
        <p className="mt-2 text-slate-500">Rejoignez BENNOURI Pièces Auto</p>
      </div>

      <form onSubmit={submit} className="bg-white border border-slate-200 rounded-sm p-8 shadow-sm space-y-4">
        <Field icon={User} label="Nom complet" value={form.name} onChange={onChange("name")} required testid="reg-name" />
        <Field icon={Mail} label="Email" type="email" value={form.email} onChange={onChange("email")} required testid="reg-email" />
        <Field icon={Lock} label="Mot de passe" type="password" value={form.password} onChange={onChange("password")} required testid="reg-password" />
        <Field icon={Phone} label="Téléphone" value={form.phone} onChange={onChange("phone")} testid="reg-phone" />
        <Field icon={MapPin} label="Adresse" value={form.address} onChange={onChange("address")} testid="reg-address" />

        <button type="submit" disabled={loading} className="w-full bn-btn-primary disabled:opacity-60" data-testid="register-submit-button">
          {loading ? "Création..." : (<><UserPlus className="w-4 h-4" /> S'inscrire</>)}
        </button>

        <p className="text-sm text-center text-slate-500">
          Déjà inscrit ?{" "}
          <Link to="/connexion" className="text-red-600 hover:underline font-medium" data-testid="register-to-login">Se connecter</Link>
        </p>
      </form>
    </div>
  );
}

function Field({ icon: Icon, label, type = "text", value, onChange, required, testid }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          data-testid={testid}
          className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-sm focus:border-red-600 outline-none"
        />
      </div>
    </div>
  );
}
