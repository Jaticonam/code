import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, SearchX } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { fetchProducts } from "@/lib/products";
import { Product, CATEGORIES } from "@/types/product";
import { CountdownTimer } from "@/components/CountdownTimer";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProductCard } from "@/components/ProductCard";
import { CartSidebar } from "@/components/CartSidebar";
import { FloatingButtons } from "@/components/FloatingButtons";
import { NotificationStack, showNotification } from "@/components/NotificationStack";
import { RecentActivity } from "@/components/RecentActivity";
import { ImageZoomModal } from "@/components/ImageZoomModal";

const CategoryPage = () => {
  const { id: paramCategoryId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("cat") || paramCategoryId;
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [zoomImage, setZoomImage] = useState<{ src: string; title: string } | null>(null);

  const { cart, addToCart, removeFromCart, changeQty, setExactQty, totalItems, totalPrice, savings } = useCart();

  useEffect(() => {
    fetchProducts().then((p) => { setProducts(p); setLoading(false); });
  }, []);

  const activeCategory = categoryId || "todas";
  const categoryInfo = CATEGORIES.find((c) => c.id === activeCategory);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "todas") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  const handleCategorySelect = useCallback((id: string) => {
    navigate(`/catalogo/categoria.html?cat=${id}`);
  }, [navigate]);

  const handleAddToCart = useCallback((p: Product) => {
    addToCart(p);
    showNotification("¡Agregado con Éxito!", p.title);
  }, [addToCart]);

  return (
    <div className="min-h-screen bg-background pb-40">
      <NotificationStack />

      <header className="sticky top-0 z-[100] w-full flex flex-col shadow-sm">
        <CountdownTimer />
        <div className="bg-card/95 backdrop-blur-xl border-b border-border px-4 py-3 md:py-4">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <button
              onClick={() => navigate("/catalogo")}
              className="p-2 bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg md:text-xl font-black text-foreground">
                {categoryInfo ? `${categoryInfo.icon} ${categoryInfo.name}` : "Categoría"}
              </h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {filteredProducts.length} productos
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-2 md:px-4 mt-6 md:mt-8">
        <CategoryFilter categories={CATEGORIES} active={activeCategory} onSelect={handleCategorySelect} />

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-6 px-2 md:px-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card rounded-[20px] border border-border p-2.5 md:p-4 animate-pulse">
                <div className="aspect-square bg-muted rounded-[14px] mb-2.5" />
                <div className="h-4 bg-muted rounded w-3/4 mx-auto mb-2" />
                <div className="h-8 bg-muted rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <div className="bg-muted p-6 rounded-full mb-4">
              <SearchX className="w-10 h-10 opacity-30" />
            </div>
            <p className="font-black text-sm tracking-widest text-center">Sin productos en esta categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-6 px-2 md:px-0">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
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
        isOpen={cartOpen} onClose={() => setCartOpen(false)} cart={cart}
        totalItems={totalItems} totalPrice={totalPrice} savings={savings}
        onRemove={removeFromCart} onChangeQty={changeQty} onSetQty={setExactQty}
      />
      <ImageZoomModal src={zoomImage?.src ?? null} title={zoomImage?.title ?? ""} onClose={() => setZoomImage(null)} />
    </div>
  );
};

export default CategoryPage;
