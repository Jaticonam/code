import {
  render,
} from "@testing-library/react";

import {
  MemoryRouter,
} from "react-router-dom";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type {
  Product,
} from "@/shared/types/product";

import {
  ProductCard,
} from "./ProductCard";

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
    campaigns: [],
    ...overrides,
  };
}

describe(
  "ProductCard pricing",
  () => {
    it(
      "integra precio, oferta anterior y tiers canónicos sin alterar importes",
      () => {
        const { container } =
          render(
            <MemoryRouter>
              <ProductCard
                product={createProduct()}
                onAddToCart={vi.fn()}
              />
            </MemoryRouter>,
          );

        const text =
          container.textContent ??
          "";

        expect(text).toContain(
          "8.0",
        );
        expect(text).toContain(
          "S/10.0",
        );
        expect(text).toContain(
          "Por Mayor (3u) × S/27",
        );
        expect(text).toContain(
          "Por Docena (12u) × S/84",
        );
        expect(text).toContain(
          "Medio ciento (50u) × S/300",
        );
        expect(text).toContain(
          "Por Caja (100u) × S/500",
        );
      },
    );

    it(
      "rechaza una oferta mayor y omite tiers inválidos",
      () => {
        const { container } =
          render(
            <MemoryRouter>
              <ProductCard
                product={createProduct({
                  price_offer: 12,
                  price_3: -5,
                  price_12:
                    Number.POSITIVE_INFINITY,
                  price_50:
                    Number.NaN,
                  price_100: 0,
                })}
                onAddToCart={vi.fn()}
              />
            </MemoryRouter>,
          );

        const text =
          container.textContent ??
          "";

        expect(text).toContain(
          "10.0",
        );
        expect(
          container.querySelector(
            ".line-through",
          ),
        ).toBeNull();
        expect(text).not.toContain(
          "Precios mayorista",
        );
      },
    );
  },
);
