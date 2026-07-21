import type { Product } from "@/shared/types/product";

import type {
  CatalogBadge,
  LegacyCampaignReference,
  ProductCompatibilityProfile,
} from "./BadgeTypes";

import {
  normalizeLegacyBadgeValue,
  resolveLegacyBadgeValue,
} from "./LegacyBadgeAliases";

export interface ResolveProductCompatibilityOptions {
  includePricingBadges?: boolean;
}

const hasValidOffer = (product: Product): boolean =>
  typeof product.price_offer === "number" &&
  Number.isFinite(product.price_offer) &&
  product.price_offer > 0 &&
  product.price_offer < product.price_1;

const toCodeSegment = (value: string): string =>
  normalizeLegacyBadgeValue(value)
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "") || "unknown";

const deduplicateBadges = (
  badges: CatalogBadge[],
): CatalogBadge[] => {
  const byCode = new Map<string, CatalogBadge>();

  badges.forEach((badge) => {
    const existing = byCode.get(badge.code);

    if (!existing || badge.priority > existing.priority) {
      byCode.set(badge.code, badge);
    }
  });

  return [...byCode.values()];
};

const deduplicateCampaigns = (
  campaigns: LegacyCampaignReference[],
): LegacyCampaignReference[] => {
  const byCode = new Map<string, LegacyCampaignReference>();

  campaigns.forEach((campaign) => {
    const existing = byCode.get(campaign.code);

    if (!existing || campaign.priority > existing.priority) {
      byCode.set(campaign.code, campaign);
    }
  });

  return [...byCode.values()];
};

export function resolveProductCompatibility(
  product: Product,
  options: ResolveProductCompatibilityOptions = {},
): ProductCompatibilityProfile {
  const {
    includePricingBadges = true,
  } = options;

  const badges: CatalogBadge[] = [];
  const campaignReferences: LegacyCampaignReference[] = [];
  const unknownLegacyValues: string[] = [];

  let seasonality: ProductCompatibilityProfile["seasonality"] =
    "unspecified";

  let seasonalitySourceValue: string | null = null;

  if (includePricingBadges && hasValidOffer(product)) {
    badges.push({
      id: "badge:promotion.flash",
      code: "promotion.flash",
      label: "Promo Flash",
      icon: "⚡",
      kind: "promotion",
      themeToken: "promotion.flash",
      priority: 120,
      source: "pricingRule",
      sourceReferenceId: null,
    });
  }

  (product.badges ?? []).forEach((rawValue) => {
    const cleanValue = String(rawValue || "").trim();

    if (!cleanValue) {
      return;
    }

    const resolution = resolveLegacyBadgeValue(cleanValue);

    if (!resolution) {
      const codeSegment = toCodeSegment(cleanValue);

      unknownLegacyValues.push(cleanValue);

      badges.push({
        id: `badge:legacy.${codeSegment}`,
        code: `legacy.${codeSegment}`,
        label: cleanValue,
        icon: null,
        kind: "merchandising",
        themeToken: "legacy.default",
        priority: 10,
        source: "legacyManual",
        sourceReferenceId: `legacy-badge:${codeSegment}`,
      });

      return;
    }

    if (resolution.type === "badge") {
      badges.push({
        id: `badge:${resolution.badge.code}`,
        ...resolution.badge,
        source: "legacyManual",
        sourceReferenceId: null,
      });

      return;
    }

    if (resolution.type === "seasonality") {
      seasonality = resolution.seasonality;
      seasonalitySourceValue = cleanValue;

      return;
    }

    campaignReferences.push({
      ...resolution.campaign,
      sourceReferenceId:
        `legacy-campaign:${toCodeSegment(
          resolution.campaign.normalizedName,
        )}`,
    });
  });

  return {
    badges: deduplicateBadges(badges),
    seasonality,
    seasonalitySourceValue,
    campaignReferences:
      deduplicateCampaigns(campaignReferences),
    unknownLegacyValues: [
      ...new Set(unknownLegacyValues),
    ],
  };
}