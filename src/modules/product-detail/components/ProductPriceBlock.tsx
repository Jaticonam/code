interface ProductPriceBlockProps {
  unitPrice: number;
  total: number;
  effectiveQty: number;
  pricePulse: boolean;
  showUnlock: boolean;
  savingsByQty: number;
  basePrice: number;
  nextTier: {
    qty: number;
    price: number;
  } | null;
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
  nextTier,
  isQtyInputValid,
}: ProductPriceBlockProps) {
  const hasOffer = unitPrice > 0 && basePrice > unitPrice;

  return (
    <div className="text-center md:text-left">
      {hasOffer && (
        <div className="mb-2 flex justify-center md:justify-start">
          <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-red-600">
            🔥 Oferta activa
          </span>
        </div>
      )}

      {hasOffer && (
        <p className="mb-1 text-sm font-bold text-slate-400 line-through">
          Antes S/ {basePrice.toFixed(2)}
        </p>
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

      {nextTier && !hasOffer && (
        <p className="mt-1 text-sm font-semibold text-[#1d8299]">
          🔥 Agrega {nextTier.qty - effectiveQty} más y baja a S/{" "}
          {nextTier.price.toFixed(2)}
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