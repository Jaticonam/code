import type { Product } from "@/shared/types/product";
import type { PdfProduct } from "../types/PdfProduct";

export const PDF_PRODUCT_PLACEHOLDER_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
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

const cleanText = (value?: string | null, fallback = "") =>
  String(value || fallback)
    .replace(/\s+/g, " ")
    .trim();

const normalizeStatus = (status?: string) => cleanText(status).toLowerCase();

const isHiddenProduct = (product: Product) =>
  normalizeStatus(product.status) === "oculto";

const getMainImage = (product: Product) => {
  const image = cleanText(product.img);
  return image || PDF_PRODUCT_PLACEHOLDER_IMAGE;
};

const getPrimaryPrice = (product: Product) => {
  const offerPrice = Number(product.price_offer || 0);
  const basePrice = Number(product.price_1 || 0);

  return offerPrice > 0 ? offerPrice : basePrice;
};

const getStockLabel = (product: Product) => {
  const status = normalizeStatus(product.status);

  if (status === "agotado") {
    return "Agotado";
  }

  if (typeof product.stock !== "number") {
    return "Consultar stock";
  }

  if (product.stock <= 0) {
    return "Consultar stock";
  }

  return `Stock: ${product.stock} und.`;
};

export const mapProductToPdfProduct = (product: Product): PdfProduct => ({
  id: cleanText(product.id),
  title: cleanText(product.title, "Producto Wooly"),
  category: cleanText(product.category, "Sin categoría"),
  image: getMainImage(product),

  price1: Number(product.price_1 || 0),
  price3: product.price_3,
  price12: product.price_12,
  price50: product.price_50,
  price100: product.price_100,
  offerPrice: product.price_offer,

  primaryPrice: getPrimaryPrice(product),
  stock: product.stock,
  stockLabel: getStockLabel(product),

  status: product.status,
  priority: Number(product.priority || 0),
});

export const mapProductsToPdfProducts = (products: Product[]) =>
  products
    .filter((product) => !isHiddenProduct(product))
    .map(mapProductToPdfProduct)
    .sort((a, b) => b.priority - a.priority);
