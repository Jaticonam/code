import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchX } from "lucide-react";
import { useCartStore } from "@/modules/cart/store";
import { useProducts } from "@/modules/catalog/hooks/useProducts";
import { Product } from "@/shared/types/product";
import { CATEGORY_CONFIG } from "@/shared/config/categories";
import { CAMPAIGN_CONFIG } from "@/shared/config/campaigns";
import { CountdownTimer } from "@/shared/components/commerce/CountdownTimer";
import { HeaderBar } from "@/shared/components/layout/HeaderBar";
import { FloatingButtons } from "@/shared/components/layout/FloatingButtons";
import { ImageZoomModal } from "@/shared/components/media/ImageZoomModal";
import { CatalogSkeleton } from "@/shared/components/skeletons/CatalogSkeleton";
import { ProductCard } from "@/modules/catalog/components/ProductCard";
import { CartSidebar } from "@/modules/cart/components/CartSidebar";
import { AddToCartModal } from "@/modules/cart/components/AddToCartModal";
import { RecentActivity } from "@/modules/feedback/components/RecentActivity";
import { HeaderCategoryFilter } from "@/modules/catalog/components/HeaderCategoryFilter";
import { HeaderCampaignFilter } from "@/modules/catalog/components/HeaderCampaignFilter";
import { useCatalogFilters } from "@/modules/catalog/hooks/useCatalogFilters";
import { useCatalogPrioritySections } from "@/modules/catalog/hooks/useCatalogPrioritySections";
import { CatalogExploreCenter } from "@/modules/catalog/components/CatalogExploreCenter";
import { CatalogSeo } from "@/shared/seo/catalogSeoComponent";
import { getCatalogSeo } from "@/shared/seo/catalogSeo";
import AOS from "aos";

const CatalogPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getCategoryFromUrl = () =>
    new URLSearchParams(window.location.search).get("cat") || "todas";
  const getCampaignFromUrl = () =>
    new URLSearchParams(window.location.search).get("cpg") || "";
  const isValidCategory = (id: string) =>
    id === "todas" || CATEGORY_CONFIG.some((cat) => cat.id === id);

  const [activeCategory, setActiveCategory] = useState(() => {
    const initialCat = getCategoryFromUrl();
    return isValidCategory(initialCat) ? initialCat : "todas";
  });

  const [activeCampaign, setActiveCampaign] = useState(() =>
    getCampaignFromUrl(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [zoomImage, setZoomImage] = useState<{
    src: string;
    title: string;
  } | null>(null);
  const [exploreOpen, setExploreOpen] = useState(false);

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

  const {
    data: products = [],
    isLoading: loading,
    isFullCatalogLoaded,
  } = useProducts(activeCategory as any);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("cat") || "todas";
    const campaign = params.get("cpg") || "";
    setActiveCategory(isValidCategory(cat) ? cat : "todas");
    setActiveCampaign(campaign);
  }, [location.search]);

  useEffect(() => {
    const restored =
      location.state?.restoreSearch ||
      sessionStorage.getItem("wooly_restore_search");
    if (!restored) return;
    setSearchQuery(restored);
    sessionStorage.removeItem("wooly_restore_search");
    window.history.replaceState({}, document.title);
  }, [location.state]);

  const handleCategorySelect = useCallback(
    (id: string) => {
      setSearchQuery("");
      setActiveCategory(id);

      const params = new URLSearchParams();
      if (id !== "todas") params.set("cat", id);
      if (activeCampaign) params.set("cpg", activeCampaign);

      navigate(`/catalogo${params.toString() ? `?${params}` : ""}`);
    },
    [navigate, activeCampaign],
  );

  const handleCampaignSelect = useCallback(
    (campaign: string) => {
      setSearchQuery("");
      setActiveCampaign(campaign);

      const params = new URLSearchParams();
      if (activeCategory !== "todas") params.set("cat", activeCategory);
      if (campaign) params.set("cpg", campaign);

      navigate(`/catalogo${params.toString() ? `?${params}` : ""}`);
    },
    [navigate, activeCategory],
  );

  const {
    filteredProducts,
    categoryCounts,
    campaignCounts,
    visibleCategories,
    hasCategory,
    hasCampaign,
  } = useCatalogFilters({
    products,
    activeCategory,
    activeCampaign,
    searchQuery,
    showCounts: isFullCatalogLoaded,
  });

  const activeCat =
    activeCategory !== "todas"
      ? CATEGORY_CONFIG.find((c) => c.id === activeCategory)
      : null;
  const activeCampaignData = activeCampaign
    ? CAMPAIGN_CONFIG.find((c) => c.id === activeCampaign)
    : null;
  const hasActiveFilters = Boolean(activeCampaignData || activeCat);

  const handleAddToCart = useCallback(
    (product: Product) => {
      addToCart(product, 1);
      setSelectedProduct(product);
      setAddModalOpen(true);
    },
    [addToCart],
  );

  const handleCloseAddModal = useCallback(() => setAddModalOpen(false), []);

  const handleAddExtra = useCallback(
    (qty: number) => {
      if (selectedProduct && qty > 0) addToCart(selectedProduct, qty);
    },
    [addToCart, selectedProduct],
  );

  const currentQtyInCart = selectedProduct
    ? (cart.find((item) => item.id === selectedProduct.id)?.qty ?? 0)
    : 0;

  const renderGrid = (items: Product[]) => (
    <div className="grid grid-cols-2 gap-[3px] md:grid-cols-3 md:gap-2 xl:grid-cols-5 xl:gap-2">
      {items.map((p, index) => (
        <div key={p.id} data-aos="fade-up" data-aos-delay={(index % 5) * 40}>
          <ProductCard
            product={p}
            cart={cart}
            onAddToCart={handleAddToCart}
            onImageClick={(src, title) => setZoomImage({ src, title })}
          />
        </div>
      ))}
    </div>
  );

  const {
    showPriorityBlocks,
    topProducts,
    strongProducts,
    highlightProducts,
    regularProducts,
  } = useCatalogPrioritySections({
    products,
    filteredProducts,
    activeCategory,
    activeCampaign,
    searchQuery,
  });

  const seo = getCatalogSeo(activeCategory);
  useEffect(() => {
    const timer = setTimeout(() => {
      AOS.refreshHard();
    }, 100);

    return () => clearTimeout(timer);
  }, [filteredProducts, activeCategory, activeCampaign, searchQuery]);

  return (
    <div className="min-h-screen bg-background pb-40">
      <CatalogSeo seo={seo} />
      <header className="sticky top-0 z-[100] flex w-full flex-col shadow-sm">
        <CountdownTimer />

        <HeaderBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          products={products}
          topContent={
            <HeaderCampaignFilter
              active={activeCampaign}
              counts={campaignCounts}
              show={isFullCatalogLoaded}
              onSelect={handleCampaignSelect}
            />
          }
          bottomContent={
            <HeaderCategoryFilter
              categories={visibleCategories}
              active={activeCategory}
              counts={categoryCounts}
              onSelect={handleCategorySelect}
            />
          }
        />
      </header>

      <main className="mx-auto mt-6 max-w-7xl px-2 md:mt-8 md:px-4">
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
                    {showPriorityBlocks
                      ? "🛍️ Todo el catálogo"
                      : "🛍️ Resultados"}
                  </h2>

                  <p className="text-[12px] font-medium text-muted-foreground">
                    {showPriorityBlocks
                      ? "Explora todos los productos disponibles para tu negocio."
                      : "Productos encontrados según tu búsqueda, campaña o categoría."}
                  </p>
                </div>

                {renderGrid(regularProducts)}
              </section>
            )}
          </div>
        )}
      </main>

      <CatalogExploreCenter
        open={exploreOpen}
        activeCampaign={activeCampaign}
        activeCategory={activeCategory}
        activeCampaignName={activeCampaignData?.name}
        activeCategoryName={activeCat?.name}
        campaignCounts={campaignCounts}
        categoryCounts={categoryCounts}
        categories={visibleCategories}
        cartCount={totalItems}
        onClose={() => setExploreOpen(false)}
        onCampaignSelect={handleCampaignSelect}
        onCategorySelect={handleCategorySelect}
        onOpenCart={() => setCartOpen(true)}
      />

      <RecentActivity products={products} />
      <FloatingButtons
        cartCount={totalItems}
        onCartClick={() => setCartOpen(true)}
        onExploreClick={() => setExploreOpen(true)}
      />

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

      {exploreOpen && (
        <div className="explore-overlay" onClick={() => setExploreOpen(false)}>
          <div className="explore-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="explore-panel">
              <div className="explore-handle" />

              <div className="explore-head">
                <div>
                  <h3 className="explore-title">Explorar</h3>
                  {hasActiveFilters && (
                    <span className="explore-active-label">
                      Filtros activos
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setExploreOpen(false)}
                  className="explore-close"
                >
                  Cerrar
                </button>
              </div>

              {hasActiveFilters && (
                <div className="explore-active-list">
                  {activeCampaign && (
                    <button
                      onClick={() => handleCampaignSelect("")}
                      className="explore-chip explore-chip-primary"
                    >
                      {activeCampaignData?.icon} {activeCampaignData?.name} ✕
                    </button>
                  )}

                  {activeCat && (
                    <button
                      onClick={() => handleCategorySelect("todas")}
                      className="explore-chip explore-chip-secondary"
                    >
                      {activeCat.icon} {activeCat.name} ✕
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
