import type { Product } from "@/shared/types/product";
import { getAvailablePriceTiers } from "@/shared/config/priceTiers";

const CHIP_COLORS: Record<string, string> = {
  price_3: "wholesale-chip-price-3",
  price_12: "wholesale-chip-price-12",
  price_50: "wholesale-chip-price-50",
  price_100: "wholesale-chip-price-100",
};

const ICONS: Record<string, string> = {
  price_3: "🔥",
  price_12: "⚡",
  price_50: "🚀",
  price_100: "💎",
};

const LABELS: Record<string, string> = {
  price_3: "Por Mayor",
  price_12: "Por Docena",
  price_50: "Medio ciento",
  price_100: "Por Caja",
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
      <div className="wholesale-title mt-1 pt-1.5 border-t border-dashed border-slate-300 flex items-center justify-center gap-1 text-[10px] font-black uppercase tracking-wider text-slate-600">
        <span>📦</span>
        <span>PRECIOS MAYORISTA</span>
      </div>

      <div className="flex flex-col gap-1.5">
        {tiers.map((tier) => {
          const price = Number(product[tier.key]);
          if (price >= product.price_1) return null;

          const units = parseInt(tier.label, 10);
          const total = price * units;

          return (
            <div
              key={tier.key}
              className={`wholesale-chip flex justify-center text-center ${
                CHIP_COLORS[tier.key] ||
                "border-slate-200 bg-slate-50 text-slate-600"
              }`}
            >
              <span className="block w-full text-center">
                {LABELS[tier.key]} ({tier.label}) x S/{total.toFixed(0)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
