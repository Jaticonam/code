import { describe, expect, it } from "vitest";

import type { Product } from "@/shared/types/product";

import {
  getProductDisplayIndicators,
  resolveProductCompatibility,
} from "./index";

const createProduct = (
  overrides: Partial<Product> = {},
): Product => ({
  id: "TEST-001",
  title: "Producto de prueba",
  description: "Producto para pruebas",
  category: "cajas",
  price_1: 10,
  stock: 10,
  img: "/placeholder.svg",
  badges: [],
  campaigns: [],
  ...overrides,
});

describe("resolveProductCompatibility", () => {
  it("homologa Más vendido", () => {
    const profile = resolveProductCompatibility(
      createProduct({
        badges: ["Más vendido"],
      }),
    );

    expect(profile.badges).toHaveLength(1);

    expect(profile.badges[0]).toMatchObject({
      code: "merchandising.bestSeller",
      kind: "merchandising",
      source: "legacyManual",
    });
  });

  it("separa Todo el Año como evergreen", () => {
    const profile = resolveProductCompatibility(
      createProduct({
        badges: ["✨Todo el Año"],
      }),
    );

    expect(profile.badges).toHaveLength(0);
    expect(profile.seasonality).toBe("evergreen");
  });

  it("separa Día de la Novia como campaña", () => {
    const profile = resolveProductCompatibility(
      createProduct({
        badges: ["Día de la Novia"],
      }),
    );

    expect(profile.campaignReferences).toHaveLength(1);

    expect(profile.campaignReferences[0]).toMatchObject({
      code: "campaign.diaNovia",
      label: "Día de la Novia",
    });
  });

  it("deriva Promo Flash desde una oferta válida", () => {
    const profile = resolveProductCompatibility(
      createProduct({
        price_offer: 8,
      }),
    );

    expect(profile.badges[0]).toMatchObject({
      code: "promotion.flash",
      source: "pricingRule",
    });
  });

  it("preserva valores desconocidos como legacy", () => {
    const profile = resolveProductCompatibility(
      createProduct({
        badges: ["Selección especial"],
      }),
    );

    expect(profile.unknownLegacyValues).toEqual([
      "Selección especial",
    ]);

    expect(profile.badges[0].code).toBe(
      "legacy.seleccion.especial",
    );
  });

  it("prioriza campaña y promoción", () => {
    const profile = resolveProductCompatibility(
      createProduct({
        badges: [
          "Día de la Novia",
          "Más vendido",
        ],
        price_offer: 8,
      }),
    );

    const indicators = getProductDisplayIndicators(
      profile,
      {
        maxVisible: 2,
      },
    );

    expect(
      indicators.map(
        (indicator) => indicator.code,
      ),
    ).toEqual([
      "campaign.diaNovia",
      "promotion.flash",
    ]);
  });
});
