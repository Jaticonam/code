export type {
  CatalogBadge,
  CatalogBadgeKind,
  CatalogBadgeSource,
  LegacyCampaignReference,
  ProductCompatibilityProfile,
  ProductDisplayIndicator,
  ProductDisplayIndicatorKind,
  ProductSeasonality,
} from "./BadgeTypes";

export {
  normalizeLegacyBadgeValue,
  resolveLegacyBadgeValue,
} from "./LegacyBadgeAliases";

export {
  resolveProductCompatibility,
  type ResolveProductCompatibilityOptions,
} from "./ResolveProductCompatibility";

export {
  getProductDisplayIndicators,
  type ProductBadgeDisplayPolicy,
} from "./BadgeDisplayPolicy";