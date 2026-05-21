import type { Product } from "@/shared/types/product";
import { getAvailablePriceTiers } from "@/shared/config/priceTiers";

const COLORS: Record<string, string> = {
  price_1: "bg-[#1d8299]",
  price_3: "bg-[#f5b025]",
  price_12: "bg-[#f286be]",
  price_50: "bg-[#7c3aed]",
  price_100: "bg-slate-700",
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

  return (
    <div className="absolute bottom-2 left-2 right-2 z-20 flex justify-center gap-1">
      {getAvailablePriceTiers(product).map((tier, index) => {
        const price = Number(product[tier.key]);

        if (!price || price <= 0) return null;

        return (
          <span
            key={tier.key}
            style={{ animationDelay: `${index * 120}ms` }}
            className={`${COLORS[tier.key] || "bg-slate-500"} animate-badge-float rounded-full px-2.5 py-[5px] text-[10px] font-black text-white shadow-lg transition hover:scale-110`}
          >
            {tier.label} S/{price.toFixed(1)}
          </span>
        );
      })}
    </div>
  );
}
