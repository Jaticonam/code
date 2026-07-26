import { useState, useEffect, useCallback } from "react";
import type { Product } from "@/shared/types/product";
import type { CartItem } from "@/modules/cart/types";

import {
  getTotalItems,
  getTotalPrice,
  getTotalSavings,
} from "./cart.selectors";

import {
  addItemToCart,
  removeItemFromCart,
  changeCartItemQty,
  setCartItemQty,
  setCartItemNote,
} from "./cart.actions";

import {
  CART_KEY,
  loadCart,
  parsePersistedCart,
  saveCart,
} from "./cart.persistence";

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>(() => loadCart());

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== CART_KEY) return;

      setCart(
        parsePersistedCart(
          e.newValue,
        ),
      );
    };

    window.addEventListener("storage", handler);

    return () => window.removeEventListener("storage", handler);
  }, []);

  const addToCart = useCallback(
    (product: Product, qty: number = 1) => {
      setCart((prev) =>
        addItemToCart(prev, product, qty)
      );
    },
    []
  );

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) =>
      removeItemFromCart(prev, id)
    );
  }, []);

  const changeQty = useCallback(
    (id: string, delta: number) => {
      setCart((prev) =>
        changeCartItemQty(prev, id, delta)
      );
    },
    []
  );

  const setExactQty = useCallback(
    (id: string, qty: number | null) => {
      setCart((prev) =>
        setCartItemQty(prev, id, qty)
      );
    },
    []
  );

  const setItemNote = useCallback(
    (id: string, note: string) => {
      setCart((prev) =>
        setCartItemNote(prev, id, note)
      );
    },
    []
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const totalItems = getTotalItems(cart);

  const totalPrice = getTotalPrice(cart);

  const savings = getTotalSavings(cart);

  return {
    cart,
    addToCart,
    removeFromCart,
    changeQty,
    setExactQty,
    setItemNote,
    clearCart,
    totalItems,
    totalPrice,
    savings,
  };
}
