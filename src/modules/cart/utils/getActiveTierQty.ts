import type { CartItem } from "@/modules/cart/types";

export function getActiveTierQty(item: CartItem): number {
  if (item.price_100 && item.qty >= 100) return 100;
  if (item.price_50 && item.qty >= 50) return 50;
  if (item.price_12 && item.qty >= 12) return 12;
  if (item.price_3 && item.qty >= 3) return 3;

  return 1;
}
