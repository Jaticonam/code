import type { Product } from "@/shared/types/product";

import type { CatalogCategoryId } from "@/modules/catalog/providers/CatalogProvider";
import { catalogProvider } from "@/modules/catalog/providers/DefaultCatalogProvider";

import { getCampaignNameToIdMap } from "./campaignService";

/* =========================================================
   TIPOS INTERNOS
   ========================================================= */

type CategoryCacheEntry = {
  savedAt: number;
  items: Product[];
};

export type CatalogCategory = CatalogCategoryId | "todas";

/* =========================================================
   CONFIGURACIÓN
   ========================================================= */

const CACHE_TTL = 1000 * 60 * 5;

/* =========================================================
   CACHE EN MEMORIA
   ========================================================= */

const memoryCache = new Map<CatalogCategoryId, CategoryCacheEntry>();

const pendingRequests = new Map<CatalogCategoryId, Promise<Product[]>>();

/* =========================================================
   HELPERS
   ========================================================= */

const productKey = (category: string) => `jung_catalog_v3_${category}`;

const now = () => Date.now();

const isFresh = (savedAt: number) => now() - savedAt <= CACHE_TTL;

export const getCatalogCategories = (): CatalogCategoryId[] => [
  ...catalogProvider.getCategories(),
];

const sortProducts = (items: Product[]) =>
  [...items].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

const flattenByCategory = (
  byCategory: Partial<Record<CatalogCategoryId, Product[]>>,
) => sortProducts(Object.values(byCategory).flatMap((items) => items ?? []));

/* =========================================================
   CACHE LOCAL DE PRODUCTOS
   ========================================================= */

function readStorageCache(category: CatalogCategoryId): Product[] | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(productKey(category));

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as CategoryCacheEntry;

    if (!parsed?.savedAt || !isFresh(parsed.savedAt)) {
      return null;
    }

    if (!Array.isArray(parsed.items)) {
      return null;
    }

    memoryCache.set(category, {
      savedAt: parsed.savedAt,
      items: parsed.items,
    });

    return parsed.items;
  } catch {
    return null;
  }
}

export function readCachedCategoryProducts(
  category: CatalogCategoryId,
): Product[] | null {
  const memoryEntry = memoryCache.get(category);

  if (memoryEntry && isFresh(memoryEntry.savedAt)) {
    return sortProducts(memoryEntry.items);
  }

  if (memoryEntry && !isFresh(memoryEntry.savedAt)) {
    memoryCache.delete(category);
  }

  const storageItems = readStorageCache(category);

  return storageItems ? sortProducts(storageItems) : null;
}

function writeCache(category: CatalogCategoryId, items: Product[]): void {
  const entry: CategoryCacheEntry = {
    savedAt: now(),
    items,
  };

  memoryCache.set(category, entry);

  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(productKey(category), JSON.stringify(entry));
  } catch {
    // Si localStorage falla, se conserva el cache en memoria.
  }
}

/* =========================================================
   SNAPSHOT DEL CATÁLOGO
   ========================================================= */

export function getCachedCatalogSnapshot() {
  const categories = getCatalogCategories();

  const byCategory: Partial<Record<CatalogCategoryId, Product[]>> = {};

  categories.forEach((category) => {
    const cached = readCachedCategoryProducts(category);

    if (cached) {
      byCategory[category] = cached;
    }
  });

  const loadedCategories = categories.filter(
    (category) => byCategory[category],
  );

  const isFullCatalogLoaded = loadedCategories.length === categories.length;

  return {
    byCategory,
    products: flattenByCategory(byCategory),
    loadedCategories,
    isFullCatalogLoaded,
  };
}

/* =========================================================
   CARGA DESDE EL PROVIDER
   ========================================================= */

async function fetchCategoryProducts(
  category: CatalogCategoryId,
): Promise<Product[]> {
  const campaignNameToIdMap = await getCampaignNameToIdMap();

  const products = await catalogProvider.loadCategoryProducts(
    category,
    campaignNameToIdMap,
  );

  const sortedProducts = sortProducts(products);

  writeCache(category, sortedProducts);

  return sortedProducts;
}
/* =========================================================
   API DE CARGA POR CATEGORÍA
   ========================================================= */

export async function loadCategoryProducts(
  category: CatalogCategoryId,
  options: { forceRefresh?: boolean } = {},
): Promise<Product[]> {
  if (!options.forceRefresh) {
    const cached = readCachedCategoryProducts(category);

    if (cached) {
      return cached;
    }
  }

  const pendingRequest = pendingRequests.get(category);

  if (pendingRequest) {
    return pendingRequest;
  }

  const request = fetchCategoryProducts(category).finally(() => {
    pendingRequests.delete(category);
  });

  pendingRequests.set(category, request);

  return request;
}

export async function loadAllProducts(): Promise<Product[]> {
  const categories = getCatalogCategories();

  const results = await Promise.all(
    categories.map((category) =>
      loadCategoryProducts(category).catch((error: unknown) => {
        console.error(`Error en categoría "${category}":`, error);

        return [];
      }),
    ),
  );

  return sortProducts(results.flat());
}

/* =========================================================
   CARGA PROGRESIVA
   ========================================================= */

export async function loadCatalogProgressive(
  activeCategory: CatalogCategory,
  onUpdate: (products: Product[], isFullCatalogLoaded: boolean) => void,
): Promise<void> {
  const categories = getCatalogCategories();

  const preferredCategory = activeCategory !== "todas" ? activeCategory : null;

  const categoryOrder = preferredCategory
    ? [
        preferredCategory,
        ...categories.filter((category) => category !== preferredCategory),
      ]
    : categories;

  const byCategory = getCachedCatalogSnapshot().byCategory;

  onUpdate(
    flattenByCategory(byCategory),
    Object.keys(byCategory).length === categories.length,
  );

  for (const category of categoryOrder) {
    if (byCategory[category]) {
      continue;
    }

    try {
      byCategory[category] = await loadCategoryProducts(category);
    } catch (error: unknown) {
      console.error(`Error cargando "${category}":`, error);

      byCategory[category] = [];
    }

    onUpdate(
      flattenByCategory(byCategory),
      Object.keys(byCategory).length === categories.length,
    );
  }
}
