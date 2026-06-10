import type { Product } from "@/shared/types/product";
import { ProductCard } from "@/modules/catalog/components/ProductCard";

interface RelatedProductsProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onImageClick: (product: Product) => void;
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

      <div className="grid grid-cols-2 gap-[3px] md:grid-cols-3 md:gap-2 xl:grid-cols-4 xl:gap-2">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onImageClick={() => onImageClick(product)}
          />
        ))}
      </div>
    </section>
  );
}
