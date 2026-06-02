import { useEffect, useState } from "react";
import type { Product } from "@/shared/types/product";
import { loadCatalogProgressive, type CatalogCategory } from "@/modules/catalog/services/fetchProducts";

export function useProducts(activeCategory:CatalogCategory="todas"){
  const [data,setData]=useState<Product[]>([]);
  const [isLoading,setIsLoading]=useState(true);
  const [isFullCatalogLoaded,setIsFullCatalogLoaded]=useState(false);

  useEffect(()=>{
    let cancelled=false;
    setIsLoading(true);
    setIsFullCatalogLoaded(false);

    loadCatalogProgressive(activeCategory,(products,fullLoaded)=>{
      if(cancelled) return;
      setData(products);
      setIsLoading(products.length===0&&!fullLoaded);
      setIsFullCatalogLoaded(fullLoaded);
    });

    return()=>{cancelled=true;};
  },[activeCategory]);

  return {data,isLoading,isFullCatalogLoaded};
}
