import type { SheetProduct } from "./normalizeProduct";

const PUBLIC_STATUSES = new Set([
  "",
  "publicado",
  "publicada",
  "published",
  "activo",
  "activa",
  "active",
  "preventa",
]);

function normalizeStatus(status: string | undefined) {
  return String(status ?? "")
    .trim()
    .toLowerCase();
}

export function validateProducts(products: SheetProduct[]) {
  return products.filter((product) => {
    if (!product.id) return false;
    if (!product.title) return false;
    if (!product.img) return false;

    const status = normalizeStatus(product.status);

    return PUBLIC_STATUSES.has(status);
  });
}
