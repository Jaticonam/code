import type { Product } from "@/shared/types/product";

const CACHE_KEY = "wooly_products_cache";
const CACHE_DURATION = 10 * 1000;

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
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, timestamp: Date.now(), source })
    );
  } catch {
    // Ignorar errores de storage
  }
}

export async function fetchProducts(): Promise<Product[]> {
  const cached = getCached();
  if (cached) return cached;

  try {
    const { loadAllProducts } = await import("@/modules/catalog/services/fetchProducts");
    const products = await loadAllProducts();

    if (products?.length) {
      console.log(`Catálogo cargado desde Sheets: ${products.length} productos`);
      setCache(products, "sheets");
      return products;
    }

    console.warn("Sheets vacío o sin productos publicados. Usando fallback local.");
    const { FALLBACK_PRODUCTS } = await import("@/modules/catalog/data/fallback-products");

    setCache(FALLBACK_PRODUCTS, "fallback");
    return FALLBACK_PRODUCTS;
  } catch (error) {
    console.error("Error cargando catálogo desde Sheets:", error);

    const { FALLBACK_PRODUCTS } = await import("@/modules/catalog/data/fallback-products");

    setCache(FALLBACK_PRODUCTS, "fallback");
    return FALLBACK_PRODUCTS;
  }
}

export function clearProductsCache() {
  try {
    sessionStorage.removeItem(CACHE_KEY);
  } catch {
    // Ignorar errores de storage
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

export function getMinPrice(product: Product): number {
  return (
    product.price_100 ||
    product.price_50 ||
    product.price_12 ||
    product.price_3 ||
    product.price_1 ||
    0
  );
}

export function isProductAvailable(product: Product): boolean {
  if (!product.price_1 || product.price_1 <= 0) return false;
  if (product.stock === 0) return false;
  if (product.stock === null || product.stock === undefined) return false;
  return true;
}