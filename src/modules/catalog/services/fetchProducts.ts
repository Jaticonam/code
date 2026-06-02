import type { Product } from "@/shared/types/product";
import {
  SHEETS_CONFIG,
  type SheetSource,
  type SheetCategory,
} from "./productsConfig";
import { normalizeProduct } from "./normalizeProduct";
import { validateProducts } from "./validateProducts";

type CsvRow = Record<string, string>;
export type CatalogCategory = SheetCategory | "todas";
const CACHE_TTL = 1000 * 60 * 15;
const REQUIRED_HEADERS = [
  "id",
  "title",
  "description",
  "category",
  "price_1",
  "price_3",
  "price_12",
  "price_50",
  "price_100",
  "stock",
  "img",
  "badge",
  "priority",
  "status",
  "updated_at",
] as const;

const key = (category: string) => `jung_catalog_${category}`;
const now = () => Date.now();
const sortProducts = (items: Product[]) =>
  items.sort((a, b) => b.priority - a.priority);

function readCache(category: SheetCategory): Product[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key(category));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.savedAt || now() - parsed.savedAt > CACHE_TTL) return null;
    return parsed.items || null;
  } catch {
    return null;
  }
}

function writeCache(category: SheetCategory, items: Product[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      key(category),
      JSON.stringify({ savedAt: now(), items }),
    );
  } catch {}
}

function parseCSVLine(line: string) {
  const result: string[] = [];
  let current = "",
    insideQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i],
      nextChar = line[i + 1];
    if (char === '"' && insideQuotes && nextChar === '"') {
      current += '"';
      i++;
      continue;
    }
    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }
    if (char === "," && !insideQuotes) {
      result.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  result.push(current);
  return result;
}

function parseCSV(text: string): { headers: string[]; rows: CsvRow[] } {
  const lines = text
    .replace(/\r/g, "")
    .split("\n")
    .filter((line) => line.trim() !== "");
  if (!lines.length) return { headers: [], rows: [] };
  const headers = parseCSVLine(lines[0]).map((h) => h.trim());
  const rows = lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const row: CsvRow = {};
    headers.forEach((header, index) => {
      row[header] = (values[index] ?? "").trim();
    });
    return row;
  });
  return { headers, rows };
}

function validateHeaders(headers: string[], source: SheetSource) {
  const normalizedHeaders = headers.map((h) => h.trim().toLowerCase());
  const missing = REQUIRED_HEADERS.filter(
    (required) => !normalizedHeaders.includes(required.toLowerCase()),
  );
  if (missing.length)
    throw new Error(
      `La hoja category="${source.category}" docId="${source.docId}" gid="${source.gid}" no cumple el schema. Faltan columnas: ${missing.join(", ")}`,
    );
}

function getSource(category: SheetCategory) {
  return SHEETS_CONFIG.find((s) => s.category === category);
}

export async function loadCategoryProducts(
  category: SheetCategory,
): Promise<Product[]> {
  const source = getSource(category);
  if (!source) return [];
  const url = `https://docs.google.com/spreadsheets/d/${source.docId}/export?format=csv&gid=${source.gid}`;
  const res = await fetch(url);
  if (!res.ok)
    throw new Error(
      `Error cargando category="${source.category}" docId="${source.docId}" gid="${source.gid}": HTTP ${res.status}`,
    );
  const csvText = await res.text();
  const { headers, rows } = parseCSV(csvText);
  validateHeaders(headers, source);
  const meaningfulRows = rows.filter((row) =>
    Object.values(row).some((value) => (value ?? "").trim() !== ""),
  );
  const normalized = meaningfulRows.map((row) =>
    normalizeProduct(row, source.category),
  );
  const products = validateProducts(normalized).map(
    ({ updated_at, ...product }) => product,
  );
  writeCache(category, products);
  return products;
}

export async function loadAllProducts(): Promise<Product[]> {
  const results = await Promise.all(
    SHEETS_CONFIG.map((source) =>
      loadCategoryProducts(source.category).catch((error) => {
        console.error(`Error en fuente "${source.category}":`, error);
        return [];
      }),
    ),
  );
  return sortProducts(results.flat());
}

export async function loadCatalogProgressive(
  activeCategory: CatalogCategory,
  onUpdate: (products: Product[], isFullCatalogLoaded: boolean) => void,
) {
  const categories = SHEETS_CONFIG.map((s) => s.category);
  const preferred = activeCategory !== "todas" ? activeCategory : null;
  const order = preferred
    ? [preferred, ...categories.filter((c) => c !== preferred)]
    : categories;
  const byCategory: Partial<Record<SheetCategory, Product[]>> = {};

  order.forEach((category) => {
    const cached = readCache(category);
    if (cached) byCategory[category] = cached;
  });

  if (preferred) {
    const preferredCache = byCategory[preferred];
    if (preferredCache?.length) onUpdate(sortProducts(preferredCache), false);
  } else if (Object.keys(byCategory).length) {
    onUpdate(sortProducts(Object.values(byCategory).flat()), false);
  }

  for (const category of order) {
    try {
      byCategory[category] = await loadCategoryProducts(category);
    } catch (error) {
      console.error(`Error cargando "${category}":`, error);
    }
    onUpdate(sortProducts(Object.values(byCategory).flat()), false);
  }

  onUpdate(sortProducts(Object.values(byCategory).flat()), true);
}
