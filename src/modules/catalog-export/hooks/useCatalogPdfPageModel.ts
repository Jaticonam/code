import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import {
  resolveCatalogSelection,
  type CatalogSelectionResult,
} from "@/modules/catalog/domain/CatalogSelection";
import { useCatalogCampaigns } from "@/modules/catalog/hooks/useCatalogCampaigns";
import { useCatalogData } from "@/modules/catalog/hooks/useCatalogData";
import { parseCatalogPdfLink } from "@/modules/catalog-tools/services/CatalogPdfLinkContract";
import { CATEGORY_CONFIG } from "@/shared/config/categories";

import { mapProductsToPdfProducts } from "../mappers/PdfProductMapper";
import { buildPdfCategorySections } from "../services/BuildPdfCategorySections";

const INVALID_PDF_LINK = "__invalid_pdf_link__";

const formatDate = (date: Date, includeTime = false) =>
  new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...(includeTime
      ? {
          hour: "2-digit",
          minute: "2-digit",
        }
      : {}),
  }).format(date);

const addDays = (date: Date, days: number) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

export const buildCatalogPdfCopy = (
  selection: CatalogSelectionResult,
) => {
  if (selection.isCombination) {
    return {
      title: `Catálogo Mayorista · ${selection.categoryLabel} + ${selection.campaignLabel}`,
      subtitle: `Selección comercial de ${selection.categoryLabel} para la campaña ${selection.campaignLabel}. Precios y productos sujetos a disponibilidad.`,
      segmentLabel: `${selection.categoryLabel} · ${selection.campaignLabel}`,
      segmentType: "combination" as const,
    };
  }

  if (selection.hasCampaign) {
    return {
      title: `Catálogo Mayorista · ${selection.campaignLabel}`,
      subtitle: `Productos seleccionados para la campaña ${selection.campaignLabel}. Precios y productos sujetos a disponibilidad.`,
      segmentLabel: selection.campaignLabel,
      segmentType: "campaign" as const,
    };
  }

  if (selection.hasCategory) {
    return {
      title: `Catálogo Mayorista · ${selection.categoryLabel}`,
      subtitle: `Selección comercial de productos de la categoría ${selection.categoryLabel} para pedidos mayoristas.`,
      segmentLabel: selection.categoryLabel,
      segmentType: "category" as const,
    };
  }

  return {
    title: "Catálogo Mayorista",
    subtitle:
      "Productos seleccionados para emprendedores, tiendas y ventas por campaña.",
    segmentLabel: "General",
    segmentType: "general" as const,
  };
};

export const buildCatalogPdfDates = (
  generatedDate: Date,
  validityDays: number,
) => ({
  generatedAt: formatDate(generatedDate, true),
  validUntil: formatDate(addDays(generatedDate, validityDays)),
});

export const useCatalogPdfPageModel = (validityDays: number) => {
  const [searchParams] = useSearchParams();
  const linkContract = useMemo(
    () => parseCatalogPdfLink(searchParams),
    [searchParams],
  );
  const categoryId = linkContract.ok
    ? linkContract.contract.categoryId ?? ""
    : INVALID_PDF_LINK;
  const campaignId = linkContract.ok
    ? linkContract.contract.campaignId ?? ""
    : INVALID_PDF_LINK;

  const { data, isLoading, isFullCatalogLoaded } =
    useCatalogData("todas");
  const { campaigns, isLoading: isCampaignRegistryLoading } =
    useCatalogCampaigns({ includeInactive: true });
  const generatedDate = useMemo(() => new Date(), []);
  const dates = useMemo(
    () => buildCatalogPdfDates(generatedDate, validityDays),
    [generatedDate, validityDays],
  );
  const selection = useMemo(
    () =>
      resolveCatalogSelection({
        products: data,
        categories: CATEGORY_CONFIG,
        campaigns,
        categoryId,
        campaignId,
      }),
    [data, campaigns, categoryId, campaignId],
  );
  const copy = useMemo(
    () => buildCatalogPdfCopy(selection),
    [selection],
  );
  const products = useMemo(
    () => mapProductsToPdfProducts(selection.products),
    [selection.products],
  );
  const categorySections = useMemo(
    () => buildPdfCategorySections(products),
    [products],
  );
  const selectionIsReady =
    isFullCatalogLoaded &&
    (!campaignId || !isCampaignRegistryLoading);
  const hasProducts = products.length > 0;

  return {
    ...dates,
    copy,
    products,
    categorySections,
    selectionIsReady,
    hasProducts,
    showCategorySections: !selection.hasCategory,
    showLoadingState:
      !hasProducts && (isLoading || !selectionIsReady),
    showEmptyState:
      !hasProducts && !isLoading && selectionIsReady,
  };
};
