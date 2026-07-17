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
      label: "Por Mayor (3u)",
      shortLabel: "3U",
      value: product.price3,
    },
    {
      kind: "price12",
      label: "Por Docena (12u)",
      shortLabel: "DZ",
      value: product.price12,
    },
    {
      kind: "price50",
      label: "Por 50 und.",
      shortLabel: "50U",
      value: product.price50,
    },
    {
      kind: "price100",
      label: "Por 100 und.",
      shortLabel: "100U",
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
        <div className="catalog-pdf-card__top">
          <div className="catalog-pdf-card__meta">
            <span className="catalog-pdf-card__code">{product.id}</span>
            <span className="catalog-pdf-card__category">
              {formatCategory(product.category)}
            </span>
          </div>

          <h2 className="catalog-pdf-card__title">{product.title}</h2>
        </div>

        <div className="catalog-pdf-card__separator" />

        <div className="catalog-pdf-card__unitSection">
          <span className="catalog-pdf-card__sectionLabel">
            Precio unitario
          </span>

          <div className="catalog-pdf-card__unitPriceRow">
            <span className="catalog-pdf-card__currency">S/</span>
            <strong className="catalog-pdf-card__unitPriceValue">
              {Number(product.primaryPrice || 0).toFixed(2)}
            </strong>
          </div>

          {hasOffer ? (
            <span className="catalog-pdf-card__oldPrice">
              Antes {formatMoney(product.price1)}
            </span>
          ) : null}

          <div className="catalog-pdf-card__stockPill">
            <span className="catalog-pdf-card__stockIcon">✓</span>
            <span>{product.stockLabel}</span>
          </div>
        </div>

        <div className="catalog-pdf-card__separator catalog-pdf-card__separator--dashed" />

        <div className="catalog-pdf-card__wholesaleSection">
          <span className="catalog-pdf-card__sectionLabel">
            Precios mayorista
          </span>

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
                  <span className="catalog-pdf-card__tierText">
                    {tier.label}
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
        </div>
      </div>
    </article>
  );
}
