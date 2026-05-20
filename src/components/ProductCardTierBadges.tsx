import type { Product } from "@/types/product";
import { getAvailablePriceTiers } from "@/config/priceTiers";

interface ProductCardTierBadgesProps {
  product: Product;
  available: boolean;
  isPreventa: boolean;
}

export function ProductCardTierBadges({
  product,
  available,
  isPreventa,
}: ProductCardTierBadgesProps) {
  if (!available || isPreventa) return null;

  return (
    <div className="absolute bottom-2 right-2 flex flex-col gap-1.5 items-end">
      {getAvailablePriceTiers(product).map((tier, index) => {
        const price = product[tier.key];

        if (
          typeof price !== "number" ||
          !Number.isFinite(price) ||
          price <= 0
        ) {
          return null;
        }

        return (
          <div
            key={tier.key}
            className={`${tier.className} price-badge-bounce`}
            style={{ animationDelay: `${index * 120}ms` }}
          >
            {tier.label} S/{price.toFixed(1)}
          </div>
        );
      })}
    </div>
  );
}
