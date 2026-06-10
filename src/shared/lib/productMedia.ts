import type { Product } from "@/shared/types/product";

export type ProductMediaType = "image" | "video";

export interface ProductMedia {
  id: string;
  type: ProductMediaType;
  src: string;
  thumb?: string;
  alt: string;
  order: number;
}

const cleanMediaUrl = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

export function getProductMedia(product: Product): ProductMedia[] {
  const galleryImages = cleanMediaUrl(product.gallery)
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);

  const rawImages = [product.img, ...galleryImages]
    .map(cleanMediaUrl)
    .filter(Boolean);

  const uniqueImages = Array.from(new Set(rawImages));

  const media = uniqueImages.map((src, index) => ({
    id: `${product.id}-image-${index + 1}`,
    type: "image" as const,
    src,
    thumb: src,
    alt:
      index === 0
        ? `${product.title} imagen principal`
        : `${product.title} imagen ${index + 1}`,
    order: index + 1,
  }));

  return media.length
    ? media
    : [
        {
          id: `${product.id}-placeholder`,
          type: "image",
          src: "/placeholder.svg",
          thumb: "/placeholder.svg",
          alt: product.title,
          order: 1,
        },
      ];
}
