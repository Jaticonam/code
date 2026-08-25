import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  Product,
} from "@/shared/types/product";

import {
  applyCoreMediaAssets,
} from "./JungCoreMediaOverride";

function product(
  id: string,
  img: string,
  gallery = "",
): Product {
  return {
    id,
    title: id,
    description: "Producto",
    category: "flores",
    price_1: 10,
    price_3: null,
    price_12: null,
    price_50: null,
    price_100: null,
    price_offer: null,
    stock: 1,
    img,
    gallery,
    badges: [],
    campaigns: [],
    priority: 0,
    status: "publicado",
  };
}

describe(
  "applyCoreMediaAssets",
  () => {
    it(
      "sobrescribe media por SKU y respeta primary/position",
      () => {
        const products = [
          product(
            "SKU-1",
            "sheet-main.jpg",
            "sheet-gallery.jpg",
          ),
        ];

        const result =
          applyCoreMediaAssets(
            products,
            [
              {
                sku: "SKU-1",
                url: "core-02.jpg",
                position: 2,
                isPrimary: false,
              },
              {
                sku: "SKU-1",
                url: "core-01.jpg",
                position: 1,
                isPrimary: true,
              },
              {
                sku: "SKU-1",
                url: "core-03.jpg",
                position: 3,
                isPrimary: false,
              },
            ],
          );

        expect(result[0].img)
          .toBe("core-01.jpg");

        expect(result[0].gallery)
          .toBe(
            "core-02.jpg|core-03.jpg",
          );
      },
    );

    it(
      "conserva Sheets cuando Core no tiene el SKU",
      () => {
        const products = [
          product(
            "SKU-1",
            "sheet-main.jpg",
            "sheet-gallery.jpg",
          ),
        ];

        const result =
          applyCoreMediaAssets(
            products,
            [
              {
                sku: "OTRO-SKU",
                url: "otro.jpg",
                position: 1,
                isPrimary: true,
              },
            ],
          );

        expect(result)
          .toEqual(products);
      },
    );

    it(
      "ignora assets sin URL válida",
      () => {
        const products = [
          product(
            "SKU-1",
            "sheet-main.jpg",
          ),
        ];

        const result =
          applyCoreMediaAssets(
            products,
            [
              {
                sku: "SKU-1",
                url: "",
                position: 1,
                isPrimary: true,
              },
            ],
          );

        expect(result)
          .toEqual(products);
      },
    );

    it(
      "elimina URLs duplicadas",
      () => {
        const products = [
          product(
            "SKU-1",
            "sheet.jpg",
          ),
        ];

        const result =
          applyCoreMediaAssets(
            products,
            [
              {
                sku: "SKU-1",
                url: "core.jpg",
                position: 1,
                isPrimary: true,
              },
              {
                sku: "SKU-1",
                url: "core.jpg",
                position: 2,
                isPrimary: false,
              },
            ],
          );

        expect(result[0].img)
          .toBe("core.jpg");

        expect(result[0].gallery)
          .toBe("");
      },
    );
  },
);
