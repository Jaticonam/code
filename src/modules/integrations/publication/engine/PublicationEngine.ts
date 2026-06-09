import type { Product } from "@/shared/types/product";
import type { PublicationPlan } from "../models/PublicationPlan";
import type { PublicationResult } from "../models/PublicationResult";

const normalize = (value?: string) => String(value || "").trim().toLowerCase();

const byDirection = (direction: "asc" | "desc") => direction === "asc" ? 1 : -1;

const sortProducts = (items: Product[], plan: PublicationPlan) => {
  if (!plan.sorting) return items;
  const direction = byDirection(plan.sorting.direction);

  return [...items].sort((a, b) => {
    if (plan.sorting?.by === "priority") return ((a.priority || 0) - (b.priority || 0)) * direction;
    if (plan.sorting?.by === "price") return ((a.price_offer || a.price_1 || 0) - (b.price_offer || b.price_1 || 0)) * direction;
    if (plan.sorting?.by === "title") return a.title.localeCompare(b.title) * direction;
    return 0;
  });
};

const shuffle = <T>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

export const PublicationEngine = {
  apply(products: Product[], plan: PublicationPlan): PublicationResult<Product> {
    let items = [...products];

    if (!plan.enabled) items = [];

    if (plan.mode === "campaign" && plan.filters?.campaign) {
      const target = normalize(plan.filters.campaign);
      items = items.filter((p) => (p.campaigns || []).some((c) => normalize(c) === target));
    }

    if (plan.mode === "category" && plan.filters?.category) {
      const target = normalize(plan.filters.category);
      items = items.filter((p) => normalize(p.category) === target);
    }

    if (plan.mode === "selected" && plan.filters?.ids?.length) {
      const ids = new Set(plan.filters.ids.map(normalize));
      items = items.filter((p) => ids.has(normalize(p.id)));
    }

    if (plan.filters?.status?.length) {
      const statuses = new Set(plan.filters.status.map(normalize));
      items = items.filter((p) => statuses.has(normalize(p.status)));
    }

    if (plan.filters?.excludeOutOfStock) {
      items = items.filter((p) => Number(p.stock || 0) > 0 && normalize(p.status) !== "agotado");
    }

    if (plan.filters?.excludePreorder) {
      items = items.filter((p) => normalize(p.status) !== "preventa");
    }

    items = sortProducts(items, plan);
    if (plan.randomize) items = shuffle(items);
    if (plan.limit && plan.limit > 0) items = items.slice(0, plan.limit);

    return {
      plan,
      totalItems: products.length,
      selectedItems: items.length,
      omittedItems: products.length - items.length,
      items,
      generatedAt: new Date().toISOString(),
    };
  },
};
