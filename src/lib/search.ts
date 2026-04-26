import { Product } from "@/types/product";

export const normalize = (value: unknown) =>
  String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s-_./]/g, "");

export const searchProducts = (products: Product[], query: string) => {
  const rawTerm = query.trim();

  if (!rawTerm) return products;

  const term = normalize(rawTerm);

  return products
    .map((p) => {
      const id = normalize(p.id);
      const title = normalize(p.title);
      const description = normalize(p.description);
      const category = normalize(p.category);
      const badges = normalize(p.badges?.join(" "));

      let score = 0;

      // 🔥 PRIORIDAD ID
      if (id === term) score += 1000;
      else if (id.startsWith(term)) score += 700;
      else if (term.length >= 3 && id.includes(term)) score += 500;

      // 🧠 NOMBRE
      if (title.includes(term)) score += 300;

      // 📄 DESCRIPCIÓN
      if (description.includes(term)) score += 180;

      // 📦 CATEGORÍA
      if (category.includes(term)) score += 100;

      // 🏷 BADGES
      if (badges.includes(term)) score += 80;

      return { product: p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.product);
};