import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchX } from "lucide-react";

import { useCartStore } from "@/modules/cart/store";
import { useProducts } from "@/modules/catalog/hooks/useProducts";

import { searchProducts } from "@/shared/lib/search";
import { sortByCommercialPriority } from "@/shared/lib/sort";

import { Product } from "@/shared/types/product";
import { CATEGORY_CONFIG } from "@/shared/config/categories";

import { CountdownTimer } from "@/shared/components/commerce/CountdownTimer";
import { HeaderBar } from "@/shared/components/layout/HeaderBar";
import { FloatingButtons } from "@/shared/components/layout/FloatingButtons";
import { ImageZoomModal } from "@/shared/components/media/ImageZoomModal";
import { CatalogSkeleton } from "@/shared/components/skeletons/CatalogSkeleton";


import { CategoryFilter } from "@/modules/catalog/components/CategoryFilter";
import { ProductCard } from "@/modules/catalog/components/ProductCard";

import { CartSidebar } from "@/modules/cart/components/CartSidebar";
import { AddToCartModal } from "@/modules/cart/components/AddToCartModal";


import { RecentActivity } from "@/modules/feedback/components/RecentActivity";

const TOP_PRIORITY = 100;
const STRONG_PRIORITY = 80;
const HIGHLIGHT_PRIORITY = 50;

const CatalogPage = () => {
  const [activeCategory, setActiveCategory] = useState("todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [zoomImage, setZoomImage] = useState<{ src: string; title: string } | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

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

  const { data: products = [], isLoading: loading } = useProducts();

  useEffect(() => {
    if (!location.state?.restoreSearch) return;

    setSearchQuery(location.state.restoreSearch);
    window.history.replaceState({}, document.title);
  }, [location.state]);

  const handleCategorySelect = useCallback(
    (id: string) => {
      setActiveCategory(id);

      navigate(
        id === "todas"
          ? "/catalogo"
          : `/catalogo/categoria.html?cat=${id}`
      );
    },
    [navigate]
  );
  
  const handleAddToCart = useCallback(
    (product: Product) => {
      addToCart(product, 1);
      setSelectedProduct(product);
      setAddModalOpen(true);
    },
    [addToCart]
  );

  const handleCloseAddModal = useCallback(() => {
    setAddModalOpen(false);
  }, []);

  const handleAddExtra = useCallback(
    (qty: number) => {
      if (selectedProduct && qty > 0) addToCart(selectedProduct, qty);
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

    const categoryProducts = products.filter(
      (product) => product.category === activeCategory
    );

    if (!term) return categoryProducts;

    const insideCategory = searchProducts(categoryProducts, term);
    return insideCategory.length ? insideCategory : searchProducts(products, term);
  }, [products, activeCategory, searchQuery]);

  const showPriorityBlocks = activeCategory === "todas" && !searchQuery.trim();

  const topProducts = useMemo(
    () =>
      showPriorityBlocks
        ? sortByCommercialPriority(
            products.filter((product) => (product.priority || 0) >= TOP_PRIORITY)
          )
        : [],
    [products, showPriorityBlocks]
  );

  const strongProducts = useMemo(
    () =>
      showPriorityBlocks
        ? sortByCommercialPriority(
            products.filter((product) => {
              const priority = product.priority || 0;
              return priority >= STRONG_PRIORITY && priority < TOP_PRIORITY;
            })
          )
        : [],
    [products, showPriorityBlocks]
  );

  const highlightProducts = useMemo(
    () =>
      showPriorityBlocks
        ? sortByCommercialPriority(
            products.filter((product) => {
              const priority = product.priority || 0;
              return priority >= HIGHLIGHT_PRIORITY && priority < STRONG_PRIORITY;
            })
          )
        : [],
    [products, showPriorityBlocks]
  );

  const regularProducts = useMemo(
    () =>
      sortByCommercialPriority(
        showPriorityBlocks
          ? filteredProducts.filter(
              (product) => (product.priority || 0) < HIGHLIGHT_PRIORITY
            )
          : filteredProducts
      ),
    [filteredProducts, showPriorityBlocks]
  );

  const renderGrid = (items: Product[]) => (
    <div className="grid grid-cols-2 gap-[3px] md:grid-cols-3 md:gap-2 xl:grid-cols-5 xl:gap-2">
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
        <header className="sticky top-0 z-[100] flex w-full flex-col shadow-sm">
          <CountdownTimer />

          <HeaderBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            products={products}
          />
        </header>

        <main className="mx-auto mt-6 max-w-7xl px-2 md:mt-8 md:px-4">
          <CategoryFilter
            categories={CATEGORY_CONFIG}
            active={activeCategory}
            onSelect={handleCategorySelect}
          />
          
          {loading ? (
            <CatalogSkeleton />
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
              <div className="mb-4 rounded-full bg-muted p-6">
                <SearchX className="h-10 w-10 opacity-30" />
              </div>

              <p className="text-center text-sm font-black tracking-widest">
                Sin resultados
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {showPriorityBlocks && topProducts.length > 0 && (
                <section className="space-y-3">
                  <div className="px-2 md:px-0">
                    <h2 className="text-lg font-black text-foreground md:text-xl">
                      🔥 Lo más vendido hoy
                    </h2>
                    <p className="text-[12px] font-medium text-muted-foreground">
                      Productos con mayor rotación ahora mismo.
                    </p>
                  </div>

                  {renderGrid(topProducts)}
                </section>
              )}

              {showPriorityBlocks && strongProducts.length > 0 && (
                <section className="space-y-3">
                  <div className="px-2 md:px-0">
                    <h2 className="text-lg font-black text-foreground md:text-xl">
                      ⭐ Recomendados para vender rápido
                    </h2>
                    <p className="text-[12px] font-medium text-muted-foreground">
                      Seleccionados para vender fácil y mover stock.
                    </p>
                  </div>

                  {renderGrid(strongProducts)}
                </section>
              )}

              {showPriorityBlocks && highlightProducts.length > 0 && (
                <section className="space-y-3">
                  <div className="px-2 md:px-0">
                    <h2 className="text-lg font-black text-foreground md:text-xl">
                      🟡 Oportunidades del catálogo
                    </h2>
                    <p className="text-[12px] font-medium text-muted-foreground">
                      Opciones para ampliar tu oferta y comprar con estrategia.
                    </p>
                  </div>

                  {renderGrid(highlightProducts)}
                </section>
              )}

              {regularProducts.length > 0 && (
                <section className="space-y-3">
                  <div className="px-2 md:px-0">
                    <h2 className="text-lg font-black text-foreground md:text-xl">
                      {showPriorityBlocks ? "🛍️ Todo el catálogo" : "🛍️ Resultados"}
                    </h2>
                    <p className="text-[12px] font-medium text-muted-foreground">
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

        <FloatingButtons
          cartCount={totalItems}
          onCartClick={() => setCartOpen(true)}
        />

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

  export default CatalogPage;

