import type { Product } from "@/shared/types/product";
import { getBestProductTier } from "@/shared/lib/product";

interface ProductCardPriceProps {
  product: Product;
  isPreventa: boolean;
}

export function ProductCardPrice({
  product,
  isPreventa,
}: ProductCardPriceProps) {
  const bestTier = getBestProductTier(product);

  const showBestTierMessage =
    bestTier &&
    bestTier.qty > 1 &&
    product.price_1 > bestTier.price;

  if (isPreventa) {
    return (
      <div className="mt-3 pt-3 border-t border-[#eef2f6] flex flex-col items-center gap-1.5">
        <span className="text-[13px] text-muted-foreground font-semibold">
          Próximamente
        </span>

        <div className="flex items-baseline gap-1">
          <span className="text-[13px] text-muted-foreground">💬</span>
          <span className="text-[20px] md:text-[22px] font-black text-green-600 tracking-tight">
            Consultar
          </span>
        </div>

        <span className="text-[11px] text-muted-foreground font-medium">
          Te brindamos más información por WhatsApp
        </span>
      </div>
    );
  }

  return (
    <div className="mt-3 pt-3 border-t border-[#eef2f6] flex flex-col items-center gap-1.5">
      <div className="flex items-baseline justify-center gap-1">
        <span className="text-[13px] text-muted-foreground font-semibold">
          S/
        </span>

        <span className="text-[26px] md:text-[30px] font-black text-[#1d8299] tracking-tight leading-none">
          {product.price_1.toFixed(1)}
        </span>
      </div>

      <span className="text-[11px] text-muted-foreground font-medium">
        Precio por unidad
      </span>

      {showBestTierMessage && (
        <span className="inline-flex items-center justify-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
          🔥 Lleva {bestTier.qty} y paga S/ {bestTier.price.toFixed(1)} c/u
        </span>
      )}
    </div>
  );
}
