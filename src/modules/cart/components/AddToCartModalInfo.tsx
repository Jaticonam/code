import type { Product } from "@/shared/types/product";
import { VOLUME_PRICES } from "@/shared/domain/volumePricing/VolumePricing";
import type {
  NextVolumePrice,
} from "@/shared/domain/volumePricing/VolumePricing";

interface Props {
  product: Product;
  currentQty: number;
  pulse: boolean;
  nextTier: NextVolumePrice | null;
}

export function AddToCartModalInfo({
  product,
  currentQty,
  pulse,
  nextTier,
}: Props) {
  const tiers = VOLUME_PRICES.filter((tier) => {
    const price = product[tier.key];

    return (
      typeof price === "number" &&
      Number.isFinite(price) &&
      price > 0
    );
  }).map((tier) => ({
    ...tier,
    price: Number(product[tier.key]),
  }));

  const currentTier =
    [...tiers]
      .reverse()
      .find((tier) => currentQty >= tier.qty) ?? tiers[0];

  const bestTarget = tiers.at(-1)?.qty ?? 1;

  const targetQty =
    nextTier?.qty ??
    bestTarget;

  const unitPrice =
    nextTier?.unitPrice ??
    product.price_1;

  const missingQty = Math.max(targetQty - currentQty, 0);

  const activeTiers = tiers.map((tier) => tier.qty);

  const currentTierIndex = activeTiers.reduce(
    (acc, qty, index) => (currentQty >= qty ? index : acc),
    0,
  );

  const nextTierIndex = activeTiers.findIndex(
    (qty) => currentQty < qty,
  );

  const nextIndex =
    nextTierIndex === -1
      ? activeTiers.length - 1
      : nextTierIndex;

  const prevQty = activeTiers[currentTierIndex] ?? 1;
  const nextQty = activeTiers[nextIndex] ?? prevQty;

  const segmentBase =
    activeTiers.length > 1
      ? 100 / (activeTiers.length - 1)
      : 100;

  const segmentProgress =
    nextQty > prevQty
      ? ((currentQty - prevQty) / (nextQty - prevQty)) *
        segmentBase
      : 0;

  const rawProgress = Math.min(
    currentTierIndex * segmentBase + segmentProgress,
    100,
  );

  const progress =
    currentQty > 0
      ? Math.max(rawProgress, 10)
      : 0;

  const unlocked = currentQty >= bestTarget;

  return (
    <div
      className={[
        "mt-3 rounded-2xl border border-slate-200 bg-[#f8fafc] p-2.5 transition-transform",
        pulse ? "scale-[1.02]" : "",
      ].join(" ")}
    >
      <div className="relative mb-2">
        <img
          src={product.img || "/placeholder.svg"}
          alt={product.title}
          className="h-[320px] w-full rounded-2xl border border-slate-200 bg-white object-cover md:h-[420px]"
        />

        {currentTier && (
          <div
            className={[
              "tier",
              "tier-badge",
              currentTier.className,
              "tier-active",
              "absolute bottom-3 left-1/2 grid -translate-x-1/2 place-items-center text-[13px] font-black animate-pulse",
            ].join(" ")}
          >
            +{currentQty}
          </div>
        )}
      </div>

      <div className="mt-1 flex flex-wrap items-center justify-center gap-1.5">
        <span className="rounded-full bg-slate-100 px-2 py-[3px] text-[10px] font-black uppercase text-slate-500">
          Código: {product.id}
        </span>

        <span className="rounded-full bg-[#e6f6f8] px-2 py-[3px] text-[10px] font-black capitalize text-[#1d8299]">
          {product.category}
        </span>
      </div>

      <div className="mt-3 rounded-xl bg-white p-3 shadow-sm">
        <div className="mb-2 flex items-center justify-between text-[12px] font-black md:text-[14px]">
          <span className="text-slate-600">
            Ya tienes {currentQty} productos
          </span>

          <span
            className={
              unlocked
                ? "text-emerald-600"
                : "text-orange-500"
            }
          >
            {currentQty}/{bestTarget}
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className={[
              "h-full rounded-full transition-all duration-500",
              unlocked
                ? "bg-emerald-500"
                : "bg-orange-500",
            ].join(" ")}
            style={{ width: `${progress}%` }}
          />
        </div>

        {tiers.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
            {tiers.map((tier) => {
              const active = currentQty >= tier.qty;

              return (
                <button
                  key={tier.key}
                  type="button"
                  disabled
                  className={[
                    "tier",
                    "tier-chip",
                    tier.className,
                    "w-auto px-2.5 py-1 text-[12px] md:text-[13px]",
                    active ? "tier-active" : "",
                  ].join(" ")}
                >
                  <span>{tier.qty}+</span>

                  <span>
                    S/{tier.price.toFixed(1)}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <p className="mt-2 text-center text-[13px] font-bold leading-snug text-slate-700 md:text-[16px]">
          {unlocked ? (
            <>🎉 Mejor precio desbloqueado</>
          ) : nextTier ? (
            <>
              🚀 Agrega{" "}
              <span className="text-[#1d8299]">
                {missingQty}
              </span>{" "}
              más y paga{" "}
              <span className="text-[#1d8299]">
                S/{Number(unitPrice).toFixed(1)}
              </span>{" "}
              c/u
            </>
          ) : (
            <>✅ Ya tienes el mejor precio disponible</>
          )}
        </p>
      </div>
    </div>
  );
}

