import type { Product } from "@/shared/types/product";

import {
  getBestVolumePrice,
} from "@/shared/domain/volumePricing/VolumePricing";

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
