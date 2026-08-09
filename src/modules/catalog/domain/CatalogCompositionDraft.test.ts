import {
  describe,
  expect,
  it,
} from "vitest";

import {
  sanitizeCatalogCompositionDraft,
  sanitizeCatalogCompositionDraftList,
} from "@/modules/catalog/domain/CatalogCompositionDraft";

const validDraft = {
  id:
    "CAT-2026-ABC12345",

  name:
    "Catálogo cliente",

  status:
    "draft",

  composition: {
    mode:
      "hybrid",

    filters: {
      categoryIds: [
        "flores",
      ],

      campaignIds: [
        "navidad",
      ],

      attributes: {
        colors: [],
        tags: [],
      },
    },

    overrides: {
      includedProductIds: [
        "P-1",
      ],

      excludedProductIds: [
        "P-2",
      ],
    },
  },

  publicationIdentity: {
    title:
      "Catálogo Flores",

    description:
      "Selección comercial.",

    cover: {
      strategy:
        "auto",

      customImageUrl:
        "",
    },
  },

  publication:
    null,

  createdAt:
    "2026-08-07T20:00:00.000Z",

  updatedAt:
    "2026-08-07T20:00:00.000Z",

  version:
    3,
};

describe(
  "CatalogCompositionDraft",
  () => {
    it(
      "acepta un borrador V3 válido",
      () => {
        expect(
          sanitizeCatalogCompositionDraft(
            validDraft,
          ),
        ).toMatchObject({
          id:
            "CAT-2026-ABC12345",

          status:
            "draft",

          version:
            3,

          publication:
            null,
        });
      },
    );

    it(
      "migra V1 directamente a V3",
      () => {
        const {
          publicationIdentity:
            _identity,

          publication:
            _publication,

          ...legacy
        } =
          validDraft;

        expect(
          sanitizeCatalogCompositionDraft({
            ...legacy,
            version: 1,
          }),
        ).toMatchObject({
          version:
            3,

          publicationIdentity: {
            title:
              "Catálogo cliente",
          },

          publication:
            null,
        });
      },
    );

    it(
      "migra V2 a V3 conservando identidad",
      () => {
        const {
          publication:
            _publication,

          ...v2
        } =
          validDraft;

        expect(
          sanitizeCatalogCompositionDraft({
            ...v2,
            version: 2,
          }),
        ).toMatchObject({
          version:
            3,

          publicationIdentity: {
            title:
              "Catálogo Flores",
          },

          publication:
            null,
        });
      },
    );

    it(
      "acepta publicación V3 válida",
      () => {
        expect(
          sanitizeCatalogCompositionDraft({
            ...validDraft,

            status:
              "published",

            publication: {
              strategy:
                "fixed",

              productIds: [
                "P-1",
              ],

              publishedAt:
                "2026-08-07T20:00:00.000Z",

              validUntil:
                "2026-08-14T20:00:00.000Z",

              version:
                1,
            },
          }),
        ).toMatchObject({
          status:
            "published",

          publication: {
            strategy:
              "fixed",

            productIds: [
              "P-1",
            ],
          },
        });
      },
    );

    it(
      "rechaza una versión futura",
      () => {
        expect(
          sanitizeCatalogCompositionDraft({
            ...validDraft,
            version: 4,
          }),
        ).toBeNull();
      },
    );

    it(
      "rechaza publicación V3 inválida",
      () => {
        expect(
          sanitizeCatalogCompositionDraft({
            ...validDraft,

            publication: {
              strategy:
                "fixed",

              productIds:
                [],

              publishedAt:
                "2026-08-07T20:00:00.000Z",

              validUntil:
                "2026-08-14T20:00:00.000Z",

              version:
                1,
            },
          }),
        ).toBeNull();
      },
    );

    it(
      "rechaza IDs duplicados en lista persistida",
      () => {
        expect(
          sanitizeCatalogCompositionDraftList([
            validDraft,
            {
              ...validDraft,
            },
          ]),
        ).toBeNull();
      },
    );
  },
);