export type CatalogCompositionMode =
  | "automatic"
  | "hybrid"
  | "manual";

export interface CatalogCompositionAttributeFilters {
  /**
   * Reservado para una fase posterior.
   *
   * El Product productivo de Wooly todavía no expone
   * colores estructurados.
   */
  colors?: readonly string[];

  /**
   * Reservado para una fase posterior.
   *
   * El Product productivo de Wooly todavía no expone
   * tags comerciales estructurados.
   */
  tags?: readonly string[];
}

export interface CatalogCompositionFilters {
  /**
   * OR dentro de la dimensión.
   *
   * Ejemplo:
   * ["flores", "peluches"]
   * = flores OR peluches.
   */
  categoryIds: readonly string[];

  /**
   * OR dentro de la dimensión.
   *
   * Ejemplo:
   * ["dia-novio", "flores-amarillas"]
   * = dia-novio OR flores-amarillas.
   */
  campaignIds: readonly string[];

  /**
   * Los grupos de atributos se incorporan al contrato
   * desde V3.1, pero no se resuelven hasta que Product
   * tenga campos estructurados compatibles.
   */
  attributes?: CatalogCompositionAttributeFilters;
}

export interface CatalogCompositionOverrides {
  /**
   * Productos agregados manualmente.
   *
   * Una inclusión manual tiene prioridad sobre filtros
   * automáticos y sobre una exclusión accidental del
   * mismo producto.
   */
  includedProductIds: readonly string[];

  /**
   * Productos retirados manualmente del resultado
   * automático.
   */
  excludedProductIds: readonly string[];
}

/**
 * Contrato de selección del Compositor Comercial V3.
 *
 * Las responsabilidades de presentación, Open Graph,
 * persistencia y publicación se incorporarán en fases
 * posteriores sin contaminar este núcleo de selección.
 */
export interface CatalogComposition {
  mode: CatalogCompositionMode;

  filters: CatalogCompositionFilters;

  overrides: CatalogCompositionOverrides;
}

export const createEmptyCatalogComposition = (
  mode: CatalogCompositionMode = "automatic",
): CatalogComposition => ({
  mode,

  filters: {
    categoryIds: [],
    campaignIds: [],
    attributes: {
      colors: [],
      tags: [],
    },
  },

  overrides: {
    includedProductIds: [],
    excludedProductIds: [],
  },
});