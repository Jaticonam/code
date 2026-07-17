import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { useCatalogData } from "@/modules/catalog/hooks/useCatalogData";
import type { Product } from "@/shared/types/product";
import { mapProductsToPdfProducts } from "../../mappers/PdfProductMapper";
import CatalogPdfHeader from "../CatalogPdfHeader/CatalogPdfHeader";
import CatalogPdfGrid from "../CatalogPdfGrid/CatalogPdfGrid";

import "./CatalogPdfPage.css";

/*
  Configuración comercial del PDF.
  Cambia estos valores cuando tengamos el número/logo oficial final.
*/
const PDF_CONTACT_NUMBER = "+51 000 000 000";
const PDF_LOGO_SRC = "/logo.png";
const PDF_VALID_DAYS = 7;

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

const cleanParam = (value: string | null) =>
  String(value || "")
    .trim()
    .toLowerCase();

const normalizeText = (value?: string | null) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const toDisplayLabel = (value: string) => {
  const cleanValue = decodeURIComponent(value || "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleanValue) return "";

  return cleanValue
    .split(" ")
    .map((word) =>
      word.length <= 2
        ? word.toUpperCase()
        : `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`,
    )
    .join(" ");
};

const filterProductsBySegment = (
  products: Product[],
  categoryId: string,
  campaignId: string,
) => {
  const normalizedCategoryId = normalizeText(categoryId);
  const normalizedCampaignId = normalizeText(campaignId);

  if (normalizedCampaignId) {
    return products.filter((product) =>
      product.campaigns?.some(
        (campaign) => normalizeText(campaign) === normalizedCampaignId,
      ),
    );
  }

  if (normalizedCategoryId) {
    return products.filter(
      (product) => normalizeText(product.category) === normalizedCategoryId,
    );
  }

  return products;
};

const buildCatalogPdfCopy = (categoryId: string, campaignId: string) => {
  if (campaignId) {
    const campaignLabel = toDisplayLabel(campaignId);

    return {
      title: `Catálogo Mayorista · ${campaignLabel}`,
      subtitle: `Productos seleccionados para la campaña ${campaignLabel}. Precios y productos sujetos a disponibilidad.`,
      segmentLabel: campaignLabel,
      segmentType: "campaign" as const,
    };
  }

  if (categoryId) {
    const categoryLabel = toDisplayLabel(categoryId);

    return {
      title: `Catálogo Mayorista · ${categoryLabel}`,
      subtitle: `Selección comercial de productos de la categoría ${categoryLabel} para pedidos mayoristas.`,
      segmentLabel: categoryLabel,
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

export default function CatalogPdfPage() {
  const [searchParams] = useSearchParams();

  const categoryId = cleanParam(
    searchParams.get("categoria") ||
      searchParams.get("category") ||
      searchParams.get("cat"),
  );

  const campaignId = cleanParam(
    searchParams.get("campania") ||
      searchParams.get("campaign") ||
      searchParams.get("cpg"),
  );

  const { data, isLoading, isFullCatalogLoaded } = useCatalogData("todas");

  const generatedDate = useMemo(() => new Date(), []);
  const validUntilDate = useMemo(
    () => addDays(generatedDate, PDF_VALID_DAYS),
    [generatedDate],
  );

  const generatedAt = useMemo(
    () => formatDate(generatedDate, true),
    [generatedDate],
  );

  const validUntil = useMemo(
    () => formatDate(validUntilDate),
    [validUntilDate],
  );

  const copy = useMemo(
    () => buildCatalogPdfCopy(categoryId, campaignId),
    [categoryId, campaignId],
  );

  const products = useMemo(() => {
    const filteredProducts = filterProductsBySegment(
      data,
      categoryId,
      campaignId,
    );

    return mapProductsToPdfProducts(filteredProducts);
  }, [data, categoryId, campaignId]);

  const handlePrint = () => {
    window.print();
  };

  const hasProducts = products.length > 0;

  return (
    <main className="catalog-pdf-page">
      <section className="catalog-pdf-toolbar no-print">
        <div>
          <p className="catalog-pdf-toolbar__eyebrow">PDF MVP</p>
          <h1 className="catalog-pdf-toolbar__title">
            Catálogo mayorista imprimible
          </h1>
          <p className="catalog-pdf-toolbar__description">
            Vista optimizada para guardar como PDF desde el navegador.
          </p>

          {!isFullCatalogLoaded && (
            <p className="catalog-pdf-toolbar__warning">
              El catálogo aún está cargando categorías. Espera unos segundos
              antes de exportar para evitar un PDF incompleto.
            </p>
          )}
        </div>

        <div className="catalog-pdf-toolbar__actions">
          <a className="catalog-pdf-toolbar__link" href="/catalogo">
            Volver al catálogo
          </a>

          <button
            className="catalog-pdf-toolbar__button"
            type="button"
            onClick={handlePrint}
            disabled={!hasProducts}
          >
            Exportar PDF
          </button>
        </div>
      </section>

      <article className="catalog-pdf-sheet">
        <CatalogPdfHeader
          logoSrc={PDF_LOGO_SRC}
          title={copy.title}
          subtitle={copy.subtitle}
          segmentLabel={copy.segmentLabel}
          segmentType={copy.segmentType}
          generatedAt={generatedAt}
          validUntil={validUntil}
          productCount={products.length}
          contactNumber={PDF_CONTACT_NUMBER}
          isComplete={isFullCatalogLoaded}
        />

        {isLoading && !hasProducts ? (
          <section className="catalog-pdf-state">
            <h2>Cargando catálogo...</h2>
            <p>Estamos preparando los productos para el PDF.</p>
          </section>
        ) : null}

        {!isLoading && !hasProducts ? (
          <section className="catalog-pdf-state">
            <h2>No hay productos disponibles</h2>
            <p>Revisa la fuente de datos o los estados de publicación.</p>
          </section>
        ) : null}

        {hasProducts ? <CatalogPdfGrid products={products} /> : null}

        <footer className="catalog-pdf-footer">
          <p>
            Precios, productos y stock sujetos a confirmación por asesora
            comercial.
          </p>
          <p>Wooly Imports · Catálogo mayorista para emprendedores</p>
        </footer>
      </article>
    </main>
  );
}
