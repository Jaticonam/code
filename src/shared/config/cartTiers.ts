export const CART_TIERS = [
  { qty: 1, key: "price_1" as const, cls: "active-1", label: "1u" },
  { qty: 3, key: "price_3" as const, cls: "active-3", label: "3u" },
  { qty: 12, key: "price_12" as const, cls: "active-12", label: "12u" },
  { qty: 50, key: "price_50" as const, cls: "active-50", label: "50u" },
  { qty: 100, key: "price_100" as const, cls: "active-100", label: "100u" },
];

export const TIER_COLORS = {
  "active-1": "active-1",
  "active-3": "active-3",
  "active-12": "active-12",
  "active-50": "active-50",
  "active-100": "active-100",
};
