import type { Product } from "@/types/product";

export function getBestProductTier(product: Product) {
  const tiers = [
    { qty: 1, price: Number(product.price_1) },
    { qty: 3, price: Number(product.price_3) },
    { qty: 12, price: Number(product.price_12) },
    { qty: 50, price: Number(product.price_50) },
    { qty: 100, price: Number(product.price_100) },
  ].filter((tier) => tier.price > 0);

  if (!tiers.length) return null;

  return [...tiers].sort((a, b) => a.price - b.price || a.qty - b.qty)[0];
}
