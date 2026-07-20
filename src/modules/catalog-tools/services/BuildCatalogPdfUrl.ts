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

  if (cleanCategoryId && cleanCategoryId !== "todas") {
    params.set("cat", cleanCategoryId);
  }

  if (cleanCampaignId) {
    params.set("cpg", cleanCampaignId);
  }

  const query = params.toString();

  return query ? `/catalogo/pdf?${query}` : "/catalogo/pdf";
};

export const buildCatalogPdfUrl = ({
  origin,
  ...params
}: BuildCatalogPdfUrlParams) => {
  const path = buildCatalogPdfPath(params);
  const cleanOrigin = String(origin || "").replace(/\/$/, "");

  return cleanOrigin ? `${cleanOrigin}${path}` : path;
};
