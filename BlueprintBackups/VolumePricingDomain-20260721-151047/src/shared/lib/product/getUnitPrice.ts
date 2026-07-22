import type { Product } from "@/shared/types/product";

import {
  getVolumeUnitPrice,
} from "@/shared/domain/volumePricing";

/**
 * Compatibilidad temporal.
 * Usar getVolumeUnitPrice en código nuevo.
 */
export function getUnitPrice(
  qty: number,
  product: Product,
): number {
  return getVolumeUnitPrice(product, qty);
}
