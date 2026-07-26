import type { FeedProduct, MetaFeedItem } from "../../types/feed";

const SITE = "https://www.woolyimports.com";

const clean = (v?: string) => String(v || "").replace(/\s+/g, " ").trim();
const money = (p?: number | null) => `${Number(p || 0).toFixed(2)} PEN`;

const availability = (p: FeedProduct) => {
  const status = clean(p.status).toLowerCase();
  if (status === "agotado" || status === "oculto") return "out of stock";
  return Number(p.stock || 0) > 0 ? "in stock" : "out of stock";
};

const imageUrl = (p: FeedProduct) => {
  const src = clean(p.img);
  if (src.startsWith("http")) return src;
  return `${SITE}${src.startsWith("/") ? src : `/${src}`}`;
};

const productLink = (p: FeedProduct) =>
  `${SITE}/catalogo/producto.html?id=${encodeURIComponent(p.id)}`;

const categoryMap: Record<string, string> = {
  flores: "Home & Garden > Decor",
  peluches: "Toys & Games > Toys > Dolls, Playsets & Toy Figures",
  papeles: "Arts & Entertainment > Party & Celebration",
  cajas: "Arts & Entertainment > Gift Giving",
  cintas: "Arts & Entertainment > Crafts & Hobbies",
  globos: "Arts & Entertainment > Party & Celebration",
  accesorios: "Arts & Entertainment > Party & Celebration",
  hotwheels: "Toys & Games > Toys > Toy Vehicles",
};

export const mapProductToMeta = (p: FeedProduct): MetaFeedItem => ({
  id: p.id,
  title: clean(p.title).slice(0, 150),
  description: clean(p.description || p.title || "Producto mayorista Wooly Imports").slice(0, 5000),
  availability: availability(p),
  condition: "new",
  price: money(p.price_offer || p.price_1),
  link: productLink(p),
  image_link: imageUrl(p),
  brand: "Wooly Imports",
  google_product_category: categoryMap[clean(p.category).toLowerCase()] || "Arts & Entertainment > Party & Celebration",
});
