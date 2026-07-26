import {
  Link,
} from "react-router-dom";

import {
  ArrowRight,
} from "lucide-react";

import {
  resolveProductCommercialPolicy,
} from "@/modules/catalog/domain/ProductCommercialPolicy";

import type {
  Product,
} from "@/shared/types/product";

const BADGE_ICONS:
  Record<
    string,
    string
  > = {
  "san valentin":
    "❤️",

  "día madre":
    "🌷",

  "dia madre":
    "🌷",

  "día padre":
    "👨",

  "dia padre":
    "👨",

  "hot wheels":
    "🏎️",
};

const formatBadge = (
  value?:
    string,
) => {
  if (!value) {
    return "💡 Oportunidad";
  }

  const normalized =
    value
      .replace(
        /-/g,
        " ",
      )
      .toLowerCase();

  const text =
    normalized.replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );

  return `${
    BADGE_ICONS[
      normalized
    ] ||
    "💡"
  } ${text}`;
};

const TIERS = [
  {
    key:
      "price_3",

    label:
      "Mayor",

    qty:
      "3u",

    icon:
      "🔥",
  },
  {
    key:
      "price_12",

    label:
      "Docena",

    qty:
      "12u",

    icon:
      "⚡",
  },
  {
    key:
      "price_50",

    label:
      "Medio ciento",

    qty:
      "50u",

    icon:
      "🚀",
  },
  {
    key:
      "price_100",

    label:
      "Caja",

    qty:
      "100u",

    icon:
      "💎",
  },
] as const;

export default function BlogCatalogProductCard({
  product,
}: {
  product:
    Product;
}) {
  const policy =
    resolveProductCommercialPolicy(
      product,
    );

  if (
    !policy.isPubliclyVisible
  ) {
    return null;
  }

  const isPreventa =
    policy.status ===
    "preventa";

  const isAgotado =
    policy.status ===
    "agotado";

  const campaign =
    isPreventa
      ? "◷ Preventa"
      : isAgotado
        ? "✕ Agotado"
        : formatBadge(
            product
              .campaigns?.[0] ||
            product
              .badges?.[0],
          );

  const tiers =
    policy.isPurchasable
      ? TIERS.filter(
          (tier) =>
            Number(
              product[
                tier.key
              ] ||
              0,
            ) > 0,
        )
      : [];

  const ctaLabel =
    isPreventa
      ? "Consultar preventa"
      : isAgotado
        ? "Consultar reposición"
        : "Ver oportunidad";

  return (
    <Link
      to={`/catalogo/producto.html?id=${product.id}&cat=${product.category}`}
      className="hub-card blog-catalog-product-card"
    >
      <div className="blog-catalog-product-image">
        <img
          src={
            product.img ||
            "/placeholder.svg"
          }
          alt={
            product.title
          }
          loading="lazy"
        />

        <span>
          {campaign}
        </span>
      </div>

      <div className="blog-catalog-product-body">
        <div className="blog-catalog-product-meta">
          <small>
            {product.id}
          </small>

          <small>
            {product.category}
          </small>
        </div>

        <h3>
          {product.title}
        </h3>

        <p>
          {
            product.description
          }
        </p>

        {policy.canShowPricing ? (
          <div className="blog-catalog-product-price">
            <small>
              Precio base
            </small>

            <strong>
              S/{" "}
              {Number(
                product.price_1,
              ).toFixed(2)}
            </strong>
          </div>
        ) : (
          <div className="blog-catalog-product-price">
            <small>
              Información comercial
            </small>

            <strong>
              Consultar
            </strong>
          </div>
        )}

        {tiers.length > 0 && (
          <div className="blog-catalog-product-tiers">
            <b>
              📦 Precios mayoristas
            </b>

            {tiers.map(
              (tier) => (
                <span
                  key={
                    tier.key
                  }
                >
                  <em>
                    {
                      tier.icon
                    }{" "}
                    {
                      tier.label
                    }{" "}
                    (
                    {
                      tier.qty
                    })
                  </em>

                  <strong>
                    S/
                    {Number(
                      product[
                        tier.key
                      ],
                    ).toFixed(
                      2,
                    )}
                  </strong>
                </span>
              ),
            )}
          </div>
        )}

        <b className="blog-catalog-product-cta">
          {ctaLabel}{" "}
          <ArrowRight
            size={15}
          />
        </b>
      </div>
    </Link>
  );
}
