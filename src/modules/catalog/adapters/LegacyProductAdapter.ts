import type {
  CatalogProductContract,
  CatalogVolumePriceContract,
} from "@/shared/contracts/catalog";

import type {
  Product,
} from "@/shared/types/product";

/* =========================================================
   TIPOS
   ========================================================= */

export interface CatalogProductCompatibilityResult {
  product: Product;

  /**
   * Escalas válidas de JUNG CORE que la interfaz legacy
   * todavía no puede representar mediante price_1,
   * price_3, price_12, price_50 o price_100.
   */
  unsupportedVolumePrices:
    readonly CatalogVolumePriceContract[];
}

/* =========================================================
   CONFIGURACIÓN LEGACY
   ========================================================= */

const LEGACY_VOLUME_PRICE_QUANTITIES =
  new Set([
    1,
    3,
    12,
    50,
    100,
  ]);

const LEGACY_PRODUCT_STATUS = {
  draft: "borrador",
  published: "publicado",
  hidden: "oculto",
  preorder: "preventa",
  archived: "oculto",
} satisfies Record<
  CatalogProductContract["publicationStatus"],
  string
>;

/* =========================================================
   HELPERS
   ========================================================= */

function cleanText(
  value: unknown,
): string {
  return String(
    value ?? "",
  ).trim();
}

function uniqueStrings(
  values: readonly string[],
): string[] {
  return Array.from(
    new Set(
      values
        .map(cleanText)
        .filter(Boolean),
    ),
  );
}

function normalizeUnitPrice(
  value: unknown,
): number | null {
  const unitPrice =
    Number(value);

  return (
    Number.isFinite(unitPrice) &&
    unitPrice > 0
  )
    ? unitPrice
    : null;
}

function findUnitPrice(
  contract:
    CatalogProductContract,
  minimumQuantity:
    number,
): number | null {
  const volumePrice =
    contract.pricing
      .volumePrices
      .find(
        (candidate) =>
          candidate.minimumQuantity ===
          minimumQuantity,
      );

  return normalizeUnitPrice(
    volumePrice?.unitPrice,
  );
}

function normalizeStock(
  value: unknown,
): number | null {
  const stock =
    Number(value);

  if (
    !Number.isFinite(stock)
  ) {
    return null;
  }

  return Math.max(
    0,
    Math.floor(stock),
  );
}

function getLegacyImageUrls(
  contract:
    CatalogProductContract,
): string[] {
  const imageAssets =
    [...contract.mediaAssets]
      .filter(
        (asset) =>
          asset.kind === "image" &&
          cleanText(asset.url),
      )
      .sort(
        (a, b) =>
          Number(b.isPrimary) -
            Number(a.isPrimary) ||
          a.position -
            b.position ||
          a.id.localeCompare(
            b.id,
          ),
      );

  return uniqueStrings(
    imageAssets.map(
      (asset) =>
        asset.url,
    ),
  );
}

/* =========================================================
   ADAPTADOR
   ========================================================= */

export function adaptCatalogProductToLegacyProduct(
  contract:
    CatalogProductContract,
): CatalogProductCompatibilityResult {
  const basePrice =
    findUnitPrice(
      contract,
      1,
    ) ?? 0;

  const rawOfferPrice =
    normalizeUnitPrice(
      contract.pricing
        .offer
        ?.unitPrice,
    );

  const offerPrice =
    rawOfferPrice !== null &&
    basePrice > 0 &&
    rawOfferPrice < basePrice
      ? rawOfferPrice
      : null;

  const imageUrls =
    getLegacyImageUrls(
      contract,
    );

  const product: Product = {
    /**
     * Wooly utiliza Product.id como código visible,
     * clave del carrito y parámetro de navegación.
     *
     * Mientras exista este modelo de compatibilidad,
     * se conserva el SKU como identificador operativo.
     */
    id:
      cleanText(
        contract.sku,
      ) ||
      cleanText(
        contract.id,
      ),

    title:
      cleanText(
        contract.title,
      ),

    description:
      cleanText(
        contract.description,
      ),

    category:
      cleanText(
        contract.categoryId,
      ),

    price_1:
      basePrice,

    price_3:
      findUnitPrice(
        contract,
        3,
      ),

    price_12:
      findUnitPrice(
        contract,
        12,
      ),

    price_50:
      findUnitPrice(
        contract,
        50,
      ),

    price_100:
      findUnitPrice(
        contract,
        100,
      ),

    price_offer:
      offerPrice,

    stock:
      contract.inventory
        .tracked
        ? normalizeStock(
            contract.inventory
              .availableQuantity,
          )
        : null,

    img:
      imageUrls[0] ?? "",

    gallery:
      imageUrls.length > 1
        ? imageUrls
            .slice(1)
            .join("|")
        : undefined,

    status:
      LEGACY_PRODUCT_STATUS[
        contract.publicationStatus
      ],

    badges:
      uniqueStrings(
        contract.manualBadgeCodes,
      ),

    campaigns:
      uniqueStrings(
        contract.campaignIds,
      ),

    priority:
      Number.isFinite(
        contract.priority,
      )
        ? contract.priority
        : 0,
  };

  const unsupportedVolumePrices =
    contract.pricing
      .volumePrices
      .filter(
        (volumePrice) =>
          !LEGACY_VOLUME_PRICE_QUANTITIES
            .has(
              volumePrice
                .minimumQuantity,
            ),
      );

  return {
    product,
    unsupportedVolumePrices,
  };
}

/**
 * Atajo para consumidores que solo necesitan
 * el modelo operativo de Wooly.
 */
export function mapCatalogProductToLegacyProduct(
  contract:
    CatalogProductContract,
): Product {
  return adaptCatalogProductToLegacyProduct(
    contract,
  ).product;
}
