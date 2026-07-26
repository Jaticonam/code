import {
  Helmet,
} from "react-helmet-async";

import {
  resolveProductCommercialPolicy,
} from "@/modules/catalog/domain/ProductCommercialPolicy";

import type {
  Product,
} from "@/shared/types/product";

import type {
  ProductSeoData,
} from "@/shared/seo/productSeo";

import {
  getBaseUnitPrice,
} from "@/shared/domain/volumePricing/VolumePricing";

interface Props {
  seo:
    ProductSeoData;

  product?:
    Product |
    null;
}

function buildProductSchema(
  product:
    Product,

  seo:
    ProductSeoData,
) {
  const policy =
    resolveProductCommercialPolicy(
      product,
    );

  if (
    !policy.isPubliclyVisible
  ) {
    return null;
  }

  const productSchema = {
    "@context":
      "https://schema.org",

    "@type":
      "Product",

    name:
      product.title,

    description:
      product.description,

    sku:
      product.id,

    image:
      [
        product.img,
      ],

    category:
      product.category,

    brand: {
      "@type":
        "Brand",

      name:
        "Wooly Import Store",
    },
  };

  /*
   * Preventa Wooly es consulta anticipada, no reserva.
   * Por tanto no se genera Offer ni PreOrder.
   */
  if (
    !policy.canShowPricing
  ) {
    return productSchema;
  }

  return {
    ...productSchema,

    offers: {
      "@type":
        "Offer",

      url:
        seo.canonical,

      priceCurrency:
        "PEN",

      price:
        getBaseUnitPrice(
          product,
        ),

      availability:
        policy.status ===
        "agotado"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",

      itemCondition:
        "https://schema.org/NewCondition",
    },
  };
}

export function ProductSeo({
  seo,
  product,
}: Props) {
  const schema =
    product
      ? buildProductSchema(
          product,
          seo,
        )
      : null;

  return (
    <Helmet>
      <title>
        {seo.title}
      </title>

      <meta
        name="description"
        content={
          seo.description
        }
      />

      <link
        rel="canonical"
        href={
          seo.canonical
        }
      />

      <meta
        property="og:type"
        content="product"
      />

      <meta
        property="og:title"
        content={
          seo.title
        }
      />

      <meta
        property="og:description"
        content={
          seo.description
        }
      />

      <meta
        property="og:url"
        content={
          seo.canonical
        }
      />

      <meta
        property="og:image"
        content={
          seo.image
        }
      />

      <meta
        name="twitter:title"
        content={
          seo.title
        }
      />

      <meta
        name="twitter:description"
        content={
          seo.description
        }
      />

      <meta
        name="twitter:image"
        content={
          seo.image
        }
      />

      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(
            schema,
          )}
        </script>
      )}
    </Helmet>
  );
}
