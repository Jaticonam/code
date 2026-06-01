import type { Category } from "@/shared/types/product";
import { CAMPAIGN_CONFIG } from "@/shared/config/campaigns";
import "@/shared/styles/catalog/catalog-explore-center.css";

interface Props {
  open: boolean;
  activeCampaign: string;
  activeCategory: string;
  activeCampaignName?: string;
  activeCategoryName?: string;
  campaignCounts: Record<string, number>;
  categoryCounts: Record<string, number>;
  categories: Category[];
  cartCount: number;
  onClose: () => void;
  onCampaignSelect: (id: string) => void;
  onCategorySelect: (id: string) => void;
  onOpenCart: () => void;
}

const CAMPAIGN_STYLE: Record<string, string> = {
  "todo-el-ano": "explore-campaign-teal",
  "san-valentin": "explore-campaign-pink",
  "dia-padre": "explore-campaign-blue",
  "dia-madre": "explore-campaign-purple",
  "dia-mujer": "explore-campaign-rose",
  escolar: "explore-campaign-green",
  graduaciones: "explore-campaign-violet",
  "flores-amarillas": "explore-campaign-yellow",
  "hot-wheels": "explore-campaign-red",
};

export function CatalogExploreCenter({
  open,
  activeCampaign,
  activeCategory,
  activeCampaignName,
  activeCategoryName,
  campaignCounts,
  categoryCounts,
  categories,
  cartCount,
  onClose,
  onCampaignSelect,
  onCategorySelect,
  onOpenCart,
}: Props) {
  if (!open) return null;

  const visibleCampaigns = CAMPAIGN_CONFIG.filter(
    (c) => (campaignCounts[c.id] ?? 0) > 0,
  );
  const visibleCategories = categories.filter(
    (c) => c.id === "todas" || (categoryCounts[c.id] ?? 0) > 0,
  );
  const hasFilters = Boolean(activeCampaign || activeCategory !== "todas");

  const clearFilters = () => {
    onCampaignSelect("");
    onCategorySelect("todas");
    onClose();
  };

  return (
    <div className="catalog-explore-overlay" onClick={onClose}>
      <aside
        className="catalog-explore-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="catalog-explore-handle" />

        <header className="catalog-explore-head">
          <div>
            <h3 className="catalog-explore-title">Explorar catálogo</h3>
            <p className="catalog-explore-subtitle">
              Campañas, categorías y accesos rápidos
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="catalog-explore-close"
          >
            Cerrar
          </button>
        </header>

        {hasFilters && (
          <div className="catalog-explore-active">
            {activeCampaign && (
              <button type="button" onClick={() => onCampaignSelect("")}>
                {activeCampaignName} ✕
              </button>
            )}

            {activeCategory !== "todas" && (
              <button type="button" onClick={() => onCategorySelect("todas")}>
                {activeCategoryName} ✕
              </button>
            )}
          </div>
        )}

        <section className="catalog-explore-section">
          <h4>🎁 Campañas</h4>

          <div className="catalog-explore-campaign-grid">
            {visibleCampaigns.map((c) => {
              const isActive = activeCampaign === c.id;

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onCampaignSelect(isActive ? "" : c.id)}
                  className={`catalog-explore-campaign ${CAMPAIGN_STYLE[c.id] || "explore-campaign-teal"} ${isActive ? "active" : ""}`}
                >
                  <span>
                    <strong>{c.name}</strong>
                    <small>{campaignCounts[c.id] ?? 0} productos</small>
                  </span>

                  <b>{c.icon}</b>
                </button>
              );
            })}
          </div>
        </section>

        <section className="catalog-explore-section">
          <h4>🛍️ Categorías</h4>

          <div className="catalog-explore-category-grid">
            {visibleCategories.map((c) => {
              const count = categoryCounts[c.id] ?? 0;
              const isActive = activeCategory === c.id;

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onCategorySelect(c.id)}
                  className={`catalog-explore-category ${isActive ? "active" : ""}`}
                >
                  <span className="catalog-explore-category-icon">
                    {c.icon}
                  </span>
                  <strong>{c.name}</strong>
                  <small>({count})</small>
                </button>
              );
            })}
          </div>
        </section>

        <section className="catalog-explore-section">
          <h4>⚡ Accesos rápidos</h4>

          <div className="catalog-explore-quick-grid">
            <button type="button" onClick={clearFilters}>
              Ver todo
            </button>
            <button type="button">Más vendidos</button>
            <button type="button">Recomendados</button>
            <button type="button">Ofertas</button>
          </div>
        </section>

        <section className="catalog-explore-footer-actions">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenCart();
            }}
          >
            📦 Mi Caja ({cartCount})
          </button>

          <a
            href="https://wa.me/51936188636"
            target="_blank"
            rel="noopener noreferrer"
          >
            💬 Asesora
          </a>
        </section>
      </aside>
    </div>
  );
}
