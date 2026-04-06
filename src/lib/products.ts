import { Product } from "@/types/product";

// Google Sheets ID y nombre de la hoja — actualiza estos valores con tu hoja real
const SHEET_ID = "";
const SHEET_NAME = "productos";

const CACHE_KEY = "wooly_products_cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

interface CacheEntry {
  data: Product[];
  timestamp: number;
}

function parseNumber(val: string | number | null | undefined): number | null {
  if (val === null || val === undefined || val === "") return null;
  const n = Number(val);
  return isNaN(n) ? null : n;
}

function mapSheetRow(row: Record<string, string>): Product {
  return {
    id: row.id || "",
    title: row.nombre || row.title || "",
    description: row.descripcion || row.description || "",
    category: (row.categoria || row.category || "").toLowerCase(),
    price_1: parseNumber(row.price_1 || row.precio) || 0,
    price_3: parseNumber(row.price_3),
    price_12: parseNumber(row.price_12),
    price_50: parseNumber(row.price_50),
    price_100: parseNumber(row.price_100),
    stock: parseNumber(row.stock),
    img: row.imagen || row.img || "",
  };
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
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
    return entry.data;
  } catch {
    return null;
  }
}

function setCache(data: Product[]) {
  try {
    const entry: CacheEntry = { data, timestamp: Date.now() };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // Storage full — ignore
  }
}

export async function fetchProducts(): Promise<Product[]> {
  // Intentar caché primero
  const cached = getCached();
  if (cached) return shuffleArray(cached);

  // Si no hay SHEET_ID configurado, usar datos locales de respaldo
  if (!SHEET_ID) {
    const { FALLBACK_PRODUCTS } = await import("@/data/fallback-products");
    setCache(FALLBACK_PRODUCTS);
    return shuffleArray(FALLBACK_PRODUCTS);
  }

  try {
    const url = `https://opensheet.elk.sh/${SHEET_ID}/${encodeURIComponent(SHEET_NAME)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows: Record<string, string>[] = await res.json();
    const products = rows.map(mapSheetRow).filter((p) => p.id && p.title);
    setCache(products);
    return shuffleArray(products);
  } catch (err) {
    console.error("Error fetching from Google Sheets:", err);
    // Fallback a datos locales
    const { FALLBACK_PRODUCTS } = await import("@/data/fallback-products");
    return shuffleArray(FALLBACK_PRODUCTS);
  }
}

export function getEffectivePrice(item: { price_1: number; price_3: number | null; price_12: number | null; price_50: number | null; price_100: number | null; qty: number }): number {
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
