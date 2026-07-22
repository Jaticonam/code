import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  Product,
} from "@/shared/types/product";

import {
  getProductDisplayIndicators,
  resolveProductCompatibility,
} from "./index";

const createProduct = (
  overrides:
    Partial<Product> = {},
): Product => ({
  id:
    "TEST-001",

  title:
    "Producto de prueba",

  description:
    "Producto para pruebas",

  category:
    "cajas",

  price_1:
    10,

  stock:
    10,

  img:
    "/placeholder.svg",

  badges:
    [],

  campaigns:
    [],

  ...overrides,
});

describe(
  "resolveProductCompatibility",
  () => {
    it(
      "homologa Más vendido",
      () => {
        const profile =
          resolveProductCompatibility(
            createProduct({
              badges:
                ["Más vendido"],
            }),
          );

        expect(
          profile.badges,
        ).toHaveLength(1);

        expect(
          profile.badges[0],
        ).toMatchObject({
          code:
            "merchandising.bestSeller",

          kind:
            "merchandising",

          source:
            "legacyManual",
        });
      },
    );

    it(
      "ignora Todo el Año por ser una condición redundante",
      () => {
        const profile =
          resolveProductCompatibility(
            createProduct({
              badges:
                ["✨Todo el Año"],
            }),
          );

        expect(
          profile.badges,
        ).toHaveLength(0);

        expect(
          profile.ignoredLegacyValues,
        ).toEqual([
          {
            value:
              "✨Todo el Año",

            normalizedValue:
              "todo el ano",

            reason:
              "redundantDefault",
          },
        ]);
      },
    );

    it(
      "no convierte Día de la Novia en campaña",
      () => {
        const profile =
          resolveProductCompatibility(
            createProduct({
              badges:
                ["Día de la Novia"],
            }),
          );

        expect(
          profile.badges,
        ).toHaveLength(0);

        expect(
          profile.ignoredLegacyValues,
        ).toEqual([
          {
            value:
              "Día de la Novia",

            normalizedValue:
              "dia de la novia",

            reason:
              "campaignMustComeFromSheetCampaign",
          },
        ]);
      },
    );

    it(
      "deriva Promo Flash desde una oferta válida",
      () => {
        const profile =
          resolveProductCompatibility(
            createProduct({
              price_offer: 8,
            }),
          );

        expect(
          profile.badges[0],
        ).toMatchObject({
          code:
            "promotion.flash",

          source:
            "pricingRule",
        });
      },
    );

    it(
      "preserva valores desconocidos como legacy",
      () => {
        const profile =
          resolveProductCompatibility(
            createProduct({
              badges:
                ["Selección especial"],
            }),
          );

        expect(
          profile.unknownLegacyValues,
        ).toEqual([
          "Selección especial",
        ]);

        expect(
          profile.badges[0].code,
        ).toBe(
          "legacy.seleccion.especial",
        );
      },
    );

    it(
      "prioriza promoción sobre badge comercial",
      () => {
        const profile =
          resolveProductCompatibility(
            createProduct({
              badges:
                ["Más vendido"],

              price_offer:
                8,
            }),
          );

        const indicators =
          getProductDisplayIndicators(
            profile,
            {
              maxVisible: 2,
            },
          );

        expect(
          indicators.map(
            (indicator) =>
              indicator.code,
          ),
        ).toEqual([
          "promotion.flash",
          "merchandising.bestSeller",
        ]);
      },
    );
  },
);
