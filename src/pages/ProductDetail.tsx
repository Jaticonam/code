import { useState, useEffect, useCallback, useMemo } from "react";
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

import { getBadgePresentation, sortBadges } from "@/config/badgeRules";
import { PRICE_TIERS } from "@/config/priceTiers";
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
import { ProductSkeleton } from "@/components/skeletons/ProductSkeleton";
import { AddToCartModal } from "@/components/AddToCartModal";

const getUnitPrice = (qty: number, product: Product) => {
  if (qty >= 100 && product.price_100) return product.price_100;
  if (qty >= 50 && product.price_50) return product.price_50;
  if (qty >= 12 && product.price_12) return product.price_12;
  if (qty >= 3 && product.price_3) return product.price_3;
  return product.price_1 || 0;
};

const getNextTier = (qty: number, product: Product) => {
  if (qty < 3 && product.price_3) return { qty: 3, price: product.price_3 };
  if (qty < 12 && product.price_12) return { qty: 12, price: product.price_12 };
  if (qty < 50 && product.price_50) return { qty: 50, price: product.price_50 };
  if (qty < 100 && product.price_100) return { qty: 100, price: product.price_100 };
  return null;
};

const ProductDetailPage = () => {
  const { id: paramId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentCategory = searchParams.get("cat") || "";
  const id = searchParams.get("id") || paramId;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [cartOpen, setCartOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [zoomImage, setZoomImage] = useState<{ src: string; title: string } | null>(null);

  const [qty, setQty] = useState(1);
  const [qtyInput, setQtyInput] = useState("1");
  const [modalQty, setModalQty] = useState(0);

  const [viewers, setViewers] = useState(() => Math.floor(Math.random() * 8) + 6);
  const [lastTier, setLastTier] = useState(1);
  const [showUnlock, setShowUnlock] = useState(false);
  const [pricePulse, setPricePulse] = useState(false);

  const {
    cart,
    addToCart,
    removeFromCart,
    changeQty,
    setExactQty,
    setItemNote,
    totalItems,
    totalPrice,
    savings,
  } = useCart();

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
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
    setQtyInput("1");
    setModalQty(0);
    setLastTier(1);
    setShowUnlock(false);
    setPricePulse(false);
    setAddModalOpen(false);

    return () => clearTimeout(timer);
  }, [id]);

  const product = useMemo(
    () => products.find((item) => item.id === id),
    [products, id]
  );

  const available = product ? isProductAvailable(product) : false;
  const isPreventa =
    (product?.status || "").trim().toLowerCase() === "preventa";

  const isOutOfStock =
    !!product && !isPreventa && !!product.price_1 && product.stock === 0;

  const showWhatsAppButton = isPreventa || isOutOfStock;

  const currentCartQty = useMemo(() => {
    if (!product) return 0;
    return cart.find((item) => item.id === product.id)?.qty ?? 0;
  }, [cart, product]);

  const parsedQtyInput =
    qtyInput.trim() !== "" && /^\d+$/.test(qtyInput)
      ? parseInt(qtyInput, 10)
      : null;

  const isQtyInputValid = parsedQtyInput !== null && parsedQtyInput >= 1;
  const effectiveQty = isQtyInputValid ? parsedQtyInput : qty;

  const unitPrice = product ? getUnitPrice(effectiveQty, product) : 0;
  const total = unitPrice * effectiveQty;
  const nextTier = product ? getNextTier(effectiveQty, product) : null;

  const savingsByQty =
    product && product.price_1 > unitPrice
      ? (product.price_1 - unitPrice) * effectiveQty
      : 0;

  useEffect(() => {
    if (!product) return;

    let currentTier = 1;

    if (effectiveQty >= 100 && product.price_100) currentTier = 100;
    else if (effectiveQty >= 50 && product.price_50) currentTier = 50;
    else if (effectiveQty >= 12 && product.price_12) currentTier = 12;
    else if (effectiveQty >= 3 && product.price_3) currentTier = 3;

    setPricePulse(true);
    const pulseTimer = setTimeout(() => setPricePulse(false), 220);

    let unlockTimer: ReturnType<typeof setTimeout> | null = null;

    // 🔥 SUBE DE TIER
    if (currentTier > lastTier && currentTier > 1) {
      setShowUnlock(true);

      unlockTimer = setTimeout(() => {
        setShowUnlock(false);
      }, 1800);
    }

    // 🔴 BAJA DE TIER
    if (currentTier < lastTier) {
      setShowUnlock(false);
    }

    setLastTier(currentTier);

    return () => {
      clearTimeout(pulseTimer);
      if (unlockTimer) clearTimeout(unlockTimer);
    };

  }, [effectiveQty, product, lastTier]);

  const related = useMemo(() => {
    if (!product) return [];

    const sameCategory = products.filter(
      (item) => item.category === product.category && item.id !== product.id
    );

    const otherCategories = products.filter(
      (item) => item.category !== product.category && item.id !== product.id
    );

    return [...sameCategory.slice(0, 4), ...otherCategories.slice(0, 4)];
  }, [products, product]);

  const updateQty = useCallback((newQty: number) => {
    const safeQty = Math.max(1, Math.floor(newQty));
    setQty(safeQty);
    setQtyInput(String(safeQty));
  }, []);

  const handleQtyInputChange = useCallback((value: string) => {
    if (value === "") {
      setQtyInput("");
      return;
    }

    if (!/^\d+$/.test(value)) return;

    setQtyInput(value);

    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed >= 1) {
      setQty(parsed);
    }
  }, []);

  const handleQtyInputBlur = useCallback(() => {
    if (qtyInput === "") return;

    const parsed = parseInt(qtyInput, 10);

    if (isNaN(parsed) || parsed < 1) {
      setQtyInput("");
      return;
    }

    const safeQty = Math.floor(parsed);
    setQty(safeQty);
    setQtyInput(String(safeQty));
  }, [qtyInput]);

  const handleQtyInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.currentTarget.blur();
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        updateQty(effectiveQty + 1);
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        updateQty(Math.max(1, effectiveQty - 1));
      }
    },
    [effectiveQty, updateQty]
  );

  const handleAddToCart = useCallback(() => {
    if (!product || !available || !isQtyInputValid || parsedQtyInput === null) return;

    const nextQtyInCart = currentCartQty + parsedQtyInput;

    addToCart(product, parsedQtyInput);
    setModalQty(nextQtyInCart);
    setAddModalOpen(true);


  }, [
    product,
    available,
    isQtyInputValid,
    parsedQtyInput,
    currentCartQty,
    addToCart,
  ]);

  const handleCloseAddModal = useCallback(() => {
    setAddModalOpen(false);
  }, []);

  const handleOpenCartFromModal = useCallback(() => {
    setAddModalOpen(false);
    setCartOpen(true);
  }, []);

  const handleAddExtraFromModal = useCallback(
    (extraQty: number) => {
      if (!product || extraQty <= 0) return;

      const nextQty = modalQty + extraQty;

      addToCart(product, extraQty);
      setModalQty(nextQty);
      setQty(nextQty);
      setQtyInput(String(nextQty));
     
    },
    [product, modalQty, addToCart]
  );

  const handleContinueAccumulating = useCallback(() => {
    setAddModalOpen(false);
    navigate("/catalogo");
  }, [navigate]);

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

  const handleWhatsApp = useCallback(() => {
    if (!product) return;

    let message = "";

    if (isPreventa) {
      message =
        `Hola, quiero información sobre este producto en preventa:%0A%0A` +
        `ID: ${product.id}%0AProducto: ${product.title}`;
    } else if (isOutOfStock) {
      message =
        `Hola, quiero pedir reposición de este producto:%0A%0A` +
        `ID: ${product.id}%0AProducto: ${product.title}`;
    }

    window.open(`https://wa.me/51936188636?text=${message}`, "_blank");
  }, [product, isPreventa, isOutOfStock]);

  let stockText = "Próximo";
  let stockColorClass = "text-muted-foreground";
  let StockIcon = Clock;

  if (product) {
    if (isPreventa) {
      stockText = "Preventa";
      stockColorClass = "text-green-700";
      StockIcon = Clock;
    } else if (!product.price_1 || product.price_1 <= 0 || product.stock === null || product.stock === undefined) {
      stockText = "Próximo";
      stockColorClass = "text-muted-foreground";
      StockIcon = Clock;
    } else if (product.stock === 0) {
      stockText = "Agotado";
      stockColorClass = "text-destructive";
      StockIcon = XCircle;
    } else if (product.stock <= 12) {
      stockText = `Últimas unidades: ${product.stock}`;
      stockColorClass = "text-red-600";
      StockIcon = AlertTriangle;
    } else if (product.stock <= 36) {
      stockText = "Stock limitado";
      stockColorClass = "text-orange-600";
      StockIcon = AlertTriangle;
    } else if (product.stock <= 50) {
      stockText = "Disponible para volumen";
      stockColorClass = "text-green-700";
      StockIcon = CheckCircle;
    } else {
      stockText = "🚀 Alto stock disponible";
      stockColorClass = "text-emerald-700";
      StockIcon = CheckCircle;
    }
  }

  if (loading) {
    return <ProductSkeleton />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground font-black text-lg">Producto no encontrado</p>
        <button
          onClick={() =>
            navigate(
              currentCategory
                ? `/catalogo/categoria.html?cat=${encodeURIComponent(currentCategory)}`
                : "/catalogo"
            )
          }
          className="p-2 bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-40">
      <NotificationStack />

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

              {product.badges && product.badges.length > 0 && (
                <div className="absolute top-4 left-4 flex flex-col gap-2 items-start max-w-[75%] z-10">
                  {sortBadges(product.badges)
                    .slice(0, 3)
                    .map((badge, index) => {
                      const presentation = getBadgePresentation(badge);

                      return (
                        <div
                          key={`${product.id}-detail-image-badge-${index}`}
                          className={[
                            "px-3 py-1.5 rounded-full text-[10px] md:text-[11px] font-semibold leading-tight tracking-normal border border-white/10 shadow-md backdrop-blur-sm",
                            presentation.className,
                            presentation.animation,
                          ].join(" ")}
                        >
                          {badge}
                        </div>
                      );
                    })}
                </div>
              )}

              <div className="absolute bottom-4 right-4 bg-card/80 backdrop-blur-sm p-2 rounded-xl text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-black text-foreground leading-tight mb-3">
                {product.title}
              </h2>

              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

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

            <div className="flex flex-wrap justify-center md:justify-start gap-1.5">
              {PRICE_TIERS.map((tier) => {
                const value = product[tier.key];
                if (!value) return null;

                const active =
                  (tier.qty === 1 && effectiveQty < 3) ||
                  (tier.qty === 3 && effectiveQty >= 3 && effectiveQty < 12) ||
                  (tier.qty === 12 && effectiveQty >= 12 && effectiveQty < 50) ||
                  (tier.qty === 50 && effectiveQty >= 50 && effectiveQty < 100) ||
                  (tier.qty === 100 && effectiveQty >= 100);

                const colorMap = {
                  price_1: active
                    ? "bg-primary text-primary-foreground border-primary shadow-lg"
                    : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15",
                  price_3: active
                    ? "bg-tertiary text-tertiary-foreground border-tertiary shadow-lg"
                    : "bg-tertiary/10 text-tertiary border-tertiary/20 hover:bg-tertiary/15",
                  price_12: active
                    ? "bg-secondary text-secondary-foreground border-secondary shadow-lg"
                    : "bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/15",
                  price_50: active
                    ? "bg-purple-500 text-white border-purple-500 shadow-lg"
                    : "bg-purple-500/10 text-purple-600 border-purple-500/20 hover:bg-purple-500/15",
                  price_100: active
                    ? "bg-dark text-white border-dark shadow-lg"
                    : "bg-dark/10 text-dark border-dark/20 hover:bg-dark/15",
                } as const;

                return (
                  <button
                    key={tier.key}
                    type="button"
                    onClick={() => updateQty(tier.qty)}
                    className={`px-2.5 py-2 rounded-xl border transition-all duration-200 text-center min-w-[74px] md:min-w-[78px] shadow-sm cursor-pointer ${
                      colorMap[tier.key]
                    } ${active ? "scale-[1.03]" : "hover:scale-[1.02]"}`}
                  >
                    <p className="text-[11px] md:text-[11px] font-black tracking-wide leading-none">
                      {tier.label}
                    </p>
                    <p className="text-[13px] md:text-sm font-black mt-1 leading-none">
                      S/ {value.toFixed(2)}
                    </p>
                  </button>
                );
              })}
            </div>

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

              {effectiveQty > 1 && (
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
                  🔥 Agrega {nextTier.qty - effectiveQty} más y baja a S/ {nextTier.price.toFixed(2)}
                </p>
              )}

              {!isQtyInputValid && (
                <p className="text-destructive font-semibold text-sm mt-2">
                  Ingresa una cantidad válida para continuar
                </p>
              )}
            </div>

            {available && (
              <div className="flex justify-center md:justify-start items-center gap-4">
                <button
                  type="button"
                  onClick={() => updateQty(effectiveQty - 1)}
                  className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-foreground hover:bg-border transition-colors"
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={qtyInput}
                  onChange={(e) => handleQtyInputChange(e.target.value)}
                  onBlur={handleQtyInputBlur}
                  onKeyDown={handleQtyInputKeyDown}
                  placeholder="0"
                  className="w-24 h-12 rounded-xl border-2 border-border bg-background text-center text-2xl font-black text-foreground outline-none focus:border-primary placeholder:text-muted-foreground/50"
                  aria-label="Cantidad"
                />

                <button
                  type="button"
                  onClick={() => updateQty(effectiveQty + 1)}
                  className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-foreground hover:bg-border transition-colors"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}

            {showWhatsAppButton ? (
              <button
                onClick={handleWhatsApp}
                className="w-full py-4 rounded-2xl font-black text-base shadow-xl transition-all flex items-center justify-center gap-3 bg-green-500 text-white hover:bg-green-600"
              >
                <PlusCircle className="w-5 h-5" />
                {isPreventa ? "Consultar por WhatsApp" : "Pedir reposición"}
              </button>
            ) : available ? (
              <button
                onClick={handleAddToCart}
                disabled={!isQtyInputValid}
                className={`w-full py-4 rounded-2xl font-black text-base shadow-xl transition-all flex items-center justify-center gap-3 ${
                  isQtyInputValid
                    ? "bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98]"
                    : "bg-muted text-muted-foreground cursor-not-allowed shadow-none"
                }`}
              >
                <PlusCircle className="w-5 h-5" />
                {isQtyInputValid
                  ? `Agregar a caja — S/ ${total.toFixed(2)}`
                  : "Ingresa una cantidad"}
              </button>
            ) : null}
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h3 className="text-lg md:text-xl font-black text-foreground mb-6 tracking-tight">
              Productos que complementan tu compra
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6">
              {related.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  onAddToCart={(item) => {
                    addToCart(item, 1);
                    showNotification("¡Agregado!", item.title);
                  }}
                  onImageClick={(src, title) => setZoomImage({ src, title })}
                />
              ))}
            </div>
          </section>
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
      />

      <AddToCartModal
        open={addModalOpen}
        product={product}
        currentQty={modalQty}
        onClose={handleCloseAddModal}
        onAddExtra={handleAddExtraFromModal}
        onOpenCart={handleOpenCartFromModal}
        secondaryActionLabel="Seguir acumulando"
        onSecondaryAction={handleContinueAccumulating}
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