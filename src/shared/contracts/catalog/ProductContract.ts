import type {
  CatalogInventoryContract,
} from "./InventoryContract";

import type {
  CatalogMediaAssetContract,
} from "./MediaAssetContract";

import type {
  CatalogPricingContract,
} from "./PriceContract";

export type CatalogProductPublicationStatus =
  | "draft"
  | "published"
  | "hidden"
  | "preorder"
  | "archived";

/**
 * Contrato canónico de producto.
 *
 * Este contrato no reemplaza todavía al Product operativo
 * de Wooly. Se utilizará como frontera estable entre
 * proveedores externos, JUNG CORE y adaptadores web.
 */
export interface CatalogProductContract {
  id: string;
  sku: string;
  slug: string;

  brandId: string;
  categoryId: string;

  title: string;
  description: string;

  campaignIds: readonly string[];

  /**
   * Badges comerciales asignados manualmente.
   * Nunca se utilizan para crear campañas.
   */
  manualBadgeCodes: readonly string[];

  priority: number;

  publicationStatus:
    CatalogProductPublicationStatus;

  pricing: CatalogPricingContract;
  inventory: CatalogInventoryContract;

  mediaAssets:
    readonly CatalogMediaAssetContract[];

  updatedAt: string | null;
}
