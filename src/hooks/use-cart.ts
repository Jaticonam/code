import { useState, useEffect, useCallback } from "react";
import { CartItem, Product } from "@/types/product";
import { getEffectivePrice } from "@/lib/products";

const CART_KEY = "wooly_cart";

function loadCart(): CartItem[] {
  try {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  // Sincronizar entre pestañas
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === CART_KEY && e.newValue) {
        setCart(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((x) => x.id === product.id);
      if (existing) {
        return prev.map((x) =>
          x.id === product.id ? { ...x, qty: x.qty + 1 } : x
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const changeQty = useCallback((id: string, delta: number) => {
    setCart((prev) => {
      const item = prev.find((x) => x.id === id);
      if (!item) return prev;
      const newQty = item.qty + delta;
      if (newQty <= 0) return prev.filter((x) => x.id !== id);
      return prev.map((x) => (x.id === id ? { ...x, qty: newQty } : x));
    });
  }, []);

  const setExactQty = useCallback((id: string, qty: number) => {
    setCart((prev) =>
      prev.map((x) => (x.id === id ? { ...x, qty } : x))
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const totalItems = cart.reduce((a, b) => a + b.qty, 0);
  const totalPrice = cart.reduce(
    (a, item) => a + getEffectivePrice({ ...item }) * item.qty,
    0
  );
  const totalOriginal = cart.reduce(
    (a, item) => a + item.price_1 * item.qty,
    0
  );
  const savings = totalOriginal - totalPrice;

  return {
    cart,
    addToCart,
    removeFromCart,
    changeQty,
    setExactQty,
    clearCart,
    totalItems,
    totalPrice,
    savings,
  };
}
