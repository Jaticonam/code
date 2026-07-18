import type { Campaign } from "@/shared/types/product";

import { getCampaignComputedStatus } from "@/modules/catalog/domain/CampaignRules";

import { getCampaignColorClass } from "./campaignColors";
import type { CsvRow } from "./fetchSheets";

/* =========================================================
   SCHEMA DE GOOGLE SHEETS
   ========================================================= */

export const CAMPAIGN_REQUIRED_HEADERS = [
  "id",
  "name",
  "icon",
  "color",
  "startdate",
  "enddate",
  "priority",
  "publicationstatus",
] as const;

/* =========================================================
   HELPERS DE NORMALIZACIÓN
   ========================================================= */

function cleanText(value: unknown): string {
  return String(value ?? "").trim();
}

function parsePriority(value: unknown): number {
  const priority = Number(cleanText(value));

  return Number.isFinite(priority)
    ? priority
    : 0;
}

/* =========================================================
   NORMALIZACIÓN DESDE GOOGLE SHEETS
   ========================================================= */

export function normalizeCampaign(
  row: CsvRow,
): Campaign {
  const campaign: Campaign = {
    id: cleanText(row.id),
    name: cleanText(row.name),
    icon: cleanText(row.icon),
    color: cleanText(row.color),

    colorClass: getCampaignColorClass(
      row.color,
    ),

    startDate: cleanText(row.startdate),
    endDate: cleanText(row.enddate),

    priority: parsePriority(row.priority),

    publicationStatus: cleanText(
      row.publicationstatus,
    ),

    computedStatus: "borrador",
  };

  return {
    ...campaign,

    computedStatus:
      getCampaignComputedStatus(campaign),
  };
}

/* =========================================================
   COMPATIBILIDAD TEMPORAL
   ========================================================= */

export {
  buildCampaignNameToIdMap,
  getCampaignComputedStatus,
  isCampaignActive,
} from "@/modules/catalog/domain/CampaignRules";
