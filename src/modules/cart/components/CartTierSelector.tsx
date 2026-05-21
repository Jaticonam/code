import { CartItem } from "@/shared/types/product";
import { CART_TIERS, TIER_COLORS } from "@/shared/config/cartTiers";

interface CartTierSelectorProps {
  item: CartItem;
  onSetQty: (id: string, qty: number | null) => void;
}

export function CartTierSelector({
  item,
  onSetQty,
}: CartTierSelectorProps) {
  const itemTiers = CART_TIERS.filter((tier) => {
    const value = item[tier.key];
    return value !== null && value !== undefined && value > 0;
  });

  return (
    <div className="flex gap-1 flex-grow flex-wrap">
      {itemTiers.map((tier, index) => {
        const nextTier = itemTiers[index + 1];

        const isActive =
          item.qty >= tier.qty && (!nextTier || item.qty < nextTier.qty);

        return (
          <button
            key={tier.qty}
            onClick={() => onSetQty(item.id, tier.qty)}
            className={`cart-tier-btn ${
              isActive
                ? `${TIER_COLORS[tier.cls]} scale-[1.02] shadow-md`
                : "cart-tier-btn-muted"
            }`}
          >
            {tier.label}
          </button>
        );
      })}
    </div>
  );
}
