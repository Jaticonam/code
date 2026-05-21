import type { Product } from "@/types/product";
import { getAvailablePriceTiers } from "@/config/priceTiers";

interface Props {
  product: Product;
  available: boolean;
  isPreventa: boolean;
}

export function ProductCardTierRow({
  product,
  available,
  isPreventa,
}: Props) {

  if (!available || isPreventa) return null;

  const tiers =
    getAvailablePriceTiers(product);

  if (!tiers.length) return null;

  return (

    <div className="flex flex-wrap justify-center gap-1.5 mt-2 mb-2">

      {tiers.map((tier) => {

        const value =
          product[tier.key];

        if (
          typeof value !== "number"
          || value <= 0
        ) return null;

        return (

          <div
            key={tier.key}
            className="
            px-2.5
            py-1
            rounded-full

            bg-[#f8fafc]

            border
            border-[#e2e8f0]

            text-[10px]
            font-black

            text-[#1d8299]

            shadow-sm

            transition-all
            duration-200

            hover:scale-105
            hover:border-[#1d8299]
            "
          >

            {tier.label}

            {" "}

            <span className="text-[#0f172a]">

              S/{value.toFixed(1)}

            </span>

          </div>

        );

      })}

    </div>

  );

}
