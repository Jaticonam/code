import type { Product } from "@/shared/types/product";
import type { SheetCategory } from "./productsConfig";

type CsvRow = Record<string, string>;

export interface SheetProduct extends Product {
  badges: string[];
  campaigns: string[];
  priority: number;
  status: string;
  updated_at: string;
}

function cleanText(value: unknown): string {
  return String(value ?? "").trim();
}

function parseNumber(value: unknown): number | null {
  let cleaned = cleanText(value)
    .replace(/S\/\.?/gi, "")
    .replace(/\s/g, "");

  if (!cleaned) return null;

  if (cleaned.includes(",") && cleaned.includes(".")) {
    cleaned = cleaned.replace(/,/g, "");
  } else {
    cleaned = cleaned.replace(",", ".");
  }

  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
}

function parseRequiredNumber(value: unknown): number {
  return parseNumber(value) ?? 0;
}

function parsePipeArray(value: unknown): string[] {
  return cleanText(value)
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeSlug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
}

function parseCampaigns(value: unknown): string[] {
  return parsePipeArray(value).map(normalizeSlug);
}

export function normalizeProduct(
  row: CsvRow,
  categoryFromConfig: SheetCategory,
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

    price_offer: parseNumber(row.price_offer),

    stock: parseNumber(row.stock),
    img: cleanText(row.img),

    badges: parsePipeArray(row.badge),
    campaigns: parseCampaigns(row.campaigns),

    priority: parseRequiredNumber(row.priority),
    status: cleanText(row.status),
    updated_at: cleanText(row.updated_at),
  };
}
