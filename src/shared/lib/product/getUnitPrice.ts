import type { Product } from "@/shared/types/product";

import {
  getVolumeUnitPrice,
} from "@/modules/catalog/domain/volumePricing";

/**
 * Compatibilidad temporal.
 */
export function getUnitPrice(
  qty: number,
  product: Product,
): number {
  return getVolumeUnitPrice(product, qty);
}
