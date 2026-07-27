import {
  CATALOG_PDF_LINK_VERSION,
} from "./CatalogPdfLinkContract";
import {
  buildCatalogPdfPublicUrl,
  getApplicationConfig,
} from "@/shared/config/application";

export interface BuildCatalogPdfUrlParams {
  categoryId?: string;
  campaignId?: string;
  origin?: string;
}

const cleanValue = (value?: string | null) =>
  String(value || "").trim().toLowerCase();

export const buildCatalogPdfPath = ({
  categoryId,
  campaignId,
}: BuildCatalogPdfUrlParams) => {
  const cleanCategoryId = cleanValue(categoryId);
  const cleanCampaignId = cleanValue(campaignId);

  const params = new URLSearchParams();
  params.set("v", CATALOG_PDF_LINK_VERSION);

  if (cleanCategoryId && cleanCategoryId !== "todas") {
    params.set("cat", cleanCategoryId);
  }

  if (cleanCampaignId) {
    params.set("cpg", cleanCampaignId);
  }

  const query = params.toString();

  return `${getApplicationConfig().routes.catalogPdf}?${query}`;
};

export const buildCatalogPdfUrl = ({
  origin,
  ...params
}: BuildCatalogPdfUrlParams) => {
  const path = buildCatalogPdfPath(params);
  if (!origin) return path;
  const config = getApplicationConfig();
  return buildCatalogPdfPublicUrl({
    ...config,
    publicSite: {
      ...config.publicSite,
      origin: String(origin).replace(/\/+$/, ""),
    },
  }) + path.slice(config.routes.catalogPdf.length);
};
