import type { Product } from "@/shared/types/product";

import {
  requestJson,
} from "@/shared/infrastructure/http";

interface CoreMediaAsset {
  readonly sku?: unknown;
  readonly url?: unknown;
  readonly position?: unknown;
  readonly isPrimary?: unknown;
}

const SOURCE =
  "JUNG CORE media assets";

const DEFAULT_CORE_URL =
  "http://localhost:3000/assets";

function cleanText(
  value: unknown,
): string {
  return String(value ?? "").trim();
}

function normalizePosition(
  value: unknown,
): number {
  const position = Number(value);

  return Number.isFinite(position)
    ? position
    : Number.MAX_SAFE_INTEGER;
}

function isAsset(
  value: unknown,
): value is CoreMediaAsset {
  return (
    typeof value === "object" &&
    value !== null
  );
}

function extractAssets(
  payload: unknown,
): CoreMediaAsset[] {
  if (Array.isArray(payload)) {
    return payload.filter(isAsset);
  }

  if (
    typeof payload === "object" &&
    payload !== null
  ) {
    const record =
      payload as Record<string, unknown>;

    for (
      const candidate
      of [
        record.assets,
        record.data,
        record.items,
      ]
    ) {
      if (Array.isArray(candidate)) {
        return candidate.filter(isAsset);
      }
    }
  }

  return [];
}

function resolveCoreUrl(): string {
  const configured =
    cleanText(
      import.meta.env
        .VITE_JUNG_CORE_ASSETS_URL,
    );

  return configured ||
    DEFAULT_CORE_URL;
}

function mediaForSku(
  assets: readonly CoreMediaAsset[],
  sku: string,
): string[] {
  const normalizedSku =
    cleanText(sku).toLowerCase();

  return assets
    .filter(
      (asset) =>
        cleanText(asset.sku)
          .toLowerCase() ===
        normalizedSku,
    )
    .filter(
      (asset) =>
        Boolean(cleanText(asset.url)),
    )
    .sort((left, right) => {
      const primaryDelta =
        Number(Boolean(right.isPrimary)) -
        Number(Boolean(left.isPrimary));

      if (primaryDelta !== 0) {
        return primaryDelta;
      }

      return (
        normalizePosition(left.position) -
        normalizePosition(right.position)
      );
    })
    .map(
      (asset) =>
        cleanText(asset.url),
    )
    .filter(
      (url, index, urls) =>
        urls.indexOf(url) === index,
    );
}

export function applyCoreMediaAssets(
  products: readonly Product[],
  payload: unknown,
): Product[] {
  const assets =
    extractAssets(payload);

  if (assets.length === 0) {
    return [...products];
  }

  return products.map((product) => {
    const media =
      mediaForSku(
        assets,
        product.id,
      );

    if (media.length === 0) {
      return product;
    }

    return {
      ...product,
      img: media[0],
      gallery:
        media.slice(1).join("|"),
    };
  });
}

export async function overrideProductsWithCoreMedia(
  products: readonly Product[],
): Promise<Product[]> {
  if (products.length === 0) {
    return [];
  }

  try {
    const result =
      await requestJson<unknown>(
        resolveCoreUrl(),
        {
          source: SOURCE,
          timeoutMs: 2_000,
        },
      );

    if (result.ok === false) {
      console.warn(
        `[JUNG CORE media] ${result.error.code}: ` +
        `${result.error.message} ` +
        "Se conserva media de Google Sheets.",
      );

      return [...products];
    }

    return applyCoreMediaAssets(
      products,
      result.data,
    );
  } catch (cause: unknown) {
    console.warn(
      "[JUNG CORE media] Error inesperado. " +
      "Se conserva media de Google Sheets.",
      cause,
    );

    return [...products];
  }
}
