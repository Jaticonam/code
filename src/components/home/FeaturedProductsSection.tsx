import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Flame, RefreshCw, SearchX } from "lucide-react";

import { useCartStore } from "@/store/cart";
import { fetchProducts } from "../../lib/products";
import { Product } from "../../types/product";

import { ProductCard } from "@/components/products/ProductCard";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { ImageZoomModal } from "@/components/ImageZoomModal";
import { AddToCartModal } from "@/components/cart/AddToCartModal";
import HomeSectionHeader from "./HomeSectionHeader";

const HOME_MIN_PRIORITY = 80;
const HOME_LIMIT = 8;

function getRandomWeightedFeatured(products: Product[]) {
  const candidates = products.filter(
    (product) => (product.priority || 0) >= HOME_MIN_PRIORITY
  );

  return candidates
    .map((product) => {
      const priority = product.priority || 0;

      return {
        product,
        score: priority * 10 + Math.random() * 100,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, HOME_LIMIT)
    .map((item) => item.product);
}

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [shuffleKey, setShuffleKey] = useState(0);

  const [cartOpen, setCartOpen] = useState(false);
  const [zoomImage, setZoomImage] = useState<{ src: string; title: string } | null>(null);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const {
    cart,
    addToCart,
    totalItems,
    totalPrice,
    savings,
    removeFromCart,
    changeQty,
    setExactQty,
    setItemNote,
    clearCart,
  } = useCartStore();

  useEffect(() => {
    fetchProducts()
      .then((items) => {
        setProducts(items);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const featuredProducts = useMemo(() => {
    return getRandomWeightedFeatured(products);
  }, [products, shuffleKey]);

  const handleShuffle = () => {
    setShuffleKey((current) => current + 1);
  };

  const handleAddToCart = useCallback(
    (product: Product) => {
      addToCart(product, 1);
      setSelectedProduct(product);
      setAddModalOpen(true);
    },
    [addToCart]
  );

  const currentQtyInCart = selectedProduct
    ? cart.find((item) => item.id === selectedProduct.id)?.qty ?? 0
    : 0;

  const handleAddExtra = useCallback(
    (qty: number) => {
      if (!selectedProduct || qty <= 0) return;
      addToCart(selectedProduct, qty);
    },
    [addToCart, selectedProduct]
  );

  return (
    <section className="home-container featured-products-section">
      <div className="featured-products-header">
        <HomeSectionHeader
          icon={Flame}
          kicker="alta rotación"
          title="Productos que se venden solos"
          description="Elige una selección dinámica de productos con alto potencial comercial. Priorizamos los más fuertes, pero rotamos opciones para descubrir nuevas oportunidades."
        />

        <div className="featured-products-actions">
          <button
            type="button"
            onClick={handleShuffle}
            className="featured-products-shuffle"
          >
            <RefreshCw className="h-4 w-4" />
            Cambiar selección
          </button>

          <Link to="/catalogo" className="featured-products-link">
            Ver catálogo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="featured-products-grid">
          {Array.from({ length: HOME_LIMIT }).map((_, index) => (
            <div key={index} className="featured-product-skeleton" />
          ))}
        </div>
      ) : featuredProducts.length === 0 ? (
        <div className="featured-products-empty">
          <SearchX className="mb-3 h-8 w-8 opacity-40" />

          <p>
            Aún no hay productos con prioridad alta para mostrar.
          </p>

          <small>
            Usa priority 80, 90 o 100 para activar esta sección.
          </small>
        </div>
      ) : (
        <div className="featured-products-grid">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cart={cart}
              onAddToCart={handleAddToCart}
              onImageClick={(src, title) => setZoomImage({ src, title })}
            />
          ))}
        </div>
      )}

      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        totalItems={totalItems}
        totalPrice={totalPrice}
        savings={savings}
        onRemove={removeFromCart}
        onChangeQty={changeQty}
        onSetQty={setExactQty}
        onChangeNote={setItemNote}
        onClearCart={clearCart}
      />

      <ImageZoomModal
        src={zoomImage?.src ?? null}
        title={zoomImage?.title ?? ""}
        onClose={() => setZoomImage(null)}
      />

      <AddToCartModal
        open={addModalOpen}
        product={selectedProduct}
        currentQty={currentQtyInCart}
        onClose={() => setAddModalOpen(false)}
        onAddExtra={handleAddExtra}
        onOpenCart={() => {
          setAddModalOpen(false);
          setCartOpen(true);
        }}
      />
    </section>
  );
}
