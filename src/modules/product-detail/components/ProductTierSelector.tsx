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
  return (
    <div className="flex flex-wrap justify-center md:justify-start gap-2">
      {PRICE_TIERS.map((tier) => {
        const value = product[tier.key];

        if (!value) return null;

        const active =
          (tier.qty === 1 && effectiveQty < 3) ||
          (tier.qty === 3 && effectiveQty >= 3 && effectiveQty < 12) ||
          (tier.qty === 12 && effectiveQty >= 12 && effectiveQty < 50) ||
          (tier.qty === 50 && effectiveQty >= 50 && effectiveQty < 100) ||
          (tier.qty === 100 && effectiveQty >= 100);

        const tierStyle = active
          ? "bg-[#1d8299] text-white border-[#1d8299] shadow-md"
          : tier.qty === 3
            ? "bg-[#fff7e6] text-[#f59e0b] border-[#f6d28b] hover:bg-[#fff1cc]"
            : tier.qty === 12
              ? "bg-[#fff0f7] text-[#f286be] border-[#f6bfdc] hover:bg-[#ffe3f1]"
              : tier.qty === 50
                ? "bg-[#f3efff] text-[#8b5cf6] border-[#d8ccff] hover:bg-[#ebe3ff]"
                : tier.qty === 100
                  ? "bg-[#f1f5f9] text-[#0f172a] border-[#cbd5e1] hover:bg-[#e2e8f0]"
                  : "bg-white text-[#1d8299] border-[#d8e2ed] hover:bg-[#f0f8fa]";

        return (
          <button
            key={tier.key}
            type="button"
            onClick={()=>onSelectQty(tier.qty)}
            className={`px-3 py-1.5 rounded-2xl border transition-all duration-200 min-w-[96px] shadow-sm cursor-pointer ${tierStyle} ${active?"scale-[1.04]":"hover:scale-[1.03]"}`}
          >
            <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
              <span className="text-[13px] font-black tracking-wide">
                {tier.label}
              </span>

              <span className="text-[13px] md:text-sm font-black">
                S/{value.toFixed(2)}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
