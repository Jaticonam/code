import type { Product } from "@/types/product";
import { ProductCard } from "@/components/ProductCard";

interface RelatedProductsProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onImageClick: (src: string, title: string) => void;
}

export function RelatedProducts({
  products,
  onAddToCart,
  onImageClick,
}: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="mt-16">
      <h3 className="text-lg md:text-xl font-black text-foreground mb-6 tracking-tight">
        Productos que complementan tu compra
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onImageClick={onImageClick}
          />
        ))}
      </div>
    </section>
  );
}
