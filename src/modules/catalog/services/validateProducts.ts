import type { SheetProduct } from "./normalizeProduct";

function normalizeStatus(status: string): string {
  return status.trim().toLowerCase();
}

export function validateProducts(products: SheetProduct[]): SheetProduct[] {
  const seen = new Set<string>();
  const visibleStatuses = new Set(["publicado", "preventa", "agotado"]);

  return products.filter((p) => {
    const status = normalizeStatus(p.status);

    if (!p.id) {
      console.warn("Producto descartado: sin id", {
        title: p.title,
        status: p.status,
      });
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

    if (!visibleStatuses.has(status)) return false;

    if (status === "publicado" || status === "agotado") {
      if (Number.isNaN(p.price_1) || p.price_1 <= 0) {
        console.warn(
          `Producto ${status} descartado: price_1 inválido ->`,
          p.id,
        );
        return false;
      }

      if (!p.img) {
        console.warn(
          `Producto ${status} descartado: sin imagen ->`,
          p.id,
        );
        return false;
      }
    }

    seen.add(p.id);
    return true;
  });
}
