import type { Campaign, Product } from "@/shared/types/product";

import { buildCampaignNameToIdMap } from "@/modules/catalog/domain/CampaignRules";

import type {
  CatalogCategoryId,
  CatalogProvider,
} from "@/modules/catalog/providers/CatalogProvider";

import { fetchSheetRows } from "./fetchSheets";

import {
  CAMPAIGN_REQUIRED_HEADERS,
  normalizeCampaign,
} from "./normalizeCampaign";

import { normalizeProduct } from "./normalizeProduct";

import {
  CAMPAIGNS_SHEET_CONFIG,
  PRODUCT_SHEETS_CONFIG,
} from "./sheetsConfig";

import { validateProducts } from "./validateProducts";

/* =========================================================
   SCHEMA DE PRODUCTOS
   ========================================================= */

const PRODUCT_REQUIRED_HEADERS = [
  "id",
  "title",
  "description",
  "category",
  "price_1",
  "price_3",
  "price_12",
  "price_50",
  "price_100",
  "stock",
  "img",
  "badge",
  "campaigns",
  "priority",
  "status",
  "updated_at",
] as const;

/* =========================================================
   HELPERS
   ========================================================= */

function getProductSource(category: CatalogCategoryId) {
  return PRODUCT_SHEETS_CONFIG.find(
    (source) => source.category === category,
  );
}

/* =========================================================
   GOOGLE SHEETS PROVIDER
   ========================================================= */

export const googleSheetsCatalogProvider: CatalogProvider = {
  getCategories(): readonly CatalogCategoryId[] {
    return PRODUCT_SHEETS_CONFIG.map(
      (source) => source.category,
    );
  },

  async loadCampaigns(): Promise<Campaign[]> {
    const rows = await fetchSheetRows(
      CAMPAIGNS_SHEET_CONFIG,
      CAMPAIGN_REQUIRED_HEADERS,
    );

    return rows.map(normalizeCampaign);
  },

  async loadCategoryProducts(
    category: CatalogCategoryId,
    campaigns: readonly Campaign[],
  ): Promise<Product[]> {
    const source = getProductSource(category);

    if (!source) {
      return [];
    }

    const rows = await fetchSheetRows(
      source,
      PRODUCT_REQUIRED_HEADERS,
    );

    const campaignNameToIdMap =
      buildCampaignNameToIdMap([...campaigns]);

    const normalizedProducts = rows.map((row) =>
      normalizeProduct(
        row,
        source.category,
        campaignNameToIdMap,
      ),
    );

    return validateProducts(normalizedProducts).map(
      ({ updated_at, ...product }) => product,
    );
  },
};
