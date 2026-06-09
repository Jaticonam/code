import { useMemo, useState } from "react";
import { ArrowLeft, BookOpen, Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useBlogArticles } from "../hooks/useBlogArticles";
import { useBlogSearch } from "../hooks/useBlogSearch";
import BlogFeatured from "./BlogFeatured";
import BlogGrid from "./BlogGrid";
import { useSearchParams } from "react-router-dom";

const CATEGORIES = [
  { id: "all", label: "Todos", emoji: "🔥", href: "/blog/guias" },
  {
    id: "productos",
    label: "Productos",
    emoji: "📦",
    href: "/blog/guias?cat=productos",
  },
  {
    id: "ventas",
    label: "Ventas",
    emoji: "💰",
    href: "/blog/guias?cat=ventas",
  },
  {
    id: "tendencias",
    label: "Tendencias",
    emoji: "📈",
    href: "/blog/guias?cat=tendencias",
  },
  {
    id: "campañas",
    label: "Campañas",
    emoji: "📅",
    href: "/blog/guias?cat=campañas",
  },
  {
    id: "negocios",
    label: "Negocios",
    emoji: "💡",
    href: "/blog/guias?cat=negocios",
  },
  {
    id: "estrategias",
    label: "Estrategias",
    emoji: "🚀",
    href: "/blog/guias?cat=estrategias",
  },
];

const INITIAL_LIMIT = 6;
const STEP = 6;

export default function BlogGuidesPage() {
  const articles = useBlogArticles();
  const [searchParams] = useSearchParams();

  const cat = searchParams.get("cat") || "all";

  const [q, setQ] = useState("");
  const [visible, setVisible] = useState(INITIAL_LIMIT);

  const items = useBlogSearch(articles, q, cat);
  const [featured, ...rest] = items;
  const shown = rest.slice(0, visible);
  const hasMore = visible < rest.length;

  const stats = useMemo(
    () => ({
      guides: articles.length,
      categories: new Set(articles.map((a) => a.category)).size,
      tags: new Set(articles.flatMap((a) => a.tags || [])).size,
    }),
    [articles],
  );

  return (
    <main className="blog-guides-page">
      <section className="blog-guides-hero">
        <Sparkles className="blog-guides-ghost" />

        <Link to="/blog" className="blog-guides-back">
          <ArrowLeft size={15} /> Volver al Centro Wooly
        </Link>

        <br />

        <span>
          <BookOpen size={15} /> CENTRO DE GUÍAS WOOLY
        </span>

        <h1>Guías para comprar mejor, vender mejor y crecer más rápido.</h1>

        <p>
          Biblioteca práctica para emprendedores, florerías y tiendas de regalos
          que quieren convertir información en ventas.
        </p>

        <div className="blog-guides-search">
          <Search size={18} />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setVisible(INITIAL_LIMIT);
            }}
            placeholder="Buscar guías, campañas, productos o ideas..."
          />
        </div>

        <div className="blog-guides-filters">
          {CATEGORIES.map((item) => (
            <Link
              key={item.id}
              to={item.href}
              className={cat === item.id ? "active" : ""}
            >
              {item.emoji} {item.label}
            </Link>
          ))}
        </div>

        <div className="blog-guides-stats">
          <div className="blog-guides-stat">
            <span>📖</span>
            <strong>{stats.guides}</strong>
            <small>guías prácticas</small>
          </div>

          <div className="blog-guides-stat">
            <span>📂</span>
            <strong>{stats.categories}</strong>
            <small>categorías</small>
          </div>

          <div className="blog-guides-stat">
            <span>🏷</span>
            <strong>{stats.tags}</strong>
            <small>temas clave</small>
          </div>
        </div>
      </section>

      {!items.length ? (
        <div className="blog-empty">
          No encontramos guías para esa búsqueda.
        </div>
      ) : (
        <section className="blog-guides-content">
          <BlogFeatured article={featured} />
          <BlogGrid items={shown} />

          {hasMore && (
            <div className="blog-guides-action">
              <button type="button" onClick={() => setVisible((v) => v + STEP)}>
                Ver más guías
              </button>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
