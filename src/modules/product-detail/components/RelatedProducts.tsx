import type { Product } from "@/shared/types/product";
import { ProductCard } from "@/modules/catalog/components/ProductCard";

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
  if (!products.length) return null;

  return (
    <section className="mt-16">
      <h3 className="mb-6 text-lg font-black tracking-tight text-foreground md:text-xl">
        Productos que complementan tu compra
      </h3>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-6">
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
