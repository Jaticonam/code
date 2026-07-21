import type { CartItem } from "@/modules/cart/types";
import { PRICE_TIERS } from "@/shared/config/priceTiers";

interface CartTierSelectorProps {
  item: CartItem;
  onSetQty: (id: string, qty: number | null) => void;
}

export function CartTierSelector({
  item,
  onSetQty,
}: CartTierSelectorProps) {
  const itemTiers = PRICE_TIERS.filter((tier) => {
    const value = item[tier.key];

    return (
      typeof value === "number" &&
      Number.isFinite(value) &&
      value > 0
    );
  });

  const gridCols =
    itemTiers.length <= 1
      ? "grid-cols-1"
      : itemTiers.length === 2
        ? "grid-cols-2"
        : "grid-cols-3";

  return (
    <div className={`grid ${gridCols} flex-1 gap-1`}>
      {itemTiers.map((tier, index) => {
        const nextTier = itemTiers[index + 1];

        const active =
          item.qty >= tier.qty &&
          (!nextTier || item.qty < nextTier.qty);

        return (
          <button
            key={tier.key}
            type="button"
            onClick={() => onSetQty(item.id, tier.qty)}
            className={[
              "tier",
              "tier-button",
              tier.className,
              "w-full py-1.5",
              active
                ? "tier-active scale-[1.02]"
                : "hover:scale-[1.02]",
            ].join(" ")}
          >
            {tier.label}
          </button>
        );
      })}
    </div>
  );
}
