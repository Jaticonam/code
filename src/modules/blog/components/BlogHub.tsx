import BlogHero from "./BlogHero";
import IdeaLabSection from "./IdeaLabSection";
import TrendInsightsSection from "./TrendInsightsSection";
import CampaignCenterSection from "./CampaignCenterSection";
import BlogCatalogSection from "./BlogCatalogSection";
import BlogArticlesSection from "./BlogArticlesSection";
import OpportunityCenterSection from "./OpportunityCenterSection";
import BusinessToolsSection from "./BusinessToolsSection";
import BlogSidebarMenu from "./BlogSidebarMenu";
import { useBlogArticles } from "../hooks/useBlogArticles";
import { useBlogSearch } from "../hooks/useBlogSearch";
import { MessageCircle, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function BlogHub() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const articles = useBlogArticles();
  const items = useBlogSearch(articles, q, cat);
  const [featured, ...rest] = items;

  return (
    <>
      <BlogSidebarMenu mode="mobile" />

      <div className="blog-hub">
        <aside className="blog-sidebar">
          <div className="blog-sidebar-top">
            <div className="blog-brand">
              <small>🧠 CENTRO WOOLY</small>
              <strong>
                Ideas, tendencias y herramientas para emprendedores.
              </strong>
            </div>

            <div className="blog-search">
              <Search size={16} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar..."
              />
            </div>

            <BlogSidebarMenu mode="desktop" />
          </div>

          <div className="blog-sidebar-insights">
            <div className="blog-side-mini">
              <small>🔥 MÁS LEÍDO</small>
              <strong>Papel Coreano Premium</strong>
            </div>
            <div className="blog-side-mini">
              <small>📈 TENDENCIA</small>
              <strong>Cajas premium para regalos</strong>
            </div>
            <div className="blog-side-mini">
              <small>📅 PRÓXIMA CAMPAÑA</small>
              <strong>Día del Padre</strong>
            </div>
          </div>

          <a
            className="blog-sales"
            href="https://wa.me/51956762686"
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={18} /> Hablar con asesor
          </a>
        </aside>

        <main className="blog-main">
          <section id="inicio">
            <BlogHero q={q} setQ={setQ} setCat={setCat} />
          </section>
          <section id="laboratorio">
            <IdeaLabSection />
          </section>
          <section id="tendencias">
            <TrendInsightsSection />
          </section>
          <section id="oportunidades">
            <OpportunityCenterSection />
          </section>
          <section id="herramientas">
            <BusinessToolsSection />
          </section>
          <section id="campanas">
            <CampaignCenterSection />
          </section>
          <section id="catalogo-wooly">
            <BlogCatalogSection />
          </section>

          {!items.length ? (
            <div className="blog-empty">
              No encontramos artículos para esa búsqueda.
            </div>
          ) : (
            <>
              <div className="blog-banner">
                <div>
                  <h3>🚀 ¿Listo para abastecerte?</h3>
                  <p>Más de 1000 productos para emprendedores.</p>
                </div>
                <Link to="/catalogo" className="blog-banner-btn">
                  Ver catálogo
                </Link>
              </div>

              <section id="guias">
                <BlogArticlesSection featured={featured} items={rest} />
              </section>
            </>
          )}
        </main>
      </div>
    </>
  );
}
