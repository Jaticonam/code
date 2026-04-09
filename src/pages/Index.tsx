import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SearchX } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { fetchProducts } from "@/lib/products";
import { Product, CATEGORIES } from "@/types/product";
import { CountdownTimer } from "@/components/CountdownTimer";
import { HeaderBar } from "@/components/HeaderBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProductCard } from "@/components/ProductCard";
import { CartSidebar } from "@/components/CartSidebar";
import { FloatingButtons } from "@/components/FloatingButtons";
import { NotificationStack, showNotification } from "@/components/NotificationStack";
import { RecentActivity } from "@/components/RecentActivity";
import { ImageZoomModal } from "@/components/ImageZoomModal";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [zoomImage, setZoomImage] = useState<{ src: string; title: string } | null>(null);

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

  const filteredProducts = useMemo(() => {
    let list = products;
    if (activeCategory !== "todas") {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) => p.id.toLowerCase().includes(q) || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, activeCategory, searchQuery]);

  const navigate = useNavigate();
  const handleCategorySelect = useCallback((id: string) => {
    if (id === "todas") {
      setActiveCategory("todas");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(`/catalogo/categoria.html?cat=${id}`);
    }
  }, [navigate]);

  const handleAddToCart = useCallback(
    (p: Product) => {
      addToCart(p);
      showNotification("¡Agregado con Éxito!", p.title);
    },
    [addToCart]
  );

  return (
    <div className="min-h-screen bg-background pb-40">
      <NotificationStack />

      {/* Header fijo */}
      <header className="sticky top-0 z-[100] w-full flex flex-col shadow-sm">
        <CountdownTimer />
        <HeaderBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-2 md:px-4 mt-6 md:mt-8">
        <CategoryFilter categories={CATEGORIES} active={activeCategory} onSelect={handleCategorySelect} />

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-6 px-2 md:px-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card rounded-[20px] border border-border p-2.5 md:p-4 animate-pulse">
                <div className="aspect-square bg-muted rounded-[14px] mb-2.5" />
                <div className="h-4 bg-muted rounded w-3/4 mx-auto mb-2" />
                <div className="h-3 bg-muted rounded w-1/2 mx-auto mb-4" />
                <div className="h-8 bg-muted rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <div className="bg-muted p-6 rounded-full mb-4">
              <SearchX className="w-10 h-10 opacity-30" />
            </div>
            <p className="font-black text-sm tracking-widest text-center">Sin resultados</p>
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

      {/* Componentes flotantes */}
      <FloatingButtons cartCount={totalItems} onCartClick={() => setCartOpen(true)} />
      <RecentActivity products={products} />

      {/* Modales */}
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
    </div>
  );
};

export default Index;
