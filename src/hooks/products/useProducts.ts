import { useQuery } from "@tanstack/react-query";

import { fetchProducts } from "@/lib/products";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],

    queryFn: fetchProducts,

    staleTime: 1000 * 60 * 5,

    gcTime: 1000 * 60 * 30,
  });
}
