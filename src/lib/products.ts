import type { Product } from "@/types/product";

const CACHE_KEY = "wooly_products_cache";
const CACHE_DURATION = 10 * 1000; // 10 segundos
interface CacheEntry {
  data: Product[];
  timestamp: number;
  source: "sheets" | "fallback";
}

function getCached(): Product[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const entry: CacheEntry = JSON.parse(raw);

    if (Date.now() - entry.timestamp > CACHE_DURATION) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }

    console.log(`Productos cargados desde caché (${entry.source})`);
    return entry.data;
  } catch {
    return null;
  }
}

function setCache(data: Product[], source: CacheEntry["source"]) {
  try {
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      source,
    };

    sessionStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // Ignore storage errors
  }
}

export async function fetchProducts(): Promise<Product[]> {
  const cached = getCached();
  if (cached) return cached;

  try {
    const { loadAllProducts } = await import("@/lib/sheets/fetchSheets");
    const products = await loadAllProducts();

    if (!products || products.length === 0) {
      console.warn("Sheets vacío o sin productos publicados. Usando fallback local.");
      const { FALLBACK_PRODUCTS } = await import("@/data/fallback-products");
      setCache(FALLBACK_PRODUCTS, "fallback");
      return FALLBACK_PRODUCTS;
    }

    console.log(`Catálogo cargado desde Sheets: ${products.length} productos`);
    setCache(products, "sheets");
    return products;
  } catch (error) {
    console.error("Error cargando catálogo desde Sheets:", error);
    const { FALLBACK_PRODUCTS } = await import("@/data/fallback-products");
    setCache(FALLBACK_PRODUCTS, "fallback");
    return FALLBACK_PRODUCTS;
  }
}

export function clearProductsCache() {
  try {
    sessionStorage.removeItem(CACHE_KEY);
  } catch {
    // Ignore storage errors
  }
}

export function getEffectivePrice(item: {
  price_1: number;
  price_3: number | null;
  price_12: number | null;
  price_50: number | null;
  price_100: number | null;
  qty: number;
}): number {
  if (item.price_100 && item.qty >= 100) return item.price_100;
  if (item.price_50 && item.qty >= 50) return item.price_50;
  if (item.price_12 && item.qty >= 12) return item.price_12;
  if (item.price_3 && item.qty >= 3) return item.price_3;
  return item.price_1;
}

export function getMinPrice(p: Product): number {
  return p.price_100 || p.price_50 || p.price_12 || p.price_3 || p.price_1 || 0;
}

export function isProductAvailable(p: Product): boolean {
  if (!p.price_1 || p.price_1 <= 0) return false;
  if (p.stock === 0) return false;
  if (p.stock === null || p.stock === undefined) return false;
  return true;
}