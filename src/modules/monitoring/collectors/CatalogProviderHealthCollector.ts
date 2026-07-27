import type {
  CatalogProvider,
  CatalogProviderResult,
  CatalogProviderSource,
} from "@/modules/catalog/providers/CatalogProvider";
import type {
  CatalogSourceMetadata,
} from "@/modules/catalog/providers/FallbackCatalogProvider";
import type {
  Product,
} from "@/shared/types/product";
import type {
  HealthCollector,
  HealthComponentData,
} from "../contracts/HealthCollector";

export interface CatalogProviderHealthSnapshot {
  requestedSource: string;
  resolvedSource: string;
  fallbackUsed: boolean;
  receivedCount: number;
  validCount: number;
  rejectedCount: number;
  issueCounts:
    Readonly<
      Record<string, number>
    >;
  unsupportedTierCount: number;
  durationMs: number;
}

interface DetailedProviderResult
  extends CatalogProviderResult<Product[]> {
  diagnostics?: {
    receivedCount?: number;
    validCount?: number;
    rejectedCount?: number;
    unsupportedTierCount?: number;
  };
}

interface ProviderWithMetadata {
  loadCategoryProductsWithMetadata(
    category: string,
    campaigns:
      readonly unknown[],
  ): Promise<{
    data: Product[];
    metadata:
      CatalogSourceMetadata;
  }>;
}

function hasMetadataLoader(
  provider: CatalogProvider,
): provider is
  CatalogProvider &
  ProviderWithMetadata {
  return (
    "loadCategoryProductsWithMetadata" in
      provider &&
    typeof provider
      .loadCategoryProductsWithMetadata ===
      "function"
  );
}

function incrementIssue(
  counts: Record<string, number>,
  code: string,
): void {
  counts[code] =
    (counts[code] ?? 0) + 1;
}

export async function collectCatalogProviderHealth(
  provider: CatalogProvider,
  requestedSource:
    CatalogProviderSource =
      provider.source,
  now: () => number =
    Date.now,
): Promise<
  CatalogProviderHealthSnapshot
> {
  const startedAt = now();
  let resolvedSource:
    CatalogProviderSource =
      provider.source;
  let fallbackUsed = false;
  let receivedCount = 0;
  let validCount = 0;
  let rejectedCount = 0;
  let unsupportedTierCount = 0;
  const issueCounts:
    Record<string, number> = {};

  try {
    const campaigns =
      await provider
        .loadCampaigns();

    for (
      const category of
      provider.getCategories()
    ) {
      if (
        provider
          .loadCategoryProductsDetailed
      ) {
        const result =
          await provider
            .loadCategoryProductsDetailed(
              category,
              campaigns,
            ) as
              DetailedProviderResult;
        const diagnostics =
          result.diagnostics;

        receivedCount +=
          diagnostics
            ?.receivedCount ??
          result.data.length;
        validCount +=
          diagnostics
            ?.validCount ??
          result.data.length;
        rejectedCount +=
          diagnostics
            ?.rejectedCount ??
          0;
        unsupportedTierCount +=
          diagnostics
            ?.unsupportedTierCount ??
          0;
        result.issues.forEach(
          (issue) =>
            incrementIssue(
              issueCounts,
              issue.code,
            ),
        );
        continue;
      }

      if (
        hasMetadataLoader(
          provider,
        )
      ) {
        const result =
          await provider
            .loadCategoryProductsWithMetadata(
              category,
              campaigns,
            );

        receivedCount +=
          result.data.length;
        validCount +=
          result.data.length;
        resolvedSource =
          result.metadata
            .resolvedSource;
        fallbackUsed =
          fallbackUsed ||
          result.metadata
            .fallbackUsed;
        continue;
      }

      const products =
        await provider
          .loadCategoryProducts(
            category,
            campaigns,
          );

      receivedCount +=
        products.length;
      validCount +=
        products.length;
    }
  } catch {
    incrementIssue(
      issueCounts,
      "PROVIDER_ERROR",
    );
  }

  return {
    requestedSource,
    resolvedSource,
    fallbackUsed,
    receivedCount,
    validCount,
    rejectedCount,
    issueCounts,
    unsupportedTierCount,
    durationMs:
      Math.max(
        0,
        now() - startedAt,
      ),
  };
}

export class CatalogProviderHealthCollector
  implements
    HealthCollector<HealthComponentData> {
  readonly id =
    "catalog-provider";

  constructor(
    private readonly provider:
      CatalogProvider,
    private readonly requestedSource:
      CatalogProviderSource =
        provider.source,
    private readonly now:
      () => number =
        Date.now,
  ) {}

  async collect():
    Promise<HealthComponentData> {
    const snapshot =
      await collectCatalogProviderHealth(
        this.provider,
        this.requestedSource,
        this.now,
      );
    const providerFailed =
      Boolean(
        snapshot.issueCounts
          .PROVIDER_ERROR,
      );
    const degraded =
      snapshot.fallbackUsed ||
      snapshot.rejectedCount > 0;

    return {
      status:
        providerFailed
          ? "error"
          : degraded
            ? "warning"
            : "ok",
      score:
        providerFailed
          ? 0
          : degraded
            ? 80
            : 100,
      details:
        snapshot,
    };
  }
}
