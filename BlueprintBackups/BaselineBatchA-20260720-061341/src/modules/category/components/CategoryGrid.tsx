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
    <div className="grid grid-cols-2 gap-[3px] md:grid-cols-3 md:gap-2 xl:grid-cols-5 xl:gap-2">
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
