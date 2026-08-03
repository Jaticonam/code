import type {
  Campaign,
  Product,
} from "@/shared/types/product";

import type {
  CatalogCategoryId,
  CatalogProvider,
  CatalogProviderLoad,
  CatalogProviderResult,
  CatalogSourceMetadata,
  ResolvedCatalogProviderResult,
} from "./CatalogProvider";

import {
  createCatalogSourceMetadata,
  loadCatalogCampaignsDetailed,
  loadCatalogCategoryProductsDetailed,
} from "./CatalogProvider";

export type {
  CatalogProviderLoad,
  CatalogSourceMetadata,
} from "./CatalogProvider";

function failureReason(
  cause:
    unknown,
): string {
  return (
    cause instanceof Error &&
    cause.name
      ? cause.name
      : "PROVIDER_ERROR"
  );
}

function composeMetadata<T>(
  requestedSource:
    CatalogProvider["source"],

  result:
    ResolvedCatalogProviderResult<T>,

  options: {
    fallbackUsed?:
      boolean;

    fallbackReason?:
      string;
  } = {},
): CatalogSourceMetadata {
  return createCatalogSourceMetadata(
    requestedSource,
    result.metadata
      .resolvedSource,

    {
      fallbackUsed:
        options.fallbackUsed ||
        result.metadata
          .fallbackUsed,

      fallbackReason:
        options.fallbackReason ??
        result.metadata
          .fallbackReason,
    },
  );
}

function composeResult<T>(
  requestedSource:
    CatalogProvider["source"],

  result:
    ResolvedCatalogProviderResult<T>,

  options: {
    fallbackUsed?:
      boolean;

    fallbackReason?:
      string;
  } = {},
): ResolvedCatalogProviderResult<T> {
  const metadata =
    composeMetadata(
      requestedSource,
      result,
      options,
    );

  return {
    data:
      result.data,

    source:
      metadata.resolvedSource,

    issues:
      result.issues,

    metadata,
  };
}

export class FallbackCatalogProvider
  implements CatalogProvider {
  readonly source:
    CatalogProvider["source"];

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
    return (
      await this
        .loadCampaignsDetailed()
    ).data;
  }

  async loadCampaignsDetailed():
    Promise<
      CatalogProviderResult<Campaign[]>
    > {
    try {
      const result =
        await loadCatalogCampaignsDetailed(
          this.primary,
        );

      return composeResult(
        this.primary.source,
        result,
      );
    } catch (cause: unknown) {
      const result =
        await loadCatalogCampaignsDetailed(
          this.fallback,
        );

      return composeResult(
        this.primary.source,
        result,

        {
          fallbackUsed:
            true,

          fallbackReason:
            failureReason(
              cause,
            ),
        },
      );
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
        .loadCategoryProductsDetailed(
          category,
          campaigns,
        )
    ).data;
  }

  async loadCategoryProductsDetailed(
    category:
      CatalogCategoryId,

    campaigns:
      readonly Campaign[],
  ): Promise<
    CatalogProviderResult<Product[]>
  > {
    try {
      const result =
        await loadCatalogCategoryProductsDetailed(
          this.primary,
          category,
          campaigns,
        );

      return composeResult(
        this.primary.source,
        result,
      );
    } catch (cause: unknown) {
      const result =
        await loadCatalogCategoryProductsDetailed(
          this.fallback,
          category,
          campaigns,
        );

      return composeResult(
        this.primary.source,
        result,

        {
          fallbackUsed:
            true,

          fallbackReason:
            failureReason(
              cause,
            ),
        },
      );
    }
  }

  async loadCategoryProductsWithMetadata(
    category:
      CatalogCategoryId,

    campaigns:
      readonly Campaign[],
  ): Promise<
    CatalogProviderLoad<Product[]>
  > {
    const result =
      await this
        .loadCategoryProductsDetailed(
          category,
          campaigns,
        );

    return {
      data:
        result.data,

      metadata:
        result.metadata ??
        createCatalogSourceMetadata(
          this.source,
          result.source,
        ),
    };
  }
}