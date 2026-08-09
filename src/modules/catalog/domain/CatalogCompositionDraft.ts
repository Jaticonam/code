import type {
  CatalogComposition,
  CatalogCompositionMode,
} from "@/modules/catalog/domain/CatalogComposition";

import {
  cloneCatalogPublicationIdentity,
  createDefaultCatalogPublicationIdentity,
  sanitizeCatalogPublicationIdentity,
  type CatalogPublicationIdentity,
} from "@/modules/catalog/domain/CatalogPublicationIdentity";

import {
  cloneCatalogPublicationSnapshot,
  sanitizeCatalogPublicationSnapshot,
  type CatalogPublicationSnapshot,
} from "@/modules/catalog/domain/CatalogPublication";

export const CATALOG_COMPOSITION_DRAFT_VERSION =
  3 as const;

export type CatalogCompositionDraftStatus =
  | "draft"
  | "published"
  | "expired"
  | "archived";

export interface CatalogCompositionDraft {
  id: string;

  name: string;

  status:
    CatalogCompositionDraftStatus;

  composition:
    CatalogComposition;

  publicationIdentity:
    CatalogPublicationIdentity;

  publication:
    CatalogPublicationSnapshot | null;

  createdAt:
    string;

  updatedAt:
    string;

  version:
    typeof CATALOG_COMPOSITION_DRAFT_VERSION;
}

const VALID_MODES:
  readonly CatalogCompositionMode[] =
  [
    "automatic",
    "hybrid",
    "manual",
  ];

const VALID_STATUSES:
  readonly CatalogCompositionDraftStatus[] =
  [
    "draft",
    "published",
    "expired",
    "archived",
  ];

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value ===
      "object" &&
    value !==
      null &&
    !Array.isArray(
      value,
    )
  );
}

function sanitizeStringArray(
  value: unknown,
): string[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const result:
    string[] = [];

  const seen =
    new Set<string>();

  for (const candidate of value) {
    if (
      typeof candidate !==
        "string"
    ) {
      return null;
    }

    const normalized =
      candidate.trim();

    if (!normalized) {
      continue;
    }

    if (
      seen.has(
        normalized,
      )
    ) {
      continue;
    }

    seen.add(
      normalized,
    );

    result.push(
      normalized,
    );
  }

  return result;
}

function sanitizeComposition(
  value: unknown,
): CatalogComposition | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    typeof value.mode !==
      "string" ||
    !VALID_MODES.includes(
      value.mode as CatalogCompositionMode,
    )
  ) {
    return null;
  }

  if (
    !isRecord(
      value.filters,
    ) ||
    !isRecord(
      value.overrides,
    )
  ) {
    return null;
  }

  const categoryIds =
    sanitizeStringArray(
      value.filters.categoryIds,
    );

  const campaignIds =
    sanitizeStringArray(
      value.filters.campaignIds,
    );

  const includedProductIds =
    sanitizeStringArray(
      value.overrides
        .includedProductIds,
    );

  const excludedProductIds =
    sanitizeStringArray(
      value.overrides
        .excludedProductIds,
    );

  if (
    categoryIds ===
      null ||
    campaignIds ===
      null ||
    includedProductIds ===
      null ||
    excludedProductIds ===
      null
  ) {
    return null;
  }

  let colors:
    string[] = [];

  let tags:
    string[] = [];

  if (
    value.filters.attributes !==
      undefined
  ) {
    if (
      !isRecord(
        value.filters.attributes,
      )
    ) {
      return null;
    }

    const parsedColors =
      sanitizeStringArray(
        value.filters.attributes
          .colors ??
          [],
      );

    const parsedTags =
      sanitizeStringArray(
        value.filters.attributes
          .tags ??
          [],
      );

    if (
      parsedColors ===
        null ||
      parsedTags ===
        null
    ) {
      return null;
    }

    colors =
      parsedColors;

    tags =
      parsedTags;
  }

  return {
    mode:
      value.mode as CatalogCompositionMode,

    filters: {
      categoryIds,
      campaignIds,

      attributes: {
        colors,
        tags,
      },
    },

    overrides: {
      includedProductIds,
      excludedProductIds,
    },
  };
}

function isValidIsoDate(
  value: unknown,
): value is string {
  return (
    typeof value ===
      "string" &&
    value.trim().length >
      0 &&
    !Number.isNaN(
      Date.parse(
        value,
      ),
    )
  );
}

export function cloneCatalogComposition(
  composition:
    CatalogComposition,
): CatalogComposition {
  return {
    mode:
      composition.mode,

    filters: {
      categoryIds: [
        ...composition
          .filters
          .categoryIds,
      ],

      campaignIds: [
        ...composition
          .filters
          .campaignIds,
      ],

      attributes: {
        colors: [
          ...(
            composition
              .filters
              .attributes
              ?.colors ??
            []
          ),
        ],

        tags: [
          ...(
            composition
              .filters
              .attributes
              ?.tags ??
            []
          ),
        ],
      },
    },

    overrides: {
      includedProductIds: [
        ...composition
          .overrides
          .includedProductIds,
      ],

      excludedProductIds: [
        ...composition
          .overrides
          .excludedProductIds,
      ],
    },
  };
}

export function cloneCatalogCompositionDraft(
  draft:
    CatalogCompositionDraft,
): CatalogCompositionDraft {
  return {
    ...draft,

    composition:
      cloneCatalogComposition(
        draft.composition,
      ),

    publicationIdentity:
      cloneCatalogPublicationIdentity(
        draft.publicationIdentity,
      ),

    publication:
      draft.publication
        ? cloneCatalogPublicationSnapshot(
            draft.publication,
          )
        : null,
  };
}

export function sanitizeCatalogCompositionDraft(
  value: unknown,
): CatalogCompositionDraft | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    value.version !==
      1 &&
    value.version !==
      2 &&
    value.version !==
      CATALOG_COMPOSITION_DRAFT_VERSION
  ) {
    return null;
  }

  if (
    typeof value.id !==
      "string" ||
    !value.id.trim()
  ) {
    return null;
  }

  if (
    typeof value.name !==
      "string" ||
    !value.name.trim()
  ) {
    return null;
  }

  if (
    typeof value.status !==
      "string" ||
    !VALID_STATUSES.includes(
      value.status as CatalogCompositionDraftStatus,
    )
  ) {
    return null;
  }

  if (
    !isValidIsoDate(
      value.createdAt,
    ) ||
    !isValidIsoDate(
      value.updatedAt,
    )
  ) {
    return null;
  }

  const composition =
    sanitizeComposition(
      value.composition,
    );

  if (!composition) {
    return null;
  }

  const publicationIdentity =
    value.version ===
      1
      ? createDefaultCatalogPublicationIdentity(
          value.name,
        )
      : sanitizeCatalogPublicationIdentity(
          value.publicationIdentity,
        );

  if (!publicationIdentity) {
    return null;
  }

  let publication:
    CatalogPublicationSnapshot | null =
      null;

  if (
    value.version ===
      CATALOG_COMPOSITION_DRAFT_VERSION
  ) {
    if (
      value.publication !==
        null
    ) {
      publication =
        sanitizeCatalogPublicationSnapshot(
          value.publication,
        );

      if (!publication) {
        return null;
      }
    }
  }

  return {
    id:
      value.id.trim(),

    name:
      value.name.trim(),

    status:
      value.status as CatalogCompositionDraftStatus,

    composition,

    publicationIdentity,

    publication,

    createdAt:
      value.createdAt,

    updatedAt:
      value.updatedAt,

    version:
      CATALOG_COMPOSITION_DRAFT_VERSION,
  };
}

export function sanitizeCatalogCompositionDraftList(
  value: unknown,
): CatalogCompositionDraft[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const result:
    CatalogCompositionDraft[] =
      [];

  const ids =
    new Set<string>();

  for (const candidate of value) {
    const draft =
      sanitizeCatalogCompositionDraft(
        candidate,
      );

    if (!draft) {
      return null;
    }

    if (
      ids.has(
        draft.id,
      )
    ) {
      return null;
    }

    ids.add(
      draft.id,
    );

    result.push(
      draft,
    );
  }

  return result;
}