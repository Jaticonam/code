import type {
  ProductCompatibilityProfile,
  ProductDisplayIndicator,
} from "./BadgeTypes";

export interface ProductBadgeDisplayPolicy {
  maxVisible?: number;
}

export function getProductDisplayIndicators(
  profile: ProductCompatibilityProfile,
  policy:
    ProductBadgeDisplayPolicy = {},
): ProductDisplayIndicator[] {
  const {
    maxVisible = 2,
  } = policy;

  const ordered =
    profile.badges
      .slice()
      .sort(
        (a, b) =>
          b.priority - a.priority,
      )
      .map<ProductDisplayIndicator>(
        (badge) => ({
          ...badge,
        }),
      );

  return ordered.slice(
    0,
    Math.max(maxVisible, 0),
  );
}
