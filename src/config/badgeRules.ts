export interface BadgeRule {
  keywords: string[];
  className: string;
  animation?: string;
  priority: number;
}

export const BADGE_RULES: BadgeRule[] = [
  {
    priority: 1,
    keywords: [
      "para papá",
      "para papa",
      "dia del padre",
      "día del padre",
      "dia padre",
      "día padre",
      "padre",
      "papá",
      "papa",
      "father",
    ],
    className:
      "bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white shadow-[0_0_12px_rgba(37,99,235,0.28)]",
    animation: "animate-pulse",
  },
  {
    priority: 2,
    keywords: [
      "campaña",
      "campana",
      "temporada",
      "san valentin",
      "san valentín",
      "navidad",
      "madre",
      "halloween",
      "escolar",
    ],
    className: "bg-[#f5b025] text-slate-950",
    animation: "",
  },
  {
    priority: 3,
    keywords: ["nuevo", "new", "novedad", "nuevo ingreso", "recién llegado"],
    className: "bg-indigo-600 text-white",
    animation: "animate-pulse",
  },
  {
    priority: 4,
    keywords: [
      "oferta",
      "promo",
      "promocion",
      "promoción",
      "descuento",
      "remate",
      "liquidacion",
      "liquidación",
    ],
    className: "bg-red-600 text-white",
    animation: "",
  },
  {
    priority: 5,
    keywords: [
      "mas vendido",
      "más vendido",
      "top ventas",
      "best seller",
      "bestseller",
    ],
    className:
      "bg-gradient-to-r from-[#f5b025] to-[#d49615] text-slate-950 shadow-[0_0_10px_rgba(245,176,37,0.28)]",
    animation: "",
  },
  {
    priority: 6,
    keywords: [
      "premium",
      "exclusivo",
      "vip",
      "especial",
      "edicion limitada",
      "edición limitada",
    ],
    className: "bg-slate-900 text-white",
    animation: "",
  },
  {
    priority: 7,
    keywords: [
      "mayorista",
      "por mayor",
      "caja",
      "cajón",
      "cajon",
      "docena",
      "pack",
      "lote",
      "bulk",
    ],
    className: "bg-[#1d8299] text-white",
    animation: "",
  },
  {
    priority: 8,
    keywords: [
      "top",
      "alta rotacion",
      "alta rotación",
      "tendencia",
      "destacado",
      "recomendado",
    ],
    className: "bg-orange-600 text-white",
    animation: "",
  },
  {
    priority: 9,
    keywords: [
      "stock limitado",
      "ultimas unidades",
      "últimas unidades",
      "agotando",
    ],
    className: "bg-red-700 text-white",
    animation: "animate-pulse",
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

  const matchedRule = [...BADGE_RULES]
    .sort((a, b) => a.priority - b.priority)
    .find((rule) =>
      rule.keywords.some((keyword) =>
        value.includes(normalizeBadgeText(keyword))
      )
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
