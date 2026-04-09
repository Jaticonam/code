import type { SheetProduct } from "./normalizeProduct";

function normalizeStatus(status: string): string {
  return status.trim().toLowerCase();
}

export function validateProducts(products: SheetProduct[]): SheetProduct[] {
  const seen = new Set<string>();

  return products.filter((p) => {
    if (!p.id) {
      console.warn("Producto descartado: sin id");
      return false;
    }

    if (seen.has(p.id)) {
      console.warn("Producto descartado: id duplicado ->", p.id);
      return false;
    }

    if (!p.title) {
      console.warn("Producto descartado: sin title ->", p.id);
      return false;
    }

    if (Number.isNaN(p.price_1) || p.price_1 <= 0) {
      console.warn("Producto descartado: price_1 inválido ->", p.id);
      return false;
    }

    if (!p.img) {
      console.warn("Producto descartado: sin imagen ->", p.id);
      return false;
    }

    if (normalizeStatus(p.status) !== "publicado") {
      return false;
    }

    seen.add(p.id);
    return true;
  });
}