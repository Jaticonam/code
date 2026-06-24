import type { Product } from "@/shared/types/product";
import type { SheetCategory } from "./sheetsConfig";
import type { CsvRow } from "./fetchSheets";

export interface SheetProduct extends Product {
  badges: string[];
  campaigns: string[];
  priority: number;
  status: string;
  updated_at: string;
}

export type CampaignNameToIdMap = Record<string, string>;

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

function parseCampaigns(
  value: unknown,
  campaignNameToIdMap: CampaignNameToIdMap,
): string[] {
  return parsePipeArray(value)
    .map((campaignName) => campaignNameToIdMap[campaignName])
    .filter(Boolean);
}

export function normalizeProduct(
  row: CsvRow,
  categoryFromConfig: SheetCategory,
  campaignNameToIdMap: CampaignNameToIdMap = {},
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

    img: cleanText(row.cover || row.img),
    gallery: cleanText(row.gallery || row.images),

    badges: parsePipeArray(row.badge),
    campaigns: parseCampaigns(row.campaigns, campaignNameToIdMap),

    priority: parseRequiredNumber(row.priority),
    status: cleanText(row.status),
    updated_at: cleanText(row.updated_at),
  };
}
