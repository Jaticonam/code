import BlogHero from "./BlogHero";
import IdeaLabSection from "./IdeaLabSection";
import TrendInsightsSection from "./TrendInsightsSection";
import CampaignCenterSection from "./CampaignCenterSection";
import BlogCatalogSection from "./BlogCatalogSection";
import BlogArticlesSection from "./BlogArticlesSection";
import OpportunityCenterSection from "./OpportunityCenterSection";
import BusinessToolsSection from "./BusinessToolsSection";
import { BlogHubRail } from "./rail";
import BlogSidebar from "./sidebar/BlogSidebar";
import BlogMobileNav from "./sidebar/BlogMobileNav";

import { useBlogArticles } from "../hooks/useBlogArticles";
import { useBlogSearch } from "../hooks/useBlogSearch";

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
      <BlogMobileNav />

      <div className="blog-layout">
        <BlogSidebar q={q} setQ={setQ} />

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

        <BlogHubRail />
      </div>
    </>
  );
}
