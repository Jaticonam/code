import "./CatalogPdfHeader.css";

type CatalogPdfSegmentType = "general" | "category" | "campaign";

interface CatalogPdfHeaderProps {
  logoSrc?: string;
  title: string;
  subtitle: string;
  segmentLabel: string;
  segmentType: CatalogPdfSegmentType;
  generatedAt: string;
  validUntil: string;
  productCount: number;
  contactNumber: string;
  isComplete: boolean;
}

const getSegmentLabel = (segmentType: CatalogPdfSegmentType) => {
  if (segmentType === "campaign") return "Campaña";
  if (segmentType === "category") return "Categoría";
  return "Catálogo";
};

export default function CatalogPdfHeader({
  logoSrc,
  title,
  subtitle,
  segmentLabel,
  segmentType,
  generatedAt,
  validUntil,
  productCount,
  contactNumber,
  isComplete,
}: CatalogPdfHeaderProps) {
  return (
    <header className="catalog-pdf-header">
      <div className="catalog-pdf-header__main">
        <div className="catalog-pdf-header__brandRow">
          <div className="catalog-pdf-header__logoMark">
            {logoSrc ? (
              <img
                className="catalog-pdf-header__logoImage"
                src={logoSrc}
                alt="Wooly Imports"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : null}

            <span className="catalog-pdf-header__logoFallback">W</span>
          </div>

          <div className="catalog-pdf-header__brandText">
            <span className="catalog-pdf-header__eyebrow">
              Wooly Imports
            </span>
            <span className="catalog-pdf-header__brandTagline">
              Mayorista para emprendedores
            </span>
          </div>
        </div>

        <div className="catalog-pdf-header__copy">
          <span className="catalog-pdf-header__segment">
            {getSegmentLabel(segmentType)} · {segmentLabel}
          </span>

          <h1 className="catalog-pdf-header__title">{title}</h1>

          <p className="catalog-pdf-header__subtitle">{subtitle}</p>
        </div>
      </div>

      <aside className="catalog-pdf-header__meta">
        <div className="catalog-pdf-header__metaGrid">
          <span className="catalog-pdf-header__pill">
            {productCount} productos
          </span>

          <span className="catalog-pdf-header__pill">
            {isComplete ? "Catálogo listo" : "Cargando categorías"}
          </span>

          <span className="catalog-pdf-header__contact">
            <span>Pedidos y stock</span>
            <strong>{contactNumber}</strong>
          </span>

          <span className="catalog-pdf-header__validity">
            <span>Precios y productos válidos hasta</span>
            <strong>{validUntil}</strong>
          </span>
        </div>

        <span className="catalog-pdf-header__date">
          Generado: {generatedAt}
        </span>
      </aside>
    </header>
  );
}
