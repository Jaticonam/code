export interface BadgeRule {
  keywords: string[];
  className: string;
  animation?: string;
  priority: number;
}

export const BADGE_RULES: BadgeRule[] = [
  {
    keywords: ["preventa", "pre venta", "lanzamiento", "proximamente", "próximamente"],
    className: "bg-green-500 text-white",
    animation: "animate-pulse",
    priority: 1,
  },
  {
    keywords: ["oferta", "promo", "promocion", "promoción", "descuento"],
    className: "bg-red-600 text-white",
    animation: "",
    priority: 2,
  },
  {
    keywords: ["cyber", "cybermom", "campaña", "campana"],
    className: "bg-rose-700 text-white",
    animation: "",
    priority: 3,
  },
  {
    keywords: ["nuevo", "new"],
    className: "bg-purple-600 text-white",
    animation: "animate-pulse",
    priority: 4,
  },
  {
    keywords: ["top", "top ventas", "destacado", "recomendado"],
    className: "bg-amber-500 text-white",
    animation: "",
    priority: 5,
  },
  {
    keywords: ["premium", "exclusivo", "vip"],
    className: "bg-slate-800 text-white",
    animation: "",
    priority: 6,
  },
  {
    keywords: ["regalo", "gift", "detalle"],
    className: "bg-pink-600 text-white",
    animation: "",
    priority: 7,
  },
];

export function normalizeBadgeText(badge: string): string {
  return badge
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function getBadgePresentation(badge: string) {
  const value = normalizeBadgeText(badge);

  const matchedRule = BADGE_RULES.find((rule) =>
    rule.keywords.some((keyword) => value.includes(keyword))
  );

  if (matchedRule) {
    return {
      className: matchedRule.className,
      animation: matchedRule.animation || "",
      priority: matchedRule.priority,
    };
  }

  return {
    className: "bg-black/80 text-white",
    animation: "",
    priority: 999,
  };
}

export function sortBadges(badges: string[]): string[] {
  return [...badges].sort((a, b) => {
    const aPriority = getBadgePresentation(a).priority;
    const bPriority = getBadgePresentation(b).priority;
    return aPriority - bPriority;
  });
}