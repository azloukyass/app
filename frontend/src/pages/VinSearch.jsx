import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hash, ArrowRight, Info } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";
import { useCart } from "@/context/CartContext";

export default function VinSearch() {
  const [vin, setVin] = useState("");
  const [loading, setLoading] = useState(false);
  const { setVehicle } = useCart();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const v = vin.trim().toUpperCase();
    if (v.length < 11) {
      toast.error("Le VIN doit contenir au moins 11 caractères");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/vin/decode", { vin: v });
      setVehicle(data);
      navigate(`/vehicule/${data.vin}`);
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-testid="vin-search-page">
      <div className="text-center mb-10">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-red-600 mb-3">Étape 1 / 3</div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">Recherche par VIN</h1>
        <p className="mt-4 text-slate-600 max-w-xl mx-auto">
          Le VIN (Vehicle Identification Number) permet d'identifier précisément votre véhicule et de retrouver les pièces 100% compatibles.
        </p>
      </div>

      <form onSubmit={submit} className="bg-white border border-slate-200 rounded-sm p-8 sm:p-10 shadow-sm">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
          Votre numéro VIN
        </label>
        <div className="relative mt-2">
          <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={vin}
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            placeholder="WVWZZZ1KZ8W123456"
            maxLength={17}
            className="w-full pl-12 pr-4 py-5 text-xl font-mono-vin uppercase border-2 border-slate-300 rounded-sm focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none"
            data-testid="vin-input"
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bn-btn-primary text-lg py-4 disabled:opacity-60"
          data-testid="vin-submit-button"
        >
          {loading ? "Identification..." : (<>Valider <ArrowRight className="w-5 h-5" /></>)}
        </button>

        <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-sm flex items-start gap-3 text-sm text-slate-600">
          <Info className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-slate-800 mb-1">Où trouver votre VIN ?</div>
            <ul className="list-disc pl-4 space-y-1">
              <li>Sur la carte grise (champ <span className="font-mono-vin">E</span>)</li>
              <li>Gravé sur le châssis, visible côté conducteur en bas du pare-brise</li>
              <li>Sur l'étiquette dans l'embrasure de la porte conducteur</li>
            </ul>
            <button
              type="button"
              onClick={() => setVin("WVWZZZ1KZ8W123456")}
              className="mt-2 text-red-600 hover:underline font-mono-vin"
              data-testid="vin-example-button"
            >
              Essayer avec : WVWZZZ1KZ8W123456
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
