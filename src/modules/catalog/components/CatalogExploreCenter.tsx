import "./CatalogExploreCenter.css";

export interface CatalogExploreCampaignOption {
  id: string;
  name: string;
  icon: string;
}

interface CatalogExploreCategoryOption {
  id: string;
  name: string;
  icon: string;
}

interface Props {
  open: boolean;
  activeCampaign: string;
  activeCategory: string;
  activeCampaignName?: string;
  activeCategoryName?: string;
  campaigns: ReadonlyArray<CatalogExploreCampaignOption>;
  campaignCounts: Record<string, number>;
  categoryCounts: Record<string, number>;
  categories: CatalogExploreCategoryOption[];
  cartCount: number;
  onClose: () => void;
  onResetCatalog: () => void;
  onCampaignSelect: (id: string) => void;
  onCategorySelect: (id: string) => void;
  onOpenCart: () => void;
}

const CAMPAIGN_STYLE: Record<string, string> = {
  "san-valentin": "explore-campaign-pink",
  "dia-padre": "explore-campaign-blue",
  "dia-madre": "explore-campaign-purple",
  "dia-mujer": "explore-campaign-rose",
  escolar: "explore-campaign-green",
  graduaciones: "explore-campaign-violet",
  graduados: "explore-campaign-violet",
  "flores-amarillas": "explore-campaign-yellow",
  "hot-wheels": "explore-campaign-red",
  hotwheels: "explore-campaign-red",
};

export function CatalogExploreCenter({
  open,
  activeCampaign,
  activeCategory,
  activeCampaignName,
  activeCategoryName,
  campaigns,
  campaignCounts,
  categoryCounts,
  categories,
  cartCount,
  onClose,
  onResetCatalog,
  onCampaignSelect,
  onCategorySelect,
  onOpenCart,
}: Props) {
  if (!open) return null;

  const visibleCampaigns = campaigns.filter(
    (campaign) => (campaignCounts[campaign.id] ?? 0) > 0,
  );

  const visibleCategories = categories.filter(
    (category) =>
      category.id === "todas" || (categoryCounts[category.id] ?? 0) > 0,
  );

  const hasFilters = Boolean(activeCampaign || activeCategory !== "todas");

  const handleResetCatalog = () => {
    onResetCatalog();
    onClose();
  };

  const handleCampaignClick = (campaignId: string) => {
    const nextCampaign = activeCampaign === campaignId ? "" : campaignId;
    onCampaignSelect(nextCampaign);
    onClose();
  };

  const handleCategoryClick = (categoryId: string) => {
    onCategorySelect(categoryId);
    onClose();
  };

  return (
    <div className="catalog-explore-overlay" onClick={onClose}>
      <aside
        className="catalog-explore-panel"
        onClick={(event) => event.stopPropagation()}
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
              <button
                type="button"
                onClick={() => handleCampaignClick(activeCampaign)}
              >
                {activeCampaignName || activeCampaign} ✕
              </button>
            )}

            {activeCategory !== "todas" && (
              <button
                type="button"
                onClick={() => handleCategoryClick("todas")}
              >
                {activeCategoryName || activeCategory} ✕
              </button>
            )}
          </div>
        )}

        {visibleCampaigns.length > 0 && (
          <section className="catalog-explore-section">
            <h4>🎁 Campañas</h4>

            <div className="catalog-explore-campaign-grid">
              {visibleCampaigns.map((campaign) => {
                const isActive = activeCampaign === campaign.id;
                const styleClass =
                  CAMPAIGN_STYLE[campaign.id] || "explore-campaign-teal";

                return (
                  <button
                    key={campaign.id}
                    type="button"
                    onClick={() => handleCampaignClick(campaign.id)}
                    className={`catalog-explore-campaign ${styleClass} ${
                      isActive ? "active" : ""
                    }`}
                  >
                    <span className="catalog-explore-campaign-content">
                      <strong>{campaign.name}</strong>
                    </span>

                    <b className="catalog-explore-campaign-icon">
                      {campaign.icon}
                    </b>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        <section className="catalog-explore-section">
          <h4>🛍️ Categorías</h4>

          <div className="catalog-explore-category-grid">
            {visibleCategories.map((category) => {
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryClick(category.id)}
                  className={`catalog-explore-category ${
                    isActive ? "active" : ""
                  }`}
                >
                  <span className="catalog-explore-category-icon">
                    {category.icon}
                  </span>

                  <strong>{category.name}</strong>
                </button>
              );
            })}
          </div>
        </section>

        <section className="catalog-explore-footer-actions">
          <button
            type="button"
            onClick={handleResetCatalog}
            className="catalog-explore-action-clear"
          >
            🛍️ Ver todo el catálogo
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenCart();
            }}
            className="catalog-explore-action-cart"
          >
            📦 Mi Caja ({cartCount})
          </button>

          <a
            href="https://wa.me/51936188636"
            target="_blank"
            rel="noopener noreferrer"
            className="catalog-explore-action-whatsapp"
          >
            💬 Asesora
          </a>
        </section>
      </aside>
    </div>
  );
}