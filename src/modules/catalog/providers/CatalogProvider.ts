import type {
  CatalogSourceMode,
} from "@/shared/config/application/CatalogSourceMode";

import type {
  Campaign,
  Product,
} from "@/shared/types/product";

/* =========================================================
   TIPOS DEL PROVIDER
   ========================================================= */

export type CatalogCategoryId =
  NonNullable<Product["category"]>;

export function isCatalogCacheSourceCompatible(
  storedSource:
    string |
    undefined,

  activeSource:
    CatalogSourceMode,
): boolean {
  return (
    storedSource ===
      activeSource ||
    (
      storedSource ===
        undefined &&
      activeSource ===
        "google-sheets"
    )
  );
}

export interface CatalogSourceMetadata {
  requestedSource:
    CatalogSourceMode;

  resolvedSource:
    CatalogSourceMode;

  fallbackUsed:
    boolean;

  fallbackReason?:
    string;
}

export interface CatalogProviderLoad<T> {
  data:
    T;

  metadata:
    CatalogSourceMetadata;
}

export interface CatalogProviderIssue {
  code:
    string;

  message:
    string;

  itemIndex?:
    number;
}

export interface CatalogProviderResult<T> {
  data:
    T;

  source:
    CatalogSourceMode;

  issues:
    readonly CatalogProviderIssue[];

  metadata?:
    CatalogSourceMetadata;
}

export interface ResolvedCatalogProviderResult<T>
  extends CatalogProviderResult<T> {
  metadata:
    CatalogSourceMetadata;
}

export function createCatalogSourceMetadata(
  requestedSource:
    CatalogSourceMode,

  resolvedSource:
    CatalogSourceMode =
      requestedSource,

  options: {
    fallbackUsed?:
      boolean;

    fallbackReason?:
      string;
  } = {},
): CatalogSourceMetadata {
  const fallbackUsed =
    options.fallbackUsed ??
    requestedSource !==
      resolvedSource;

  return {
    requestedSource,
    resolvedSource,
    fallbackUsed,

    ...(
      options.fallbackReason
        ? {
            fallbackReason:
              options.fallbackReason,
          }
        : {}
    ),
  };
}

function normalizeCatalogProviderResult<T>(
  provider:
    CatalogProvider,

  result:
    CatalogProviderResult<T>,
): ResolvedCatalogProviderResult<T> {
  const resolvedSource =
    result.metadata
      ?.resolvedSource ??
    result.source;

  return {
    ...result,

    source:
      resolvedSource,

    metadata:
      result.metadata ??
      createCatalogSourceMetadata(
        provider.source,
        resolvedSource,
      ),
  };
}

/* =========================================================
   CONTRATO DEL CATÁLOGO
   ========================================================= */

export interface CatalogProvider {
  readonly source:
    CatalogSourceMode;

  getCategories():
    readonly CatalogCategoryId[];

  loadCampaigns():
    Promise<Campaign[]>;

  loadCampaignsDetailed?():
    Promise<
      CatalogProviderResult<Campaign[]>
    >;

  loadCategoryProducts(
    category:
      CatalogCategoryId,

    campaigns:
      readonly Campaign[],
  ): Promise<Product[]>;

  loadCategoryProductsDetailed?(
    category:
      CatalogCategoryId,

    campaigns:
      readonly Campaign[],
  ): Promise<
    CatalogProviderResult<Product[]>
  >;
}

export async function loadCatalogCampaignsDetailed(
  provider:
    CatalogProvider,
): Promise<
  ResolvedCatalogProviderResult<Campaign[]>
> {
  if (
    provider
      .loadCampaignsDetailed
  ) {
    return normalizeCatalogProviderResult(
      provider,

      await provider
        .loadCampaignsDetailed(),
    );
  }

  return {
    data:
      await provider
        .loadCampaigns(),

    source:
      provider.source,

    issues:
      [],

    metadata:
      createCatalogSourceMetadata(
        provider.source,
      ),
  };
}

export async function loadCatalogCategoryProductsDetailed(
  provider:
    CatalogProvider,

  category:
    CatalogCategoryId,

  campaigns:
    readonly Campaign[],
): Promise<
  ResolvedCatalogProviderResult<Product[]>
> {
  if (
    provider
      .loadCategoryProductsDetailed
  ) {
    return normalizeCatalogProviderResult(
      provider,

      await provider
        .loadCategoryProductsDetailed(
          category,
          campaigns,
        ),
    );
  }

  return {
    data:
      await provider
        .loadCategoryProducts(
          category,
          campaigns,
        ),

    source:
      provider.source,

    issues:
      [],

    metadata:
      createCatalogSourceMetadata(
        provider.source,
      ),
  };
}