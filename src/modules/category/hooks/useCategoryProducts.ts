import { useEffect, useState } from "react";
import type { Product } from "@/shared/types/product";
import { fetchProducts } from "@/modules/catalog/utils/products";

export function useCategoryProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then((items) => {
      setProducts(items);
      setLoading(false);
    });
  }, []);

  return {
    products,
    loading,
  };
}
