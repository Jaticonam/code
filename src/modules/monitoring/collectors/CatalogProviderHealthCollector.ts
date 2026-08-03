import {
  loadCatalogCampaignsDetailed,
  loadCatalogCategoryProductsDetailed,
} from "@/modules/catalog/providers/CatalogProvider";

import type {
  CatalogProvider,
  ResolvedCatalogProviderResult,
} from "@/modules/catalog/providers/CatalogProvider";

import type {
  CatalogSourceMode,
} from "@/shared/config/application/CatalogSourceMode";

import type {
  Product,
} from "@/shared/types/product";

import type {
  HealthCollector,
  HealthComponentData,
} from "../contracts/HealthCollector";

export interface CatalogProviderHealthSnapshot {
  requestedSource:
    string;

  resolvedSource:
    string;

  fallbackUsed:
    boolean;

  receivedCount:
    number;

  validCount:
    number;

  rejectedCount:
    number;

  issueCounts:
    Readonly<
      Record<string, number>
    >;

  unsupportedTierCount:
    number;

  durationMs:
    number;
}

interface DetailedProductResult
  extends
    ResolvedCatalogProviderResult<Product[]> {
  diagnostics?: {
    receivedCount?:
      number;

    validCount?:
      number;

    rejectedCount?:
      number;

    unsupportedTierCount?:
      number;
  };
}

function incrementIssue(
  counts:
    Record<string, number>,

  code:
    string,
): void {
  counts[code] =
    (counts[code] ?? 0) + 1;
}

export async function collectCatalogProviderHealth(
  provider:
    CatalogProvider,

  requestedSource:
    CatalogSourceMode =
      provider.source,

  now:
    () => number =
      Date.now,
): Promise<
  CatalogProviderHealthSnapshot
> {
  const startedAt =
    now();

  let resolvedSource:
    CatalogSourceMode =
      provider.source;

  let fallbackUsed =
    false;

  let receivedCount =
    0;

  let validCount =
    0;

  let rejectedCount =
    0;

  let unsupportedTierCount =
    0;

  const issueCounts:
    Record<string, number> = {};

  try {
    const campaignResult =
      await loadCatalogCampaignsDetailed(
        provider,
      );

    const campaigns =
      campaignResult.data;

    resolvedSource =
      campaignResult
        .metadata
        .resolvedSource;

    fallbackUsed =
      campaignResult
        .metadata
        .fallbackUsed;

    campaignResult
      .issues
      .forEach(
        (issue) =>
          incrementIssue(
            issueCounts,
            issue.code,
          ),
      );

    for (
      const category of
      provider.getCategories()
    ) {
      const result =
        await loadCatalogCategoryProductsDetailed(
          provider,
          category,
          campaigns,
        ) as
          DetailedProductResult;

      const diagnostics =
        result.diagnostics;

      resolvedSource =
        result
          .metadata
          .resolvedSource;

      fallbackUsed =
        fallbackUsed ||
        result
          .metadata
          .fallbackUsed;

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

      result
        .issues
        .forEach(
          (issue) =>
            incrementIssue(
              issueCounts,
              issue.code,
            ),
        );
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
      CatalogSourceMode =
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
        snapshot
          .issueCounts
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