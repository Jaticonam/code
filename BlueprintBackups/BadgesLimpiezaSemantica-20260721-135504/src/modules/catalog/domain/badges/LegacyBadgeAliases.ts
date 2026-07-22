import type {
  CatalogBadgeKind,
  ProductSeasonality,
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
      type: "seasonality";
      seasonality: ProductSeasonality;
    }
  | {
      type: "campaign";
      campaign: {
        code: string;
        label: string;
        normalizedName: string;
        themeToken: string;
        priority: number;
      };
    };

export function normalizeLegacyBadgeValue(value: string): string {
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

const EVERGREEN_ALIASES = new Set([
  "todo el ano",
  "evergreen",
]);

const BRIDE_DAY_ALIASES = new Set([
  "dia de la novia",
]);

export function resolveLegacyBadgeValue(
  value: string,
): LegacyBadgeResolution | null {
  const normalizedValue = normalizeLegacyBadgeValue(value);

  if (!normalizedValue) {
    return null;
  }

  if (BEST_SELLER_ALIASES.has(normalizedValue)) {
    return {
      type: "badge",
      badge: {
        code: "merchandising.bestSeller",
        label: "Más vendido",
        icon: null,
        kind: "merchandising",
        themeToken: "merchandising.bestSeller",
        priority: 80,
      },
    };
  }

  if (EVERGREEN_ALIASES.has(normalizedValue)) {
    return {
      type: "seasonality",
      seasonality: "evergreen",
    };
  }

  if (BRIDE_DAY_ALIASES.has(normalizedValue)) {
    return {
      type: "campaign",
      campaign: {
        code: "campaign.diaNovia",
        label: "Día de la Novia",
        normalizedName: normalizedValue,
        themeToken: "campaign.rose",
        priority: 100,
      },
    };
  }

  return null;
}