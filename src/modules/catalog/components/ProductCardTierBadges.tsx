import type { Product } from "@/shared/types/product";
import { getAvailablePriceTiers } from "@/shared/config/priceTiers";

const CHIP_COLORS: Record<string, string> = {
  price_3: "wholesale-chip-price-3",
  price_12: "wholesale-chip-price-12",
  price_50: "wholesale-chip-price-50",
  price_100: "wholesale-chip-price-100",
};

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
    const price = Number(product[tier.key]);
    return tier.key !== "price_1" && price > 0;
  });

  if (!tiers.length) return null;

  return (
    <div className="wholesale-list">
      <div className="wholesale-title">
        <span>📦</span>
        <span>Precio Mayorista</span>
      </div>

      <div className="flex flex-col gap-1.5">
        {tiers.map((tier) => {
          const price = Number(product[tier.key]);
          if (price >= product.price_1) return null;

          const ICONS: Record<string, string> = {
            price_3: "🔥",
            price_12: "🚀",
            price_50: "⭐",
            price_100: "💎",
          };

          return (
            <div
              key={tier.key}
              className={`wholesale-chip ${CHIP_COLORS[tier.key] || "border-slate-200 bg-slate-50 text-slate-600"}`}
            >
              <span>
                {ICONS[tier.key] || "📦"} Lleva {tier.label} y paga S/
                {price.toFixed(1)} c/u
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
