import { useMemo } from "react";

import { useCatalogData } from "@/modules/catalog/hooks/useCatalogData";
import { mapProductsToPdfProducts } from "../../mappers/PdfProductMapper";
import CatalogPdfHeader from "../CatalogPdfHeader/CatalogPdfHeader";
import CatalogPdfGrid from "../CatalogPdfGrid/CatalogPdfGrid";

import "./CatalogPdfPage.css";

const formatGeneratedDate = () =>
  new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

export default function CatalogPdfPage() {
  const { data, isLoading, isFullCatalogLoaded } = useCatalogData("todas");

  const products = useMemo(() => mapProductsToPdfProducts(data), [data]);

  const generatedAt = useMemo(() => formatGeneratedDate(), []);

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
          generatedAt={generatedAt}
          productCount={products.length}
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
            Precios, stock y disponibilidad sujetos a confirmación por asesora
            comercial.
          </p>
          <p>Wooly Imports · Catálogo mayorista para emprendedores</p>
        </footer>
      </article>
    </main>
  );
}
