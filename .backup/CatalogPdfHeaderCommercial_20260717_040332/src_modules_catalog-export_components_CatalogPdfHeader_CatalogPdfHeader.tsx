import "./CatalogPdfHeader.css";

interface CatalogPdfHeaderProps {
  generatedAt: string;
  productCount: number;
  isComplete: boolean;
}

export default function CatalogPdfHeader({
  generatedAt,
  productCount,
  isComplete,
}: CatalogPdfHeaderProps) {
  return (
    <header className="catalog-pdf-header">
      <div className="catalog-pdf-header__brand">
        <p className="catalog-pdf-header__eyebrow">Wooly Imports</p>
        <h1 className="catalog-pdf-header__title">Catálogo Mayorista</h1>
        <p className="catalog-pdf-header__subtitle">
          Productos seleccionados para emprendedores, tiendas y ventas por
          campaña.
        </p>
      </div>

      <aside className="catalog-pdf-header__meta">
        <span className="catalog-pdf-header__pill">
          {productCount} productos
        </span>
        <span className="catalog-pdf-header__pill">
          {isComplete ? "Catálogo completo" : "Cargando categorías"}
        </span>
        <span className="catalog-pdf-header__date">
          Generado: {generatedAt}
        </span>
      </aside>
    </header>
  );
}
