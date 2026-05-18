import { useMemo } from "react";

import type { Product } from "@/types/product";

interface UseFilteredProductsParams {
  products: Product[];
  activeCategory?: string;
  searchQuery?: string;
}

function normalize(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

export function useFilteredProducts({
  products,
  activeCategory = "todas",
  searchQuery = "",
}: UseFilteredProductsParams) {
  return useMemo(() => {
    const category = normalize(activeCategory);
    const query = normalize(searchQuery);

    return products.filter((product) => {
      const productCategory = normalize(product.category);

      const matchesCategory =
        category === "todas" ||
        category === "todos" ||
        productCategory === category;

      const searchableText = [
        product.title,
        product.description,
        product.category,
        product.id,
      ]
        .map(normalize)
        .join(" ");

      const matchesSearch =
        !query || searchableText.includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);
}
