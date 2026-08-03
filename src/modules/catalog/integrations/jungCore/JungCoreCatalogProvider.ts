import type {
  Campaign,
  Product,
} from "@/shared/types/product";

import {
  validateAndAdaptCatalogSnapshotToLegacy,
  type CatalogSnapshotCompatibilityResult,
  type LegacySnapshotAdapterOptions,
} from "@/modules/catalog/adapters/LegacySnapshotAdapter";

import type {
  CatalogCategoryId,
  CatalogProvider,
  CatalogProviderIssue,
  CatalogProviderResult,
} from "@/modules/catalog/providers/CatalogProvider";

import type {
  JungCoreSnapshotLoader,
} from "./JungCoreSnapshotLoader";

export type JungCoreCatalogProviderStatus =
  | "idle"
  | "loading"
  | "ready"
  | "error";

export type JungCoreCatalogProviderErrorCode =
  | "JUNG_CORE_SNAPSHOT_LOAD_FAILED"
  | "JUNG_CORE_SNAPSHOT_INVALID"
  | "JUNG_CORE_BRAND_MISMATCH";

export interface JungCoreCatalogProviderState {
  status:
    JungCoreCatalogProviderStatus;

  revision:
    string | null;

  generatedAt:
    string | null;

  loadedAt:
    number | null;

  productIssueCount:
    number;

  unsupportedTierCount:
    number;

  lastErrorCode:
    JungCoreCatalogProviderErrorCode | null;
}

export interface JungCoreCatalogProviderDiagnostics {
  receivedCount: number;
  validCount: number;
  rejectedCount: number;
  unsupportedTierCount: number;
}

export interface JungCoreCatalogProductsResult
  extends CatalogProviderResult<Product[]> {
  diagnostics:
    JungCoreCatalogProviderDiagnostics;
}

export interface JungCoreCatalogProviderOptions
  extends LegacySnapshotAdapterOptions {
  loader:
    JungCoreSnapshotLoader;

  expectedBrandId:
    string;

  bootstrapCategories:
    readonly CatalogCategoryId[];

  now?:
    () => number;
}

export class JungCoreCatalogProviderError
  extends Error {
  readonly code:
    JungCoreCatalogProviderErrorCode;

  readonly providerCause?:
    unknown;

  constructor(
    code:
      JungCoreCatalogProviderErrorCode,

    message:
      string,

    providerCause?:
      unknown,
  ) {
    super(message);

    this.name =
      "JungCoreCatalogProviderError";

    this.code =
      code;

    this.providerCause =
      providerCause;
  }
}

function cleanRequiredText(
  value: unknown,
  field: string,
): string {
  const normalized =
    String(value ?? "").trim();

  if (!normalized) {
    throw new Error(
      `${field} no puede estar vacío.`,
    );
  }

  return normalized;
}

function uniqueCategories(
  categories:
    readonly CatalogCategoryId[],
): CatalogCategoryId[] {
  return Array.from(
    new Set(
      categories.filter(
        (category) =>
          Boolean(
            String(
              category ?? "",
            ).trim(),
          ),
      ),
    ),
  );
}

function providerIssue(
  code: string,
  message: string,
  itemIndex?: number,
): CatalogProviderIssue {
  return {
    code,
    message,
    itemIndex,
  };
}

export class JungCoreCatalogProvider
  implements CatalogProvider {
  readonly source =
    "jung-core" as const;

  private readonly loader:
    JungCoreSnapshotLoader;

  private readonly expectedBrandId:
    string;

  private readonly bootstrapCategories:
    readonly CatalogCategoryId[];

  private readonly adapterOptions:
    LegacySnapshotAdapterOptions;

  private readonly now:
    () => number;

  private snapshotCache:
    CatalogSnapshotCompatibilityResult | null =
      null;

  private pendingSnapshot:
    Promise<CatalogSnapshotCompatibilityResult> | null =
      null;

  private state:
    JungCoreCatalogProviderState = {
      status:
        "idle",

      revision:
        null,

      generatedAt:
        null,

      loadedAt:
        null,

      productIssueCount:
        0,

      unsupportedTierCount:
        0,

      lastErrorCode:
        null,
    };

  constructor(
    options:
      JungCoreCatalogProviderOptions,
  ) {
    this.loader =
      options.loader;

    this.expectedBrandId =
      cleanRequiredText(
        options.expectedBrandId,
        "expectedBrandId",
      );

    this.bootstrapCategories =
      uniqueCategories(
        options.bootstrapCategories,
      );

    this.adapterOptions = {
      resolveColorClass:
        options.resolveColorClass,
    };

    this.now =
      options.now ??
      Date.now;
  }

  getCategories():
    readonly CatalogCategoryId[] {
    return [
      ...(
        this.snapshotCache
          ?.categories ??
        this.bootstrapCategories
      ),
    ];
  }

  getState():
    JungCoreCatalogProviderState {
    return {
      ...this.state,
    };
  }

  async loadCampaigns():
    Promise<Campaign[]> {
    const snapshot =
      await this.ensureSnapshot();

    return [
      ...snapshot.campaigns,
    ];
  }

  async loadCategoryProducts(
    category:
      CatalogCategoryId,

    campaigns:
      readonly Campaign[],
  ): Promise<Product[]> {
    const result =
      await this
        .loadCategoryProductsDetailed(
          category,
          campaigns,
        );

    return result.data;
  }

  async loadCategoryProductsDetailed(
    category:
      CatalogCategoryId,

    _campaigns:
      readonly Campaign[],
  ): Promise<
    JungCoreCatalogProductsResult
  > {
    const snapshot =
      await this.ensureSnapshot();

    const categoryIsPublished =
      snapshot.categories.includes(
        category,
      );

    const products =
      categoryIsPublished
        ? [
            ...(
              snapshot
                .productsByCategory
                .get(category) ??
              []
            ),
          ]
        : [];

    const productIssues =
      categoryIsPublished
        ? snapshot.productIssues.filter(
            (issue) =>
              issue.categoryId ===
                category,
          )
        : [];

    const unsupportedVolumePrices =
      categoryIsPublished
        ? snapshot
            .unsupportedVolumePrices
            .filter(
              (entry) =>
                entry.categoryId ===
                  category,
            )
        : [];

    return {
      data:
        products,

      source:
        this.source,

      issues:
        productIssues.map(
          (issue) =>
            providerIssue(
              issue.code,
              issue.message,
              issue.productIndex,
            ),
        ),

      diagnostics: {
        receivedCount:
          products.length,

        validCount:
          products.length,

        rejectedCount:
          0,

        unsupportedTierCount:
          unsupportedVolumePrices.length,
      },
    };
  }

  private async ensureSnapshot():
    Promise<
      CatalogSnapshotCompatibilityResult
    > {
    if (this.snapshotCache) {
      return this.snapshotCache;
    }

    if (this.pendingSnapshot) {
      return this.pendingSnapshot;
    }

    this.state = {
      status:
        "loading",

      revision:
        null,

      generatedAt:
        null,

      loadedAt:
        null,

      productIssueCount:
        0,

      unsupportedTierCount:
        0,

      lastErrorCode:
        null,
    };

    const request =
      this.loadAndAdaptSnapshot()
        .then(
          (snapshot) => {
            this.snapshotCache =
              snapshot;

            this.state = {
              status:
                "ready",

              revision:
                snapshot.revision,

              generatedAt:
                snapshot.generatedAt,

              loadedAt:
                this.now(),

              productIssueCount:
                snapshot
                  .productIssues
                  .length,

              unsupportedTierCount:
                snapshot
                  .unsupportedVolumePrices
                  .length,

              lastErrorCode:
                null,
            };

            return snapshot;
          },
        )
        .catch(
          (cause: unknown) => {
            const error =
              cause instanceof
                JungCoreCatalogProviderError
                ? cause
                : new JungCoreCatalogProviderError(
                    "JUNG_CORE_SNAPSHOT_LOAD_FAILED",

                    "No se pudo cargar el snapshot de JUNG CORE.",

                    cause,
                  );

            this.state = {
              status:
                "error",

              revision:
                null,

              generatedAt:
                null,

              loadedAt:
                null,

              productIssueCount:
                0,

              unsupportedTierCount:
                0,

              lastErrorCode:
                error.code,
            };

            throw error;
          },
        )
        .finally(
          () => {
            if (
              this.pendingSnapshot ===
                request
            ) {
              this.pendingSnapshot =
                null;
            }
          },
        );

    this.pendingSnapshot =
      request;

    return request;
  }

  private async loadAndAdaptSnapshot():
    Promise<
      CatalogSnapshotCompatibilityResult
    > {
    let value:
      unknown;

    try {
      value =
        await this.loader
          .loadSnapshot();
    } catch (cause: unknown) {
      throw new JungCoreCatalogProviderError(
        "JUNG_CORE_SNAPSHOT_LOAD_FAILED",

        "El loader no pudo obtener el snapshot de JUNG CORE.",

        cause,
      );
    }

    const adaptation =
      validateAndAdaptCatalogSnapshotToLegacy(
        value,
        this.adapterOptions,
      );

    if (adaptation.ok === false) {
      throw new JungCoreCatalogProviderError(
        "JUNG_CORE_SNAPSHOT_INVALID",

        "El snapshot de JUNG CORE no cumple catalog-snapshot.v1.",

        adaptation.errors,
      );
    }

    const actualBrandId =
      String(
        adaptation.data.brandId,
      ).trim();

    if (
      actualBrandId !==
        this.expectedBrandId
    ) {
      throw new JungCoreCatalogProviderError(
        "JUNG_CORE_BRAND_MISMATCH",

        `El snapshot pertenece a "${actualBrandId}" y se esperaba "${this.expectedBrandId}".`,
      );
    }

    return adaptation.data;
  }
}