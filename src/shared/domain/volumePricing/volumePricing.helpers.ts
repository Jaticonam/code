import {
  DISCOUNT_VOLUME_PRICES,
  VOLUME_PRICES,
} from "@/shared/domain/volumePricing/volumePricing.config";

import type {
  AvailableVolumePrice,
  AvailableVolumePriceOptions,
  NextVolumePrice,
  VolumePriceProduct,
} from "@/shared/domain/volumePricing/volumePricing.types";

function isValidPrice(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value > 0
  );
}

export function getBaseUnitPrice(
  product: VolumePriceProduct,
): number {
  const basePrice = isValidPrice(product.price_1)
    ? product.price_1
    : 0;

  const offerPrice = product.price_offer;

  const hasValidOffer =
    isValidPrice(offerPrice) &&
    offerPrice < basePrice;

  return hasValidOffer ? offerPrice : basePrice;
}

export function getAvailableVolumePrices(
  product: VolumePriceProduct,
  options: AvailableVolumePriceOptions = {},
): AvailableVolumePrice[] {
  const { includeBasePrice = true } = options;

  const definitions = includeBasePrice
    ? VOLUME_PRICES
    : DISCOUNT_VOLUME_PRICES;

  return definitions.flatMap((volumePrice) => {
    const rawValue =
      volumePrice.key === "price_1"
        ? getBaseUnitPrice(product)
        : product[volumePrice.key];

    if (!isValidPrice(rawValue)) {
      return [];
    }

    return [
      {
        ...volumePrice,
        unitPrice: rawValue,
      },
    ];
  });
}

export function getVolumeUnitPrice(
  product: VolumePriceProduct,
  qty: number,
): number {
  const safeQty = Math.max(1, qty);

  const applicableVolumePrice =
    [...DISCOUNT_VOLUME_PRICES]
      .reverse()
      .find((volumePrice) => {
        const unitPrice = product[volumePrice.key];

        return (
          safeQty >= volumePrice.qty &&
          isValidPrice(unitPrice)
        );
      });

  if (applicableVolumePrice) {
    return Number(product[applicableVolumePrice.key]);
  }

  return getBaseUnitPrice(product);
}

export function getNextVolumePrice(
  product: VolumePriceProduct,
  qty: number,
): NextVolumePrice | null {
  const safeQty = Math.max(0, qty);

  const nextVolumePrice =
    DISCOUNT_VOLUME_PRICES.find((volumePrice) => {
      const unitPrice = product[volumePrice.key];

      return (
        safeQty < volumePrice.qty &&
        isValidPrice(unitPrice)
      );
    });

  if (!nextVolumePrice) {
    return null;
  }

  return {
    qty: nextVolumePrice.qty,
    unitPrice: Number(product[nextVolumePrice.key]),
  };
}

export function getActiveVolumePriceQty(
  product: VolumePriceProduct,
  qty: number,
): number {
  const safeQty = Math.max(1, qty);

  const activeVolumePrice =
    [...VOLUME_PRICES]
      .reverse()
      .find((volumePrice) => {
        const unitPrice =
          volumePrice.key === "price_1"
            ? getBaseUnitPrice(product)
            : product[volumePrice.key];

        return (
          safeQty >= volumePrice.qty &&
          isValidPrice(unitPrice)
        );
      });

  return activeVolumePrice?.qty ?? 1;
}

export function getBestVolumePrice(
  product: VolumePriceProduct,
): AvailableVolumePrice | null {
  const volumePrices =
    getAvailableVolumePrices(product);

  if (!volumePrices.length) {
    return null;
  }

  return [...volumePrices].sort(
    (a, b) =>
      a.unitPrice - b.unitPrice ||
      a.qty - b.qty,
  )[0];
}
