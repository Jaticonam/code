import type { Product } from "@/types/product";
import { searchProducts } from "@/lib/search";
import { sortByCommercialPriority } from "@/lib/sort";

export function filterCategoryProducts(
  products: Product[],
  activeCategory: string,
  searchTerm: string
) {
  const categoryProducts =
    activeCategory === "todas"
      ? products
      : products.filter((product) => product.category === activeCategory);

  const term = searchTerm.trim();

  if (!term) {
    return {
      categoryProducts,
      filteredProducts: sortByCommercialPriority(categoryProducts),
    };
  }

  const insideCategory = searchProducts(categoryProducts, term);

  if (insideCategory.length > 0) {
    return {
      categoryProducts,
      filteredProducts: sortByCommercialPriority(insideCategory),
    };
  }

  return {
    categoryProducts,
    filteredProducts: sortByCommercialPriority(searchProducts(products, term)),
  };
}
