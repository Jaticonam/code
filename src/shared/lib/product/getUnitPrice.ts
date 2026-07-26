import type { Product } from "@/shared/types/product";

import {
  getVolumeUnitPrice,
} from "@/shared/domain/volumePricing/VolumePricing";

/**
 * Compatibilidad temporal.
 */
export function getUnitPrice(
  qty: number,
  product: Product,
): number {
  return getVolumeUnitPrice(product, qty);
}
