export type CatalogBadgeKind =
  | "campaign"
  | "promotion"
  | "merchandising";

export type CatalogBadgeSource =
  | "campaign"
  | "pricingRule"
  | "manual"
  | "analytics"
  | "legacyManual";

export type ProductSeasonality =
  | "evergreen"
  | "seasonal"
  | "campaignOnly"
  | "limited"
  | "unspecified";

export interface CatalogBadge {
  id: string;
  code: string;
  label: string;
  icon: string | null;

  kind: CatalogBadgeKind;
  themeToken: string;
  priority: number;

  source: CatalogBadgeSource;
  sourceReferenceId: string | null;
}

export interface LegacyCampaignReference {
  code: string;
  label: string;
  normalizedName: string;

  themeToken: string;
  priority: number;

  sourceReferenceId: string;
}

export interface ProductCompatibilityProfile {
  badges: CatalogBadge[];

  seasonality: ProductSeasonality;
  seasonalitySourceValue: string | null;

  campaignReferences: LegacyCampaignReference[];
  unknownLegacyValues: string[];
}

export type ProductDisplayIndicatorKind =
  | CatalogBadgeKind
  | "seasonality";

export interface ProductDisplayIndicator {
  id: string;
  code: string;
  label: string;
  icon: string | null;

  kind: ProductDisplayIndicatorKind;
  themeToken: string;
  priority: number;

  source: CatalogBadgeSource;
  sourceReferenceId: string | null;
}