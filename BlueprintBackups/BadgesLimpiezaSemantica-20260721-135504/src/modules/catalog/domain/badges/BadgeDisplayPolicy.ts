import type {
  ProductCompatibilityProfile,
  ProductDisplayIndicator,
} from "./BadgeTypes";

export interface ProductBadgeDisplayPolicy {
  maxVisible?: number;
  includeSeasonality?: boolean;
}

const SEASONALITY_INDICATORS = {
  evergreen: {
    id: "seasonality:evergreen",
    code: "seasonality.evergreen",
    label: "Todo el Año",
    icon: "✨",
    kind: "seasonality" as const,
    themeToken: "seasonality.evergreen",
    priority: 40,
    source: "legacyManual" as const,
    sourceReferenceId: null,
  },
};

export function getProductDisplayIndicators(
  profile: ProductCompatibilityProfile,
  policy: ProductBadgeDisplayPolicy = {},
): ProductDisplayIndicator[] {
  const {
    maxVisible = 2,
    includeSeasonality = true,
  } = policy;

  const campaignIndicator = profile.campaignReferences
    .slice()
    .sort((a, b) => b.priority - a.priority)
    .map<ProductDisplayIndicator>((campaign) => ({
      id: `campaign:${campaign.code}`,
      code: campaign.code,
      label: campaign.label,
      icon: null,
      kind: "campaign",
      themeToken: campaign.themeToken,
      priority: campaign.priority,
      source: "campaign",
      sourceReferenceId: campaign.sourceReferenceId,
    }))[0];

  const commercialIndicators = profile.badges
    .slice()
    .sort((a, b) => b.priority - a.priority);

  const seasonalityIndicator =
    includeSeasonality &&
    profile.seasonality === "evergreen"
      ? SEASONALITY_INDICATORS.evergreen
      : null;

  const ordered = [
    campaignIndicator,
    ...commercialIndicators,
    seasonalityIndicator,
  ].filter(
    (
      indicator,
    ): indicator is ProductDisplayIndicator =>
      Boolean(indicator),
  );

  const unique = new Map<
    string,
    ProductDisplayIndicator
  >();

  ordered.forEach((indicator) => {
    if (!unique.has(indicator.id)) {
      unique.set(indicator.id, indicator);
    }
  });

  return [...unique.values()].slice(
    0,
    Math.max(maxVisible, 0),
  );
}