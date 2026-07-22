import type { Product } from "@/shared/types/product";

import {
  getBestVolumePrice,
} from "@/modules/catalog/domain/volumePricing";

/**
 * Compatibilidad temporal.
 */
export function getBestProductTier(
  product: Product,
) {
  const bestVolumePrice =
    getBestVolumePrice(product);

  if (!bestVolumePrice) {
    return null;
  }

  return {
    qty: bestVolumePrice.qty,
    price: bestVolumePrice.unitPrice,
  };
}
