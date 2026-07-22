import type { Campaign } from "@/shared/types/product";

/* =========================================================
   TIPOS
   ========================================================= */

export type CampaignNameToIdMap =
  Record<string, string>;

/* =========================================================
   NORMALIZACIÓN
   ========================================================= */

function cleanText(value: unknown): string {
  return String(value ?? "").trim();
}

export function normalizeCampaignLookupKey(
  value: unknown,
): string {
  return cleanText(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseCampaignDate(
  value: unknown,
): Date | null {
  const clean = cleanText(value);

  if (!clean) {
    return null;
  }

  const humanDate = clean.match(
    /^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/,
  );

  if (humanDate) {
    const [, day, month, year] = humanDate;

    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
    );

    return Number.isNaN(date.getTime())
      ? null
      : date;
  }

  const isoDate = new Date(clean);

  return Number.isNaN(isoDate.getTime())
    ? null
    : isoDate;
}

function normalizePublicationStatus(
  value: unknown,
): Campaign["computedStatus"] {
  const status =
    normalizeCampaignLookupKey(value);

  const statusMap: Record<
    string,
    Campaign["computedStatus"]
  > = {
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

  return statusMap[status] ?? "borrador";
}

/* =========================================================
   ESTADO OPERATIVO
   ========================================================= */

export function getCampaignComputedStatus(
  campaign: Pick<
    Campaign,
    "startDate" | "endDate" | "publicationStatus"
  >,
): Campaign["computedStatus"] {
  const publicationStatus =
    normalizePublicationStatus(
      campaign.publicationStatus,
    );

  if (publicationStatus === "oculta") {
    return "oculta";
  }

  if (publicationStatus === "borrador") {
    return "borrador";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = parseCampaignDate(
    campaign.startDate,
  );

  const end = parseCampaignDate(
    campaign.endDate,
  );

  if (start) {
    start.setHours(0, 0, 0, 0);
  }

  if (end) {
    end.setHours(23, 59, 59, 999);
  }

  if (start && today < start) {
    return "programada";
  }

  if (end && today > end) {
    return "finalizada";
  }

  return "activa";
}

/* =========================================================
   REGLAS DE CAMPAÑA
   ========================================================= */

export function isCampaignActive(
  campaign: Campaign,
): boolean {
  /**
   * No se confía únicamente en computedStatus porque una
   * campaña almacenada en caché puede cruzar de fecha.
   */
  return getCampaignComputedStatus(
    campaign,
  ) === "activa";
}

export function buildCampaignNameToIdMap(
  campaigns: readonly Campaign[],
): CampaignNameToIdMap {
  return campaigns.reduce<CampaignNameToIdMap>(
    (map, campaign) => {
      const normalizedName =
        normalizeCampaignLookupKey(
          campaign.name,
        );

      const normalizedId =
        normalizeCampaignLookupKey(
          campaign.id,
        );

      map[campaign.name] = campaign.id;
      map[campaign.id] = campaign.id;

      if (normalizedName) {
        map[normalizedName] = campaign.id;
      }

      if (normalizedId) {
        map[normalizedId] = campaign.id;
      }

      return map;
    },
    {},
  );
}
