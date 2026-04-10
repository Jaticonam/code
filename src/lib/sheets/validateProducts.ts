import type { SheetProduct } from "./normalizeProduct";

function normalizeStatus(status: string): string {
  return status.trim().toLowerCase();
}

export function validateProducts(products: SheetProduct[]): SheetProduct[] {
  const seen = new Set<string>();

  return products.filter((p) => {
    const status = normalizeStatus(p.status);

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

    // Ocultos o borradores no entran
    if (status === "draft" || status === "hidden") {
      return false;
    }

    // Publicado: debe estar listo para vender
    if (status === "Publicado") {
      if (Number.isNaN(p.price_1) || p.price_1 <= 0) {
        console.warn("Producto publicado descartado: price_1 inválido ->", p.id);
        return false;
      }

      if (!p.img) {
        console.warn("Producto publicado descartado: sin imagen ->", p.id);
        return false;
      }
    }

    // Preventa: puede entrar con información parcial
    if (status === "preventa") {
      // Solo exigimos id + title, ya validados arriba.
      // Si luego quieres, aquí podemos exigir imagen mínima.
    }

    // Si viene cualquier otro status raro, mejor no mostrarlo
    if (status !== "publicado" && status !== "preventa") {
      return false;
    }

    seen.add(p.id);
    return true;
  });
}