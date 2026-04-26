import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Search, SearchX } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { fetchProducts } from "@/lib/products";
import { searchProducts } from "@/lib/search";
import { sortByCommercialPriority } from "@/lib/sort";
import { Product, CATEGORIES } from "@/types/product";
import { CountdownTimer } from "@/components/CountdownTimer";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProductCard } from "@/components/ProductCard";
import { CartSidebar } from "@/components/CartSidebar";
import { FloatingButtons } from "@/components/FloatingButtons";
import { RecentActivity } from "@/components/RecentActivity";
import { ImageZoomModal } from "@/components/ImageZoomModal";
import { AddToCartModal } from "@/components/AddToCartModal";
import { CategorySkeleton } from "@/components/skeletons/CategorySkeleton";

const CategoryPage = () => {
  const { id: paramCategoryId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("cat") || paramCategoryId;
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [zoomImage, setZoomImage] = useState<{ src: string; title: string } | null>(null);
  const [categorySearch, setCategorySearch] = useState("");

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const {
    cart,
    addToCart,
    removeFromCart,
    changeQty,
    setExactQty,
    totalItems,
    totalPrice,
    savings,
  } = useCart();

  useEffect(() => {
    fetchProducts().then((p) => {
      setProducts(p);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (categoryId === "todas") {
      navigate("/catalogo", { replace: true });
    }
  }, [categoryId, navigate]);

  useEffect(() => {
    setCategorySearch("");
  }, [categoryId]);

  const activeCategory = categoryId || "todas";
  const categoryInfo = CATEGORIES.find((c) => c.id === activeCategory);

  const categoryProducts = useMemo(() => {
    if (activeCategory === "todas") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  const filteredProducts = useMemo(() => {
    const term = categorySearch.trim();

    if (!term) return sortByCommercialPriority(categoryProducts);

    const inside = searchProducts(categoryProducts, term);

    if (inside.length > 0) return sortByCommercialPriority(inside);

    return sortByCommercialPriority(searchProducts(products, term));
  }, [categoryProducts, products, categorySearch]);

  const handleCategorySelect = useCallback((id: string) => {
    if (id === "todas") {
      navigate("/catalogo");
    } else {
      navigate(`/catalogo/categoria.html?cat=${id}`);
    }
  }, [navigate]);

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

  const hasSearch = categorySearch.trim().length > 0;

  return (
    <div className="min-h-screen bg-background pb-40">
      <header className="sticky top-0 z-[100] w-full flex flex-col shadow-sm">
        <CountdownTimer />

        <div className="bg-card/95 backdrop-blur-xl border-b border-border px-4 py-3 md:py-4">
          <div className="max-w-7xl mx-auto flex flex-col gap-3">
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
              {/* Bloque izquierda */}
              <div className="flex items-center gap-3 min-w-0 md:shrink-0">
                <button
                  onClick={() => navigate("/catalogo")}
                  className="p-2 bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors shrink-0"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="min-w-0">
                  <h1 className="text-lg md:text-xl font-black text-foreground truncate leading-tight">
                    {categoryInfo ? `${categoryInfo.icon} ${categoryInfo.name}` : "Categoría"}
                  </h1>

                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {hasSearch
                      ? `${filteredProducts.length} resultado${filteredProducts.length === 1 ? "" : "s"}`
                      : `${categoryProducts.length} productos`}
                  </p>
                </div>
              </div>

              {/* Buscador */}
              <div className="relative flex-1 min-w-0">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/70" />

                <input
                  type="text"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  placeholder={`¿Qué buscas en ${categoryInfo?.name?.toLowerCase() || "esta categoría"}?`}
                  className="w-full h-11 md:h-12 rounded-2xl bg-muted border border-transparent pl-11 pr-10 text-sm font-semibold text-foreground placeholder:text-muted-foreground/80 outline-none transition-all focus:bg-background focus:border-primary/20 focus:ring-4 focus:ring-primary/10"
                />

                {hasSearch && (
                  <button
                    type="button"
                    onClick={() => setCategorySearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Limpiar búsqueda"
                  >
                    <SearchX className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-2 md:px-4 mt-6 md:mt-8">
        <CategoryFilter
          categories={CATEGORIES}
          active={activeCategory}
          onSelect={handleCategorySelect}
        />

        {loading ? (
          <CategorySkeleton />
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <div className="bg-muted p-6 rounded-full mb-4">
              <SearchX className="w-10 h-10 opacity-30" />
            </div>

            <p className="font-black text-sm tracking-widest text-center">
              {hasSearch
                ? "No encontramos resultados en esta categoría"
                : "Sin productos en esta categoría"}
            </p>

            {hasSearch && (
              <button
                type="button"
                onClick={() => setCategorySearch("")}
                className="mt-4 px-4 py-2 rounded-xl bg-muted text-foreground text-sm font-bold hover:bg-muted/80 transition-colors"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-6 px-2 md:px-0">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                cart={cart}
                onAddToCart={handleAddToCart}
                onImageClick={(src, title) => setZoomImage({ src, title })}
              />
            ))}
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

export default CategoryPage;