import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { getBadgePresentation, sortBadges } from "@/config/badgeRules";
import { PRICE_TIERS } from "@/config/priceTiers";
import { useCartStore } from "@/store/cart";
import { fetchProducts, isProductAvailable } from "@/lib/products";
import { Product } from "@/types/product";

import { FloatingButtons } from "@/components/layout/FloatingButtons";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { NotificationStack, showNotification } from "@/components/NotificationStack";
import { RecentActivity } from "@/components/RecentActivity";
import { ImageZoomModal } from "@/components/ImageZoomModal";
import { CountdownTimer } from "@/components/CountdownTimer";
import { ProductCard } from "@/components/products/ProductCard";
import { useCart } from "@/hooks/use-cart";
import { fetchProducts, isProductAvailable } from "@/lib/products";
import { Product } from "@/types/product";

import { getUnitPrice } from "@/lib/product/getUnitPrice";
import { getNextTier } from "@/lib/product/getNextTier";
import { getStockPresentation } from "@/lib/product/getStockPresentation";
import { useProductViewers } from "@/hooks/product/useProductViewers";
import { useRelatedProducts } from "@/hooks/product/useRelatedProducts";

import { FloatingButtons } from "@/components/FloatingButtons";
import { CartSidebar } from "@/components/CartSidebar";
import { NotificationStack, showNotification } from "@/components/NotificationStack";
import { RecentActivity } from "@/components/RecentActivity";
import { ImageZoomModal } from "@/components/ImageZoomModal";
import { ProductSkeleton } from "@/components/skeletons/ProductSkeleton";
import { AddToCartModal } from "@/components/cart/AddToCartModal";

import { ProductDetailHeader } from "@/components/product/ProductDetailHeader";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductStockInfo } from "@/components/product/ProductStockInfo";
import { ProductTierSelector } from "@/components/product/ProductTierSelector";
import { ProductPriceBlock } from "@/components/product/ProductPriceBlock";
import { ProductQuantitySelector } from "@/components/product/ProductQuantitySelector";
import { ProductPurchaseActions } from "@/components/product/ProductPurchaseActions";
import { RelatedProducts } from "@/components/product/RelatedProducts";

import {
  useParams,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";

const ProductDetailPage = () => {
  const { id: paramId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const fromSearch = location.state?.fromSearch;
  const searchQuery = location.state?.searchQuery;

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

  const [lastTier, setLastTier] = useState(1);
  const [showUnlock, setShowUnlock] = useState(false);
  const [pricePulse, setPricePulse] = useState(false);

  const viewers = useProductViewers();

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
  } = useCartStore();

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
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

  const related = useRelatedProducts(products, product);

  const stockPresentation = product
    ? getStockPresentation(product, isPreventa)
    : null;

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

    if (currentTier > lastTier && currentTier > 1) {
      setShowUnlock(true);

      unlockTimer = setTimeout(() => {
        setShowUnlock(false);
      }, 1800);
    }

    if (currentTier < lastTier) {
      setShowUnlock(false);
    }

    setLastTier(currentTier);

    return () => {
      clearTimeout(pulseTimer);
      if (unlockTimer) clearTimeout(unlockTimer);
    };
  }, [effectiveQty, product, lastTier]);

  useEffect(() => {
    const handleBackspace = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;

      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isTyping) return;

      if (event.key === "Backspace") {
        event.preventDefault();
        handleBack();
      }
    };

    window.addEventListener("keydown", handleBackspace);

    return () => {
      window.removeEventListener("keydown", handleBackspace);
    };
  });

  const handleBack = useCallback(() => {
    if (fromSearch) {
      navigate("/catalogo", {
        state: {
          restoreSearch: searchQuery,
        },
      });
      return;
    }

    navigate(-1);
  }, [navigate, fromSearch, searchQuery]);

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
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.currentTarget.blur();
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        updateQty(effectiveQty + 1);
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
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

  const handleRelatedAddToCart = useCallback(
    (item: Product) => {
      addToCart(item, 1);
      showNotification("¡Agregado!", item.title);
    },
    [addToCart]
  );

  if (loading) {
    return <ProductSkeleton />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground font-black text-lg">
          Producto no encontrado
        </p>

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

      <ProductDetailHeader
        product={product}
        onBack={handleBack}
        onShare={handleShare}
      />

      <main className="max-w-5xl mx-auto px-4 md:px-6 mt-6 md:mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-start">
          <ProductGallery
            product={product}
            available={available}
            onZoom={(src, title) => setZoomImage({ src, title })}
          />

          <div className="flex flex-col gap-6 card-shop p-6 md:p-7 bg-white">
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-[28px] tracking-tight font-black text-foreground leading-tight mb-3">
                {product.title}
              </h2>

              <p className="text-sm md:text-base text-[#64748b] leading-relaxed">
                {product.description}
              </p>
            </div>

            <ProductStockInfo
              product={product}
              available={available}
              viewers={viewers}
              stockPresentation={stockPresentation}
            />

            <ProductTierSelector
              product={product}
              effectiveQty={effectiveQty}
              onSelectQty={updateQty}
            />

            <ProductPriceBlock
              unitPrice={unitPrice}
              total={total}
              effectiveQty={effectiveQty}
              pricePulse={pricePulse}
              showUnlock={showUnlock}
              savingsByQty={savingsByQty}
              basePrice={product.price_1}
              nextTier={nextTier}
              isQtyInputValid={isQtyInputValid}
            />

            {available && (
              <ProductQuantitySelector
                value={qtyInput}
                effectiveQty={effectiveQty}
                onDecrease={() => updateQty(effectiveQty - 1)}
                onIncrease={() => updateQty(effectiveQty + 1)}
                onChange={handleQtyInputChange}
                onBlur={handleQtyInputBlur}
                onKeyDown={handleQtyInputKeyDown}
              />
            )}

            <ProductPurchaseActions
              showWhatsAppButton={showWhatsAppButton}
              isPreventa={isPreventa}
              available={available}
              isQtyInputValid={isQtyInputValid}
              total={total}
              onWhatsApp={handleWhatsApp}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>

        <RelatedProducts
          products={related}
          onAddToCart={handleRelatedAddToCart}
          onImageClick={(src, title) => setZoomImage({ src, title })}
        />
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
      />

      <AddToCartModal
        open={addModalOpen}
        product={product}
        currentQty={modalQty}
        onClose={handleCloseAddModal}
        onAddExtra={handleAddExtraFromModal}
        onOpenCart={handleOpenCartFromModal}
        secondaryActionLabel="Más productos"
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
