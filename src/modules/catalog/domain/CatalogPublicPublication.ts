import type {
  CatalogComposition,
} from "@/modules/catalog/domain/CatalogComposition";

import type {
  CatalogPublicationSnapshot,
} from "@/modules/catalog/domain/CatalogPublication";

import type {
  CatalogPublicationIdentity,
} from "@/modules/catalog/domain/CatalogPublicationIdentity";

/**
 * Versión del recurso público persistido.
 *
 * Es independiente de la versión interna del snapshot
 * para permitir que ambos contratos evolucionen sin
 * quedar artificialmente acoplados.
 */
export const CATALOG_PUBLIC_PUBLICATION_VERSION =
  1 as const;

/**
 * Recurso mínimo que un lector público necesita para
 * reconstruir un catálogo publicado por Public ID.
 *
 * Deliberadamente no expone identidad del borrador,
 * nombre interno, status administrativo ni timestamps
 * de autoría.
 */
export interface CatalogPublicPublication {
  publicId:
    string;

  composition:
    CatalogComposition;

  publicationIdentity:
    CatalogPublicationIdentity;

  publication:
    CatalogPublicationSnapshot;

  version:
    typeof CATALOG_PUBLIC_PUBLICATION_VERSION;
}
