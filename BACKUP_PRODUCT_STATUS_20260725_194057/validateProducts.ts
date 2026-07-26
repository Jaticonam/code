import {
  isProductPublicationDataValid,
} from "@/modules/catalog/domain/ProductCommercialPolicy";

import type {
  SheetProduct,
} from "./normalizeProduct";

/**
 * Devuelve únicamente productos aptos para publicación pública.
 *
 * Estados admitidos:
 * - preventa
 * - publicado
 * - agotado
 *
 * Estados bloqueados:
 * - borrador
 * - oculto
 * - vacío
 * - desconocido
 *
 * La política también valida los datos mínimos requeridos
 * según cada estado.
 */
export function validateProducts(
  products: SheetProduct[],
): SheetProduct[] {
  return products.filter(
    isProductPublicationDataValid,
  );
}
