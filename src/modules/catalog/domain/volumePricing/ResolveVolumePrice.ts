import {
  DISCOUNT_VOLUME_PRICES,
  VOLUME_PRICES,
  isValidVolumePrice,
} from "@/modules/catalog/domain/volumePricing/VolumePriceRules";

import type {
  NextVolumePrice,
  ResolvedVolumePrice,
  ResolveVolumePriceOptions,
  VolumePriceProduct,
} from "@/modules/catalog/domain/volumePricing/VolumePrice";

export function getBaseUnitPrice(
  product: VolumePriceProduct,
): number {
  const basePrice = isValidVolumePrice(product.price_1)
    ? product.price_1
    : 0;

  const offerPrice = product.price_offer;

  const hasValidOffer =
    isValidVolumePrice(offerPrice) &&
    offerPrice < basePrice;

  return hasValidOffer ? offerPrice : basePrice;
}

export function getAvailableVolumePrices(
  product: VolumePriceProduct,
  options: ResolveVolumePriceOptions = {},
): ResolvedVolumePrice[] {
  const {
    includeBasePrice = true,
  } = options;

  const definitions = includeBasePrice
    ? VOLUME_PRICES
    : DISCOUNT_VOLUME_PRICES;

  return definitions.flatMap((volumePrice) => {
    const rawUnitPrice =
      volumePrice.key === "price_1"
        ? getBaseUnitPrice(product)
        : product[volumePrice.key];

    if (!isValidVolumePrice(rawUnitPrice)) {
      return [];
    }

    return [
      {
        ...volumePrice,
        unitPrice: rawUnitPrice,
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
          isValidVolumePrice(unitPrice)
        );
      });

  if (applicableVolumePrice) {
    return Number(
      product[applicableVolumePrice.key],
    );
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
        isValidVolumePrice(unitPrice)
      );
    });

  if (!nextVolumePrice) {
    return null;
  }

  return {
    qty: nextVolumePrice.qty,
    unitPrice: Number(
      product[nextVolumePrice.key],
    ),
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
          isValidVolumePrice(unitPrice)
        );
      });

  return activeVolumePrice?.qty ?? 1;
}

export function getBestVolumePrice(
  product: VolumePriceProduct,
): ResolvedVolumePrice | null {
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
