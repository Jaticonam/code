import type { PdfProduct } from "../../types/PdfProduct";
import { PDF_PRODUCT_PLACEHOLDER_IMAGE } from "../../mappers/PdfProductMapper";

import "./CatalogPdfCard.css";

interface CatalogPdfCardProps {
  product: PdfProduct;
}

type TierKind = "price3" | "price12" | "price50" | "price100";

type TierPrice = {
  kind: TierKind;
  label: string;
  shortLabel: string;
  value?: number | null;
};

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

const getTierPrices = (product: PdfProduct): TierPrice[] =>
  [
    {
      kind: "price3",
      label: "3 unidades",
      shortLabel: "3u",
      value: product.price3,
    },
    {
      kind: "price12",
      label: "Docena",
      shortLabel: "Dz",
      value: product.price12,
    },
    {
      kind: "price50",
      label: "50 unidades",
      shortLabel: "50u",
      value: product.price50,
    },
    {
      kind: "price100",
      label: "100 unidades",
      shortLabel: "100u",
      value: product.price100,
    },
  ].filter((tier) => Number(tier.value || 0) > 0);

export default function CatalogPdfCard({ product }: CatalogPdfCardProps) {
  const tierPrices = getTierPrices(product);

  const hasOffer =
    Number(product.offerPrice || 0) > 0 &&
    Number(product.offerPrice || 0) < Number(product.price1 || 0);

  return (
    <article className="catalog-pdf-card">
      <div className="catalog-pdf-card__media">
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
          <span className="catalog-pdf-card__offerBadge">Oferta</span>
        ) : null}
      </div>

      <div className="catalog-pdf-card__content">
        <div className="catalog-pdf-card__meta">
          <span className="catalog-pdf-card__code">{product.id}</span>
          <span className="catalog-pdf-card__category">
            {formatCategory(product.category)}
          </span>
        </div>

        <h2 className="catalog-pdf-card__title">{product.title}</h2>

        <div className="catalog-pdf-card__pricePanel">
          <span className="catalog-pdf-card__priceLabel">
            Precio principal
          </span>

          <div className="catalog-pdf-card__priceRow">
            <strong className="catalog-pdf-card__price">
              {formatMoney(product.primaryPrice)}
            </strong>

            {hasOffer ? (
              <span className="catalog-pdf-card__oldPrice">
                Antes {formatMoney(product.price1)}
              </span>
            ) : null}
          </div>
        </div>

        {tierPrices.length > 0 ? (
          <div
            className="catalog-pdf-card__tiers"
            aria-label="Precios mayoristas"
          >
            {tierPrices.map((tier) => (
              <div
                className={`catalog-pdf-card__tier catalog-pdf-card__tier--${tier.kind}`}
                key={tier.kind}
              >
                <span className="catalog-pdf-card__tierLabel">
                  {tier.shortLabel}
                </span>
                <strong className="catalog-pdf-card__tierPrice">
                  {formatMoney(tier.value)}
                </strong>
              </div>
            ))}
          </div>
        ) : (
          <p className="catalog-pdf-card__noTiers">
            Precio mayorista sujeto a confirmación
          </p>
        )}

        <p className="catalog-pdf-card__stock">{product.stockLabel}</p>
      </div>
    </article>
  );
}
