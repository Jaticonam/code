import type { Product } from "@/shared/types/product";

import {
  getNextVolumePrice,
} from "@/modules/catalog/domain/volumePricing";

/**
 * Compatibilidad temporal.
 */
export function getNextTier(
  qty: number,
  product: Product,
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
