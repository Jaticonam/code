import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createEmptyCatalogComposition,
  type CatalogComposition,
} from "./CatalogComposition";

import type {
  CatalogCompositionResolution,
} from "./CatalogCompositionResolver";

import {
  createDefaultCatalogPublicationIdentity,
} from "./CatalogPublicationIdentity";

import {
  resolveCatalogPublicationEligibility,
} from "./CatalogPublicationEligibility";

const createResolution = (
  overrides:
    Partial<CatalogCompositionResolution> =
      {},
): CatalogCompositionResolution => ({
  products: [],

  productIds: [],

  automaticProductIds: [],

  manuallyIncludedProductIds: [],

  excludedProductIds: [],

  blockedIncludedProductIds: [],

  missingIncludedProductIds: [],

  unsupportedAttributeFilters: [],

  isFullyResolved: true,

  ...overrides,
});

const createComposition = (
  overrides:
    Partial<CatalogComposition> =
      {},
): CatalogComposition => {
  const base =
    createEmptyCatalogComposition();

  return {
    ...base,
    ...overrides,

    filters: {
      ...base.filters,
      ...overrides.filters,
    },

    overrides: {
      ...base.overrides,
      ...overrides.overrides,
    },
  };
};

describe(
  "CatalogPublicationEligibility",
  () => {
    it(
      "publica por V2 el catálogo general",
      () => {
        expect(
          resolveCatalogPublicationEligibility({
            composition:
              createComposition(),

            resolution:
              createResolution(),
          }),
        ).toEqual({
          status:
            "v2-publicable",

          v2: {},

          reasons: [],

          effectiveAddedProductIds:
            [],

          effectiveRemovedProductIds:
            [],
        });
      },
    );

    it(
      "publica por V2 una categoría",
      () => {
        const result =
          resolveCatalogPublicationEligibility({
            composition:
              createComposition({
                filters: {
                  categoryIds: [
                    " Flores ",
                  ],

                  campaignIds:
                    [],
                },
              }),

            resolution:
              createResolution(),
          });

        expect(
          result,
        ).toMatchObject({
          status:
            "v2-publicable",

          v2: {
            categoryId:
              "flores",
          },
        });
      },
    );

    it(
      "publica por V2 una campaña",
      () => {
        const result =
          resolveCatalogPublicationEligibility({
            composition:
              createComposition({
                filters: {
                  categoryIds:
                    [],

                  campaignIds: [
                    " Navidad ",
                  ],
                },
              }),

            resolution:
              createResolution(),
          });

        expect(
          result,
        ).toMatchObject({
          status:
            "v2-publicable",

          v2: {
            campaignId:
              "navidad",
          },
        });
      },
    );

    it(
      "publica por V2 una categoría más una campaña",
      () => {
        const result =
          resolveCatalogPublicationEligibility({
            composition:
              createComposition({
                filters: {
                  categoryIds: [
                    "Flores",
                  ],

                  campaignIds: [
                    "Navidad",
                  ],
                },
              }),

            resolution:
              createResolution(),
          });

        expect(
          result,
        ).toMatchObject({
          status:
            "v2-publicable",

          v2: {
            categoryId:
              "flores",

            campaignId:
              "navidad",
          },
        });
      },
    );

    it(
      "requiere public id para varias categorías",
      () => {
        const result =
          resolveCatalogPublicationEligibility({
            composition:
              createComposition({
                filters: {
                  categoryIds: [
                    "flores",
                    "peluches",
                  ],

                  campaignIds:
                    [],
                },
              }),

            resolution:
              createResolution(),
          });

        expect(
          result,
        ).toMatchObject({
          status:
            "requires-public-id",

          reasons:
            expect.arrayContaining([
              "MULTIPLE_CATEGORIES",
            ]),
        });
      },
    );

    it(
      "requiere public id para varias campañas",
      () => {
        const result =
          resolveCatalogPublicationEligibility({
            composition:
              createComposition({
                filters: {
                  categoryIds:
                    [],

                  campaignIds: [
                    "navidad",
                    "san-valentin",
                  ],
                },
              }),

            resolution:
              createResolution(),
          });

        expect(
          result,
        ).toMatchObject({
          status:
            "requires-public-id",

          reasons:
            expect.arrayContaining([
              "MULTIPLE_CAMPAIGNS",
            ]),
        });
      },
    );

    it(
      "no considera agregado efectivo un producto que ya estaba en la base",
      () => {
        const result =
          resolveCatalogPublicationEligibility({
            composition:
              createComposition({
                mode:
                  "hybrid",

                overrides: {
                  includedProductIds: [
                    "P-001",
                  ],

                  excludedProductIds:
                    [],
                },
              }),

            resolution:
              createResolution({
                automaticProductIds: [
                  "P-001",
                ],

                productIds: [
                  "P-001",
                ],

                manuallyIncludedProductIds: [
                  "P-001",
                ],
              }),
          });

        expect(
          result,
        ).toMatchObject({
          status:
            "v2-publicable",

          effectiveAddedProductIds:
            [],
        });
      },
    );

    it(
      "requiere public id cuando existe un agregado efectivo",
      () => {
        const result =
          resolveCatalogPublicationEligibility({
            composition:
              createComposition({
                mode:
                  "hybrid",
              }),

            resolution:
              createResolution({
                automaticProductIds: [
                  "P-001",
                ],

                productIds: [
                  "P-001",
                  "P-002",
                ],

                manuallyIncludedProductIds: [
                  "P-002",
                ],
              }),
          });

        expect(
          result,
        ).toMatchObject({
          status:
            "requires-public-id",

          reasons:
            expect.arrayContaining([
              "EFFECTIVE_INCLUDED_PRODUCTS",
            ]),

          effectiveAddedProductIds: [
            "P-002",
          ],
        });
      },
    );

    it(
      "ignora una exclusión que no cambia la base",
      () => {
        const result =
          resolveCatalogPublicationEligibility({
            composition:
              createComposition({
                mode:
                  "hybrid",

                overrides: {
                  includedProductIds:
                    [],

                  excludedProductIds: [
                    "P-999",
                  ],
                },
              }),

            resolution:
              createResolution({
                automaticProductIds: [
                  "P-001",
                ],

                productIds: [
                  "P-001",
                ],

                excludedProductIds: [
                  "P-999",
                ],
              }),
          });

        expect(
          result,
        ).toMatchObject({
          status:
            "v2-publicable",

          effectiveRemovedProductIds:
            [],
        });
      },
    );

    it(
      "requiere public id cuando existe un retiro efectivo",
      () => {
        const result =
          resolveCatalogPublicationEligibility({
            composition:
              createComposition({
                mode:
                  "hybrid",
              }),

            resolution:
              createResolution({
                automaticProductIds: [
                  "P-001",
                  "P-002",
                ],

                productIds: [
                  "P-001",
                ],

                excludedProductIds: [
                  "P-002",
                ],
              }),
          });

        expect(
          result,
        ).toMatchObject({
          status:
            "requires-public-id",

          reasons:
            expect.arrayContaining([
              "EFFECTIVE_EXCLUDED_PRODUCTS",
            ]),

          effectiveRemovedProductIds: [
            "P-002",
          ],
        });
      },
    );

    it(
      "permite V2 cuando inclusión y exclusión no cambian el resultado final",
      () => {
        const result =
          resolveCatalogPublicationEligibility({
            composition:
              createComposition({
                mode:
                  "hybrid",

                overrides: {
                  includedProductIds: [
                    "P-001",
                  ],

                  excludedProductIds: [
                    "P-001",
                  ],
                },
              }),

            resolution:
              createResolution({
                automaticProductIds: [
                  "P-001",
                ],

                productIds: [
                  "P-001",
                ],

                manuallyIncludedProductIds: [
                  "P-001",
                ],

                excludedProductIds: [
                  "P-001",
                ],
              }),
          });

        expect(
          result.status,
        ).toBe(
          "v2-publicable",
        );
      },
    );

    it(
      "requiere public id para modo manual",
      () => {
        const result =
          resolveCatalogPublicationEligibility({
            composition:
              createComposition({
                mode:
                  "manual",
              }),

            resolution:
              createResolution(),
          });

        expect(
          result,
        ).toMatchObject({
          status:
            "requires-public-id",

          reasons:
            expect.arrayContaining([
              "MANUAL_MODE",
            ]),
        });
      },
    );

    it.each([
      [
        "título",
        {
          title:
            "Catálogo cliente",
        },
        "CUSTOM_TITLE",
      ],
      [
        "descripción",
        {
          description:
            "Selección especial",
        },
        "CUSTOM_DESCRIPTION",
      ],
    ])(
      "requiere public id por %s personalizado",
      (
        _label,
        identityOverride,
        reason,
      ) => {
        const identity =
          createDefaultCatalogPublicationIdentity();

        Object.assign(
          identity,
          identityOverride,
        );

        const result =
          resolveCatalogPublicationEligibility({
            composition:
              createComposition(),

            resolution:
              createResolution(),

            publicationIdentity:
              identity,
          });

        expect(
          result,
        ).toMatchObject({
          status:
            "requires-public-id",

          reasons:
            expect.arrayContaining([
              reason,
            ]),
        });
      },
    );

    it(
      "requiere public id por portada personalizada",
      () => {
        const identity =
          createDefaultCatalogPublicationIdentity();

        identity.cover = {
          strategy:
            "custom",

          customImageUrl:
            "/custom/catalogo.jpg",
        };

        const result =
          resolveCatalogPublicationEligibility({
            composition:
              createComposition(),

            resolution:
              createResolution(),

            publicationIdentity:
              identity,
          });

        expect(
          result,
        ).toMatchObject({
          status:
            "requires-public-id",

          reasons:
            expect.arrayContaining([
              "CUSTOM_COVER",
            ]),
        });
      },
    );

    it(
      "requiere public id ante atributos todavía no soportados",
      () => {
        const result =
          resolveCatalogPublicationEligibility({
            composition:
              createComposition(),

            resolution:
              createResolution({
                unsupportedAttributeFilters: [
                  "colors",
                ],

                isFullyResolved:
                  false,
              }),
          });

        expect(
          result,
        ).toMatchObject({
          status:
            "requires-public-id",

          reasons:
            expect.arrayContaining([
              "UNSUPPORTED_ATTRIBUTE_FILTERS",
            ]),
        });
      },
    );

    it(
      "requiere public id si hay inclusiones bloqueadas o inexistentes",
      () => {
        const result =
          resolveCatalogPublicationEligibility({
            composition:
              createComposition({
                mode:
                  "hybrid",
              }),

            resolution:
              createResolution({
                blockedIncludedProductIds: [
                  "P-BLOCKED",
                ],

                missingIncludedProductIds: [
                  "P-MISSING",
                ],

                isFullyResolved:
                  false,
              }),
          });

        expect(
          result,
        ).toMatchObject({
          status:
            "requires-public-id",

          reasons:
            expect.arrayContaining([
              "BLOCKED_INCLUDED_PRODUCTS",
              "MISSING_INCLUDED_PRODUCTS",
            ]),
        });
      },
    );

    it(
      "usa fallback de seguridad para una resolución incompleta desconocida",
      () => {
        const result =
          resolveCatalogPublicationEligibility({
            composition:
              createComposition(),

            resolution:
              createResolution({
                isFullyResolved:
                  false,
              }),
          });

        expect(
          result,
        ).toMatchObject({
          status:
            "requires-public-id",

          reasons: [
            "UNRESOLVED_COMPOSITION",
          ],
        });
      },
    );
  },
);
