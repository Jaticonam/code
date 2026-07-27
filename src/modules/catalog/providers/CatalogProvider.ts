import type { Campaign, Product } from "@/shared/types/product";
import type { CatalogSourceMode } from "@/shared/config/application";

/* =========================================================
   TIPOS DEL PROVIDER
   ========================================================= */

export type CatalogCategoryId = NonNullable<Product["category"]>;

export function isCatalogCacheSourceCompatible(
  storedSource: string | undefined,
  activeSource: CatalogSourceMode,
): boolean {
  return (
    storedSource === activeSource ||
    (storedSource === undefined &&
      activeSource === "google-sheets")
  );
}

export interface CatalogProviderIssue {
  code: string;
  message: string;
  itemIndex?: number;
}

export interface CatalogProviderResult<T> {
  data: T;
  source: CatalogSourceMode;
  issues:
    readonly CatalogProviderIssue[];
}

/* =========================================================
   CONTRATO DEL CATÁLOGO
   ========================================================= */

export interface CatalogProvider {
  readonly source:
    CatalogSourceMode;

  getCategories(): readonly CatalogCategoryId[];

  loadCampaigns(): Promise<Campaign[]>;

  loadCategoryProducts(
    category: CatalogCategoryId,
    campaigns: readonly Campaign[],
  ): Promise<Product[]>;

  loadCategoryProductsDetailed?(
    category: CatalogCategoryId,
    campaigns: readonly Campaign[],
  ): Promise<
    CatalogProviderResult<Product[]>
  >;
}
