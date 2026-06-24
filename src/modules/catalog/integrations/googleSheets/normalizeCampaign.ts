import type { Campaign } from "@/shared/types/product";
import { getCampaignColorClass } from "./campaignColors";
import type { CsvRow } from "./fetchSheets";

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

function cleanText(value: unknown): string {
  return String(value ?? "").trim();
}

function parseSheetDate(value: unknown) {
  const clean = cleanText(value);

  if (!clean) return null;

  const humanDate = clean.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);

  if (humanDate) {
    const [, day, month, year] = humanDate;
    const date = new Date(Number(year), Number(month) - 1, Number(day));

    return Number.isNaN(date.getTime()) ? null : date;
  }

  const isoDate = new Date(clean);

  return Number.isNaN(isoDate.getTime()) ? null : isoDate;
}

function normalizePublicationStatus(
  value: unknown,
): Campaign["computedStatus"] {
  const status = cleanText(value).toLowerCase();

  const map: Record<string, Campaign["computedStatus"]> = {
    publicado: "activa",
    publicada: "activa",
    publicadas: "activa",
    active: "activa",
    published: "activa",

    oculto: "oculta",
    oculta: "oculta",
    hidden: "oculta",

    borrador: "borrador",
    draft: "borrador",
  };

  return map[status] ?? "borrador";
}

function parsePriority(value: unknown): number {
  const priority = Number(cleanText(value));

  return Number.isFinite(priority) ? priority : 0;
}

export function getCampaignComputedStatus(
  campaign: Pick<Campaign, "startDate" | "endDate" | "publicationStatus">,
): Campaign["computedStatus"] {
  const publicationStatus = normalizePublicationStatus(
    campaign.publicationStatus,
  );

  if (publicationStatus === "oculta") return "oculta";
  if (publicationStatus === "borrador") return "borrador";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = parseSheetDate(campaign.startDate);
  const end = parseSheetDate(campaign.endDate);

  if (start) start.setHours(0, 0, 0, 0);
  if (end) end.setHours(23, 59, 59, 999);

  if (start && today < start) return "programada";
  if (end && today > end) return "finalizada";

  return "activa";
}

export function normalizeCampaign(row: CsvRow): Campaign {
  const campaign: Campaign = {
    id: cleanText(row.id),
    name: cleanText(row.name),
    icon: cleanText(row.icon),
    color: cleanText(row.color),
    colorClass: getCampaignColorClass(row.color),
    startDate: cleanText(row.startdate),
    endDate: cleanText(row.enddate),
    priority: parsePriority(row.priority),
    publicationStatus: cleanText(row.publicationstatus),
    computedStatus: "borrador",
  };

  return {
    ...campaign,
    computedStatus: getCampaignComputedStatus(campaign),
  };
}

export function isCampaignActive(campaign: Campaign) {
  return campaign.computedStatus === "activa";
}

export function buildCampaignNameToIdMap(campaigns: Campaign[]) {
  return campaigns.reduce<Record<string, string>>((acc, campaign) => {
    acc[campaign.name] = campaign.id;
    acc[campaign.id] = campaign.id;

    return acc;
  }, {});
}
