import {
  isProductPublicationDataValid,
  resolveProductCommercialPolicy,
} from "@/modules/catalog/domain/ProductCommercialPolicy";

import type {
  Product,
} from "@/shared/types/product";

import {
  PDF_IMAGE_MANIFEST,
} from "../data/PdfImageManifest";

import type {
  PdfProduct,
  PdfProductPresentation,
} from "../types/PdfProduct";

export const PDF_PRODUCT_PLACEHOLDER_IMAGE =
  `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <rect width="600" height="600" rx="48" fill="#f8fafc"/>
  <rect x="110" y="145" width="380" height="270" rx="28" fill="#e2e8f0"/>
  <circle cx="235" cy="245" r="45" fill="#cbd5e1"/>
  <path d="M145 380l105-110 78 78 54-58 73 90H145z" fill="#cbd5e1"/>
  <text x="300" y="475" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#64748b">
    Wooly Imports
  </text>
</svg>
`)}`;

const PDF_DESCRIPTION_MAX_LENGTH =
  190;

const cleanText = (
  value?:
    string |
    null,
  fallback = "",
) =>
  String(
    value ||
    fallback,
  )
    .replace(
      /\s+/g,
      " ",
    )
    .trim();

const getMainImage = (
  product:
    Product,
) => {
  const productId =
    cleanText(
      product.id,
    );

  const optimizedPdfImage =
    cleanText(
      PDF_IMAGE_MANIFEST[
        productId
      ],
    );

  const catalogImage =
    cleanText(
      product.img,
    );

  return (
    optimizedPdfImage ||
    catalogImage ||
    PDF_PRODUCT_PLACEHOLDER_IMAGE
  );
};

const getShortDescription = (
  product:
    Product,
) => {
  const description =
    cleanText(
      product.description,
    );

  if (!description) {
    return "";
  }

  if (
    description.length <=
    PDF_DESCRIPTION_MAX_LENGTH
  ) {
    return description;
  }

  return `${description
    .slice(
      0,
      PDF_DESCRIPTION_MAX_LENGTH -
        3,
    )
    .trim()}...`;
};

const getPresentation = (
  status:
    string,
): PdfProductPresentation => {
  if (
    status === "preventa"
  ) {
    return "preventa";
  }

  if (
    status === "agotado"
  ) {
    return "agotado";
  }

  return "published";
};

const getPrimaryPrice = (
  product:
    Product,
  showPricing:
    boolean,
): number => {
  if (!showPricing) {
    return 0;
  }

  const offerPrice =
    Number(
      product.price_offer ||
      0,
    );

  const basePrice =
    Number(
      product.price_1 ||
      0,
    );

  return offerPrice > 0
    ? offerPrice
    : basePrice;
};

export const mapProductToPdfProduct = (
  product:
    Product,
): PdfProduct => {
  const policy =
    resolveProductCommercialPolicy(
      product,
    );

  const status =
    policy.status === "invalid"
      ? ""
      : policy.status;

  const isPreventa =
    status === "preventa";

  const isAgotado =
    status === "agotado";

  const showWholesalePricing =
    policy.isPurchasable;

  return {
    id:
      cleanText(
        product.id,
      ),

    title:
      cleanText(
        product.title,
        "Producto Wooly",
      ),

    description:
      getShortDescription(
        product,
      ),

    category:
      cleanText(
        product.category,
        "Sin categoría",
      ),

    image:
      getMainImage(
        product,
      ),

    /*
     * Los datos confidenciales de preventa se neutralizan
     * en el DTO. No basta con esconderlos mediante CSS.
     */
    price1:
      policy.canShowPricing
        ? Number(
            product.price_1 ||
            0,
          )
        : 0,

    price3:
      showWholesalePricing
        ? product.price_3
        : null,

    price12:
      showWholesalePricing
        ? product.price_12
        : null,

    price50:
      showWholesalePricing
        ? product.price_50
        : null,

    price100:
      showWholesalePricing
        ? product.price_100
        : null,

    offerPrice:
      policy.canShowPricing
        ? product.price_offer
        : null,

    primaryPrice:
      getPrimaryPrice(
        product,
        policy.canShowPricing,
      ),

    stock:
      policy.canShowInventoryQuantity
        ? product.stock
        : null,

    stockLabel:
      isPreventa
        ? "Preventa · Consultar"
        : isAgotado
          ? "Agotado"
          : typeof product.stock ===
                "number"
            ? `Stock: ${product.stock} und.`
            : "Disponible",

    presentation:
      getPresentation(
        status,
      ),

    showPricing:
      policy.canShowPricing,

    showWholesalePricing,

    status:
      status || undefined,

    priority:
      Number(
        product.priority ||
        0,
      ),
  };
};

export const mapProductsToPdfProducts = (
  products:
    Product[],
): PdfProduct[] =>
  products
    .filter(
      isProductPublicationDataValid,
    )
    .map(
      mapProductToPdfProduct,
    );
