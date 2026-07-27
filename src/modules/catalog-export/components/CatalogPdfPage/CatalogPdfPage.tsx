import {
  useMemo,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import {
  resolveCatalogSelection,
  type CatalogSelectionResult,
} from "@/modules/catalog/domain/CatalogSelection";

import {
  useCatalogCampaigns,
} from "@/modules/catalog/hooks/useCatalogCampaigns";

import {
  useCatalogData,
} from "@/modules/catalog/hooks/useCatalogData";

import {
  CATEGORY_CONFIG,
} from "@/shared/config/categories";
import {
  getApplicationConfig,
} from "@/shared/config/application";
import {
  formatWhatsAppPhone,
} from "@/modules/product-detail/utils/WhatsAppLink";
import {
  parseCatalogPdfLink,
} from "@/modules/catalog-tools/services/CatalogPdfLinkContract";

import {
  mapProductsToPdfProducts,
} from "../../mappers/PdfProductMapper";

import {
  buildPdfCategorySections,
} from "../../services/BuildPdfCategorySections";

import CatalogPdfHeader from "../CatalogPdfHeader/CatalogPdfHeader";
import CatalogPdfGrid from "../CatalogPdfGrid/CatalogPdfGrid";
import CatalogPdfCategorySection from "../CatalogPdfCategorySection/CatalogPdfCategorySection";

import "./CatalogPdfPage.css";

/* =========================================================
   CONFIGURACIÓN COMERCIAL
   ========================================================= */

/* =========================================================
   FECHAS
   ========================================================= */

const formatDate = (
  date: Date,
  includeTime = false,
) =>
  new Intl.DateTimeFormat(
    "es-PE",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      ...(includeTime
        ? {
            hour: "2-digit",
            minute: "2-digit",
          }
        : {}),
    },
  ).format(date);

const addDays = (
  date: Date,
  days: number,
) => {
  const nextDate =
    new Date(date);

  nextDate.setDate(
    nextDate.getDate() + days,
  );

  return nextDate;
};

/* =========================================================
   COPY COMERCIAL
   ========================================================= */

const buildCatalogPdfCopy = (
  selection: CatalogSelectionResult,
) => {
  if (selection.isCombination) {
    return {
      title:
        `Catálogo Mayorista · ${selection.categoryLabel} + ${selection.campaignLabel}`,

      subtitle:
        `Selección comercial de ${selection.categoryLabel} para la campaña ${selection.campaignLabel}. Precios y productos sujetos a disponibilidad.`,

      segmentLabel:
        `${selection.categoryLabel} · ${selection.campaignLabel}`,

      segmentType:
        "combination" as const,
    };
  }

  if (selection.hasCampaign) {
    return {
      title:
        `Catálogo Mayorista · ${selection.campaignLabel}`,

      subtitle:
        `Productos seleccionados para la campaña ${selection.campaignLabel}. Precios y productos sujetos a disponibilidad.`,

      segmentLabel:
        selection.campaignLabel,

      segmentType:
        "campaign" as const,
    };
  }

  if (selection.hasCategory) {
    return {
      title:
        `Catálogo Mayorista · ${selection.categoryLabel}`,

      subtitle:
        `Selección comercial de productos de la categoría ${selection.categoryLabel} para pedidos mayoristas.`,

      segmentLabel:
        selection.categoryLabel,

      segmentType:
        "category" as const,
    };
  }

  return {
    title:
      "Catálogo Mayorista",

    subtitle:
      "Productos seleccionados para emprendedores, tiendas y ventas por campaña.",

    segmentLabel:
      "General",

    segmentType:
      "general" as const,
  };
};

/* =========================================================
   COMPONENTE
   ========================================================= */

const applicationConfig =
  getApplicationConfig();

export default function CatalogPdfPage() {
  const [
    searchParams,
  ] = useSearchParams();

  const linkContract = useMemo(
    () => parseCatalogPdfLink(searchParams),
    [searchParams],
  );
  const categoryId = linkContract.ok
    ? linkContract.contract.categoryId ?? ""
    : "__invalid_pdf_link__";
  const campaignId = linkContract.ok
    ? linkContract.contract.campaignId ?? ""
    : "__invalid_pdf_link__";

  const {
    data,
    isLoading,
    isFullCatalogLoaded,
  } = useCatalogData(
    "todas",
  );

  const {
    campaigns,
    isLoading:
      isCampaignRegistryLoading,
  } = useCatalogCampaigns({
    includeInactive: true,
  });

  const generatedDate =
    useMemo(
      () => new Date(),
      [],
    );

  const validUntilDate =
    useMemo(
      () =>
        addDays(
          generatedDate,
          applicationConfig.commerce.pdfValidityDays,
        ),
      [generatedDate],
    );

  const generatedAt =
    useMemo(
      () =>
        formatDate(
          generatedDate,
          true,
        ),
      [generatedDate],
    );

  const validUntil =
    useMemo(
      () =>
        formatDate(
          validUntilDate,
        ),
      [validUntilDate],
    );

  const selection =
    useMemo(
      () =>
        resolveCatalogSelection({
          products: data,
          categories:
            CATEGORY_CONFIG,
          campaigns,
          categoryId,
          campaignId,
        }),
      [
        data,
        campaigns,
        categoryId,
        campaignId,
      ],
    );

  const copy =
    useMemo(
      () =>
        buildCatalogPdfCopy(
          selection,
        ),
      [selection],
    );

  const products =
    useMemo(
      () =>
        mapProductsToPdfProducts(
          selection.products,
        ),
      [selection.products],
    );

  const categorySections =
    useMemo(
      () =>
        buildPdfCategorySections(
          products,
        ),
      [products],
    );

  const showCategorySections =
    !selection.hasCategory;

  const selectionIsReady =
    isFullCatalogLoaded &&
    (
      !campaignId ||
      !isCampaignRegistryLoading
    );

  const hasProducts =
    products.length > 0;

  const showLoadingState =
    !hasProducts &&
    (
      isLoading ||
      !selectionIsReady
    );

  const showEmptyState =
    !hasProducts &&
    !isLoading &&
    selectionIsReady;

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="catalog-pdf-page">
      <section className="catalog-pdf-toolbar no-print">
        <div>
          <p className="catalog-pdf-toolbar__eyebrow">
            PDF MVP
          </p>

          <h1 className="catalog-pdf-toolbar__title">
            Catálogo mayorista imprimible
          </h1>

          <p className="catalog-pdf-toolbar__description">
            Vista optimizada para guardar como PDF
            desde el navegador.
          </p>

          {!selectionIsReady ? (
            <p className="catalog-pdf-toolbar__warning">
              El catálogo o el registro de campañas
              todavía está cargando. Espera unos
              segundos antes de exportar para evitar
              un PDF incompleto.
            </p>
          ) : null}
        </div>

        <div className="catalog-pdf-toolbar__actions">
          <a
            className="catalog-pdf-toolbar__link"
            href="/catalogo"
          >
            Volver al catálogo
          </a>

          <button
            className="catalog-pdf-toolbar__button"
            type="button"
            onClick={handlePrint}
            disabled={
              !hasProducts ||
              !selectionIsReady
            }
          >
            Exportar PDF
          </button>
        </div>
      </section>

      <article className="catalog-pdf-sheet">
        <CatalogPdfHeader
          logoSrc={applicationConfig.assets.pdfLogoUrl}
          title={copy.title}
          subtitle={copy.subtitle}
          segmentLabel={copy.segmentLabel}
          segmentType={copy.segmentType}
          generatedAt={generatedAt}
          validUntil={validUntil}
          productCount={products.length}
          contactNumber={formatWhatsAppPhone(
            applicationConfig.contact.whatsappNumber,
          )}
          isComplete={selectionIsReady}
        />

        {showLoadingState ? (
          <section className="catalog-pdf-state">
            <h2>Cargando catálogo...</h2>

            <p>
              Estamos preparando la selección completa
              para el PDF.
            </p>
          </section>
        ) : null}

        {showEmptyState ? (
          <section className="catalog-pdf-state">
            <h2>No hay productos disponibles</h2>

            <p>
              Revisa la categoría, la campaña o sus
              estados de publicación.
            </p>
          </section>
        ) : null}

        {hasProducts ? (
          showCategorySections ? (
            <div className="catalog-pdf-categorySections">
              {categorySections.map(
                (section) => (
                  <CatalogPdfCategorySection
                    key={section.id}
                    section={section}
                  />
                ),
              )}
            </div>
          ) : (
            <CatalogPdfGrid
              products={products}
            />
          )
        ) : null}

        <footer className="catalog-pdf-footer">
          <p>
            Precios, productos y stock sujetos a
            confirmación por asesora comercial.
          </p>

          <p>
            {applicationConfig.app.name} · Catálogo
            mayorista para emprendedores
          </p>
        </footer>
      </article>
    </main>
  );
}
