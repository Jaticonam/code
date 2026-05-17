import { createContext, useContext } from "react";

import { useProducts } from "./products.store";

type ProductsStore = ReturnType<typeof useProducts>;

const ProductsContext = createContext<ProductsStore | null>(null);

export function ProductsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = useProducts();

  return (
    <ProductsContext.Provider value={store}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProductsStore() {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error(
      "useProductsStore debe usarse dentro de ProductsProvider"
    );
  }

  return context;
}
