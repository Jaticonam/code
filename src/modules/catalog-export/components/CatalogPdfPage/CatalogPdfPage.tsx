import {
  getApplicationConfig,
} from "@/shared/config/application";
import {
  formatWhatsAppPhone,
} from "@/modules/product-detail/utils/WhatsAppLink";
import { useCatalogPdfPageModel } from "../../hooks/useCatalogPdfPageModel";

import CatalogPdfHeader from "../CatalogPdfHeader/CatalogPdfHeader";
import CatalogPdfGrid from "../CatalogPdfGrid/CatalogPdfGrid";
import CatalogPdfCategorySection from "../CatalogPdfCategorySection/CatalogPdfCategorySection";

import "./CatalogPdfPage.css";

const applicationConfig =
  getApplicationConfig();

export default function CatalogPdfPage() {
  const {
    generatedAt,
    validUntil,
    copy,
    products,
    categorySections,
    selectionIsReady,
    hasProducts,
    showCategorySections,
    showLoadingState,
    showEmptyState,
  } = useCatalogPdfPageModel(
    applicationConfig.commerce.pdfValidityDays,
  );

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
          <button
            className="catalog-pdf-toolbar__button"
            type="button"
            onClick={handlePrint}
            disabled={!hasProducts || !selectionIsReady}
          >
            Imprimir PDF
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
