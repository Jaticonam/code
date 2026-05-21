import { useEffect, useState } from "react";
import { CheckCircle2, X, Package } from "lucide-react";
import { Product } from "@/shared/types/product";

interface AddToCartModalProps {
  open: boolean;
  product: Product | null;
  currentQty: number;
  onClose: () => void;
  onAddExtra: (qty: number) => void;
  onOpenCart: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

function getNextTier(product: Product, qty: number) {
  const tiers = [
    { targetQty: 3, unitPrice: product.price_3 },
    { targetQty: 12, unitPrice: product.price_12 },
    { targetQty: 50, unitPrice: product.price_50 },
    { targetQty: 100, unitPrice: product.price_100 },
  ];

  const validTiers = tiers.filter(
    (tier) =>
      typeof tier.unitPrice === "number" &&
      Number.isFinite(tier.unitPrice) &&
      tier.unitPrice > 0
  );

  return validTiers.find((tier) => qty < tier.targetQty) ?? null;
}

export function AddToCartModal({
  open,
  product,
  currentQty,
  onClose,
  onAddExtra,
  onOpenCart,
  secondaryActionLabel,
  onSecondaryAction,
}: AddToCartModalProps) {
  const [pulse, setPulse] = useState(false);

  const nextTier = product ? getNextTier(product, currentQty) : null;
  const missingQty = nextTier ? Math.max(nextTier.targetQty - currentQty, 0) : 0;
  const hasUpsell = !!nextTier && missingQty > 0;

  useEffect(() => {
    if (!open || !nextTier) return;

    setPulse(true);
    const t = setTimeout(() => setPulse(false), 180);
    return () => clearTimeout(t);
  }, [currentQty, open, nextTier]);

  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/45 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-[360px] animate-in fade-in zoom-in-95 duration-200 rounded-2xl border border-[#dbe5ee] bg-white p-4 shadow-2xl">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dcfce7] text-[#16a34a]">
              <CheckCircle2 className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h3 className="text-[16px] font-extrabold leading-tight text-[#334155]">
                Agregado a tu caja
              </h3>
              <p className="line-clamp-1 text-[12px] font-medium text-[#64748b]">
                {product.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1 text-[#94a3b8] transition-colors hover:bg-[#f1f5f9] hover:text-[#334155]"
            aria-label="Cerrar modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* BLOQUE INFO */}
        <div
          className={[
            "mt-4 rounded-xl border border-[#dbe5ee] bg-[#f8fafc] p-3 transition-all duration-200",
            pulse ? "scale-[1.02]" : "",
          ].join(" ")}
        >
          <div className="flex items-center gap-3">
            <img
              src={product.img || "/placeholder.svg"}
              alt={product.title}
              className="h-14 w-14 shrink-0 rounded-lg object-cover"
            />

            <div className="min-w-0">
              <p className="text-[12px] font-medium text-[#64748b]">
                Vas con {currentQty} unidad{currentQty !== 1 ? "es" : ""}
              </p>

              {nextTier ? (
                <p className="mt-1 text-[13px] leading-snug text-[#334155]">
                  Con{" "}
                  <span className="font-extrabold text-[#1d8299]">
                    {nextTier.targetQty} unidades
                  </span>{" "}
                  bajas a{" "}
                  <span className="font-extrabold text-[#1d8299]">
                    S/{nextTier.unitPrice.toFixed(1)}
                  </span>{" "}
                  c/u
                </p>
              ) : (
                <p className="mt-1 text-[13px] font-semibold text-[#16a34a]">
                  Ya tienes el mejor precio 🔥
                </p>
              )}
            </div>
          </div>
        </div>

        {/* BLOQUE UPSELL */}
        {hasUpsell && (
          <div className="mt-3 rounded-xl border border-[#bfe5ed] bg-[#e6f6f8] p-3">
            <p className="text-[12px] font-bold leading-snug text-[#334155]">
              Estás a {missingQty} más para bajar el precio... ¡Aprovecha! 😏
            </p>
          </div>
        )}

        {/* BOTONES */}
        <div className="mt-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {hasUpsell ? (
              <button
                onClick={() => onAddExtra(missingQty)}
                className="w-full rounded-xl bg-[#1d8299] py-3 text-[13px] font-extrabold text-white transition-all duration-200 hover:bg-[#16697a] active:scale-[0.97]"
              >
                Bajar precio (+{missingQty})
              </button>
            ) : (
              <button
                disabled
                className="w-full rounded-xl bg-[#dcfce7] py-3 text-[13px] font-bold text-[#16a34a]"
              >
                ✓ Agregado
              </button>
            )}

            <button
              onClick={onSecondaryAction ?? onClose}
              className="w-full rounded-xl border-2 border-[#f6bfdc] bg-white px-3 py-3 text-[13px] font-extrabold text-[#f286be] transition-all duration-200 hover:bg-[#fff0f7] active:scale-[0.98]"
            >
              {secondaryActionLabel ?? "Otro producto"}
            </button>
          </div>

          <button
            onClick={onOpenCart}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1d8299] py-3 text-[13px] font-extrabold text-white transition-all duration-200 hover:bg-[#16697a] active:scale-[0.98]"
          >
            <Package className="h-4 w-4" />
            Ver mi caja
          </button>
        </div>
      </div>
    </div>
  );
}
