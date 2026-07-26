import type {
  Product,
} from "@/shared/types/product";

import {
  isProductPublicationDataValid,
} from "@/modules/catalog/domain/ProductCommercialPolicy";

import {
  loadAllProducts,
} from "@/modules/catalog/services/fetchProducts";

const CACHE_KEY =
  "wooly_products_cache";

const CACHE_DURATION =
  10 * 1000;

interface CacheEntry {
  data:
    Product[];

  timestamp:
    number;

  source:
    "sheets" |
    "fallback";
}

/* =========================================================
   SANEAMIENTO
   ========================================================= */

function sanitizePublicProducts(
  products:
    Product[],
): Product[] {
  return products.filter(
    isProductPublicationDataValid,
  );
}

/* =========================================================
   CACHE
   ========================================================= */

function setCache(
  data:
    Product[],
  source:
    CacheEntry["source"],
) {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        data:
          sanitizePublicProducts(
            data,
          ),
        timestamp:
          Date.now(),
        source,
      }),
    );
  } catch {
    // Ignorar errores de storage.
  }
}

function getCached():
  Product[] |
  null {
  try {
    const raw =
      sessionStorage.getItem(
        CACHE_KEY,
      );

    if (!raw) {
      return null;
    }

    const entry:
      CacheEntry =
        JSON.parse(raw);

    if (
      Date.now() -
        entry.timestamp >
      CACHE_DURATION
    ) {
      sessionStorage.removeItem(
        CACHE_KEY,
      );

      return null;
    }

    /*
     * Una caché creada antes de estas reglas también
     * queda saneada al momento de ser leída.
     */
    const sanitized =
      sanitizePublicProducts(
        entry.data,
      );

    if (
      sanitized.length !==
      entry.data.length
    ) {
      setCache(
        sanitized,
        entry.source,
      );
    }

    return sanitized;
  } catch {
    return null;
  }
}

/* =========================================================
   FALLBACK
   ========================================================= */

async function loadFallbackProducts():
  Promise<Product[]> {
  const {
    FALLBACK_PRODUCTS,
  } = await import(
    "@/modules/catalog/data/fallback-products"
  );

  return sanitizePublicProducts(
    FALLBACK_PRODUCTS,
  );
}

/* =========================================================
   CARGA
   ========================================================= */

export async function fetchProducts():
  Promise<Product[]> {
  const cached =
    getCached();

  if (cached !== null) {
    return cached;
  }

  try {
    const loadedProducts =
      await loadAllProducts();

    const publicProducts =
      sanitizePublicProducts(
        loadedProducts ?? [],
      );

    /*
     * Un resultado vacío de Google Sheets no es un error.
     *
     * Puede significar que todos los productos fueron
     * ocultados, están en borrador o fueron bloqueados
     * correctamente por la política.
     */
    setCache(
      publicProducts,
      "sheets",
    );

    if (
      publicProducts.length === 0
    ) {
      console.warn(
        "Google Sheets respondió correctamente, pero no existen productos aptos para publicación.",
      );
    }

    return publicProducts;
  } catch (error) {
    /*
     * El fallback se utiliza únicamente ante una falla
     * técnica real de carga.
     */
    console.error(
      "Error técnico cargando catálogo desde Sheets. Usando fallback validado:",
      error,
    );

    const fallbackProducts =
      await loadFallbackProducts();

    setCache(
      fallbackProducts,
      "fallback",
    );

    return fallbackProducts;
  }
}

export function clearProductsCache() {
  try {
    sessionStorage.removeItem(
      CACHE_KEY,
    );
  } catch {
    // Ignorar errores de storage.
  }
}

/**
 * Compatibilidad legacy.
 *
 * Desde ahora la disponibilidad comercial se resuelve
 * mediante la política central, no solamente precio y stock.
 */
export function isProductAvailable(
  product:
    Product,
): boolean {
  return isProductPurchasable(
    product,
  );
}

import {
  isProductPurchasable,
} from "@/modules/catalog/domain/ProductCommercialPolicy";
