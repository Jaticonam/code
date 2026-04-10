import type { Product } from "@/types/product";
import type { SheetCategory } from "./sheetsConfig";

type CsvRow = Record<string, string>;

export interface SheetProduct extends Product {
  badges: string[];
  priority: number;
  status: string;
  updated_at: string;
}

function cleanText(value: unknown): string {
  return String(value ?? "").trim();
}

function parseNumber(value: unknown): number | null {
  const cleaned = cleanText(value)
    .replace(/\s/g, "")
    .replace(",", ".");

  if (!cleaned) return null;

  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
}

function parseRequiredNumber(value: unknown): number {
  return parseNumber(value) ?? 0;
}

function parseBadges(value: unknown): string[] {
  return cleanText(value)
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizeProduct(
  row: CsvRow,
  categoryFromConfig: SheetCategory
): SheetProduct {
  return {
    id: cleanText(row.id),
    title: cleanText(row.title),
    description: cleanText(row.description),
    category: categoryFromConfig,
    price_1: parseRequiredNumber(row.price_1),
    price_3: parseNumber(row.price_3),
    price_12: parseNumber(row.price_12),
    price_50: parseNumber(row.price_50),
    price_100: parseNumber(row.price_100),
    stock: parseNumber(row.stock),
    img: cleanText(row.img),
    badges: parseBadges(row.badge),
    priority: parseRequiredNumber(row.priority),
    status: cleanText(row.status),
    updated_at: cleanText(row.updated_at),
  };
}