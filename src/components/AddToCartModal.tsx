import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { Product } from "@/types/product";

interface AddToCartModalProps {
  open: boolean;
  product: Product | null;
  currentQty: number;
  onClose: () => void;
  onAddExtra: (qty: number) => void;
  onOpenCart: () => void;
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
  }, [currentQty, open]);

  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-[130] bg-black/45 backdrop-blur-[2px] flex items-center justify-center px-4">
      <div className="w-full max-w-[360px] rounded-2xl bg-white shadow-2xl border border-slate-200 p-4 animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="shrink-0 rounded-full bg-green-100 p-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>

            <div className="min-w-0">
              <h3 className="text-[15px] font-extrabold text-slate-800">
                Agregado a tu caja
              </h3>
              <p className="text-[12px] text-slate-500 line-clamp-2">
                {product.title}
              </p>
            </div>
          </div>

          <button onClick={onClose}>
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* BLOQUE INFO */}
        <div
          className={[
            "mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 transition-all duration-200",
            pulse ? "scale-[1.02]" : "",
          ].join(" ")}
        >
          <div className="flex items-center gap-3">
            <img
              src={product.img || "/placeholder.svg"}
              alt={product.title}
              className="w-14 h-14 rounded-lg object-cover"
            />

            <div>
              <p className="text-[12px] text-slate-500">
                Ya tienes {currentQty} unidad{currentQty !== 1 ? "es" : ""} de este producto
              </p>

              {nextTier ? (
                <p className="text-[13px] text-slate-700 mt-1">
                  Si completas{" "}
                  <span className="font-extrabold text-primary">
                    {nextTier.targetQty} unidades
                  </span>
                  , pagas{" "}
                  <span className="font-extrabold text-primary">
                    S/{nextTier.unitPrice.toFixed(1)}
                  </span>{" "}
                  por unidad.
                </p>
              ) : (
                <p className="text-[13px] text-slate-700 mt-1">
                  Ya tienes el mejor precio para este producto.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* BLOQUE MENSAJE (TU COPY, SOLO MEJOR PALABRA) */}
        {hasUpsell && (
          <div className="mt-3 rounded-xl bg-primary/10 border border-primary/15 p-3">
            <p className="text-[12px] font-bold text-slate-800">
              Agrega {missingQty} más y mejora tu precio
            </p>
          </div>
        )}

        {/* BOTONES */}
        <div className="mt-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {hasUpsell ? (
              <button
                onClick={() => onAddExtra(missingQty)}
                className="w-full rounded-xl bg-primary text-white py-2.5 text-[13px] font-bold active:scale-[0.97]"
              >
                Aumenta +{missingQty}
              </button>
            ) : (
              <button
                disabled
                className="w-full rounded-xl bg-green-100 text-green-700 py-2.5 text-[13px] font-bold"
              >
                ✓ Agregado
              </button>
            )}

            <button
            onClick={onClose}
            className="w-full rounded-xl bg-secondary/10 text-secondary py-2.5 px-3 text-[13px] font-semibold hover:bg-secondary/20 active:scale-[0.97] transition-all duration-200"
            >
            Seguir comprando
            </button>
          </div>

          <button
            onClick={onOpenCart}
            className="w-full rounded-xl bg-slate-800 text-white py-2.5 text-[13px] font-bold"
          >
            Ver mi caja
          </button>
        </div>
      </div>
    </div>
  );
}