import type { Campaign, Product } from "@/shared/types/product";

/* =========================================================
   TIPOS DEL PROVIDER
   ========================================================= */

export type CatalogCategoryId = NonNullable<Product["category"]>;

/* =========================================================
   CONTRATO DEL CATÁLOGO
   ========================================================= */

export interface CatalogProvider {
  getCategories(): readonly CatalogCategoryId[];

  loadCampaigns(): Promise<Campaign[]>;

  loadCategoryProducts(
    category: CatalogCategoryId,
    campaigns: readonly Campaign[],
  ): Promise<Product[]>;
}
