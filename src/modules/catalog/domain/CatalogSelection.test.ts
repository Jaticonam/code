import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  Campaign,
  Product,
} from "@/shared/types/product";

import {
  resolveCatalogSelection,
} from "./CatalogSelection";

const categories = [
  {
    id: "todas",
    name: "Todas",
    icon: "🛍️",
  },
  {
    id: "flores",
    name: "Flores",
    icon: "🌸",
  },
  {
    id: "cajas",
    name: "Cajas",
    icon: "📦",
  },
] as const;

const campaigns: Campaign[] = [
  {
    id: "dia-madre",
    name: "Día de la Madre",
    icon: "🌷",
    color: "rosado",
    themeToken: "campaign.rosado",
    colorClass: "catalog-campaign-pink",
    startDate: "01/05/2026",
    endDate: "31/05/2026",
    priority: 100,
    publicationStatus: "publicado",
    computedStatus: "activa",
  },
  {
    id: "cyber",
    name: "Cyber Wooly",
    icon: "⚡",
    color: "negro",
    themeToken: "campaign.negro",
    colorClass: "catalog-campaign-dark",
    startDate: "01/07/2026",
    endDate: "31/07/2026",
    priority: 80,
    publicationStatus: "publicado",
    computedStatus: "activa",
  },
];

const createProduct = (
  overrides: Partial<Product>,
): Product => ({
  id: "PRODUCTO",
  title: "Producto Wooly",
  description: "Descripción",
  category: "flores",
  price_1: 10,
  img: "https://example.com/producto.jpg",
  status: "publicado",
  campaigns: [],
  priority: 0,
  ...overrides,
});

const products: Product[] = [
  createProduct({
    id: "FLOR-001",
    category: "flores",
    campaigns: ["dia-madre"],
    priority: 100,
  }),
  createProduct({
    id: "CAJA-001",
    category: "cajas",
    campaigns: ["dia-madre"],
    priority: 80,
  }),
  createProduct({
    id: "FLOR-002",
    category: "flores",
    campaigns: [],
    priority: 50,
  }),
  createProduct({
    id: "CAJA-002",
    category: "cajas",
    campaigns: ["cyber"],
    priority: 20,
  }),
  createProduct({
    id: "OCULTO-001",
    category: "flores",
    campaigns: ["dia-madre"],
    priority: 200,
    status: "oculto",
  }),
];

describe(
  "resolveCatalogSelection",
  () => {
    it(
      "devuelve el catálogo general sin productos ocultos",
      () => {
        const result =
          resolveCatalogSelection({
            products,
            categories,
            campaigns,
          });

        expect(result.segmentType)
          .toBe("general");

        expect(result.products.map(
          (product) => product.id,
        )).toEqual([
          "FLOR-001",
          "CAJA-001",
          "FLOR-002",
          "CAJA-002",
        ]);
      },
    );

    it(
      "filtra únicamente por categoría",
      () => {
        const result =
          resolveCatalogSelection({
            products,
            categories,
            campaigns,
            categoryId: "flores",
          });

        expect(result.segmentType)
          .toBe("category");

        expect(result.productCount)
          .toBe(2);

        expect(result.products.map(
          (product) => product.id,
        )).toEqual([
          "FLOR-001",
          "FLOR-002",
        ]);
      },
    );

    it(
      "filtra únicamente por campaña",
      () => {
        const result =
          resolveCatalogSelection({
            products,
            categories,
            campaigns,
            campaignId: "dia-madre",
          });

        expect(result.segmentType)
          .toBe("campaign");

        expect(result.products.map(
          (product) => product.id,
        )).toEqual([
          "FLOR-001",
          "CAJA-001",
        ]);
      },
    );

    it(
      "combina categoría y campaña mediante intersección",
      () => {
        const result =
          resolveCatalogSelection({
            products,
            categories,
            campaigns,
            categoryId: "flores",
            campaignId: "dia-madre",
          });

        expect(result.segmentType)
          .toBe("combination");

        expect(result.isCombination)
          .toBe(true);

        expect(result.products.map(
          (product) => product.id,
        )).toEqual([
          "FLOR-001",
        ]);
      },
    );

    it(
      "normaliza mayúsculas y acentos",
      () => {
        const result =
          resolveCatalogSelection({
            products,
            categories,
            campaigns,
            categoryId: " FLÓRES ",
            campaignId: " DÍA-MADRE ",
          });

        expect(result.categoryId)
          .toBe("flores");

        expect(result.campaignId)
          .toBe("dia-madre");

        expect(result.productCount)
          .toBe(1);
      },
    );

    it(
      "interpreta todas como ausencia de filtro de categoría",
      () => {
        const result =
          resolveCatalogSelection({
            products,
            categories,
            campaigns,
            categoryId: "todas",
            campaignId: "dia-madre",
          });

        expect(result.hasCategory)
          .toBe(false);

        expect(result.hasCampaign)
          .toBe(true);

        expect(result.productCount)
          .toBe(2);
      },
    );

    it(
      "bloquea una categoría inexistente",
      () => {
        const result =
          resolveCatalogSelection({
            products,
            categories,
            campaigns,
            categoryId: "inexistente",
          });

        expect(result.isEmpty)
          .toBe(true);

        expect(result.warnings.map(
          (warning) => warning.code,
        )).toContain(
          "unknown-category",
        );
      },
    );

    it(
      "bloquea una campaña inexistente",
      () => {
        const result =
          resolveCatalogSelection({
            products,
            categories,
            campaigns,
            campaignId: "inexistente",
          });

        expect(result.isEmpty)
          .toBe(true);

        expect(result.warnings.map(
          (warning) => warning.code,
        )).toContain(
          "unknown-campaign",
        );
      },
    );

    it(
      "reporta una combinación válida sin productos",
      () => {
        const result =
          resolveCatalogSelection({
            products,
            categories,
            campaigns,
            categoryId: "flores",
            campaignId: "cyber",
          });

        expect(result.isEmpty)
          .toBe(true);

        expect(result.warnings.map(
          (warning) => warning.code,
        )).toContain(
          "empty-selection",
        );
      },
    );

    it(
      "ordena los productos por prioridad descendente",
      () => {
        const result =
          resolveCatalogSelection({
            products: [
              createProduct({
                id: "BAJA",
                priority: 10,
              }),
              createProduct({
                id: "ALTA",
                priority: 100,
              }),
              createProduct({
                id: "MEDIA",
                priority: 50,
              }),
            ],
            categories,
            campaigns,
          });

        expect(result.products.map(
          (product) => product.id,
        )).toEqual([
          "ALTA",
          "MEDIA",
          "BAJA",
        ]);
      },
    );
  },
);
