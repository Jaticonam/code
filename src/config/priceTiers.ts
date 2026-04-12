import type { Product } from "@/types/product";

export const PRICE_TIERS = [
  { qty: 1, key: "price_1" as const, label: "1u", className: "bg-primary text-primary-foreground" },
  { qty: 3, key: "price_3" as const, label: "3u+", className: "bg-tertiary text-tertiary-foreground" },
  { qty: 12, key: "price_12" as const, label: "12u+", className: "bg-secondary text-secondary-foreground" },
  { qty: 50, key: "price_50" as const, label: "50u+", className: "bg-purple-500 text-white" },
  { qty: 100, key: "price_100" as const, label: "100u+", className: "bg-dark text-white" },
] as const;

export const VOLUME_PRICE_TIERS = PRICE_TIERS.filter((tier) => tier.key !== "price_1");

export function getAvailablePriceTiers(product: Product) {
  return VOLUME_PRICE_TIERS.filter((tier) => {
    const value = product[tier.key];
    return typeof value === "number" && Number.isFinite(value) && value > 0;
  });
}

export function getUnitPriceByQty(product: Product, qty: number): number {
  if (qty >= 100 && product.price_100) return product.price_100;
  if (qty >= 50 && product.price_50) return product.price_50;
  if (qty >= 12 && product.price_12) return product.price_12;
  if (qty >= 3 && product.price_3) return product.price_3;
  return product.price_1 || 0;
}

export function getNextTier(product: Product, qty: number) {
  if (qty < 3 && product.price_3) return { qty: 3, price: product.price_3 };
  if (qty < 12 && product.price_12) return { qty: 12, price: product.price_12 };
  if (qty < 50 && product.price_50) return { qty: 50, price: product.price_50 };
  if (qty < 100 && product.price_100) return { qty: 100, price: product.price_100 };
  return null;
}