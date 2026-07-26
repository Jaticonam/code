import type {
  Product,
} from "@/shared/types/product";

import {
  getAvailableVolumePrices,
} from "@/shared/domain/volumePricing/VolumePricing";
import type {
  NextVolumePrice,
} from "@/shared/domain/volumePricing/VolumePricing";

interface ProductVolumePriceProgressProps {
  product: Product;
  effectiveQty: number;
  nextVolumePrice: NextVolumePrice | null;
}

export function ProductVolumePriceProgress({
  product,
  effectiveQty,
  nextVolumePrice,
}: ProductVolumePriceProgressProps) {
  const volumePrices =
    getAvailableVolumePrices(
      product,
    );

  const bestTarget =
    volumePrices.at(-1)?.qty ??
    1;

  const availableQuantities =
    volumePrices.map(
      (volumePrice) =>
        volumePrice.qty,
    );

  const currentVolumePriceIndex =
    availableQuantities.reduce(
      (
        activeIndex,
        volumePriceQty,
        index,
      ) =>
        effectiveQty >=
        volumePriceQty
          ? index
          : activeIndex,
      0,
    );

  const nextVolumePriceIndex =
    availableQuantities.findIndex(
      (volumePriceQty) =>
        effectiveQty <
        volumePriceQty,
    );

  const nextIndex =
    nextVolumePriceIndex === -1
      ? availableQuantities.length -
        1
      : nextVolumePriceIndex;

  const previousQty =
    availableQuantities[
      currentVolumePriceIndex
    ] ?? 1;

  const nextQty =
    availableQuantities[
      nextIndex
    ] ?? previousQty;

  const segmentBase =
    availableQuantities.length > 1
      ? 100 /
        (
          availableQuantities.length -
          1
        )
      : 100;

  const segmentProgress =
    nextQty > previousQty
      ? (
          (
            effectiveQty -
            previousQty
          ) /
          (
            nextQty -
            previousQty
          )
        ) * segmentBase
      : 0;

  const rawProgress =
    Math.min(
      currentVolumePriceIndex *
        segmentBase +
        segmentProgress,
      100,
    );

  const progress =
    effectiveQty > 0
      ? Math.max(
          rawProgress,
          10,
        )
      : 0;

  const unlocked =
    effectiveQty >= bestTarget;

  const targetQty =
    nextVolumePrice?.qty ??
    bestTarget;

  const missingQty =
    Math.max(
      targetQty -
        effectiveQty,
      0,
    );

  if (
    volumePrices.length <= 1
  ) {
    return null;
  }

  return (
    <div className="mt-1">
      <div className="mb-2 flex justify-end text-[12px] font-black">
        <span
          className={
            unlocked
              ? "text-emerald-600"
              : "text-orange-500"
          }
        >
          {effectiveQty}/
          {bestTarget}
        </span>
      </div>

      <div className="h-4 overflow-hidden rounded-full bg-slate-200 shadow-inner">
        <div
          className={[
            "h-full rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(34,197,94,.25)]",
            unlocked
              ? "bg-gradient-to-r from-emerald-500 to-green-600"
              : "bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500",
          ].join(" ")}
          style={{
            width:
              `${progress}%`,
          }}
        />
      </div>

      <p className="mt-2 text-center text-[14px] font-bold leading-snug text-slate-600">
        {unlocked ? (
          <>
            🎉 Mejor precio
            desbloqueado
          </>
        ) : nextVolumePrice ? (
          <>
            🚀 Agrega{" "}
            <span className="text-[#1d8299]">
              {missingQty}
            </span>{" "}
            más y baja a{" "}
            <span className="text-[#1d8299]">
              S/
              {nextVolumePrice
                .unitPrice
                .toFixed(2)}
            </span>{" "}
            c/u
          </>
        ) : (
          <>
            ✅ Ya tienes el mejor
            precio disponible
          </>
        )}
      </p>
    </div>
  );
}
