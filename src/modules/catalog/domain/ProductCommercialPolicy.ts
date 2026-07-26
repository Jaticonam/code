/* =========================================================
   CONTRATO MÍNIMO DE POLÍTICA
   ========================================================= */

/**
 * Contrato mínimo deliberadamente independiente del tipo
 * legacy Product.
 *
 * JUNG CORE podrá proporcionar los mismos datos desde su
 * contrato canónico sin reescribir las reglas comerciales.
 */
export interface ProductCommercialPolicyInput {
  id?: string | null;
  title?: string | null;
  description?: string | null;
  img?: string | null;

  price_1?: number | null;
  stock?: number | null;

  status?: string | null;
}

/* =========================================================
   ESTADOS OFICIALES DEL SHEET LEGACY
   ========================================================= */

export const PRODUCT_SHEET_STATUSES = [
  "borrador",
  "oculto",
  "preventa",
  "publicado",
  "agotado",
] as const;

export type ProductSheetStatus =
  (typeof PRODUCT_SHEET_STATUSES)[number];

export type ResolvedProductSheetStatus =
  | ProductSheetStatus
  | "invalid";

const PRODUCT_SHEET_STATUS_SET =
  new Set<string>(
    PRODUCT_SHEET_STATUSES,
  );

const PUBLIC_PRODUCT_STATUS_SET =
  new Set<ProductSheetStatus>([
    "preventa",
    "publicado",
    "agotado",
  ]);

/* =========================================================
   DIAGNÓSTICO
   ========================================================= */

export type ProductCommercialIssue =
  | "invalid-status"
  | "non-public-status"
  | "missing-id"
  | "missing-title"
  | "missing-image"
  | "missing-description"
  | "invalid-base-price"
  | "invalid-stock"
  | "stock-status-mismatch";

export interface ProductCommercialPolicy {
  status:
    ResolvedProductSheetStatus;

  isStatusValid:
    boolean;

  isPubliclyVisible:
    boolean;

  hasValidPublicationData:
    boolean;

  isPurchasable:
    boolean;

  isConsultOnly:
    boolean;

  canShowPricing:
    boolean;

  canShowInventoryQuantity:
    boolean;

  canExportToTransactionalChannel:
    boolean;

  issues:
    ProductCommercialIssue[];
}

/* =========================================================
   HELPERS
   ========================================================= */

function cleanText(
  value: unknown,
): string {
  return String(
    value ?? "",
  ).trim();
}

function isPositiveFiniteNumber(
  value: unknown,
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value > 0
  );
}

function isFiniteStock(
  value: unknown,
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0
  );
}

export function normalizeProductSheetStatus(
  value: unknown,
): ResolvedProductSheetStatus {
  const normalized =
    cleanText(value)
      .toLowerCase();

  return PRODUCT_SHEET_STATUS_SET.has(
    normalized,
  )
    ? (
        normalized as
          ProductSheetStatus
      )
    : "invalid";
}

/* =========================================================
   RESOLUCIÓN DE POLÍTICA
   ========================================================= */

export function resolveProductCommercialPolicy(
  product:
    ProductCommercialPolicyInput,
): ProductCommercialPolicy {
  const status =
    normalizeProductSheetStatus(
      product.status,
    );

  const issues:
    ProductCommercialIssue[] = [];

  if (status === "invalid") {
    issues.push(
      "invalid-status",
    );

    return {
      status,
      isStatusValid: false,
      isPubliclyVisible: false,
      hasValidPublicationData: false,
      isPurchasable: false,
      isConsultOnly: false,
      canShowPricing: false,
      canShowInventoryQuantity: false,
      canExportToTransactionalChannel:
        false,
      issues,
    };
  }

  if (
    !PUBLIC_PRODUCT_STATUS_SET
      .has(status)
  ) {
    issues.push(
      "non-public-status",
    );

    return {
      status,
      isStatusValid: true,
      isPubliclyVisible: false,
      hasValidPublicationData: false,
      isPurchasable: false,
      isConsultOnly: false,
      canShowPricing: false,
      canShowInventoryQuantity: false,
      canExportToTransactionalChannel:
        false,
      issues,
    };
  }

  if (!cleanText(product.id)) {
    issues.push(
      "missing-id",
    );
  }

  if (!cleanText(product.title)) {
    issues.push(
      "missing-title",
    );
  }

  if (!cleanText(product.img)) {
    issues.push(
      "missing-image",
    );
  }

  const hasPublicPresentation =
    !issues.includes(
      "missing-id",
    ) &&
    !issues.includes(
      "missing-title",
    ) &&
    !issues.includes(
      "missing-image",
    );

  const hasValidBasePrice =
    isPositiveFiniteNumber(
      product.price_1,
    );

  const hasValidStock =
    isFiniteStock(
      product.stock,
    );

  const hasAvailableStock =
    hasValidStock &&
    product.stock > 0;

  /* ---------------------------------------------------------
     PREVENTA
     --------------------------------------------------------- */

  if (
    status === "preventa" &&
    !cleanText(
      product.description,
    )
  ) {
    issues.push(
      "missing-description",
    );
  }

  /* ---------------------------------------------------------
     PUBLICADO
     --------------------------------------------------------- */

  if (
    status === "publicado" &&
    !hasValidBasePrice
  ) {
    issues.push(
      "invalid-base-price",
    );
  }

  if (
    status === "publicado" &&
    !hasValidStock
  ) {
    issues.push(
      "invalid-stock",
    );
  }

  if (
    status === "publicado" &&
    hasValidStock &&
    !hasAvailableStock
  ) {
    issues.push(
      "stock-status-mismatch",
    );
  }

  /* ---------------------------------------------------------
     AGOTADO
     ---------------------------------------------------------

     El estado agotado prevalece sobre la cantidad registrada.
     Solamente necesita precio válido para su presentación.
     --------------------------------------------------------- */

  if (
    status === "agotado" &&
    !hasValidBasePrice
  ) {
    issues.push(
      "invalid-base-price",
    );
  }

  const hasValidPublicationData =
    hasPublicPresentation &&
    issues.length === 0;

  /*
   * Visible significa realmente apto para publicación.
   * Ya no basta con tener un estado aparentemente público.
   */
  const isPubliclyVisible =
    hasValidPublicationData;

  const isPurchasable =
    status === "publicado" &&
    hasValidPublicationData &&
    hasValidBasePrice &&
    hasAvailableStock;

  const isConsultOnly =
    hasValidPublicationData &&
    (
      status === "preventa" ||
      status === "agotado"
    );

  const canShowPricing =
    hasValidPublicationData &&
    status !== "preventa" &&
    hasValidBasePrice;

  const canShowInventoryQuantity =
    hasValidPublicationData &&
    status === "publicado" &&
    hasValidStock;

  return {
    status,
    isStatusValid: true,
    isPubliclyVisible,
    hasValidPublicationData,
    isPurchasable,
    isConsultOnly,
    canShowPricing,
    canShowInventoryQuantity,
    canExportToTransactionalChannel:
      isPurchasable,
    issues,
  };
}

/* =========================================================
   ATAJOS DE CONSUMO
   ========================================================= */

export function isProductPubliclyVisible(
  product:
    ProductCommercialPolicyInput,
): boolean {
  return (
    resolveProductCommercialPolicy(
      product,
    ).isPubliclyVisible
  );
}

export function isProductPublicationDataValid(
  product:
    ProductCommercialPolicyInput,
): boolean {
  return (
    resolveProductCommercialPolicy(
      product,
    ).hasValidPublicationData
  );
}

export function isProductPurchasable(
  product:
    ProductCommercialPolicyInput,
): boolean {
  return (
    resolveProductCommercialPolicy(
      product,
    ).isPurchasable
  );
}

export function canProductExportToTransactionalChannel(
  product:
    ProductCommercialPolicyInput,
): boolean {
  return (
    resolveProductCommercialPolicy(
      product,
    ).canExportToTransactionalChannel
  );
}
