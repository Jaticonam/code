import type { Product } from "@/shared/types/product";
import { PRICE_TIERS } from "@/shared/config/priceTiers";

interface ProductTierSelectorProps {
  product: Product;
  effectiveQty: number;
  onSelectQty: (qty: number) => void;
}

export function ProductTierSelector({
  product,
  effectiveQty,
  onSelectQty,
}: ProductTierSelectorProps) {
  const availableTiers = PRICE_TIERS.filter((tier) => {
    const value = product[tier.key];

    return (
      typeof value === "number" &&
      Number.isFinite(value) &&
      value > 0
    );
  });

  return (
    <div className="flex flex-wrap justify-center gap-2 md:justify-start">
      {availableTiers.map((tier, index) => {
        const value = Number(product[tier.key]);
        const nextTier = availableTiers[index + 1];

        const active =
          effectiveQty >= tier.qty &&
          (!nextTier || effectiveQty < nextTier.qty);

        return (
          <button
            key={tier.key}
            type="button"
            onClick={() => onSelectQty(tier.qty)}
            className={[
              "tier",
              "tier-button",
              tier.className,
              "min-w-[96px]",
              active
                ? "tier-active scale-[1.04]"
                : "hover:scale-[1.03]",
            ].join(" ")}
          >
            <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
              <span className="text-[13px] font-black tracking-wide">
                {tier.label}
              </span>

              <span className="text-[13px] font-black md:text-sm">
                S/{value.toFixed(2)}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
