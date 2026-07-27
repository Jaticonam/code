import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
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
  readCartStorage,
  readPersistedCart,
  saveCart,
} from "./cart.persistence";

export function useCart() {
  const initialRead = useRef(
    readCartStorage(),
  );
  const persistenceBlocked =
    useRef(
      initialRead.current.success ===
        false &&
        initialRead.current.reason ===
          "UNSUPPORTED_VERSION",
    );
  const [cart, setCart] =
    useState<CartItem[]>(() =>
      initialRead.current.success
        ? initialRead.current.data
        : [],
    );

  useEffect(() => {
    if (persistenceBlocked.current) {
      return;
    }

    saveCart(cart);
  }, [cart]);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== CART_KEY) return;

      const result =
        readPersistedCart(
          e.newValue,
        );

      if (result.success === false) {
        if (
          result.reason ===
          "UNSUPPORTED_VERSION"
        ) {
          persistenceBlocked.current =
            true;
        }
        return;
      }

      persistenceBlocked.current =
        false;
      setCart(result.data);
    };

    window.addEventListener("storage", handler);

    return () => window.removeEventListener("storage", handler);
  }, []);

  const addToCart = useCallback(
    (product: Product, qty: number = 1) => {
      persistenceBlocked.current =
        false;
      setCart((prev) =>
        addItemToCart(prev, product, qty)
      );
    },
    []
  );

  const removeFromCart = useCallback((id: string) => {
    persistenceBlocked.current =
      false;
    setCart((prev) =>
      removeItemFromCart(prev, id)
    );
  }, []);

  const changeQty = useCallback(
    (id: string, delta: number) => {
      persistenceBlocked.current =
        false;
      setCart((prev) =>
        changeCartItemQty(prev, id, delta)
      );
    },
    []
  );

  const setExactQty = useCallback(
    (id: string, qty: number | null) => {
      persistenceBlocked.current =
        false;
      setCart((prev) =>
        setCartItemQty(prev, id, qty)
      );
    },
    []
  );

  const setItemNote = useCallback(
    (id: string, note: string) => {
      persistenceBlocked.current =
        false;
      setCart((prev) =>
        setCartItemNote(prev, id, note)
      );
    },
    []
  );

  const clearCart = useCallback(() => {
    persistenceBlocked.current =
      false;
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
