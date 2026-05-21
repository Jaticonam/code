import { useEffect, useState } from "react";
import type { Product } from "@/types/product";
import { fetchProducts } from "@/lib/products";

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
