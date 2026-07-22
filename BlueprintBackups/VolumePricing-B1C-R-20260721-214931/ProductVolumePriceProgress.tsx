import type { Product } from "@/shared/types/product";

interface ProductVolumePriceProgressProps {
  product: Product;
  effectiveQty: number;
  nextVolumePrice: {
    qty: number;
    price: number;
  } | null;
}

export function ProductVolumePriceProgress({
  product,
  effectiveQty,
  nextVolumePrice,
}: ProductVolumePriceProgressProps) {
  const tiers = [
    { qty: 1, price: product.price_1 },
    { qty: 3, price: product.price_3 },
    { qty: 12, price: product.price_12 },
    { qty: 50, price: product.price_50 },
    { qty: 100, price: product.price_100 },
  ].filter(
    (tier): tier is { qty: number; price: number } =>
      typeof tier.price === "number" &&
      Number.isFinite(tier.price) &&
      tier.price > 0,
  );

  const bestTarget = tiers.at(-1)?.qty ?? 1;
  const activeTiers = tiers.map((tier) => tier.qty);

  const currentTierIndex = activeTiers.reduce(
    (activeIndex, tierQty, index) =>
      effectiveQty >= tierQty ? index : activeIndex,
    0,
  );

  const nextVolumePriceIndex = activeTiers.findIndex(
    (tierQty) => effectiveQty < tierQty,
  );

  const nextIndex =
    nextVolumePriceIndex === -1
      ? activeTiers.length - 1
      : nextVolumePriceIndex;

  const previousQty = activeTiers[currentTierIndex] ?? 1;
  const nextQty = activeTiers[nextIndex] ?? previousQty;

  const segmentBase =
    activeTiers.length > 1
      ? 100 / (activeTiers.length - 1)
      : 100;

  const segmentProgress =
    nextQty > previousQty
      ? ((effectiveQty - previousQty) /
          (nextQty - previousQty)) *
        segmentBase
      : 0;

  const rawProgress = Math.min(
    currentTierIndex * segmentBase + segmentProgress,
    100,
  );

  const progress =
    effectiveQty > 0
      ? Math.max(rawProgress, 10)
      : 0;

  const unlocked = effectiveQty >= bestTarget;
  const targetQty = nextVolumePrice?.qty ?? bestTarget;
  const missingQty = Math.max(targetQty - effectiveQty, 0);

  if (tiers.length <= 1) return null;

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
          {effectiveQty}/{bestTarget}
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
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-2 text-center text-[14px] font-bold leading-snug text-slate-600">
        {unlocked ? (
          <>🎉 Mejor precio desbloqueado</>
        ) : nextVolumePrice ? (
          <>
            🚀 Agrega{" "}
            <span className="text-[#1d8299]">
              {missingQty}
            </span>{" "}
            más y baja a{" "}
            <span className="text-[#1d8299]">
              S/{nextVolumePrice.price.toFixed(2)}
            </span>{" "}
            c/u
          </>
        ) : (
          <>✅ Ya tienes el mejor precio disponible</>
        )}
      </p>
    </div>
  );
}


