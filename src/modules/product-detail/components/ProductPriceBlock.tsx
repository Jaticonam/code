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
  return (
    <div className="text-center md:text-left">
      <div className="flex items-end justify-center md:justify-start gap-2">
        <span className="text-lg md:text-xl font-black text-muted-foreground">
          S/
        </span>

        <span
          className={`text-4xl md:text-5xl font-black text-[#1d8299] tracking-tight leading-none transition-transform duration-200 ${
            pricePulse ? "scale-105" : "scale-100"
          }`}
        >
          {unitPrice.toFixed(2)}
        </span>
      </div>

      {showUnlock && (
        <p className="text-success font-bold text-sm mt-2">
          🎉 Mejor precio desbloqueado
        </p>
      )}

      {effectiveQty > 1 && (
        <p className="text-sm text-foreground mt-2">
          Total: <strong>S/ {total.toFixed(2)}</strong>
        </p>
      )}

      {savingsByQty > 0 && (
        <p className="text-green-600 font-bold text-sm md:text-base mt-1">
          💰 Estás pagando <strong>S/ {unitPrice.toFixed(2)}</strong> en lugar de{" "}
          <span className="line-through opacity-70">
            S/ {basePrice.toFixed(2)}
          </span>
        </p>
      )}

      {nextTier && (
        <p className="text-[#1d8299] text-sm font-semibold mt-1">
          🔥 Agrega {nextTier.qty - effectiveQty} más y baja a S/{" "}
          {nextTier.price.toFixed(2)}
        </p>
      )}

      {!isQtyInputValid && (
        <p className="text-destructive font-semibold text-sm mt-2">
          Ingresa una cantidad válida para continuar
        </p>
      )}
    </div>
  );
}
