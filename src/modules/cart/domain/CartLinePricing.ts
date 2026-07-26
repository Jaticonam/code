import type {
  CartItem,
} from "@/modules/cart/types";

import {
  getVolumeUnitPrice,
} from "@/shared/domain/volumePricing/VolumePricing";

export interface CartLinePricing {
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export function getCartLinePricing(
  item: CartItem,
): CartLinePricing {
  const quantity =
    Number.isFinite(
      item.qty,
    )
      ? Math.max(
          1,
          Math.trunc(
            item.qty,
          ),
        )
      : 1;

  const unitPrice =
    getVolumeUnitPrice(
      item,
      quantity,
    );

  return {
    quantity,
    unitPrice,
    subtotal:
      unitPrice *
      quantity,
  };
}
