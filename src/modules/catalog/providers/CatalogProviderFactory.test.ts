import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type {
  CatalogProvider,
} from "./CatalogProvider";
import {
  isCatalogCacheSourceCompatible,
} from "./CatalogProvider";
import {
  createCatalogProvider,
  resolveCatalogSourceMode,
} from "./CatalogProviderFactory";
import {
  FallbackCatalogProvider,
} from "./FallbackCatalogProvider";

function provider(
  source:
    CatalogProvider["source"],
  products: string[] = [],
): CatalogProvider {
  return {
    source,
    getCategories: () => [
      "flores",
    ],
    loadCampaigns:
      vi.fn().mockResolvedValue(
        [],
      ),
    loadCategoryProducts:
      vi.fn().mockResolvedValue(
        products.map(
          (id) => ({
            id,
          }),
        ),
      ),
  } as CatalogProvider;
}

describe(
  "CatalogProviderFactory",
  () => {
    it.each([
      [undefined, "google-sheets"],
      ["google-sheets", "google-sheets"],
      ["desconocido", "google-sheets"],
      ["contract-fixture", "contract-fixture"],
    ])(
      "resuelve %s como %s",
      (value, expected) => {
        expect(
          resolveCatalogSourceMode(
            value,
          ),
        ).toBe(expected);
      },
    );

    it.each([
      ["google-sheets", "google-sheets", true],
      ["contract-fixture", "contract-fixture", true],
      ["google-sheets", "contract-fixture", false],
      ["contract-fixture", "google-sheets", false],
      [undefined, "google-sheets", true],
      [undefined, "contract-fixture", false],
    ] as const)(
      "compatibilidad de caché %s -> %s: %s",
      (
        storedSource,
        activeSource,
        expected,
      ) => {
        expect(
          isCatalogCacheSourceCompatible(
            storedSource,
            activeSource,
          ),
        ).toBe(expected);
      },
    );

    it(
      "elige instancias inyectadas sin mutarlas",
      () => {
        const googleSheets =
          provider(
            "google-sheets",
          );
        const contractFixture =
          provider(
            "contract-fixture",
          );
        const dependencies = {
          googleSheets,
          contractFixture,
        };

        expect(
          createCatalogProvider(
            undefined,
            dependencies,
          ),
        ).toBe(googleSheets);
        expect(
          createCatalogProvider(
            "contract-fixture",
            dependencies,
          ),
        ).toBe(
          contractFixture,
        );
        expect(
          dependencies,
        ).toEqual({
          googleSheets,
          contractFixture,
        });
      },
    );
  },
);

describe(
  "FallbackCatalogProvider",
  () => {
    it(
      "no llama fallback ante un resultado vacío válido",
      async () => {
        const primary =
          provider(
            "contract-fixture",
          );
        const fallback =
          provider(
            "google-sheets",
            ["fallback"],
          );
        const composed =
          new FallbackCatalogProvider(
            primary,
            fallback,
          );
        const result =
          await composed
            .loadCategoryProductsWithMetadata(
              "flores",
              [],
            );

        expect(result).toEqual({
          data: [],
          metadata: {
            requestedSource:
              "contract-fixture",
            resolvedSource:
              "contract-fixture",
            fallbackUsed: false,
          },
        });
        expect(
          fallback
            .loadCategoryProducts,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "usa fallback solo si el primario falla",
      async () => {
        const primary =
          provider(
            "contract-fixture",
          );
        vi.mocked(
          primary
            .loadCategoryProducts,
        ).mockRejectedValueOnce(
          new TypeError(
            "fixture inválido",
          ),
        );
        const fallback =
          provider(
            "google-sheets",
            ["fallback"],
          );
        const composed =
          new FallbackCatalogProvider(
            primary,
            fallback,
          );
        const result =
          await composed
            .loadCategoryProductsWithMetadata(
              "flores",
              [],
            );

        expect(
          result.data.map(
            (item) => item.id,
          ),
        ).toEqual([
          "fallback",
        ]);
        expect(
          result.metadata,
        ).toEqual({
          requestedSource:
            "contract-fixture",
          resolvedSource:
            "google-sheets",
          fallbackUsed: true,
          fallbackReason:
            "TypeError",
        });
      },
    );

    it(
      "propaga el fallo del fallback",
      async () => {
        const primary =
          provider(
            "contract-fixture",
          );
        const fallback =
          provider(
            "google-sheets",
          );
        vi.mocked(
          primary
            .loadCategoryProducts,
        ).mockRejectedValue(
          new Error("primary"),
        );
        vi.mocked(
          fallback
            .loadCategoryProducts,
        ).mockRejectedValue(
          new Error("fallback"),
        );

        await expect(
          new FallbackCatalogProvider(
            primary,
            fallback,
          ).loadCategoryProducts(
            "flores",
            [],
          ),
        ).rejects.toThrow(
          "fallback",
        );
      },
    );

    it(
      "no mezcla resultados ni duplica llamadas",
      async () => {
        const primary =
          provider(
            "contract-fixture",
            ["primary"],
          );
        const fallback =
          provider(
            "google-sheets",
            ["fallback"],
          );
        const products =
          await new FallbackCatalogProvider(
            primary,
            fallback,
          ).loadCategoryProducts(
            "flores",
            [],
          );

        expect(
          products.map(
            (item) => item.id,
          ),
        ).toEqual([
          "primary",
        ]);
        expect(
          primary
            .loadCategoryProducts,
        ).toHaveBeenCalledOnce();
        expect(
          fallback
            .loadCategoryProducts,
        ).not.toHaveBeenCalled();
      },
    );
  },
);
