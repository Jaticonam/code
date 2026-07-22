import { useEffect, useState } from "react";
import { Package } from "lucide-react";

import type { Product } from "@/shared/types/product";

import {
  getNextVolumePrice,
} from "@/modules/catalog/domain/volumePricing";

import { AddToCartModalHeader } from "@/modules/cart/components/AddToCartModalHeader";
import { AddToCartModalInfo } from "@/modules/cart/components/AddToCartModalInfo";

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

  const nextVolumePrice = product
    ? getNextVolumePrice(product, currentQty)
    : null;

  const missingQty = nextVolumePrice
    ? Math.max(
        nextVolumePrice.qty - currentQty,
        0,
      )
    : 0;

  const hasUpsell =
    !!nextVolumePrice &&
    missingQty > 0;

  useEffect(() => {
    if (!open || !nextVolumePrice) {
      return;
    }

    setPulse(true);

    const timer = window.setTimeout(
      () => setPulse(false),
      180,
    );

    return () => {
      window.clearTimeout(timer);
    };
  }, [currentQty, open, nextVolumePrice]);

  if (!open || !product) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/45 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-[360px] animate-in rounded-2xl border border-[#dbe5ee] bg-white p-4 shadow-2xl fade-in zoom-in-95 duration-200 md:max-w-[500px] md:p-6">
        <AddToCartModalHeader
          product={product}
          onClose={onClose}
        />

        <AddToCartModalInfo
          product={product}
          currentQty={currentQty}
          pulse={pulse}
          nextTier={
            nextVolumePrice
              ? {
                  targetQty: nextVolumePrice.qty,
                  unitPrice:
                    nextVolumePrice.unitPrice,
                }
              : null
          }
        />

        <div className="mt-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {hasUpsell ? (
              <button
                onClick={() =>
                  onAddExtra(missingQty)
                }
                className="w-full rounded-xl bg-[#1d8299] py-3 text-[13px] font-extrabold text-white transition-all hover:bg-[#16697a] active:scale-[.97]"
              >
                (+{missingQty}) Mejorar precio
              </button>
            ) : (
              <button
                disabled
                className="w-full rounded-xl bg-[#dcfce7] py-3 text-[13px] font-bold text-[#16a34a]"
              >
                ✓ Mejor precio
              </button>
            )}

            <button
              onClick={
                onSecondaryAction ?? onClose
              }
              className="w-full rounded-xl border-2 border-[#f6bfdc] bg-white px-3 py-3 text-[13px] font-extrabold text-[#f286be] transition-all hover:bg-[#fff0f7] active:scale-[.98]"
            >
              {secondaryActionLabel ??
                "Otro producto"}
            </button>
          </div>

          <button
            onClick={onOpenCart}
            className="hidden w-full items-center justify-center gap-2 rounded-xl border border-[#1d8299]/30 bg-white py-3 text-[12px] font-bold text-[#1d8299] transition-all hover:border-[#1d8299] hover:bg-[#f0fafc] active:scale-[.98] md:flex"
          >
            <Package className="h-4 w-4" />

            Ver mi caja

            <span className="rounded-full bg-[#1d8299] px-1.5 py-[2px] text-[10px] font-black text-white">
              +{currentQty}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
