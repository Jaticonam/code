import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchX } from "lucide-react";
import { useCartStore } from "@/modules/cart/store";
import { useProducts } from "@/modules/catalog/hooks/useProducts";
import { searchProducts } from "@/shared/lib/search";
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
import { CampaignFilter } from "@/modules/catalog/components/CampaignFilter";
import { CAMPAIGN_CONFIG } from "@/shared/config/campaigns";

const TOP_PRIORITY = 100;
const STRONG_PRIORITY = 80;
const HIGHLIGHT_PRIORITY = 50;

const getRotationSeed = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const block = now.getHours() < 12 ? "AM" : "PM";

  return `${year}-${month}-${day}-${block}`;
};

const seededShuffle = <T extends { id: string }>(items: T[], seed: string) => {
  const hash = (text: string) => {
    let h = 0;
    for (let i = 0; i < text.length; i++) {
      h = (h << 5) - h + text.charCodeAt(i);
      h |= 0;
    }
    return h;
  };

  return [...items].sort((a, b) => hash(seed + a.id) - hash(seed + b.id));
};

const sortByPriorityAndShuffleSameLevel = (items: Product[]) => {
  const seed = getRotationSeed();

  const groups = items.reduce<Record<number, Product[]>>((acc, product) => {
    const priority = product.priority || 0;
    (acc[priority] ||= []).push(product);
    return acc;
  }, {});

  return Object.keys(groups)
    .map(Number)
    .sort((a, b) => b - a)
    .flatMap((priority) => seededShuffle(groups[priority], seed));
};

const CatalogPage = () => {
  const getCategoryFromUrl = () =>
    new URLSearchParams(window.location.search).get("cat") || "todas";

  const getCampaignFromUrl = () =>
    new URLSearchParams(window.location.search).get("campaign") || "";

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

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("cat") || "todas";
    const campaign = params.get("campaign") || "";

    setActiveCategory(isValidCategory(cat) ? cat : "todas");
    setActiveCampaign(campaign);
  }, [location.search]);

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
      if (activeCampaign) params.set("campaign", activeCampaign);

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
      if (campaign) params.set("campaign", campaign);

      navigate(`/catalogo${params.toString() ? `?${params}` : ""}`);
    },
    [navigate, activeCategory],
  );

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

  const filteredProducts = useMemo(() => {
    const term = searchQuery.trim();
    let filtered = products;

    if (activeCategory !== "todas") {
      filtered = filtered.filter(
        (product) => product.category === activeCategory,
      );
    }

    if (activeCampaign) {
      filtered = filtered.filter((product) =>
        product.campaigns?.includes(activeCampaign),
      );
    }

    if (!term) return filtered;

    const insideFilters = searchProducts(filtered, term);
    return insideFilters.length
      ? insideFilters
      : searchProducts(products, term);
  }, [products, activeCategory, activeCampaign, searchQuery]);

  const showPriorityBlocks =
    activeCategory === "todas" && !activeCampaign && !searchQuery.trim();

  const topProducts = useMemo(
    () =>
      showPriorityBlocks
        ? sortByPriorityAndShuffleSameLevel(
            products.filter((p) => (p.priority || 0) >= TOP_PRIORITY),
          )
        : [],
    [products, showPriorityBlocks],
  );

  const strongProducts = useMemo(
    () =>
      showPriorityBlocks
        ? sortByPriorityAndShuffleSameLevel(
            products.filter((p) => {
              const priority = p.priority || 0;
              return priority >= STRONG_PRIORITY && priority < TOP_PRIORITY;
            }),
          )
        : [],
    [products, showPriorityBlocks],
  );

  const highlightProducts = useMemo(
    () =>
      showPriorityBlocks
        ? sortByPriorityAndShuffleSameLevel(
            products.filter((p) => {
              const priority = p.priority || 0;
              return (
                priority >= HIGHLIGHT_PRIORITY && priority < STRONG_PRIORITY
              );
            }),
          )
        : [],
    [products, showPriorityBlocks],
  );

  const regularProducts = useMemo(
    () =>
      sortByPriorityAndShuffleSameLevel(
        showPriorityBlocks
          ? filteredProducts.filter(
              (p) => (p.priority || 0) < HIGHLIGHT_PRIORITY,
            )
          : filteredProducts,
      ),
    [filteredProducts, showPriorityBlocks],
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
  const campaignCounts = useMemo(() => {
    return products.reduce<Record<string, number>>((acc, product) => {
      product.campaigns?.forEach((campaign) => {
        acc[campaign] = (acc[campaign] || 0) + 1;
      });

      return acc;
    }, {});
  }, [products]);

  const categoryCounts = useMemo(() => {
    const counts = products.reduce<Record<string, number>>((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});
    counts.todas = products.length;
    return counts;
  }, [products]);

  const activeCat =
    activeCategory !== "todas"
      ? CATEGORY_CONFIG.find((c) => c.id === activeCategory)
      : null;

  const activeCampaignData = activeCampaign
    ? CAMPAIGN_CONFIG.find((c) => c.id === activeCampaign)
    : null;

  const hasActiveFilters = Boolean(activeCampaignData || activeCat);

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
        <div id="filter-category" className="space-y-8">
          <CampaignFilter
            active={activeCampaign}
            counts={campaignCounts}
            onSelect={handleCampaignSelect}
          />

          <CategoryFilter
            categories={CATEGORY_CONFIG}
            active={activeCategory}
            counts={categoryCounts}
            onSelect={handleCategorySelect}
          />
        </div>
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
                      : "Productos encontrados según tu búsqueda o categoría."}
                  </p>
                </div>

                {renderGrid(regularProducts)}
              </section>
            )}
          </div>
        )}
      </main>

      {!exploreOpen && (
        <FloatingButtons
          cartCount={totalItems}
          onCartClick={() => setCartOpen(true)}
          onExploreClick={() => setExploreOpen(true)}
        />
      )}

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

              <div className="explore-body">
                <section>
                  <CampaignFilter
                    active={activeCampaign}
                    counts={campaignCounts}
                    onSelect={(id) => {
                      handleCampaignSelect(id);
                      setExploreOpen(false);
                    }}
                  />
                </section>

                <section>
                  <CategoryFilter
                    categories={CATEGORY_CONFIG}
                    active={activeCategory}
                    counts={categoryCounts}
                    onSelect={(id) => {
                      handleCategorySelect(id);
                      setExploreOpen(false);
                    }}
                  />
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CatalogPage;
