import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  Product,
} from "@/shared/types/product";

import {
  mapProductsToPdfProducts,
} from "./PdfProductMapper";

function createProduct(
  overrides:
    Partial<Product> = {},
): Product {
  return {
    id:
      "FLOR-001",

    title:
      "Rosa premium",

    description:
      "Producto de prueba.",

    category:
      "flores",

    price_1:
      10,

    price_3:
      9,

    price_12:
      8,

    stock:
      20,

    img:
      "https://example.com/product.jpg",

    status:
      "publicado",

    campaigns:
      [],

    priority:
      0,

    ...overrides,
  };
}

describe(
  "PdfProductMapper",
  () => {
    it(
      "neutraliza precio y stock de preventa",
      () => {
        const [result] =
          mapProductsToPdfProducts([
            createProduct({
              status:
                "preventa",

              price_1:
                999,

              price_3:
                888,

              stock:
                500,
            }),
          ]);

        expect(
          result.presentation,
        ).toBe(
          "preventa",
        );

        expect(
          result.showPricing,
        ).toBe(false);

        expect(
          result.showWholesalePricing,
        ).toBe(false);

        expect(
          result.price1,
        ).toBe(0);

        expect(
          result.price3,
        ).toBeNull();

        expect(
          result.stock,
        ).toBeNull();
      },
    );

    it(
      "considera agotado sin importar la cantidad",
      () => {
        const [result] =
          mapProductsToPdfProducts([
            createProduct({
              status:
                "agotado",

              stock:
                500,
            }),
          ]);

        expect(
          result.presentation,
        ).toBe(
          "agotado",
        );

        expect(
          result.stockLabel,
        ).toBe(
          "Agotado",
        );

        expect(
          result.stock,
        ).toBeNull();

        expect(
          result.showPricing,
        ).toBe(true);

        expect(
          result.showWholesalePricing,
        ).toBe(false);
      },
    );

    it.each([
      "oculto",
      "borrador",
      "",
      "pendiente",
    ])(
      "excluye estado %s",
      (status) => {
        const result =
          mapProductsToPdfProducts([
            createProduct({
              status,
            }),
          ]);

        expect(
          result,
        ).toEqual([]);
      },
    );

    it(
      "excluye publicado con stock cero",
      () => {
        const result =
          mapProductsToPdfProducts([
            createProduct({
              status:
                "publicado",

              stock:
                0,
            }),
          ]);

        expect(
          result,
        ).toEqual([]);
      },
    );
  },
);
