import {
  resolveProductCommercialPolicy,
} from "@/modules/catalog/domain/ProductCommercialPolicy";

import type {
  FeedProduct,
  MetaFeedItem,
} from "../../types/feed";

const SITE =
  "https://www.woolyimports.com";

const clean = (
  value?:
    string,
) =>
  String(
    value ||
    "",
  )
    .replace(
      /\s+/g,
      " ",
    )
    .trim();

const money = (
  price?:
    number |
    null,
) =>
  `${Number(
    price ||
    0,
  ).toFixed(2)} PEN`;

const availability = (
  product:
    FeedProduct,
) => {
  const policy =
    resolveProductCommercialPolicy(
      product,
    );

  return policy
    .isPurchasable
    ? "in stock"
    : "out of stock";
};

const imageUrl = (
  product:
    FeedProduct,
) => {
  const src =
    clean(
      product.img,
    );

  if (
    src.startsWith(
      "http",
    )
  ) {
    return src;
  }

  return `${SITE}${
    src.startsWith("/")
      ? src
      : `/${src}`
  }`;
};

const productLink = (
  product:
    FeedProduct,
) =>
  `${SITE}/catalogo/producto.html?id=${encodeURIComponent(
    product.id,
  )}`;

const categoryMap:
  Record<
    string,
    string
  > = {
  flores:
    "Home & Garden > Decor",

  peluches:
    "Toys & Games > Toys > Dolls, Playsets & Toy Figures",

  papeles:
    "Arts & Entertainment > Party & Celebration",

  cajas:
    "Arts & Entertainment > Gift Giving",

  cintas:
    "Arts & Entertainment > Crafts & Hobbies",

  globos:
    "Arts & Entertainment > Party & Celebration",

  accesorios:
    "Arts & Entertainment > Party & Celebration",

  hotwheels:
    "Toys & Games > Toys > Toy Vehicles",
};

export const mapProductToMeta = (
  product:
    FeedProduct,
): MetaFeedItem => ({
  id:
    product.id,

  title:
    clean(
      product.title,
    ).slice(
      0,
      150,
    ),

  description:
    clean(
      product.description ||
      product.title ||
      "Producto mayorista Wooly Imports",
    ).slice(
      0,
      5000,
    ),

  availability:
    availability(
      product,
    ),

  condition:
    "new",

  price:
    money(
      product.price_offer ||
      product.price_1,
    ),

  link:
    productLink(
      product,
    ),

  image_link:
    imageUrl(
      product,
    ),

  brand:
    "Wooly Imports",

  google_product_category:
    categoryMap[
      clean(
        product.category,
      ).toLowerCase()
    ] ||
    "Arts & Entertainment > Party & Celebration",
});
