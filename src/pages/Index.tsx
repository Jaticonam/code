import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SearchX } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { fetchProducts } from "@/lib/products";
import { searchProducts } from "@/lib/search";
import { sortByCommercialPriority } from "@/lib/sort";
import { Product, CATEGORIES } from "@/types/product";
import { CountdownTimer } from "@/components/CountdownTimer";
import { HeaderBar } from "@/components/HeaderBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProductCard } from "@/components/ProductCard";
import { CartSidebar } from "@/components/CartSidebar";
import { FloatingButtons } from "@/components/FloatingButtons";
import { RecentActivity } from "@/components/RecentActivity";
import { ImageZoomModal } from "@/components/ImageZoomModal";
import { AddToCartModal } from "@/components/AddToCartModal";
import { CatalogSkeleton } from "@/components/skeletons/CatalogSkeleton";

const TOP_PRIORITY = 100;
const STRONG_PRIORITY = 80;
const HIGHLIGHT_PRIORITY = 50;

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("todas");
  const [searchQuery, setSearchQuery] = useState("");
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
  } = useCart();

  useEffect(() => {
    fetchProducts().then((p) => {
      setProducts(p);
      setLoading(false);
    });
  }, []);

  const navigate = useNavigate();

  const handleCategorySelect = useCallback((id: string) => {
    if (id === "todas") {
      navigate("/catalogo");
    } else {
      navigate(`/catalogo/categoria.html?cat=${id}`);
    }
  }, [navigate]
  );

  const handleAddToCart = useCallback(
    (p: Product) => {
      addToCart(p, 1);
      setSelectedProduct(p);
      setAddModalOpen(true);
    },
    [addToCart]
  );

  const handleCloseAddModal = useCallback(() => {
    setAddModalOpen(false);
  }, []);

  const handleAddExtra = useCallback(
    (qty: number) => {
      if (!selectedProduct || qty <= 0) return;
      addToCart(selectedProduct, qty);
    },
    [addToCart, selectedProduct]
  );

  const currentQtyInCart = selectedProduct
    ? cart.find((item) => item.id === selectedProduct.id)?.qty ?? 0
    : 0;

  const filteredProducts = useMemo(() => {
    const term = searchQuery.trim();

    if (activeCategory === "todas") {
      return term ? searchProducts(products, term) : products;
    }

    const categoryProducts = products.filter((p) => p.category === activeCategory);

    if (!term) return categoryProducts;

    const inside = searchProducts(categoryProducts, term);

    if (inside.length > 0) return inside;

    return searchProducts(products, term);
  }, [products, activeCategory, searchQuery]);

  const showPriorityBlocks = activeCategory === "todas" && !searchQuery.trim();

  const topProducts = useMemo(() => {
    if (!showPriorityBlocks) return [];

    return sortByCommercialPriority(
      products.filter((p) => (p.priority || 0) >= TOP_PRIORITY)
    );
  }, [products, showPriorityBlocks]);

  const strongProducts = useMemo(() => {
    if (!showPriorityBlocks) return [];

    return sortByCommercialPriority(
      products.filter(
        (p) =>
          (p.priority || 0) >= STRONG_PRIORITY &&
          (p.priority || 0) < TOP_PRIORITY
      )
    );
  }, [products, showPriorityBlocks]);

  const highlightProducts = useMemo(() => {
    if (!showPriorityBlocks) return [];

    return sortByCommercialPriority(
      products.filter(
        (p) =>
          (p.priority || 0) >= HIGHLIGHT_PRIORITY &&
          (p.priority || 0) < STRONG_PRIORITY
      )
    );
  }, [products, showPriorityBlocks]);

  const regularProducts = useMemo(() => {
    if (!showPriorityBlocks) return sortByCommercialPriority(filteredProducts);

    return sortByCommercialPriority(
      filteredProducts.filter((p) => (p.priority || 0) < HIGHLIGHT_PRIORITY)
    );
  }, [filteredProducts, showPriorityBlocks]);

  const renderGrid = (items: Product[]) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-6 px-2 md:px-0">
      {items.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          cart={cart}
          onAddToCart={handleAddToCart}
          onImageClick={(src, title) => setZoomImage({ src, title })}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-40">
      <header className="sticky top-0 z-[100] w-full flex flex-col shadow-sm">
        <CountdownTimer />
        <HeaderBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </header>

      <main className="max-w-7xl mx-auto px-2 md:px-4 mt-6 md:mt-8">
        <CategoryFilter
          categories={CATEGORIES}
          active={activeCategory}
          onSelect={handleCategorySelect}
        />

        {loading ? (
          <CatalogSkeleton />
        ) : filteredProducts.length === 0 ? (
                  
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <div className="bg-muted p-6 rounded-full mb-4">
              <SearchX className="w-10 h-10 opacity-30" />
            </div>
            <p className="font-black text-sm tracking-widest text-center">
              Sin resultados
            </p>
          </div>
        ) : (
          <div className="space-y-8">
           {showPriorityBlocks && topProducts.length > 0 && (
            <section className="space-y-3">
              <div className="px-2 md:px-0">
                <h2 className="text-lg md:text-xl font-black text-foreground">
                  🔥 Lo más vendido hoy
                </h2>
                <p className="text-[12px] text-muted-foreground font-medium">
                  Productos con mayor rotación ahora mismo.
                </p>
              </div>
              {renderGrid(topProducts)}
            </section>
          )}

          {showPriorityBlocks && strongProducts.length > 0 && (
            <section className="space-y-3">
              <div className="px-2 md:px-0">
                <h2 className="text-lg md:text-xl font-black text-foreground">
                  ⭐ Recomendados para vender rápido
                </h2>
                <p className="text-[12px] text-muted-foreground font-medium">
                  Seleccionados para vender fácil y mover stock.
                </p>
              </div>
              {renderGrid(strongProducts)}
            </section>
          )}

          {showPriorityBlocks && highlightProducts.length > 0 && (
            <section className="space-y-3">
              <div className="px-2 md:px-0">
                <h2 className="text-lg md:text-xl font-black text-foreground">
                  🟡 Oportunidades del catálogo
                </h2>
                <p className="text-[12px] text-muted-foreground font-medium">
                  Opciones para ampliar tu oferta y comprar con estrategia.
                </p>
              </div>
              {renderGrid(highlightProducts)}
            </section>
          )} 
          {regularProducts.length > 0 && (
            <section className="space-y-3">
              <div className="px-2 md:px-0">
                <h2 className="text-lg md:text-xl font-black text-foreground">
                  {showPriorityBlocks ? "🛍️ Todo el catálogo" : "🛍️ Resultados"}
                </h2>
                <p className="text-[12px] text-muted-foreground font-medium">
                  {showPriorityBlocks
                    ? "Explora todos los productos disponibles para tu negocio."
                    : "Productos encontrados según tu búsqueda o categoría."}
                </p>
              </div>
              {renderGrid(regularProducts)}
            </section>
          )}
          </div>
        )}
      </main>

      <FloatingButtons cartCount={totalItems} onCartClick={() => setCartOpen(true)} />
      <RecentActivity products={products} />

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
        onClose={handleCloseAddModal}
        onAddExtra={handleAddExtra}
        onOpenCart={() => {
          setAddModalOpen(false);
          setCartOpen(true);
        }}
      />
    </div>
  );
};

export default Index;