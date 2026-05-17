import { useEffect, useState, useCallback } from "react";

import { Product } from "@/types/product";
import { fetchProducts } from "@/lib/products";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);

      const data = await fetchProducts();

      setProducts(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    loading,
    reloadProducts: loadProducts,
  };
}
