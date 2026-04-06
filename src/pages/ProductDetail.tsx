import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Lock, CheckCircle, AlertTriangle, Clock, XCircle, ZoomIn, Minus, Plus, Share2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { fetchProducts, getMinPrice, isProductAvailable, getEffectivePrice } from "@/lib/products";
import { Product } from "@/types/product";
import { FloatingButtons } from "@/components/FloatingButtons";
import { CartSidebar } from "@/components/CartSidebar";
import { NotificationStack, showNotification } from "@/components/NotificationStack";
import { RecentActivity } from "@/components/RecentActivity";
import { ImageZoomModal } from "@/components/ImageZoomModal";
import { CountdownTimer } from "@/components/CountdownTimer";
import { ProductCard } from "@/components/ProductCard";

const TIER_DISPLAY = [
  { qty: 1, key: "price_1" as const, label: "1 unidad", color: "bg-primary text-primary-foreground" },
  { qty: 3, key: "price_3" as const, label: "3+ unidades", color: "bg-tertiary text-tertiary-foreground" },
  { qty: 12, key: "price_12" as const, label: "12+ unidades", color: "bg-secondary text-secondary-foreground" },
  { qty: 50, key: "price_50" as const, label: "50+ unidades", color: "bg-purple-500 text-primary-foreground" },
  { qty: 100, key: "price_100" as const, label: "100+ unidades", color: "bg-dark text-primary-foreground" },
];

const ProductDetailPage = () => {
  const { id: paramId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id") || paramId;
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [zoomImage, setZoomImage] = useState<{ src: string; title: string } | null>(null);
  const [qty, setQty] = useState(1);

  const { cart, addToCart, removeFromCart, changeQty, setExactQty, totalItems, totalPrice, savings } = useCart();

  useEffect(() => {
    fetchProducts().then((p) => {
      setProducts(p);
      setLoading(false);
    });
  }, []);

  const product = products.find((p) => p.id === id);
  const available = product ? isProductAvailable(product) : false;
  const minPrice = product ? getMinPrice(product) : 0;

  // Productos relacionados: misma categoría, excluyendo el actual
  const related = product
    ? products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
    : [];

  const handleAddToCart = useCallback(() => {
    if (!product || !available) return;
    for (let i = 0; i < qty; i++) {
      addToCart(product);
    }
    showNotification("¡Agregado con Éxito!", `${qty}x ${product.title}`);
  }, [product, available, qty, addToCart]);

  const handleShare = useCallback(() => {
    if (!product) return;
    if (navigator.share) {
      navigator.share({ title: product.title, text: product.description, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showNotification("¡Enlace copiado!", "Comparte este producto");
    }
  }, [product]);

  // Stock info
  let stockText = "próximamente";
  let stockColorClass = "bg-muted text-muted-foreground border-border";
  let StockIcon = Clock;
  if (product) {
    if (!product.price_1 || product.price_1 <= 0 || product.stock === null || product.stock === undefined) {
      stockText = "próximamente"; StockIcon = Clock;
    } else if (product.stock === 0) {
      stockText = "agotado"; stockColorClass = "bg-destructive/10 text-destructive border-destructive/20"; StockIcon = XCircle;
    } else if (product.stock <= 3) {
      stockText = `¡Solo quedan ${product.stock} unidades!`; stockColorClass = "bg-tertiary/10 text-tertiary border-tertiary/20"; StockIcon = AlertTriangle;
    } else {
      stockText = `${product.stock} unidades disponibles`; stockColorClass = "bg-success/10 text-success border-success/20"; StockIcon = CheckCircle;
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl mx-auto mb-4" />
          <p className="text-muted-foreground font-bold text-sm">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground font-black text-lg">Producto no encontrado</p>
        <button onClick={() => navigate("/")} className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-black text-sm">
          Volver al catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-40">
      <NotificationStack />

      {/* Header */}
      <header className="sticky top-0 z-[100] w-full flex flex-col shadow-sm">
        <CountdownTimer />
        <div className="bg-card/95 backdrop-blur-xl border-b border-border px-4 py-3 md:py-4">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-grow">
              <h1 className="text-sm md:text-base font-black text-foreground truncate">{product.title}</h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{product.id} · {product.category}</p>
            </div>
            <button onClick={handleShare} className="p-2 bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 mt-6 md:mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* ========== IMAGEN ========== */}
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-3xl bg-muted border border-border shadow-lg group cursor-zoom-in"
              onClick={() => setZoomImage({ src: product.img, title: product.title })}
            >
              <img
                src={product.img}
                alt={product.title}
                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!available ? "opacity-60 grayscale-[50%]" : ""}`}
              />
              <div className="absolute top-4 left-4 bg-red-600 text-primary-foreground text-[9px] font-black px-3 py-1.5 rounded-lg shadow-lg animate-pop-in uppercase tracking-widest">
                CYBERMOM ✨
              </div>
              <div className="absolute bottom-4 right-4 bg-card/80 backdrop-blur-sm p-2 rounded-xl text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* ========== INFO ========== */}
          <div className="flex flex-col gap-6">
            {/* Título y descripción */}
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-foreground leading-tight mb-3">{product.title}</h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Stock */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${stockColorClass} border w-fit`}>
              <StockIcon className="w-4 h-4" />
              <span className="text-[11px] font-black tracking-wide">{stockText}</span>
            </div>

            {/* ========== TABLA DE PRECIOS ========== */}
            <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
              <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">Precios por volumen</h3>
              <div className="space-y-2">
                {TIER_DISPLAY.filter((t) => {
                  const val = product[t.key];
                  return val !== null && val !== undefined && val > 0;
                }).map((t) => (
                  <div key={t.key} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${t.color}`}>{t.qty}</span>
                      <span className="text-sm font-bold text-foreground">{t.label}</span>
                    </div>
                    <span className="text-lg font-black text-primary">S/ {product[t.key]!.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ========== PRECIO PRINCIPAL ========== */}
            <div className="flex items-end gap-3">
              <div>
                <span className="text-xs font-black text-muted-foreground uppercase tracking-widest block mb-1">Desde</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-muted-foreground">S/</span>
                  <span className="text-5xl font-black text-primary tracking-tighter">{minPrice.toFixed(2)}</span>
                </div>
              </div>
              {minPrice < product.price_1 && (
                <span className="text-xl text-muted-foreground line-through font-black mb-1">S/ {product.price_1.toFixed(2)}</span>
              )}
            </div>

            {/* ========== SELECTOR CANTIDAD + BOTÓN ========== */}
            {available && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Cantidad:</span>
                  <div className="flex items-center bg-muted rounded-2xl p-1">
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10 bg-card rounded-xl shadow-sm flex items-center justify-center text-primary active:scale-90 transition-transform">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-lg font-black text-foreground">{qty}</span>
                    <button onClick={() => setQty((q) => q + 1)} className="w-10 h-10 bg-card rounded-xl shadow-sm flex items-center justify-center text-primary active:scale-90 transition-transform">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black text-base capitalize tracking-wide shadow-lg shadow-primary/20 hover:bg-dark active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Agregar al carrito — S/ {(minPrice * qty).toFixed(2)}
                </button>
              </div>
            )}
            {!available && (
              <button disabled className="w-full bg-muted text-muted-foreground py-4 rounded-2xl font-black text-base cursor-not-allowed flex items-center justify-center gap-3">
                <Lock className="w-5 h-5" />
                No disponible
              </button>
            )}
          </div>
        </div>

        {/* ========== PRODUCTOS RELACIONADOS ========== */}
        {related.length > 0 && (
          <section className="mt-16">
            <h3 className="text-lg font-black text-foreground mb-6 tracking-tight">También te puede interesar</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {related.map((r) => (
                <ProductCard
                  key={r.id}
                  product={r}
                  onAddToCart={(p) => { addToCart(p); showNotification("¡Agregado!", p.title); }}
                  onImageClick={(src, title) => setZoomImage({ src, title })}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Flotantes */}
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

export default ProductDetailPage;
