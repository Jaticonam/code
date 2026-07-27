import type { Campaign, Product } from "@/shared/types/product";

/* =========================================================
   TIPOS DEL PROVIDER
   ========================================================= */

export type CatalogCategoryId = NonNullable<Product["category"]>;

export type CatalogProviderSource =
  | "google-sheets"
  | "contract-fixture";

export function isCatalogCacheSourceCompatible(
  storedSource: string | undefined,
  activeSource: CatalogProviderSource,
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
  source: CatalogProviderSource;
  issues:
    readonly CatalogProviderIssue[];
}

/* =========================================================
   CONTRATO DEL CATÁLOGO
   ========================================================= */

export interface CatalogProvider {
  readonly source:
    CatalogProviderSource;

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
