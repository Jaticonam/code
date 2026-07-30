import { SearchInput } from "@/modules/search/components/SearchInput";
import { HeaderCampaignFilter } from "@/modules/catalog/components/HeaderCampaignFilter";
import { HeaderCategoryFilter } from "@/modules/catalog/components/HeaderCategoryFilter";
import type { HeaderCampaignOption } from "@/modules/catalog/components/HeaderCampaignFilter";
import type { Category, Product } from "@/shared/types/product";
import "./CatalogTopNav.css";

interface CatalogTopNavProps {
  products: Product[];

  searchQuery: string;
  onSearchChange: (query: string) => void;

  categories: Category[];
  activeCategory: string;
  categoryCounts?: Record<string, number>;
  onCategorySelect: (id: string) => void;

  campaigns: ReadonlyArray<HeaderCampaignOption>;
  activeCampaign: string;
  campaignCounts?: Record<string, number>;
  showCampaigns?: boolean;
  onCampaignSelect: (id: string) => void;

  searchPlaceholder?: string;
}

export function CatalogTopNav({
  products,
  searchQuery,
  onSearchChange,

  categories,
  activeCategory,
  categoryCounts = {},
  onCategorySelect,

  campaigns,
  activeCampaign,
  campaignCounts = {},
  showCampaigns = false,
  onCampaignSelect,

  searchPlaceholder = "Busca flores, cajas, peluches o código...",
}: CatalogTopNavProps) {
  const hasCampaignSection = showCampaigns && campaigns.length > 0;

  return (
    <nav
      className="catalogTopNav"
      aria-label="Navegación principal del catálogo"
    >
      <div className="catalogTopNavInner">
        <section
          className="catalogTopNavSection catalogTopNavCategories"
          aria-label="Categorías del catálogo"
        >
          <HeaderCategoryFilter
            categories={categories}
            active={activeCategory}
            counts={categoryCounts}
            onSelect={onCategorySelect}
          />
        </section>

        {hasCampaignSection && (
          <section
            className="catalogTopNavSection catalogTopNavCampaigns"
            aria-label="Campañas activas"
          >
            <HeaderCampaignFilter
              campaigns={campaigns}
              active={activeCampaign}
              counts={campaignCounts}
              show={hasCampaignSection}
              onSelect={onCampaignSelect}
            />
          </section>
        )}

        <section
          className="catalogTopNavSection catalogTopNavSearch"
          aria-label="Buscador del catálogo"
        >
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            products={products}
            placeholder={searchPlaceholder}
          />
        </section>
      </div>
    </nav>
  );
}
