import type { Product } from "@/shared/types/product";

import {
  getNextVolumePrice,
} from "@/shared/domain/volumePricing";

/**
 * Compatibilidad temporal.
 * Usar getNextVolumePrice en código nuevo.
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
