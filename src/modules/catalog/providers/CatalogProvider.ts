import type { Campaign, Product } from "@/shared/types/product";

/* =========================================================
   TIPOS DEL PROVIDER
   ========================================================= */

export type CatalogCategoryId = NonNullable<Product["category"]>;

export type CampaignNameToIdMap = Record<string, string>;

/* =========================================================
   CONTRATO DEL CATÁLOGO
   ========================================================= */

export interface CatalogProvider {
  getCategories(): readonly CatalogCategoryId[];

  loadCampaigns(): Promise<Campaign[]>;

  loadCategoryProducts(
    category: CatalogCategoryId,
    campaignNameToIdMap: CampaignNameToIdMap,
  ): Promise<Product[]>;
}
