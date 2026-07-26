import {
  describe,
  expect,
  it,
} from "vitest";

import {
  DISCOUNT_VOLUME_PRICES as CATALOG_DISCOUNT_VOLUME_PRICES,
  VOLUME_PRICES as CATALOG_VOLUME_PRICES,
  getActiveVolumePriceQty as getCatalogActiveVolumePriceQty,
  getAvailableVolumePrices as getCatalogAvailableVolumePrices,
  getBaseUnitPrice as getCatalogBaseUnitPrice,
  getBestVolumePrice as getCatalogBestVolumePrice,
  getNextVolumePrice as getCatalogNextVolumePrice,
  getVolumeUnitPrice as getCatalogVolumeUnitPrice,
} from "@/modules/catalog/domain/volumePricing";

import {
  DISCOUNT_VOLUME_PRICES as SHARED_DISCOUNT_VOLUME_PRICES,
  VOLUME_PRICES as SHARED_VOLUME_PRICES,
  getActiveVolumePriceQty as getSharedActiveVolumePriceQty,
  getAvailableVolumePrices as getSharedAvailableVolumePrices,
  getBaseUnitPrice as getSharedBaseUnitPrice,
  getBestVolumePrice as getSharedBestVolumePrice,
  getNextVolumePrice as getSharedNextVolumePrice,
  getVolumeUnitPrice as getSharedVolumeUnitPrice,
} from "@/shared/domain/volumePricing/VolumePricing";

import type {
  VolumePriceProduct,
} from "@/shared/domain/volumePricing/VolumePricing";

/* =========================================================
   FIXTURES
   ========================================================= */

function createProduct(
  overrides:
    Partial<VolumePriceProduct> = {},
): VolumePriceProduct {
  return {
    price_1: 10,
    price_3: 9,
    price_12: 8,
    price_50: 7,
    price_100: 6,
    price_offer: null,

    ...overrides,
  };
}

/* =========================================================
   CONFIGURACIÓN
   ========================================================= */

describe(
  "configuración de Volume Pricing",
  () => {
    it(
      "mantiene las cinco escalas comerciales oficiales",
      () => {
        expect(
          SHARED_VOLUME_PRICES,
        ).toEqual([
          {
            qty: 1,
            key: "price_1",
            label: "1u",
            className:
              "volume-price-1",
          },
          {
            qty: 3,
            key: "price_3",
            label: "3u",
            className:
              "volume-price-3",
          },
          {
            qty: 12,
            key: "price_12",
            label: "12u",
            className:
              "volume-price-12",
          },
          {
            qty: 50,
            key: "price_50",
            label: "50u",
            className:
              "volume-price-50",
          },
          {
            qty: 100,
            key: "price_100",
            label: "100u",
            className:
              "volume-price-100",
          },
        ]);
      },
    );

    it(
      "mantiene la misma configuración que catalog",
      () => {
        expect(
          SHARED_VOLUME_PRICES,
        ).toEqual(
          CATALOG_VOLUME_PRICES,
        );

        expect(
          SHARED_DISCOUNT_VOLUME_PRICES,
        ).toEqual(
          CATALOG_DISCOUNT_VOLUME_PRICES,
        );
      },
    );
  },
);

/* =========================================================
   PRECIO BASE Y OFERTA
   ========================================================= */

describe(
  "precio base y oferta",
  () => {
    it.each([
      {
        name:
          "usa precio base sin oferta",
        overrides: {
          price_offer: null,
        },
        expected: 10,
      },
      {
        name:
          "aplica una oferta menor",
        overrides: {
          price_offer: 8,
        },
        expected: 8,
      },
      {
        name:
          "ignora oferta igual al precio base",
        overrides: {
          price_offer: 10,
        },
        expected: 10,
      },
      {
        name:
          "ignora oferta mayor al precio base",
        overrides: {
          price_offer: 12,
        },
        expected: 10,
      },
      {
        name:
          "devuelve cero con precio base inválido",
        overrides: {
          price_1: 0,
          price_offer: 5,
        },
        expected: 0,
      },
    ])(
      "$name",
      ({
        overrides,
        expected,
      }) => {
        expect(
          getSharedBaseUnitPrice(
            createProduct(
              overrides,
            ),
          ),
        ).toBe(
          expected,
        );
      },
    );
  },
);

/* =========================================================
   PRECIOS DISPONIBLES
   ========================================================= */

describe(
  "precios disponibles",
  () => {
    const product =
      createProduct({
        price_offer: 9,
        price_12: null,
        price_100: 0,
      });

    it(
      "incluye precio base efectivo por defecto",
      () => {
        expect(
          getSharedAvailableVolumePrices(
            product,
          ),
        ).toEqual([
          {
            qty: 1,
            key: "price_1",
            label: "1u",
            className:
              "volume-price-1",
            unitPrice: 9,
          },
          {
            qty: 3,
            key: "price_3",
            label: "3u",
            className:
              "volume-price-3",
            unitPrice: 9,
          },
          {
            qty: 50,
            key: "price_50",
            label: "50u",
            className:
              "volume-price-50",
            unitPrice: 7,
          },
        ]);
      },
    );

    it(
      "puede excluir el precio base",
      () => {
        expect(
          getSharedAvailableVolumePrices(
            product,
            {
              includeBasePrice:
                false,
            },
          ).map(
            (volumePrice) =>
              volumePrice.qty,
          ),
        ).toEqual([
          3,
          50,
        ]);
      },
    );
  },
);

/* =========================================================
   PRECIO POR CANTIDAD
   ========================================================= */

describe(
  "precio unitario por cantidad",
  () => {
    it.each([
      [-4, 10],
      [0, 10],
      [1, 10],
      [2, 10],
      [3, 9],
      [11, 9],
      [12, 8],
      [49, 8],
      [50, 7],
      [99, 7],
      [100, 6],
      [500, 6],
    ])(
      "cantidad %s utiliza precio %s",
      (
        quantity,
        expected,
      ) => {
        expect(
          getSharedVolumeUnitPrice(
            createProduct(),
            quantity,
          ),
        ).toBe(
          expected,
        );
      },
    );

    it(
      "retrocede a la última escala válida",
      () => {
        const product =
          createProduct({
            price_12: null,
            price_100: null,
          });

        expect(
          getSharedVolumeUnitPrice(
            product,
            20,
          ),
        ).toBe(9);

        expect(
          getSharedVolumeUnitPrice(
            product,
            150,
          ),
        ).toBe(7);
      },
    );
  },
);

/* =========================================================
   SIGUIENTE ESCALA
   ========================================================= */

describe(
  "siguiente precio por volumen",
  () => {
    it.each([
      [
        0,
        {
          qty: 3,
          unitPrice: 9,
        },
      ],
      [
        1,
        {
          qty: 3,
          unitPrice: 9,
        },
      ],
      [
        3,
        {
          qty: 12,
          unitPrice: 8,
        },
      ],
      [
        49,
        {
          qty: 50,
          unitPrice: 7,
        },
      ],
      [
        50,
        {
          qty: 100,
          unitPrice: 6,
        },
      ],
      [
        100,
        null,
      ],
    ])(
      "desde cantidad %s devuelve %o",
      (
        quantity,
        expected,
      ) => {
        expect(
          getSharedNextVolumePrice(
            createProduct(),
            quantity,
          ),
        ).toEqual(
          expected,
        );
      },
    );

    it(
      "omite una escala sin precio válido",
      () => {
        expect(
          getSharedNextVolumePrice(
            createProduct({
              price_3: null,
            }),
            1,
          ),
        ).toEqual({
          qty: 12,
          unitPrice: 8,
        });
      },
    );
  },
);

/* =========================================================
   ESCALA ACTIVA
   ========================================================= */

describe(
  "escala activa",
  () => {
    it.each([
      [0, 1],
      [1, 1],
      [3, 3],
      [12, 12],
      [99, 50],
      [100, 100],
    ])(
      "cantidad %s activa escala %s",
      (
        quantity,
        expected,
      ) => {
        expect(
          getSharedActiveVolumePriceQty(
            createProduct(),
            quantity,
          ),
        ).toBe(
          expected,
        );
      },
    );

    it(
      "ignora escalas sin precio",
      () => {
        expect(
          getSharedActiveVolumePriceQty(
            createProduct({
              price_100: null,
            }),
            150,
          ),
        ).toBe(50);
      },
    );
  },
);

/* =========================================================
   MEJOR PRECIO
   ========================================================= */

describe(
  "mejor precio disponible",
  () => {
    it(
      "selecciona el menor precio unitario",
      () => {
        expect(
          getSharedBestVolumePrice(
            createProduct(),
          ),
        ).toEqual(
          expect.objectContaining({
            qty: 100,
            unitPrice: 6,
          }),
        );
      },
    );

    it(
      "prioriza menor cantidad cuando el precio empata",
      () => {
        expect(
          getSharedBestVolumePrice(
            createProduct({
              price_3: 6,
              price_12: 6,
              price_50: 6,
              price_100: 6,
            }),
          ),
        ).toEqual(
          expect.objectContaining({
            qty: 3,
            unitPrice: 6,
          }),
        );
      },
    );
  },
);

/* =========================================================
   PARIDAD MODULES ↔ SHARED
   ========================================================= */

describe(
  "paridad con la implementación de catalog",
  () => {
    it(
      "produce los mismos resultados en una matriz de escenarios",
      () => {
        const products:
          VolumePriceProduct[] = [
            createProduct(),

            createProduct({
              price_offer: 8.5,
            }),

            createProduct({
              price_3: null,
              price_50: null,
            }),

            createProduct({
              price_1: 0,
              price_3: -1,
              price_12:
                Number.NaN,
              price_50:
                Number.POSITIVE_INFINITY,
              price_100: null,
              price_offer: 4,
            }),
          ];

        const quantities = [
          -5,
          0,
          1,
          2,
          3,
          11,
          12,
          49,
          50,
          99,
          100,
          500,
        ];

        products.forEach(
          (product) => {
            expect(
              getSharedBaseUnitPrice(
                product,
              ),
            ).toBe(
              getCatalogBaseUnitPrice(
                product,
              ),
            );

            expect(
              getSharedAvailableVolumePrices(
                product,
              ),
            ).toEqual(
              getCatalogAvailableVolumePrices(
                product,
              ),
            );

            expect(
              getSharedAvailableVolumePrices(
                product,
                {
                  includeBasePrice:
                    false,
                },
              ),
            ).toEqual(
              getCatalogAvailableVolumePrices(
                product,
                {
                  includeBasePrice:
                    false,
                },
              ),
            );

            expect(
              getSharedBestVolumePrice(
                product,
              ),
            ).toEqual(
              getCatalogBestVolumePrice(
                product,
              ),
            );

            quantities.forEach(
              (quantity) => {
                expect(
                  getSharedVolumeUnitPrice(
                    product,
                    quantity,
                  ),
                ).toBe(
                  getCatalogVolumeUnitPrice(
                    product,
                    quantity,
                  ),
                );

                expect(
                  getSharedNextVolumePrice(
                    product,
                    quantity,
                  ),
                ).toEqual(
                  getCatalogNextVolumePrice(
                    product,
                    quantity,
                  ),
                );

                expect(
                  getSharedActiveVolumePriceQty(
                    product,
                    quantity,
                  ),
                ).toBe(
                  getCatalogActiveVolumePriceQty(
                    product,
                    quantity,
                  ),
                );
              },
            );
          },
        );
      },
    );
  },
);
