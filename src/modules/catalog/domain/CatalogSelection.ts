import type {
  Campaign,
  Product,
} from "@/shared/types/product";

/* =========================================================
   TIPOS DE ENTRADA
   ========================================================= */

export interface CatalogSelectionCategory {
  id: string;
  name: string;
  icon: string;
}

export interface ResolveCatalogSelectionParams {
  products: readonly Product[];
  categories: readonly CatalogSelectionCategory[];
  campaigns: readonly Campaign[];
  categoryId?: string | null;
  campaignId?: string | null;
}

/* =========================================================
   TIPOS DE RESULTADO
   ========================================================= */

export type CatalogSelectionSegmentType =
  | "general"
  | "category"
  | "campaign"
  | "combination";

export type CatalogSelectionWarningCode =
  | "unknown-category"
  | "unknown-campaign"
  | "empty-selection";

export interface CatalogSelectionWarning {
  code: CatalogSelectionWarningCode;
  message: string;
}

export interface CatalogSelectionResult {
  categoryId: string;
  categoryLabel: string;
  categoryIcon: string;

  campaignId: string;
  campaignLabel: string;
  campaignIcon: string;

  category?: CatalogSelectionCategory;
  campaign?: Campaign;

  products: Product[];
  productCount: number;

  hasCategory: boolean;
  hasCampaign: boolean;
  isCombination: boolean;
  isEmpty: boolean;

  segmentType: CatalogSelectionSegmentType;
  warnings: CatalogSelectionWarning[];
}

/* =========================================================
   NORMALIZACIÓN
   ========================================================= */

export function normalizeCatalogSelectionValue(
  value: unknown,
): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeCategoryId(
  value: unknown,
): string {
  const normalized =
    normalizeCatalogSelectionValue(value);

  return normalized === "todas"
    ? ""
    : normalized;
}

function normalizeProductStatus(
  product: Product,
): string {
  return normalizeCatalogSelectionValue(
    product.status,
  );
}

/* =========================================================
   REGLAS DE PRODUCTO
   ========================================================= */

function isSelectableProduct(
  product: Product,
): boolean {
  return normalizeProductStatus(product) !== "oculto";
}

function productMatchesCategory(
  product: Product,
  categoryId: string,
): boolean {
  if (!categoryId) {
    return true;
  }

  return (
    normalizeCatalogSelectionValue(
      product.category,
    ) === categoryId
  );
}

function productMatchesCampaign(
  product: Product,
  campaignId: string,
): boolean {
  if (!campaignId) {
    return true;
  }

  return Boolean(
    product.campaigns?.some(
      (productCampaignId) =>
        normalizeCatalogSelectionValue(
          productCampaignId,
        ) === campaignId,
    ),
  );
}

function sortProductsByPriority(
  products: readonly Product[],
): Product[] {
  return [...products].sort(
    (a, b) =>
      Number(b.priority ?? 0) -
      Number(a.priority ?? 0),
  );
}

/* =========================================================
   RESOLUCIÓN DE REGISTROS
   ========================================================= */

function findCategory(
  categories: readonly CatalogSelectionCategory[],
  categoryId: string,
) {
  if (!categoryId) {
    return undefined;
  }

  return categories.find(
    (category) =>
      normalizeCatalogSelectionValue(
        category.id,
      ) === categoryId,
  );
}

function findCampaign(
  campaigns: readonly Campaign[],
  campaignId: string,
) {
  if (!campaignId) {
    return undefined;
  }

  return campaigns.find(
    (campaign) =>
      normalizeCatalogSelectionValue(
        campaign.id,
      ) === campaignId,
  );
}

function getSegmentType(
  hasCategory: boolean,
  hasCampaign: boolean,
): CatalogSelectionSegmentType {
  if (hasCategory && hasCampaign) {
    return "combination";
  }

  if (hasCategory) {
    return "category";
  }

  if (hasCampaign) {
    return "campaign";
  }

  return "general";
}

/* =========================================================
   RESOLVER PRINCIPAL
   ========================================================= */

export function resolveCatalogSelection({
  products,
  categories,
  campaigns,
  categoryId,
  campaignId,
}: ResolveCatalogSelectionParams): CatalogSelectionResult {
  const requestedCategoryId =
    normalizeCategoryId(categoryId);

  const requestedCampaignId =
    normalizeCatalogSelectionValue(
      campaignId,
    );

  const hasCategory =
    Boolean(requestedCategoryId);

  const hasCampaign =
    Boolean(requestedCampaignId);

  const category = findCategory(
    categories,
    requestedCategoryId,
  );

  const campaign = findCampaign(
    campaigns,
    requestedCampaignId,
  );

  const warnings:
    CatalogSelectionWarning[] = [];

  if (hasCategory && !category) {
    warnings.push({
      code: "unknown-category",
      message:
        `La categoría "${requestedCategoryId}" no existe en el registro oficial.`,
    });
  }

  if (hasCampaign && !campaign) {
    warnings.push({
      code: "unknown-campaign",
      message:
        `La campaña "${requestedCampaignId}" no existe en el registro oficial.`,
    });
  }

  const hasInvalidFilter =
    (hasCategory && !category) ||
    (hasCampaign && !campaign);

  const selectedProducts =
    hasInvalidFilter
      ? []
      : sortProductsByPriority(
          products.filter(
            (product) =>
              isSelectableProduct(product) &&
              productMatchesCategory(
                product,
                requestedCategoryId,
              ) &&
              productMatchesCampaign(
                product,
                requestedCampaignId,
              ),
          ),
        );

  if (selectedProducts.length === 0) {
    warnings.push({
      code: "empty-selection",
      message:
        "La selección actual no contiene productos disponibles.",
    });
  }

  const canonicalCategoryId =
    category?.id ?? requestedCategoryId;

  const canonicalCampaignId =
    campaign?.id ?? requestedCampaignId;

  return {
    categoryId: canonicalCategoryId,
    categoryLabel:
      category?.name ??
      (hasCategory
        ? requestedCategoryId
        : "Todo el catálogo"),
    categoryIcon:
      category?.icon ?? "📦",

    campaignId: canonicalCampaignId,
    campaignLabel:
      campaign?.name ??
      (hasCampaign
        ? requestedCampaignId
        : "Sin campaña específica"),
    campaignIcon:
      campaign?.icon ?? "",

    category,
    campaign,

    products: selectedProducts,
    productCount: selectedProducts.length,

    hasCategory,
    hasCampaign,
    isCombination:
      hasCategory && hasCampaign,
    isEmpty:
      selectedProducts.length === 0,

    segmentType: getSegmentType(
      hasCategory,
      hasCampaign,
    ),
    warnings,
  };
}
