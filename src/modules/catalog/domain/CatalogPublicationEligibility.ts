import type {
  CatalogComposition,
} from "@/modules/catalog/domain/CatalogComposition";

import type {
  CatalogCompositionResolution,
} from "@/modules/catalog/domain/CatalogCompositionResolver";

import type {
  CatalogPublicationIdentity,
} from "@/modules/catalog/domain/CatalogPublicationIdentity";

export type CatalogPublicationEligibilityReason =
  | "MANUAL_MODE"
  | "MULTIPLE_CATEGORIES"
  | "MULTIPLE_CAMPAIGNS"
  | "EFFECTIVE_INCLUDED_PRODUCTS"
  | "EFFECTIVE_EXCLUDED_PRODUCTS"
  | "CUSTOM_TITLE"
  | "CUSTOM_DESCRIPTION"
  | "CUSTOM_COVER"
  | "UNSUPPORTED_ATTRIBUTE_FILTERS"
  | "BLOCKED_INCLUDED_PRODUCTS"
  | "MISSING_INCLUDED_PRODUCTS"
  | "UNRESOLVED_COMPOSITION";

export interface CatalogV2PublicationParams {
  categoryId?: string;

  campaignId?: string;
}

export interface ResolveCatalogPublicationEligibilityParams {
  composition:
    CatalogComposition;

  resolution:
    CatalogCompositionResolution;

  publicationIdentity?:
    CatalogPublicationIdentity;
}

interface CatalogPublicationEligibilityBase {
  effectiveAddedProductIds:
    readonly string[];

  effectiveRemovedProductIds:
    readonly string[];
}

export type CatalogPublicationEligibility =
  | (
      CatalogPublicationEligibilityBase & {
        status:
          "v2-publicable";

        v2:
          CatalogV2PublicationParams;

        reasons:
          readonly [];
      }
    )
  | (
      CatalogPublicationEligibilityBase & {
        status:
          "requires-public-id";

        reasons:
          readonly CatalogPublicationEligibilityReason[];
      }
    );

const normalizeId = (
  value:
    unknown,
) =>
  String(
    value ?? "",
  )
    .trim()
    .toLowerCase();

const uniqueNormalizedIds = (
  values:
    readonly string[],
) => {
  const result:
    string[] = [];

  const seen =
    new Set<string>();

  values.forEach(
    (value) => {
      const normalized =
        normalizeId(
          value,
        );

      if (
        !normalized ||
        seen.has(
          normalized,
        )
      ) {
        return;
      }

      seen.add(
        normalized,
      );

      result.push(
        normalized,
      );
    },
  );

  return result;
};

const uniqueProductIds = (
  values:
    readonly string[],
) => {
  const result:
    string[] = [];

  const seen =
    new Set<string>();

  values.forEach(
    (value) => {
      const normalized =
        normalizeId(
          value,
        );

      if (
        !normalized ||
        seen.has(
          normalized,
        )
      ) {
        return;
      }

      seen.add(
        normalized,
      );

      result.push(
        value,
      );
    },
  );

  return result;
};

const hasText = (
  value:
    unknown,
) =>
  String(
    value ?? "",
  ).trim().length >
  0;

export function resolveCatalogPublicationEligibility({
  composition,
  resolution,
  publicationIdentity,
}: ResolveCatalogPublicationEligibilityParams):
  CatalogPublicationEligibility {
  const categoryIds =
    uniqueNormalizedIds(
      composition
        .filters
        .categoryIds,
    );

  const campaignIds =
    uniqueNormalizedIds(
      composition
        .filters
        .campaignIds,
    );

  const automaticIds =
    new Set(
      resolution
        .automaticProductIds
        .map(
          normalizeId,
        ),
    );

  const finalIds =
    new Set(
      resolution
        .productIds
        .map(
          normalizeId,
        ),
    );

  const effectiveAddedProductIds =
    uniqueProductIds(
      resolution
        .productIds
        .filter(
          (productId) =>
            !automaticIds.has(
              normalizeId(
                productId,
              ),
            ),
        ),
    );

  const effectiveRemovedProductIds =
    uniqueProductIds(
      resolution
        .automaticProductIds
        .filter(
          (productId) =>
            !finalIds.has(
              normalizeId(
                productId,
              ),
            ),
        ),
    );

  const reasons:
    CatalogPublicationEligibilityReason[] =
      [];

  if (
    composition.mode ===
    "manual"
  ) {
    reasons.push(
      "MANUAL_MODE",
    );
  }

  if (
    categoryIds.length >
    1
  ) {
    reasons.push(
      "MULTIPLE_CATEGORIES",
    );
  }

  if (
    campaignIds.length >
    1
  ) {
    reasons.push(
      "MULTIPLE_CAMPAIGNS",
    );
  }

  if (
    effectiveAddedProductIds.length >
    0
  ) {
    reasons.push(
      "EFFECTIVE_INCLUDED_PRODUCTS",
    );
  }

  if (
    effectiveRemovedProductIds.length >
    0
  ) {
    reasons.push(
      "EFFECTIVE_EXCLUDED_PRODUCTS",
    );
  }

  if (
    publicationIdentity
  ) {
    if (
      hasText(
        publicationIdentity
          .title,
      )
    ) {
      reasons.push(
        "CUSTOM_TITLE",
      );
    }

    if (
      hasText(
        publicationIdentity
          .description,
      )
    ) {
      reasons.push(
        "CUSTOM_DESCRIPTION",
      );
    }

    if (
      publicationIdentity
        .cover
        .strategy ===
        "custom"
    ) {
      reasons.push(
        "CUSTOM_COVER",
      );
    }
  }

  if (
    resolution
      .unsupportedAttributeFilters
      .length >
    0
  ) {
    reasons.push(
      "UNSUPPORTED_ATTRIBUTE_FILTERS",
    );
  }

  if (
    resolution
      .blockedIncludedProductIds
      .length >
    0
  ) {
    reasons.push(
      "BLOCKED_INCLUDED_PRODUCTS",
    );
  }

  if (
    resolution
      .missingIncludedProductIds
      .length >
    0
  ) {
    reasons.push(
      "MISSING_INCLUDED_PRODUCTS",
    );
  }

  if (
    !resolution
      .isFullyResolved &&
    resolution
      .unsupportedAttributeFilters
      .length ===
      0 &&
    resolution
      .blockedIncludedProductIds
      .length ===
      0 &&
    resolution
      .missingIncludedProductIds
      .length ===
      0
  ) {
    reasons.push(
      "UNRESOLVED_COMPOSITION",
    );
  }

  if (
    reasons.length >
    0
  ) {
    return {
      status:
        "requires-public-id",

      reasons,

      effectiveAddedProductIds,

      effectiveRemovedProductIds,
    };
  }

  const v2:
    CatalogV2PublicationParams =
      {};

  if (
    categoryIds.length ===
    1
  ) {
    v2.categoryId =
      categoryIds[0];
  }

  if (
    campaignIds.length ===
    1
  ) {
    v2.campaignId =
      campaignIds[0];
  }

  return {
    status:
      "v2-publicable",

    v2,

    reasons: [],

    effectiveAddedProductIds,

    effectiveRemovedProductIds,
  };
}
