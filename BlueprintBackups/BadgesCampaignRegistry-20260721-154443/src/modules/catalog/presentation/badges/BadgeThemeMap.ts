import type {
  ProductDisplayIndicator,
} from "@/modules/catalog/domain/badges";

export interface BadgeThemePresentation {
  className: string;
  animation: string;
}

const DEFAULT_PRESENTATION: BadgeThemePresentation = {
  className:
    "bg-gradient-to-r from-slate-900 to-slate-700 text-white shadow-[0_0_10px_rgba(15,23,42,0.22)]",
  animation: "",
};

const BADGE_THEME_MAP: Record<
  string,
  BadgeThemePresentation
> = {
  "promotion.flash": {
    className:
      "bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white shadow-[0_0_12px_rgba(37,99,235,0.28)]",
    animation: "animate-pulse",
  },

  "merchandising.bestSeller": {
    className:
      "bg-gradient-to-r from-[#f5b025] to-[#d49615] text-slate-950 shadow-[0_0_12px_rgba(245,176,37,0.30)]",
    animation: "",
  },

  "campaign.rose": {
    className:
      "bg-gradient-to-r from-rose-600 via-pink-500 to-rose-600 text-white shadow-[0_0_14px_rgba(225,29,72,0.28)]",
    animation: "",
  },

  "seasonality.evergreen": {
    className:
      "bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-[0_0_12px_rgba(5,150,105,0.24)]",
    animation: "",
  },

  "legacy.default": DEFAULT_PRESENTATION,
};

export function getBadgeThemePresentation(
  themeToken: string,
): BadgeThemePresentation {
  return (
    BADGE_THEME_MAP[themeToken] ??
    DEFAULT_PRESENTATION
  );
}

export function formatBadgeDisplayText(
  indicator: ProductDisplayIndicator,
): string {
  if (!indicator.icon) {
    return indicator.label;
  }

  if (indicator.kind === "promotion") {
    return `${indicator.label} ${indicator.icon}`;
  }

  return `${indicator.icon} ${indicator.label}`;
}