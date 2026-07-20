import type { CartItem } from "@/modules/cart/types";
import { getEffectivePrice } from "@/modules/catalog/utils/products";

function toMoney(value: unknown) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

export function getTotalItems(cart: CartItem[]) {
  return cart.reduce(
    (acc, item) => acc + toMoney(item.qty),
    0
  );
}

export function getTotalPrice(cart: CartItem[]) {
  return cart.reduce((acc, item) => {
    const qty = toMoney(item.qty);
    const price = toMoney(getEffectivePrice(item));

    return acc + price * qty;
  }, 0);
}

export function getTotalOriginal(cart: CartItem[]) {
  return cart.reduce((acc, item) => {
    const qty = toMoney(item.qty);
    const basePrice = toMoney(item.price_1);

    return acc + basePrice * qty;
  }, 0);
}

export function getTotalSavings(cart: CartItem[]) {
  return Math.max(
    0,
    getTotalOriginal(cart) - getTotalPrice(cart)
  );
}
