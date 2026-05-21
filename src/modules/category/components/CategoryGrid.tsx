import type { Product, CartItem } from "@/shared/types/product";
import { ProductCard } from "@/modules/catalog/components/ProductCard";

interface CategoryGridProps {
  products: Product[];
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onImageClick: (src: string, title: string) => void;
}

export function CategoryGrid({
  products,
  cart,
  onAddToCart,
  onImageClick,
}: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-6 px-2 md:px-0">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          cart={cart}
          onAddToCart={onAddToCart}
          onImageClick={onImageClick}
        />
      ))}
    </div>
  );
}
