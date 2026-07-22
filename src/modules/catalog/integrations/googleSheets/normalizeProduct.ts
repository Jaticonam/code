import type { Product } from "@/shared/types/product";

import {
  normalizeCampaignLookupKey,
  type CampaignNameToIdMap,
} from "@/modules/catalog/domain/CampaignRules";

import type {
  CatalogCategoryId,
} from "./sheetsConfig";

import type {
  CsvRow,
} from "./fetchSheets";

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

function parseNumber(
  value: unknown,
): number | null {
  let cleaned = cleanText(value)
    .replace(/S\/\.?/gi, "")
    .replace(/\s/g, "");

  if (!cleaned) {
    return null;
  }

  if (
    cleaned.includes(",") &&
    cleaned.includes(".")
  ) {
    cleaned =
      cleaned.replace(/,/g, "");
  } else {
    cleaned =
      cleaned.replace(",", ".");
  }

  const numberValue = Number(cleaned);

  return Number.isFinite(numberValue)
    ? numberValue
    : null;
}

function parseRequiredNumber(
  value: unknown,
): number {
  return parseNumber(value) ?? 0;
}

function parsePipeArray(
  value: unknown,
): string[] {
  return cleanText(value)
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseCampaigns(
  value: unknown,
  campaignNameToIdMap:
    CampaignNameToIdMap,
): string[] {
  return parsePipeArray(value)
    .map((campaignValue) => {
      const directMatch =
        campaignNameToIdMap[
          campaignValue
        ];

      if (directMatch) {
        return directMatch;
      }

      const normalizedValue =
        normalizeCampaignLookupKey(
          campaignValue,
        );

      return campaignNameToIdMap[
        normalizedValue
      ];
    })
    .filter(
      (
        campaignId,
      ): campaignId is string =>
        Boolean(campaignId),
    )
    .filter(
      (
        campaignId,
        index,
        campaignIds,
      ) =>
        campaignIds.indexOf(
          campaignId,
        ) === index,
    );
}

export function normalizeProduct(
  row: CsvRow,
  categoryFromConfig:
    CatalogCategoryId,
  campaignNameToIdMap:
    CampaignNameToIdMap = {},
): SheetProduct {
  return {
    id: cleanText(row.id),
    title: cleanText(row.title),
    description:
      cleanText(row.description),

    category: categoryFromConfig,

    price_1:
      parseRequiredNumber(row.price_1),

    price_3:
      parseNumber(row.price_3),

    price_12:
      parseNumber(row.price_12),

    price_50:
      parseNumber(row.price_50),

    price_100:
      parseNumber(row.price_100),

    price_offer:
      parseNumber(row.price_offer),

    stock:
      parseNumber(row.stock),

    img:
      cleanText(
        row.cover ||
        row.img,
      ),

    gallery:
      cleanText(
        row.gallery ||
        row.images,
      ),

    badges:
      parsePipeArray(row.badge),

    campaigns:
      parseCampaigns(
        row.campaigns,
        campaignNameToIdMap,
      ),

    priority:
      parseRequiredNumber(
        row.priority,
      ),

    status:
      cleanText(row.status),

    updated_at:
      cleanText(row.updated_at),
  };
}
