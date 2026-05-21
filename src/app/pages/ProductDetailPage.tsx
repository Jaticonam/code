import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import { useCartStore } from "@/modules/cart/store";
import { useProducts } from "@/modules/catalog/hooks/useProducts";

import { Product } from "@/shared/types/product";

import { getUnitPrice, getStockPresentation, getBestProductTier } from "@/shared/lib/product";
import { getNextTier } from "@/shared/lib/product";

import { useProductViewers } from "@/modules/product-detail/hooks/useProductViewers";
import { useRelatedProducts } from "@/modules/product-detail/hooks/useRelatedProducts";

import { FloatingButtons } from "@/shared/components/layout/FloatingButtons";
import { ImageZoomModal } from "@/shared/components/media/ImageZoomModal";
import { ProductSkeleton } from "@/shared/components/skeletons/ProductSkeleton";

import { CartSidebar } from "@/modules/cart/components/CartSidebar";
import { AddToCartModal } from "@/modules/cart/components/AddToCartModal";

import {
  NotificationStack,
  showNotification,
} from "@/modules/feedback/components/NotificationStack";

import { RecentActivity } from "@/modules/feedback/components/RecentActivity";

import { ProductDetailHeader } from "@/modules/product-detail/components/ProductDetailHeader";
import { ProductGallery } from "@/modules/product-detail/components/ProductGallery";
import { ProductStockInfo } from "@/modules/product-detail/components/ProductStockInfo";
import { ProductTierSelector } from "@/modules/product-detail/components/ProductTierSelector";
import { ProductPriceBlock } from "@/modules/product-detail/components/ProductPriceBlock";
import { ProductQuantitySelector } from "@/modules/product-detail/components/ProductQuantitySelector";
import { ProductPurchaseActions } from "@/modules/product-detail/components/ProductPurchaseActions";
import { RelatedProducts } from "@/modules/product-detail/components/RelatedProducts";


const ProductDetailPage = () => {
  const { id: paramId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const fromSearch = location.state?.fromSearch;
  const searchQuery = location.state?.searchQuery;
  const currentCategory = searchParams.get("cat") || "";
  const id = searchParams.get("id") || paramId;

  const { data: products = [], isLoading: loading } = useProducts();

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
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
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

  const status = (product?.status || "").trim().toLowerCase();
  const available = !!product && ["publicado", "preventa"].includes(status);
  const isPreventa = status === "preventa";
  const isOutOfStock = !!product && !isPreventa && !!product.price_1 && product.stock === 0;
  const showWhatsAppButton = isPreventa || isOutOfStock;

  const currentCartQty = useMemo(
    () => (product ? cart.find((item) => item.id === product.id)?.qty ?? 0 : 0),
    [cart, product]
  );

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
  const stockPresentation = product ? getStockPresentation(product, isPreventa) : null;

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
