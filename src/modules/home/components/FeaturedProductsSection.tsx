import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Flame, RefreshCw, SearchX } from "lucide-react";

import { useCartStore } from "@/modules/cart/store";
import { useProducts } from "@/modules/catalog/hooks/useProducts";

import { Product } from "@/shared/types/product";

import { ProductCard } from "@/modules/catalog/components/ProductCard";
import { CartSidebar } from "@/modules/cart/components/CartSidebar";
import { AddToCartModal } from "@/modules/cart/components/AddToCartModal";

import { ImageZoomModal } from "@/shared/components/media/ImageZoomModal";

import HomeSectionHeader from "./HomeSectionHeader";

const HOME_MIN_PRIORITY = 80;
const HOME_LIMIT = 8;

const getFeatured = (products: Product[]) =>
  products
    .filter((p) => (p.priority || 0) >= HOME_MIN_PRIORITY)
    .map((product) => ({
      product,
      score: (product.priority || 0) * 10 + Math.random() * 100,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, HOME_LIMIT)
    .map((x) => x.product);

export default function FeaturedProductsSection() {
  const { data: products = [], isLoading: loading } = useProducts();

  const [shuffleKey, setShuffleKey] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [zoomImage, setZoomImage] =
    useState<{ src: string; title: string } | null>(null);

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

  const featuredProducts = useMemo(
    () => getFeatured(products),
    [products, shuffleKey]
  );

  const currentQtyInCart = selectedProduct
    ? cart.find((x) => x.id === selectedProduct.id)?.qty ?? 0
    : 0;

  const handleShuffle = () =>
    setShuffleKey((x) => x + 1);

  const handleAddToCart = useCallback((product: Product) => {
    addToCart(product, 1);
    setSelectedProduct(product);
    setAddModalOpen(true);
  }, [addToCart]);

  const handleAddExtra = useCallback((qty: number) => {
    if (!selectedProduct || qty <= 0) return;
    addToCart(selectedProduct, qty);
  }, [addToCart, selectedProduct]);

  return (
    <section className="home-container featured-products-section">

      <div className="featured-products-header">

        <HomeSectionHeader
          icon={Flame}
          kicker="alta rotación"
          title="Productos que se venden solos"
          description="Priorizamos productos fuertes y rotamos opciones para descubrir nuevas oportunidades."
        />

        <div className="featured-products-actions">

          <button
            onClick={handleShuffle}
            className="featured-products-shuffle"
          >
            <RefreshCw className="h-4 w-4" />
            Cambiar selección
          </button>

          <Link
            to="/catalogo"
            className="featured-products-link"
          >
            Ver catálogo
            <ArrowRight className="h-4 w-4" />
          </Link>

        </div>

      </div>

      {loading ? (

        <div className="featured-products-grid">

          {Array.from({ length: HOME_LIMIT }).map((_,i)=>(
            <div
              key={i}
              className="featured-product-skeleton"
            />
          ))}

        </div>

      ) : featuredProducts.length===0 ? (

        <div className="featured-products-empty">

          <SearchX className="mb-3 h-8 w-8 opacity-40"/>

          <p>
            Aún no hay productos prioritarios.
          </p>

          <small>
            Usa prioridad 80, 90 o 100.
          </small>

        </div>

      ) : (

        <div className="featured-products-grid">

          {featuredProducts.map(product=>(
            <ProductCard
              key={product.id}
              product={product}
              cart={cart}
              onAddToCart={handleAddToCart}
              onImageClick={(src,title)=>
                setZoomImage({src,title})
              }
            />
          ))}

        </div>

      )}

      <CartSidebar
        isOpen={cartOpen}
        onClose={()=>setCartOpen(false)}
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
        onClose={()=>setAddModalOpen(false)}
        onAddExtra={handleAddExtra}
        onOpenCart={()=>{
          setAddModalOpen(false);
          setCartOpen(true);
        }}
      />

    </section>
  );
}
