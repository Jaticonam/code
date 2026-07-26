import type { Product } from "@/shared/types/product";
import type { CartItem } from "@/modules/cart/types";

export function addItemToCart(
  cart: CartItem[],
  product: Product,
  qty: number
): CartItem[] {
  const safeQty = Math.max(1, Math.floor(Number(qty) || 1));

  const existing = cart.find((x) => x.id === product.id);

  if (existing) {
    return cart.map((x) =>
      x.id === product.id
        ? {
            ...x,
            qty: x.qty + safeQty,
          }
        : x
    );
  }

  return [
    ...cart,
    {
      ...product,
      qty: safeQty,
      note: "",
    },
  ];
}

export function removeItemFromCart(
  cart: CartItem[],
  id: string
): CartItem[] {
  return cart.filter((x) => x.id !== id);
}

export function changeCartItemQty(
  cart: CartItem[],
  id: string,
  delta: number
): CartItem[] {
  return cart
    .map((x) => {
      if (x.id !== id) return x;

      const newQty = x.qty + delta;

      if (newQty <= 0) return null;

      return {
        ...x,
        qty: newQty,
      };
    })
    .filter(Boolean) as CartItem[];
}

export function setCartItemQty(
  cart: CartItem[],
  id: string,
  qty: number | null
): CartItem[] {
  return cart
    .map((x) => {
      if (x.id !== id) return x;

      if (qty === null) return x;

      const safeQty = Math.floor(Number(qty) || 0);

      if (safeQty <= 0) return null;

      return {
        ...x,
        qty: safeQty,
      };
    })
    .filter(Boolean) as CartItem[];
}

export function setCartItemNote(
  cart: CartItem[],
  id: string,
  note: string
): CartItem[] {
  return cart.map((x) =>
    x.id === id
      ? {
          ...x,
          note: note ?? "",
        }
      : x
  );
}
