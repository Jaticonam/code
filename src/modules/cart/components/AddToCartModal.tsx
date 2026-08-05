import {
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
  Package,
} from "lucide-react";

import type {
  Product,
} from "@/shared/types/product";

import {
  getVolumeUnitPrice,
} from "@/shared/domain/volumePricing/VolumePricing";

import {
  AddToCartModalHeader,
} from "@/modules/cart/components/AddToCartModalHeader";

import {
  AddToCartModalInfo,
} from "@/modules/cart/components/AddToCartModalInfo";

const QUICK_ADD_MIN = 1;
const QUICK_ADD_MAX = 12;

interface AddToCartModalProps {
  open: boolean;
  product: Product | null;
  currentQty: number;
  onClose: () => void;
  onConfirmQuantity: (qty: number) => void;
  onOpenCart: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export function AddToCartModal({
  open,
  product,
  currentQty,
  onClose,
  onConfirmQuantity,
  onOpenCart,
  secondaryActionLabel,
  onSecondaryAction,
}: AddToCartModalProps) {
  const [
    selectedQty,
    setSelectedQty,
  ] = useState(
    QUICK_ADD_MIN,
  );

  const [
    confirmedTotalQty,
    setConfirmedTotalQty,
  ] = useState<
    number |
    null
  >(null);

  useEffect(
    () => {
      if (!open) {
        return;
      }

      setSelectedQty(
        QUICK_ADD_MIN,
      );

      setConfirmedTotalQty(
        null,
      );
    },
    [
      open,
      product?.id,
    ],
  );

  if (
    !open ||
    !product
  ) {
    return null;
  }

  const projectedQty =
    currentQty +
    selectedQty;

  const projectedUnitPrice =
    getVolumeUnitPrice(
      product,
      projectedQty,
    );

  const handleDecrease =
    () => {
      setSelectedQty(
        (current) =>
          Math.max(
            QUICK_ADD_MIN,
            current - 1,
          ),
      );
    };

  const handleIncrease =
    () => {
      setSelectedQty(
        (current) =>
          Math.min(
            QUICK_ADD_MAX,
            current + 1,
          ),
      );
    };

  const handleSelectQuantity =
    (
      quantity:
        number,
    ) => {
      setSelectedQty(
        Math.min(
          QUICK_ADD_MAX,
          Math.max(
            QUICK_ADD_MIN,
            quantity,
          ),
        ),
      );
    };
  const handleConfirm =
    () => {
      onConfirmQuantity(
        selectedQty,
      );

      setConfirmedTotalQty(
        projectedQty,
      );
    };

  const handleSecondaryAction =
    onSecondaryAction ??
    onClose;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/45 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-[390px] animate-in rounded-2xl border border-[#dbe5ee] bg-white p-4 shadow-2xl fade-in zoom-in-95 duration-200 md:max-w-[520px] md:p-6">
        <AddToCartModalHeader
          product={product}
          onClose={onClose}
        />

        {confirmedTotalQty ===
        null ? (
          <>
            <AddToCartModalInfo
              product={product}
              currentQty={
                currentQty
              }
              selectedQty={
                selectedQty
              }
              minimumQty={
                QUICK_ADD_MIN
              }
              maximumQty={
                QUICK_ADD_MAX
              }
              onDecrease={
                handleDecrease
              }
              onIncrease={
                handleIncrease
              }
              onSelectQuantity={
                handleSelectQuantity
              }
            />

            <button
              type="button"
              onClick={
                handleConfirm
              }
              className="mt-4 w-full rounded-xl bg-[#1d8299] px-4 py-3.5 text-[14px] font-extrabold text-white transition-all hover:bg-[#16697a] active:scale-[.98]"
            >
              Agregar{" "}
              {selectedQty}{" "}
              {selectedQty === 1
                ? "unidad"
                : "unidades"}{" "}
              a mi caja
            </button>
          </>
        ) : (
          <div className="mt-4">
            <div
              role="status"
              className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-5 text-center"
            >
              <CheckCircle2 className="mx-auto h-9 w-9 text-emerald-600" />

              <p className="mt-2 text-[15px] font-black text-emerald-700">
                Producto agregado
              </p>

              <p className="mt-1 text-[13px] font-semibold text-emerald-700/80">
                Ahora tienes{" "}
                <strong>
                  {
                    confirmedTotalQty
                  }
                </strong>{" "}
                {confirmedTotalQty ===
                1
                  ? "unidad"
                  : "unidades"}{" "}
                de este
                producto en tu
                caja.
              </p>

              <p className="mt-2 text-[12px] font-bold text-slate-600">
                Precio unitario
                aplicado: S/{" "}
                {projectedUnitPrice.toFixed(
                  2,
                )}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={
                  onOpenCart
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1d8299] px-3 py-3 text-[13px] font-extrabold text-white transition-all hover:bg-[#16697a] active:scale-[.98]"
              >
                <Package className="h-4 w-4" />
                Ver mi caja
              </button>

              <button
                type="button"
                onClick={
                  handleSecondaryAction
                }
                className="w-full rounded-xl border-2 border-[#f6bfdc] bg-white px-3 py-3 text-[13px] font-extrabold text-[#f286be] transition-all hover:bg-[#fff0f7] active:scale-[.98]"
              >
                {secondaryActionLabel ??
                  "Agregar otro producto"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
