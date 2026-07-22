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

export type IgnoredLegacyBadgeReason =
  | "redundantDefault"
  | "campaignMustComeFromSheetCampaign";

export interface IgnoredLegacyBadgeValue {
  value: string;
  normalizedValue: string;
  reason: IgnoredLegacyBadgeReason;
}

export interface ProductCompatibilityProfile {
  badges: CatalogBadge[];

  /**
   * Valores legacy reconocidos que ya no deben producir
   * ningún indicador visual.
   */
  ignoredLegacyValues: IgnoredLegacyBadgeValue[];

  /**
   * Valores todavía no homologados.
   * Se preservan temporalmente como badge legacy.
   */
  unknownLegacyValues: string[];
}

export type ProductDisplayIndicatorKind =
  CatalogBadgeKind;

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
