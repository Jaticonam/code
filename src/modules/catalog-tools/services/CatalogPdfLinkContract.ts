export const CATALOG_PDF_LINK_VERSION = "1" as const;

export interface CatalogPdfLinkContractV1 {
  version: typeof CATALOG_PDF_LINK_VERSION;
  categoryId?: string;
  campaignId?: string;
}

export type PdfLinkIssueCode =
  | "UNSUPPORTED_VERSION"
  | "INVALID_CATEGORY_ID"
  | "INVALID_CAMPAIGN_ID"
  | "LEGACY_PARAMETER_USED"
  | "CONFLICTING_PARAMETER"
  | "UNKNOWN_PARAMETER";

export interface PdfLinkIssue {
  code: PdfLinkIssueCode;
  parameter?: string;
  message: string;
}

export type CatalogPdfLinkParseResult =
  | {
      ok: true;
      contract: CatalogPdfLinkContractV1;
      warnings: readonly PdfLinkIssue[];
    }
  | {
      ok: false;
      errors: readonly PdfLinkIssue[];
    };

const ID_PATTERN = /^[\p{L}\p{N}._-]+$/u;
const MAX_ID_LENGTH = 100;

function clean(value: string | null): string {
  return String(value ?? "").trim().toLowerCase();
}

function validatedId(
  value: string,
  kind: "category" | "campaign",
): PdfLinkIssue | null {
  if (
    value.length > MAX_ID_LENGTH ||
    !ID_PATTERN.test(value)
  ) {
    return {
      code: kind === "category"
        ? "INVALID_CATEGORY_ID"
        : "INVALID_CAMPAIGN_ID",
      parameter: kind === "category" ? "cat" : "cpg",
      message: `El ID de ${kind === "category" ? "categoría" : "campaña"} no es válido.`,
    };
  }
  return null;
}

function resolveParameter(
  params: URLSearchParams,
  canonical: string,
  aliases: readonly string[],
  warnings: PdfLinkIssue[],
  errors: PdfLinkIssue[],
): string {
  const candidates = [
    [canonical, clean(params.get(canonical))],
    ...aliases.map((alias) => [alias, clean(params.get(alias))]),
  ] as const;
  const present = candidates.filter(([, value]) => value);
  const values = new Set(present.map(([, value]) => value));

  for (const [parameter] of present) {
    if (parameter !== canonical) {
      warnings.push({
        code: "LEGACY_PARAMETER_USED",
        parameter,
        message: `Se utilizó el parámetro legacy "${parameter}".`,
      });
    }
  }
  if (values.size > 1) {
    errors.push({
      code: "CONFLICTING_PARAMETER",
      parameter: canonical,
      message: `Existen valores en conflicto para "${canonical}".`,
    });
  }
  return present[0]?.[1] ?? "";
}

export function parseCatalogPdfLink(
  input: URLSearchParams | string,
): CatalogPdfLinkParseResult {
  const params = typeof input === "string"
    ? new URLSearchParams(input.startsWith("?") ? input.slice(1) : input)
    : input;
  const warnings: PdfLinkIssue[] = [];
  const errors: PdfLinkIssue[] = [];
  const knownParameters = new Set([
    "v", "cat", "cpg", "categoria", "category", "campania", "campaign",
  ]);
  for (const parameter of params.keys()) {
    if (!knownParameters.has(parameter)) {
      warnings.push({
        code: "UNKNOWN_PARAMETER",
        parameter,
        message: `El parámetro desconocido "${parameter}" será ignorado.`,
      });
    }
  }
  const version = clean(params.get("v"));

  if (version && version !== CATALOG_PDF_LINK_VERSION) {
    errors.push({
      code: "UNSUPPORTED_VERSION",
      parameter: "v",
      message: "La versión del enlace PDF no es compatible.",
    });
  }

  const categoryId = resolveParameter(
    params,
    "cat",
    ["categoria", "category"],
    warnings,
    errors,
  );
  const campaignId = resolveParameter(
    params,
    "cpg",
    ["campania", "campaign"],
    warnings,
    errors,
  );

  if (categoryId && categoryId !== "todas") {
    const categoryIssue = validatedId(categoryId, "category");
    if (categoryIssue) errors.push(categoryIssue);
  }
  if (campaignId) {
    const campaignIssue = validatedId(campaignId, "campaign");
    if (campaignIssue) errors.push(campaignIssue);
  }
  if (errors.length) return { ok: false, errors };

  return {
    ok: true,
    contract: {
      version: CATALOG_PDF_LINK_VERSION,
      ...(categoryId && categoryId !== "todas" ? { categoryId } : {}),
      ...(campaignId ? { campaignId } : {}),
    },
    warnings,
  };
}
