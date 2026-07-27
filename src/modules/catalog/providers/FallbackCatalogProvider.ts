import type {
  Campaign,
  Product,
} from "@/shared/types/product";

import type {
  CatalogCategoryId,
  CatalogProvider,
  CatalogProviderSource,
} from "./CatalogProvider";

export interface CatalogSourceMetadata {
  requestedSource:
    CatalogProviderSource;
  resolvedSource:
    CatalogProviderSource;
  fallbackUsed: boolean;
  fallbackReason?: string;
}

export interface CatalogProviderLoad<T> {
  data: T;
  metadata:
    CatalogSourceMetadata;
}

function failureReason(
  cause: unknown,
): string {
  return cause instanceof Error &&
    cause.name
    ? cause.name
    : "PROVIDER_ERROR";
}

export class FallbackCatalogProvider
  implements CatalogProvider {
  readonly source:
    CatalogProviderSource;

  constructor(
    private readonly primary:
      CatalogProvider,
    private readonly fallback:
      CatalogProvider,
  ) {
    this.source =
      primary.source;
  }

  getCategories():
    readonly CatalogCategoryId[] {
    return this.primary
      .getCategories();
  }

  async loadCampaigns():
    Promise<Campaign[]> {
    try {
      return await this.primary
        .loadCampaigns();
    } catch {
      return this.fallback
        .loadCampaigns();
    }
  }

  async loadCategoryProducts(
    category:
      CatalogCategoryId,
    campaigns:
      readonly Campaign[],
  ): Promise<Product[]> {
    return (
      await this
        .loadCategoryProductsWithMetadata(
          category,
          campaigns,
        )
    ).data;
  }

  async loadCategoryProductsWithMetadata(
    category:
      CatalogCategoryId,
    campaigns:
      readonly Campaign[],
  ): Promise<
    CatalogProviderLoad<Product[]>
  > {
    try {
      const data =
        await this.primary
          .loadCategoryProducts(
            category,
            campaigns,
          );

      return {
        data,
        metadata: {
          requestedSource:
            this.primary.source,
          resolvedSource:
            this.primary.source,
          fallbackUsed: false,
        },
      };
    } catch (cause: unknown) {
      const data =
        await this.fallback
          .loadCategoryProducts(
            category,
            campaigns,
          );

      return {
        data,
        metadata: {
          requestedSource:
            this.primary.source,
          resolvedSource:
            this.fallback.source,
          fallbackUsed: true,
          fallbackReason:
            failureReason(cause),
        },
      };
    }
  }
}
