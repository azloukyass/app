import { useEffect, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight, Loader2, Layers, Package } from "lucide-react";
import { api, formatApiError } from "@/lib/api";
import { toast } from "sonner";

const SECTION_META = {
  mecanique: { label: "Mécanique", bar: "from-red-700 to-red-500", color: "text-red-600" },
  electrique: { label: "Électrique", bar: "from-amber-600 to-amber-400", color: "text-amber-600" },
  carrosserie: { label: "Carrosserie", bar: "from-slate-700 to-slate-500", color: "text-slate-700" },
};

export default function CategoryTree() {
  const { section } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract everything after /catalogue/:section/  → the slug path
  const pathPrefix = `/catalogue/${section}/`;
  const slugPath = location.pathname.startsWith(pathPrefix)
    ? location.pathname.slice(pathPrefix.length)
    : "";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const { data: node } = await api.get(`/catalog-tree/${section}/${slugPath}`);
        if (!cancelled) setData(node);
      } catch (err) {
        if (!cancelled) {
          setError(formatApiError(err));
          toast.error(formatApiError(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [section, slugPath]);

  const meta = SECTION_META[section] || SECTION_META.mecanique;

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-slate-500" data-testid="catalog-tree-loading">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Chargement…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-sm text-slate-500 mb-4">{error || "Catégorie introuvable."}</p>
        <button onClick={() => navigate(-1)} className="text-red-600 hover:underline font-semibold">← Retour</button>
      </div>
    );
  }

  const hasChildren = Array.isArray(data.children) && data.children.length > 0;
  const isLeaf = !hasChildren;
  // Build the slug paths for child links
  const buildChildPath = (childSlug) => `${pathPrefix}${slugPath ? slugPath + "/" : ""}${childSlug}`;

  return (
    <div data-testid={`catalog-tree-${slugPath || "root"}`}>
      {/* Header with breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb section={section} sectionLabel={meta.label} breadcrumb={data.breadcrumb} />
          <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-red-600 mt-4 mb-2">Catégorie</div>
          <h1 className={`font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase ${meta.color}`} data-testid="tree-node-title">
            {data.label}
          </h1>
          {hasChildren && (
            <p className="mt-2 text-sm text-slate-500">
              {data.children.length} sous-{data.children.length > 1 ? "catégories" : "catégorie"} · Choisissez une option
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {hasChildren ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="tree-children-grid">
            {data.children.map((child) => {
              const childHasMore = (child.children || []).length > 0;
              return (
                <Link
                  key={child.slug}
                  to={buildChildPath(child.slug)}
                  className="group bg-white border border-slate-200 hover:border-red-500 hover:shadow-lg transition-all rounded-sm overflow-hidden"
                  data-testid={`tree-child-${child.slug}`}
                >
                  <div className={`h-1.5 bg-gradient-to-r ${meta.bar}`} />
                  <div className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-sm bg-red-50 group-hover:bg-red-600 flex items-center justify-center flex-shrink-0 transition-colors">
                      {childHasMore ? (
                        <Layers className="w-5 h-5 text-red-600 group-hover:text-white transition-colors" />
                      ) : (
                        <Package className="w-5 h-5 text-red-600 group-hover:text-white transition-colors" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-black text-slate-900 text-base leading-tight uppercase">
                        {child.label}
                      </div>
                      <div className="mt-1 text-[11px] uppercase tracking-wider font-semibold text-slate-400 group-hover:text-red-600 transition-colors">
                        {childHasMore
                          ? `${child.children.length} sous-${child.children.length > 1 ? "catégories" : "catégorie"} →`
                          : "Voir les pièces →"}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : isLeaf ? (
          <div className="bg-white border border-slate-200 rounded-sm p-12 text-center" data-testid="tree-leaf-placeholder">
            <div className="w-16 h-16 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="font-display text-2xl font-black uppercase text-slate-900 tracking-tight">
              {data.label}
            </h2>
            <p className="mt-3 text-sm text-slate-500 max-w-md mx-auto">
              Les pièces disponibles pour cette catégorie seront affichées ici très prochainement.
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Vous pouvez déjà rechercher cette pièce par numéro VIN ou OEM.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/recherche-vin" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold uppercase text-sm tracking-wider px-5 py-2.5 rounded-sm">
                Rechercher par VIN <ArrowRight className="w-4 h-4" />
              </Link>
              <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 border border-slate-300 hover:border-slate-500 text-slate-700 font-bold uppercase text-sm tracking-wider px-5 py-2.5 rounded-sm">
                <ChevronLeft className="w-4 h-4" /> Retour
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Breadcrumb({ section, sectionLabel, breadcrumb }) {
  const items = breadcrumb || [];
  return (
    <div className="text-xs text-slate-500 flex items-center gap-1.5 font-semibold flex-wrap" data-testid="tree-breadcrumb">
      <Link to="/" className="hover:text-red-600">Accueil</Link>
      <ChevronRight className="w-3 h-3 text-slate-300" />
      <Link to={`/catalogue/${section}`} className="hover:text-red-600">{sectionLabel}</Link>
      {items.map((b, i) => {
        const path = "/catalogue/" + section + "/" + items.slice(0, i + 1).map((x) => x.slug).join("/");
        const isLast = i === items.length - 1;
        return (
          <span key={b.slug} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-slate-300" />
            {isLast ? (
              <span className="text-slate-900">{b.label}</span>
            ) : (
              <Link to={path} className="hover:text-red-600">{b.label}</Link>
            )}
          </span>
        );
      })}
    </div>
  );
}
