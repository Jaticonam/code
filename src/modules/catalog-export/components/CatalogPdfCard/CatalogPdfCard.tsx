import type { PdfProduct } from "../../types/PdfProduct";
import { PDF_PRODUCT_PLACEHOLDER_IMAGE } from "../../mappers/PdfProductMapper";

import "./CatalogPdfCard.css";

interface CatalogPdfCardProps {
  product: PdfProduct;
}

const moneyFormatter = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

const formatMoney = (value?: number | null) => {
  const amount = Number(value || 0);

  if (amount <= 0) {
    return "Consultar";
  }

  return moneyFormatter.format(amount);
};

const formatCategory = (category: string) =>
  category.replace(/-/g, " ").replace(/\s+/g, " ").trim();

export default function CatalogPdfCard({ product }: CatalogPdfCardProps) {
  const tierPrices = [
    { label: "Unidad", value: product.price1 },
    { label: "3 und.", value: product.price3 },
    { label: "Docena", value: product.price12 },
    { label: "50 und.", value: product.price50 },
    { label: "100 und.", value: product.price100 },
  ].filter((tier) => Number(tier.value || 0) > 0);

  const hasOffer =
    Number(product.offerPrice || 0) > 0 &&
    Number(product.offerPrice || 0) < Number(product.price1 || 0);

  return (
    <article className="catalog-pdf-card">
      <div className="catalog-pdf-card__imageWrap">
        <img
          className="catalog-pdf-card__image"
          src={product.image}
          alt={product.title}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = PDF_PRODUCT_PLACEHOLDER_IMAGE;
          }}
        />

        {hasOffer ? (
          <span className="catalog-pdf-card__badge">Oferta</span>
        ) : null}
      </div>

      <div className="catalog-pdf-card__body">
        <div className="catalog-pdf-card__topline">
          <span className="catalog-pdf-card__code">{product.id}</span>
          <span className="catalog-pdf-card__category">
            {formatCategory(product.category)}
          </span>
        </div>

        <h2 className="catalog-pdf-card__title">{product.title}</h2>

        <div className="catalog-pdf-card__priceBlock">
          <span className="catalog-pdf-card__priceLabel">Precio principal</span>
          <strong className="catalog-pdf-card__price">
            {formatMoney(product.primaryPrice)}
          </strong>
        </div>

        {tierPrices.length > 0 ? (
          <dl className="catalog-pdf-card__tiers">
            {tierPrices.map((tier) => (
              <div className="catalog-pdf-card__tier" key={tier.label}>
                <dt>{tier.label}</dt>
                <dd>{formatMoney(tier.value)}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <p className="catalog-pdf-card__stock">{product.stockLabel}</p>
      </div>
    </article>
  );
}
