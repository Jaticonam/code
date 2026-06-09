import type { Product } from "@/shared/types/product";
import type { QualityIssue } from "../models";
import type { QualityRule } from "../contracts/QualityRule";

const isValidImage = (url: string) =>
  /^https?:\/\/.+\.(jpg|jpeg|png|webp)(\?.*)?$/i.test(url) || url.includes("dl.dropboxusercontent.com");

export const ImageRule: QualityRule<Product> = {
  key: "image",
  name: "Imagen principal",
  description: "Valida que el producto tenga una imagen principal pública y compatible.",
  category: "media",
  weight: 20,
  required: true,
  enabled: true,

  validate(product) {
    const issues: QualityIssue[] = [];
    const img = String(product.img || "").trim();

    if (!img) {
      issues.push({ level: "error", code: "IMAGE_EMPTY", field: "img", message: "El producto no tiene imagen principal." });
      return issues;
    }

    if (!img.startsWith("http")) {
      issues.push({ level: "error", code: "IMAGE_NOT_PUBLIC_URL", field: "img", message: "La imagen debe ser una URL pública." });
    }

    if (!isValidImage(img)) {
      issues.push({ level: "warning", code: "IMAGE_FORMAT_REVIEW", field: "img", message: "La imagen no parece tener un formato estándar jpg, png o webp." });
    }

    return issues;
  },
};
