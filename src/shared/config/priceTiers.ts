import type { Product } from "@/shared/types/product";

import {
  DISCOUNT_VOLUME_PRICES,
  VOLUME_PRICES,
  getAvailableVolumePrices,
  getNextVolumePrice,
  getVolumeUnitPrice,
} from "@/modules/catalog/domain/volumePricing";

/**
 * Compatibilidad temporal.
 * Será retirado cuando todos los consumidores usen Volume Pricing.
 */
export const PRICE_TIERS = VOLUME_PRICES;

/**
 * Compatibilidad temporal.
 */
export const VOLUME_PRICE_TIERS =
  DISCOUNT_VOLUME_PRICES;

/**
 * Compatibilidad temporal.
 */
export function getAvailablePriceTiers(
  product: Product,
) {
  return getAvailableVolumePrices(product, {
    includeBasePrice: false,
  });
}

/**
 * Compatibilidad temporal.
 */
export function getUnitPriceByQty(
  product: Product,
  qty: number,
): number {
  return getVolumeUnitPrice(product, qty);
}

/**
 * Compatibilidad temporal.
 */
export function getNextTier(
  product: Product,
  qty: number,
) {
  const nextVolumePrice =
    getNextVolumePrice(product, qty);

  if (!nextVolumePrice) {
    return null;
  }

  return {
    qty: nextVolumePrice.qty,
    price: nextVolumePrice.unitPrice,
  };
}
