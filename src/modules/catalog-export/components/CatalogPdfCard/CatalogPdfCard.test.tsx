import {
  render,
} from "@testing-library/react";

import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  Product,
} from "@/shared/types/product";

import {
  mapProductToPdfProduct,
} from "../../mappers/PdfProductMapper";

import CatalogPdfCard from "./CatalogPdfCard";

function createProduct(
  overrides: Partial<Product> = {},
): Product {
  return {
    id: "FLOR-001",
    title: "Rosa premium",
    description: "Producto de prueba.",
    category: "flores",
    price_1: 10,
    price_offer: 8,
    price_3: 9,
    price_12: 7,
    price_50: 6,
    price_100: 5,
    stock: 20,
    img: "https://example.com/product.jpg",
    status: "publicado",
    ...overrides,
  };
}

describe(
  "CatalogPdfCard",
  () => {
    it(
      "renderiza precio canónico, precio anterior y tiers sin recalcular",
      () => {
        const { container } =
          render(
            <CatalogPdfCard
              product={
                mapProductToPdfProduct(
                  createProduct(),
                )
              }
            />,
          );

        const text =
          container.textContent ??
          "";

        expect(text).toContain(
          "Precio unidad:",
        );
        expect(text).toContain(
          "S/ 10.00",
        );
        expect(text).toContain(
          "Precio oferta:",
        );
        expect(text).toContain(
          "S/ 8.00",
        );
        expect(text).toContain(
          "Por Mayor (3u) a",
        );
        expect(text).toContain(
          "S/ 9.00",
        );
        expect(text).toContain(
          "Por 100 (100u) a",
        );
        expect(text).toContain(
          "S/ 5.00",
        );
      },
    );

    it(
      "no presenta oferta inválida ni valores monetarios inseguros",
      () => {
        const { container } =
          render(
            <CatalogPdfCard
              product={
                mapProductToPdfProduct(
                  createProduct({
                    price_offer: 12,
                    price_3: -5,
                    price_12:
                      Number.POSITIVE_INFINITY,
                    price_50:
                      Number.NaN,
                    price_100: 0,
                  }),
                )
              }
            />,
          );

        const text =
          container.textContent ??
          "";

        expect(text).toContain(
          "S/ 10.00",
        );
        expect(text).not.toContain(
          "Precio oferta:",
        );
        expect(text).not.toMatch(
          /NaN|Infinity|-5/,
        );
      },
    );

    it(
      "conserva la estructura comercial de la card",
      () => {
        const { container } =
          render(
            <CatalogPdfCard
              product={
                mapProductToPdfProduct(
                  createProduct(),
                )
              }
            />,
          );

        expect(
          container.querySelector(
            ".catalog-pdf-card__media",
          ),
        ).toBeInTheDocument();
        expect(
          container.querySelector(
            ".catalog-pdf-card__content",
          ),
        ).toBeInTheDocument();
        expect(
          container.querySelector(
            ".catalog-pdf-card__tiers",
          ),
        ).toBeInTheDocument();
      },
    );
  },
);
