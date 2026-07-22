import type { Product } from "@/shared/types/product";
import { getAvailablePriceTiers } from "@/shared/config/priceTiers";

const TIER_LABELS = {
  price_3: "Por Mayor",
  price_12: "Por Docena",
  price_50: "Medio ciento",
  price_100: "Por Caja",
} as const;

interface Props {
  product: Product;
  available: boolean;
  isPreventa: boolean;
}

export function ProductCardTierBadges({
  product,
  available,
  isPreventa,
}: Props) {
  if (!available || isPreventa) return null;

  const tiers = getAvailablePriceTiers(product).filter((tier) => {
    const unitPrice = Number(product[tier.key]);

    return unitPrice < product.price_1;
  });

  if (!tiers.length) return null;

  return (
    <div className="wholesale-list">
      <div className="wholesale-title mt-1 border-t border-dashed border-slate-300 pt-1.5">
        <span>📦</span>
        <span>Precios mayorista</span>
      </div>

      <div className="flex flex-col gap-1.5">
        {tiers.map((tier) => {
          const unitPrice = Number(product[tier.key]);
          const totalPrice = unitPrice * tier.qty;

          return (
            <div
              key={tier.key}
              className={`wholesale-chip tier tier-chip ${tier.className}`}
            >
              <span className="block w-full text-center">
                {TIER_LABELS[tier.key]} ({tier.label}) × S/
                {totalPrice.toFixed(0)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
