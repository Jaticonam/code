import type { Product } from "@/types/product";
import { SHEETS_CONFIG, type SheetSource } from "./sheetsConfig";
import { normalizeProduct } from "./normalizeProduct";
import { validateProducts } from "./validateProducts";

type CsvRow = Record<string, string>;

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

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

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

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

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
    (required) => !normalizedHeaders.includes(required.toLowerCase())
  );

  if (missing.length > 0) {
    throw new Error(
      `La hoja category="${source.category}" docId="${source.docId}" gid="${source.gid}" no cumple el schema. Faltan columnas: ${missing.join(", ")}`
    );
  }
}

async function loadCategoryProducts(source: SheetSource) {
  const url = `https://docs.google.com/spreadsheets/d/${source.docId}/export?format=csv&gid=${source.gid}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(
      `Error cargando category="${source.category}" docId="${source.docId}" gid="${source.gid}": HTTP ${res.status}`
    );
  }

  const csvText = await res.text();
  const { headers, rows } = parseCSV(csvText);

  validateHeaders(headers, source);

  const normalized = rows.map((row) =>
    normalizeProduct(row, source.category)
  );

  return validateProducts(normalized);
}

export async function loadAllProducts(): Promise<Product[]> {
  const results = await Promise.all(
    SHEETS_CONFIG.map((source) =>
      loadCategoryProducts(source).catch((error) => {
        console.error(`Error en fuente "${source.category}":`, error);
        return [];
      })
    )
  );

  return results
    .flat()
    .sort((a, b) => b.priority - a.priority)
    .map(({ badge, priority, status, updated_at, ...product }) => product);
}