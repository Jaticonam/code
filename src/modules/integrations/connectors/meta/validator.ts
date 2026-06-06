import type { FeedProduct } from "../../types/feed";

export const validateMetaProduct = (p: FeedProduct) => {
  const errors: string[] = [];
  if (!p.id) errors.push("sin id");
  if (!p.title) errors.push("sin title");
  if (!p.img) errors.push("sin imagen");
  if (!p.price_1 || p.price_1 <= 0) errors.push("precio inválido");
  if (!p.category) errors.push("sin categoría");
  return errors;
};
