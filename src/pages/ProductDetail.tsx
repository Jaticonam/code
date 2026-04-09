import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  PlusCircle,
  Lock,
  CheckCircle,
  AlertTriangle,
  Clock,
  XCircle,
  ZoomIn,
  Minus,
  Plus,
  Share2,
} from "lucide-react";

import { useCart } from "@/hooks/use-cart";
import { fetchProducts, isProductAvailable } from "@/lib/products";
import { Product } from "@/types/product";

import { FloatingButtons } from "@/components/FloatingButtons";
import { CartSidebar } from "@/components/CartSidebar";
import { NotificationStack, showNotification } from "@/components/NotificationStack";
import { RecentActivity } from "@/components/RecentActivity";
import { ImageZoomModal } from "@/components/ImageZoomModal";
import { CountdownTimer } from "@/components/CountdownTimer";
import { ProductCard } from "@/components/ProductCard";

const TIER_DISPLAY = [
  { qty: 1, key: "price_1" as const, label: "1u" },
  { qty: 3, key: "price_3" as const, label: "3u+" },
  { qty: 12, key: "price_12" as const, label: "12u+" },
  { qty: 50, key: "price_50" as const, label: "50u+" },
  { qty: 100, key: "price_100" as const, label: "100u+" },
];

const getUnitPrice = (qty: number, p: Product) => {
  if (qty >= 100 && p.price_100) return p.price_100;
  if (qty >= 50 && p.price_50) return p.price_50;
  if (qty >= 12 && p.price_12) return p.price_12;
  if (qty >= 3 && p.price_3) return p.price_3;
  return p.price_1 || 0;
};

const getNextTier = (qty: number, p: Product) => {
  if (qty < 3 && p.price_3) return { qty: 3, price: p.price_3 };
  if (qty < 12 && p.price_12) return { qty: 12, price: p.price_12 };
  if (qty < 50 && p.price_50) return { qty: 50, price: p.price_50 };
  if (qty < 100 && p.price_100) return { qty: 100, price: p.price_100 };
  return null;
};

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
  const [viewers, setViewers] = useState(Math.floor(Math.random() * 8) + 6);

  const [lastTier, setLastTier] = useState(1);
  const [showUnlock, setShowUnlock] = useState(false);
  const [pricePulse, setPricePulse] = useState(false);

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
    const interval = setInterval(() => {
      setViewers(Math.floor(Math.random() * 8) + 6);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }, 0);

    setQty(1);

    return () => clearTimeout(timer);
  }, [id]);

  const product = products.find((p) => p.id === id);
  const available = product ? isProductAvailable(product) : false;

  const unitPrice = product ? getUnitPrice(qty, product) : 0;
  const total = unitPrice * qty;
  const nextTier = product ? getNextTier(qty, product) : null;

  const savingsByQty =
    product && product.price_1 > unitPrice
      ? (product.price_1 - unitPrice) * qty
      : 0;

  useEffect(() => {
    if (!product) return;

    let currentTier = 1;

    if (qty >= 100 && product.price_100) currentTier = 100;
    else if (qty >= 50 && product.price_50) currentTier = 50;
    else if (qty >= 12 && product.price_12) currentTier = 12;
    else if (qty >= 3 && product.price_3) currentTier = 3;

    setPricePulse(true);
    const pulseTimer = setTimeout(() => setPricePulse(false), 220);

    if (currentTier !== lastTier) {
      setShowUnlock(true);
      setLastTier(currentTier);

      const unlockTimer = setTimeout(() => setShowUnlock(false), 1800);

      return () => {
        clearTimeout(pulseTimer);
        clearTimeout(unlockTimer);
      };
    }

    return () => clearTimeout(pulseTimer);
  }, [qty, product, lastTier]);

 const related = product
  ? (() => {
      const sameCategory = products.filter(
        (p) => p.category === product.category && p.id !== product.id
      );

      const otherCategories = products.filter(
        (p) => p.category !== product.category && p.id !== product.id
      );

      return [...sameCategory.slice(0, 4), ...otherCategories.slice(0, 4)];
    })()
  : [];

  const handleAddToCart = useCallback(() => {
    if (!product || !available) return;

    for (let i = 0; i < qty; i++) {
      addToCart(product);
    }

    showNotification("🔥 Agregado", `${qty}x ${product.title}`);
  }, [product, available, qty, addToCart]);

  const handleShare = useCallback(() => {
    if (!product) return;

    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showNotification("🔗 Enlace copiado", "Comparte este producto");
    }
  }, [product]);

  let stockText = "Próximo";
  let stockColorClass = "text-muted-foreground";
  let StockIcon = Clock;

  if (product) {
    if (!product.price_1 || product.price_1 <= 0 || product.stock === null || product.stock === undefined) {
      stockText = "Próximo";
      stockColorClass = "text-muted-foreground";
      StockIcon = Clock;
    } else if (product.stock === 0) {
      stockText = "Agotado";
      stockColorClass = "text-destructive";
      StockIcon = XCircle;
    } else if (product.stock <= 3) {
      stockText = "Últimos";
      stockColorClass = "text-tertiary";
      StockIcon = AlertTriangle;
    } else if (product.stock <= 10) {
      stockText = "Limitado";
      stockColorClass = "text-secondary";
      StockIcon = AlertTriangle;
    } else {
      stockText = "Disponible";
      stockColorClass = "text-success";
      StockIcon = CheckCircle;
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
        <button
          onClick={() => navigate("/")}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-black text-sm"
        >
          Volver al catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-40">
      <NotificationStack />

      {/* HEADER */}
      <header className="sticky top-0 z-[100] w-full flex flex-col shadow-sm">
        <CountdownTimer />
        <div className="bg-card/95 backdrop-blur-xl border-b border-border px-4 py-3 md:py-4">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex-grow min-w-0">
              <h1 className="text-sm md:text-base font-black text-foreground truncate">
                {product.title}
              </h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {product.id}
              </p>
            </div>

            <button
              onClick={handleShare}
              className="p-2 bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 mt-6 md:mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* IMAGEN */}
          <div className="relative">
            <div
              className="aspect-square overflow-hidden rounded-3xl bg-muted border border-border shadow-lg group cursor-zoom-in"
              onClick={() => setZoomImage({ src: product.img, title: product.title })}
            >
              <img
                src={product.img}
                alt={product.title}
                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                  !available ? "opacity-60 grayscale-[50%]" : ""
                }`}
              />

              <div className="absolute top-4 left-4 bg-red-600 text-primary-foreground text-[9px] font-black px-3 py-1.5 rounded-lg shadow-lg uppercase tracking-widest">
                🎯 CYBERMOM
              </div>

              <div className="absolute bottom-4 right-4 bg-card/80 backdrop-blur-sm p-2 rounded-xl text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* INFO */}
          <div className="flex flex-col gap-6">
            {/* título + descripción */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap mb-3">
                <span className="text-[11px] text-muted-foreground font-semibold">
                  {product.id}
                </span>
                <span className="px-2 py-1 rounded-full bg-muted text-[10px] font-semibold text-foreground uppercase tracking-wide">
                  {product.category}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-foreground leading-tight mb-3">
                {product.title}
              </h2>

              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* stock + viendo ahora */}
            <div className="flex items-center justify-center md:justify-start gap-4 flex-wrap">
              <div className={`inline-flex items-center gap-2 ${stockColorClass}`}>
                <StockIcon className="w-4 h-4" />
                <span className="text-[12px] font-bold">{stockText}</span>
              </div>

              {available && (
                <p className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[12px] font-bold">
                  👀 {viewers} viendo ahora
                </p>
              )}
            </div>

            {/* fila de precios */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {TIER_DISPLAY.map((t) => {
                const val = product[t.key];
                if (!val) return null;

                const active =
                  (t.qty === 1 && qty < 3) ||
                  (t.qty === 3 && qty >= 3 && qty < 12) ||
                  (t.qty === 12 && qty >= 12 && qty < 50) ||
                  (t.qty === 50 && qty >= 50 && qty < 100) ||
                  (t.qty === 100 && qty >= 100);

                const colorMap = {
                  price_1: active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-primary/10 text-primary border-primary/20",
                  price_3: active
                    ? "bg-tertiary text-tertiary-foreground border-tertiary"
                    : "bg-tertiary/10 text-tertiary border-tertiary/20",
                  price_12: active
                    ? "bg-secondary text-secondary-foreground border-secondary"
                    : "bg-secondary/10 text-secondary border-secondary/20",
                  price_50: active
                    ? "bg-purple-500 text-white border-purple-500"
                    : "bg-purple-500/10 text-purple-600 border-purple-500/20",
                  price_100: active
                    ? "bg-dark text-white border-dark"
                    : "bg-dark/10 text-dark border-dark/20",
                };

                return (
                  <div
                    key={t.key}
                    className={`px-3 py-2 rounded-xl border transition-all text-center min-w-[86px] shadow-sm ${
                      colorMap[t.key]
                    } ${active ? "scale-[1.03]" : ""}`}
                  >
                    <p className="text-[10px] font-black uppercase tracking-wide">{t.label}</p>
                    <p className="text-sm font-black mt-1">S/ {val.toFixed(2)}</p>
                  </div>
                );
              })}
            </div>

            {/* precio actual */}
            <div className="text-center md:text-left">
              <div className="flex items-end justify-center md:justify-start gap-2">
                <span className="text-lg md:text-xl font-black text-muted-foreground">S/</span>
                <span
                  className={`text-5xl md:text-6xl font-black text-primary tracking-tight leading-none transition-transform duration-200 ${
                    pricePulse ? "scale-105" : "scale-100"
                  }`}
                >
                  {unitPrice.toFixed(2)}
                </span>
              </div>

              {showUnlock && (
                <p className="text-success font-bold text-sm mt-2">
                  🎉 Mejor precio desbloqueado
                </p>
              )}

              {qty > 1 && (
                <p className="text-sm text-foreground mt-2">
                  Total: <strong>S/ {total.toFixed(2)}</strong>
                </p>
              )}

              {savingsByQty > 0 && (
                <p className="text-success font-semibold text-sm mt-1">
                  💰 Estás pagando <strong>S/ {unitPrice.toFixed(2)}</strong> en lugar de{" "}
                  <span className="line-through opacity-70">S/ {product.price_1.toFixed(2)}</span>
                </p>
              )}

              {nextTier && (
                <p className="text-primary text-sm font-semibold mt-1">
                  🔥 Agrega {nextTier.qty - qty} más y baja a S/ {nextTier.price.toFixed(2)}
                </p>
              )}
            </div>

            {/* cantidad */}
            {available && (
              <div className="flex justify-center md:justify-start items-center gap-4">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-foreground hover:bg-border transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <span className="text-2xl font-black text-foreground min-w-[32px] text-center">
                  {qty}
                </span>

                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-foreground hover:bg-border transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* botón */}
            {available ? (
              <button
                onClick={handleAddToCart}
                className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black text-base shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                <PlusCircle className="w-5 h-5" />
                Agregar a caja — S/ {total.toFixed(2)}
              </button>
            ) : (
              <button
                disabled
                className="w-full bg-muted text-muted-foreground py-4 rounded-2xl font-black text-base cursor-not-allowed flex items-center justify-center gap-3"
              >
                <Lock className="w-5 h-5" />
                No disponible
              </button>
            )}
          </div>
        </div>

        {/* relacionados */}
        {related.length > 0 && (
          <section className="mt-16">
            <h3 className="text-lg md:text-xl font-black text-foreground mb-6 tracking-tight">
              Productos que complementan tu compra
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6">
              {related.map((r) => (
                <ProductCard
                  key={r.id}
                  product={r}
                  onAddToCart={(p) => {
                    addToCart(p);
                    showNotification("¡Agregado!", p.title);
                  }}
                  onImageClick={(src, title) => setZoomImage({ src, title })}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* extras */}
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
    </div>
  );
};

export default ProductDetailPage;