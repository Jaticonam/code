import type {
  CatalogBadgeKind,
  IgnoredLegacyBadgeReason,
} from "./BadgeTypes";

interface LegacyBadgeDescriptor {
  code: string;
  label: string;
  icon: string | null;

  kind: CatalogBadgeKind;
  themeToken: string;
  priority: number;
}

export type LegacyBadgeResolution =
  | {
      type: "badge";
      badge: LegacyBadgeDescriptor;
    }
  | {
      type: "ignored";
      reason: IgnoredLegacyBadgeReason;
    };

export function normalizeLegacyBadgeValue(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[✨⚡🔥🚀💎]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const BEST_SELLER_ALIASES = new Set([
  "mas vendido",
  "best seller",
  "bestseller",
  "favorito",
  "popular",
]);

const REDUNDANT_DEFAULT_ALIASES = new Set([
  "todo el ano",
  "evergreen",
]);

const CAMPAIGN_VALUE_ALIASES = new Set([
  "dia de la novia",
]);

export function resolveLegacyBadgeValue(
  value: string,
): LegacyBadgeResolution | null {
  const normalizedValue =
    normalizeLegacyBadgeValue(value);

  if (!normalizedValue) {
    return null;
  }

  if (
    BEST_SELLER_ALIASES.has(
      normalizedValue,
    )
  ) {
    return {
      type: "badge",

      badge: {
        code:
          "merchandising.bestSeller",

        label:
          "Más vendido",

        icon: null,

        kind:
          "merchandising",

        themeToken:
          "merchandising.bestSeller",

        priority: 80,
      },
    };
  }

  if (
    REDUNDANT_DEFAULT_ALIASES.has(
      normalizedValue,
    )
  ) {
    return {
      type: "ignored",
      reason: "redundantDefault",
    };
  }

  if (
    CAMPAIGN_VALUE_ALIASES.has(
      normalizedValue,
    )
  ) {
    return {
      type: "ignored",

      reason:
        "campaignMustComeFromSheetCampaign",
    };
  }

  return null;
}
