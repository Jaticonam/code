import type { Product } from "@/shared/types/product";
import { getBestProductTier } from "@/shared/lib/product";

interface ProductCardPriceProps {
  product: Product;
  isPreventa?: boolean;
}

export function ProductCardPrice({ product, isPreventa = false }: ProductCardPriceProps) {
  const bestTier = getBestProductTier(product);

  const hasOffer =
    !!product.price_offer &&
    product.price_offer > 0 &&
    product.price_offer < product.price_1;

  const finalPrice = hasOffer ? product.price_offer! : product.price_1;

  const showBestTierMessage =
    !hasOffer && bestTier && bestTier.qty > 1 && product.price_1 > bestTier.price;

  if (isPreventa) {
    return (
      <div className="mt-3 flex flex-col items-center gap-1.5 border-t border-[#eef2f6] pt-3">
        <span className="text-[13px] font-semibold text-muted-foreground">Próximamente</span>
        <span className="text-[20px] font-black tracking-tight text-green-600 md:text-[22px]">💬 Consultar</span>
        <span className="text-[11px] font-medium text-muted-foreground">Te brindamos más información por WhatsApp</span>
      </div>
    );
  }

  return (
    <div className="mt-3 flex flex-col items-center gap-1 border-t border-[#eef2f6] pt-3">
      {hasOffer&&(
        <div className="flex items-center justify-center gap-1.5">
          <span className="text-[13px] font-semibold text-slate-400 line-through decoration-2">
            S/ {product.price_1.toFixed(1)}
          </span>
          <span className="rounded-full border border-red-200 bg-gradient-to-r from-red-50 to-orange-50 px-2 py-[2px] text-[9px] font-black text-red-600">
            ⚡ Ahorra
          </span>
        </div>
      )}

      <div className="flex items-baseline justify-center gap-1">
        <span className="text-[13px] font-semibold text-muted-foreground">S/</span>
        <span className={`text-[26px] font-black leading-none tracking-tight md:text-[30px] ${hasOffer?"text-red-600":"text-[#1d8299]"}`}>
          {finalPrice.toFixed(1)}
        </span>
      </div>

      <span className="text-[11px] font-medium text-muted-foreground">
        {hasOffer?"Precio oferta por unidad":"Precio por unidad"}
      </span>

      {showBestTierMessage&&(
        <span className="inline-flex items-center justify-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
          🔥 Lleva {bestTier.qty} y paga S/ {bestTier.price.toFixed(1)} c/u
        </span>
      )}
    </div>
  );
}