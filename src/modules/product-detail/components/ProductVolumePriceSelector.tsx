import type {
  Product,
} from "@/shared/types/product";

import {
  getAvailableVolumePrices,
  getVolumeUnitPrice,
  hasValidOfferPrice,
} from "@/shared/domain/volumePricing/VolumePricing";

interface ProductVolumePriceSelectorProps {
  product: Product;
  effectiveQty: number;
  onSelectQty: (qty: number) => void;
}

const OFFER_QUICK_QUANTITIES = [
  1,
  3,
  12,
] as const;

function getQuantityLabel(
  quantity: number,
): string {
  return quantity === 1
    ? "1 unidad"
    : `${quantity} unidades`;
}

export function ProductVolumePriceSelector({
  product,
  effectiveQty,
  onSelectQty,
}: ProductVolumePriceSelectorProps) {
  const hasOffer =
    hasValidOfferPrice(
      product,
    );

  if (hasOffer) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {OFFER_QUICK_QUANTITIES.map(
          (quantity) => {
            const active =
              effectiveQty ===
              quantity;

            const unitPrice =
              getVolumeUnitPrice(
                product,
                quantity,
              );

            return (
              <button
                key={quantity}
                type="button"
                onClick={() =>
                  onSelectQty(
                    quantity,
                  )
                }
                aria-label={`Seleccionar ${getQuantityLabel(
                  quantity,
                )} a S/ ${unitPrice.toFixed(
                  2,
                )} c/u`}
                aria-pressed={active}
                data-testid={`product-detail-quick-quantity-${quantity}`}
                className={[
                  "min-h-[48px] rounded-xl border px-3 py-2 text-center transition active:scale-[.98]",
                  active
                    ? "border-[#1d8299] bg-[#e6f6f8] text-[#1d8299] shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                ].join(" ")}
              >
                <span className="block text-[14px] font-black">
                  {quantity}u
                </span>
              </button>
            );
          },
        )}
      </div>
    );
  }

  const availableTiers =
    getAvailableVolumePrices(
      product,
    );

  return (
    <div className="flex flex-wrap justify-center gap-2 md:justify-start">
      {availableTiers.map(
        (
          tier,
          index,
        ) => {
          const nextTier =
            availableTiers[
              index + 1
            ];

          const active =
            effectiveQty >=
              tier.qty &&
            (
              !nextTier ||
              effectiveQty <
                nextTier.qty
            );

          return (
            <button
              key={tier.key}
              type="button"
              onClick={() =>
                onSelectQty(
                  tier.qty,
                )
              }
              aria-label={`Seleccionar ${getQuantityLabel(
                tier.qty,
              )} a S/ ${tier.unitPrice.toFixed(
                2,
              )} c/u`}
              aria-pressed={active}
              data-testid={`product-detail-volume-tier-${tier.qty}`}
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
                  S/
                  {tier.unitPrice.toFixed(
                    2,
                  )}
                </span>
              </div>
            </button>
          );
        },
      )}
    </div>
  );
}
