import type {
  NextVolumePrice,
} from "@/shared/domain/volumePricing/VolumePricing";

interface ProductPriceBlockProps {
  unitPrice: number;
  total: number;
  effectiveQty: number;
  pricePulse: boolean;
  showUnlock: boolean;
  savingsByQty: number;
  basePrice: number;
  nextVolumePrice: NextVolumePrice | null;
  isQtyInputValid: boolean;
}

export function ProductPriceBlock({
  unitPrice,
  total,
  effectiveQty,
  pricePulse,
  showUnlock,
  savingsByQty,
  basePrice,
  nextVolumePrice,
  isQtyInputValid,
}: ProductPriceBlockProps) {
  const hasOffer = unitPrice > 0 && basePrice > unitPrice;

  return (
    <div className="text-center md:text-left">
      {hasOffer&&(
        <div className="mb-2 flex flex-wrap items-center justify-center gap-2 md:justify-start">
          <span className="text-[14px] font-semibold text-slate-400 line-through decoration-2">
          S/ {basePrice.toFixed(2)}
          </span>
          <span className="rounded-full border border-red-200 bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 px-2.5 py-1 text-[10px] font-black tracking-wide text-red-600 shadow-[0_2px_10px_rgba(239,68,68,.12)]">
          ⚡ AHORRAS
          </span>
        </div>
      )}

      <div className="flex items-end justify-center gap-2 md:justify-start">
        <span className="text-lg font-black text-muted-foreground md:text-xl">
          S/
        </span>

        <span
          className={[
            "text-4xl font-black tracking-tight leading-none transition-transform duration-200 md:text-5xl",
            hasOffer ? "text-red-600" : "text-[#1d8299]",
            pricePulse ? "scale-105" : "scale-100",
          ].join(" ")}
        >
          {unitPrice.toFixed(2)}
        </span>
      </div>

      <p className="mt-1 text-[12px] font-semibold text-muted-foreground">
        {hasOffer ? "Precio oferta por unidad" : "Precio por unidad"}
      </p>

      {showUnlock && !hasOffer && (
        <p className="mt-2 text-sm font-bold text-success">
          🎉 Mejor precio desbloqueado
        </p>
      )}

      {effectiveQty > 1 && (
        <p className="mt-2 text-sm text-foreground">
          Total: <strong>S/ {total.toFixed(2)}</strong>
        </p>
      )}

      {savingsByQty > 0 && !hasOffer && (
        <p className="mt-1 text-sm font-bold text-green-600 md:text-base">
          💰 Estás pagando <strong>S/ {unitPrice.toFixed(2)}</strong> en lugar de{" "}
          <span className="line-through opacity-70">
            S/ {basePrice.toFixed(2)}
          </span>
        </p>
      )}

      {nextVolumePrice && !hasOffer && (
        <p className="mt-1 text-sm font-semibold text-[#1d8299]">
          🔥 Agrega {nextVolumePrice.qty - effectiveQty} más y baja a S/{" "}
          {nextVolumePrice.unitPrice.toFixed(2)}
        </p>
      )}

      {!isQtyInputValid && (
        <p className="mt-2 text-sm font-semibold text-destructive">
          Ingresa una cantidad válida para continuar
        </p>
      )}
    </div>
  );
}







