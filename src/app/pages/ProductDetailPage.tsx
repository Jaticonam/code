import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import {
  useCartStore,
} from "@/modules/cart/store";

import {
  isProductPurchasable,
} from "@/modules/catalog/domain/ProductCommercialPolicy";

import {
  getNextVolumePrice,
  getVolumeUnitPrice,
} from "@/shared/domain/volumePricing/VolumePricing";

import {
  useProducts,
} from "@/modules/catalog/hooks/useProducts";

import type {
  Product,
} from "@/shared/types/product";

import {
  getStockPresentation,
} from "@/shared/lib/product";

import {
  useProductViewers,
} from "@/modules/product-detail/hooks/useProductViewers";

import {
  useRelatedProducts,
} from "@/modules/product-detail/hooks/useRelatedProducts";

import {
  resolveProductDetailCommercialState,
} from "@/modules/product-detail/domain/ProductDetailCommercialState";

import {
  buildProductWhatsappMessage,
  buildProductWhatsappUrl,
  type ProductWhatsappIntent,
} from "@/modules/product-detail/utils/BuildProductWhatsappMessage";

import {
  FloatingButtons,
} from "@/shared/components/layout/FloatingButtons";

import {
  ImageZoomModal,
} from "@/shared/components/media/ImageZoomModal";

import {
  ProductSkeleton,
} from "@/shared/components/skeletons/ProductSkeleton";

import {
  CartSidebar,
} from "@/modules/cart/components/CartSidebar";

import {
  AddToCartModal,
} from "@/modules/cart/components/AddToCartModal";

import {
  RecentActivity,
} from "@/modules/feedback/components/RecentActivity";

import {
  ProductDetailHeader,
} from "@/modules/product-detail/components/ProductDetailHeader";

import {
  ProductGallery,
} from "@/modules/product-detail/components/ProductGallery";

import {
  ProductStockInfo,
} from "@/modules/product-detail/components/ProductStockInfo";

import {
  ProductVolumePriceSelector,
} from "@/modules/product-detail/components/ProductVolumePriceSelector";

import {
  ProductPriceBlock,
} from "@/modules/product-detail/components/ProductPriceBlock";

import {
  ProductQuantitySelector,
} from "@/modules/product-detail/components/ProductQuantitySelector";

import {
  ProductPurchaseActions,
} from "@/modules/product-detail/components/ProductPurchaseActions";

import {
  RelatedProducts,
} from "@/modules/product-detail/components/RelatedProducts";

import {
  ProductVolumePriceProgress,
} from "@/modules/product-detail/components/ProductVolumePriceProgress";

import {
  ProductSeo,
} from "@/shared/seo/productSeoComponent";

import {
  getProductSeo,
} from "@/shared/seo/productSeo";

import {
  getProductMedia,
} from "@/shared/lib/productMedia";

const ProductDetailPage =
  () => {
  const {
    id:
      paramId,
  } =
    useParams<{
      id:
        string;
    }>();

  const [
    searchParams,
  ] =
    useSearchParams();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const fromSearch =
    location.state
      ?.fromSearch;

  const searchQuery =
    location.state
      ?.searchQuery;

  const currentCategory =
    searchParams.get(
      "cat",
    ) ||
    "";

  const id =
    searchParams.get(
      "id",
    ) ||
    paramId;

  const productCategory =
    currentCategory ||
    "todas";

  const {
    data:
      products = [],

    isLoading:
      loading,
  } =
    useProducts(
      productCategory as never,
    );

  const [
    cartOpen,
    setCartOpen,
  ] =
    useState(false);

  const [
    addModalOpen,
    setAddModalOpen,
  ] =
    useState(false);

  const [
    selectedRelated,
    setSelectedRelated,
  ] =
    useState<Product | null>(
      null,
    );

  const [
    zoomGallery,
    setZoomGallery,
  ] =
    useState<{
      initialIndex:
        number;
    } | null>(
      null,
    );

  const [
    qty,
    setQty,
  ] =
    useState(1);

  const [
    qtyInput,
    setQtyInput,
  ] =
    useState("1");

  const [
    lastVolumePrice,
    setLastVolumePrice,
  ] =
    useState(1);

  const [
    showUnlock,
    setShowUnlock,
  ] =
    useState(false);

  const [
    pricePulse,
    setPricePulse,
  ] =
    useState(false);

  const [
    pageReady,
    setPageReady,
  ] =
    useState(false);

  const viewers =
    useProductViewers();

  const {
    cart,
    addToCart,
    removeFromCart,
    changeQty,
    setExactQty,
    setItemNote,
    clearCart,
    totalItems,
    totalPrice,
    savings,
  } =
    useCartStore();

  const product =
    useMemo(
      () =>
        products.find(
          (
            item,
          ) =>
            item.id ===
            id,
        ),
      [
        products,
        id,
      ],
    );

  const commercialState =
    useMemo(
      () =>
        product
          ? resolveProductDetailCommercialState(
              product,
            )
          : null,
      [
        product,
      ],
    );

  const available =
    commercialState
      ?.isPurchasable ??
    false;

  const isPreventa =
    commercialState
      ?.isPreventa ??
    false;

  const isAgotado =
    commercialState
      ?.isAgotado ??
    false;

  const showWhatsAppButton =
    commercialState
      ?.isConsultOnly ??
    false;

  const canShowPricing =
    commercialState
      ?.canShowPricing ??
    false;

  const canShowVolumePricing =
    commercialState
      ?.canShowVolumePricing ??
    false;

  const canSelectQuantity =
    commercialState
      ?.canSelectQuantity ??
    false;

  /*
   * Conserva el comportamiento visual de la galería:
   * publicado y preventa permanecen activos;
   * agotado conserva su presentación no disponible.
   */
  const galleryAvailable =
    available ||
    isPreventa;

  const productMedia =
    product
      ? getProductMedia(
          product,
        )
      : [];

  const productSeo =
    getProductSeo(
      product,
      id,
    );

  const selectedRelatedQty =
    selectedRelated
      ? (
          cart.find(
            (
              item,
            ) =>
              item.id ===
              selectedRelated.id,
          )?.qty ??
          0
        )
      : 0;
  useEffect(
    () => {
      setPageReady(
        false,
      );

      const timer =
        window.setTimeout(
          () => {
            window.scrollTo({
              top:
                0,

              left:
                0,

              behavior:
                "smooth",
            });
          },
          0,
        );

      const readyTimer =
        window.setTimeout(
          () =>
            setPageReady(
              true,
            ),
          220,
        );

      setQty(
        1,
      );

      setQtyInput(
        "1",
      );

      setLastVolumePrice(
        1,
      );

      setShowUnlock(
        false,
      );

      setPricePulse(
        false,
      );

      return () => {
        window.clearTimeout(
          timer,
        );

        window.clearTimeout(
          readyTimer,
        );
      };
    },
    [
      id,
    ],
  );

  const parsedQtyInput =
    qtyInput.trim() !==
      "" &&
    /^\d+$/.test(
      qtyInput,
    )
      ? parseInt(
          qtyInput,
          10,
        )
      : null;

  const isQtyInputValid =
    parsedQtyInput !==
      null &&
    parsedQtyInput >=
      1;

  const effectiveQty =
    isQtyInputValid
      ? parsedQtyInput
      : qty;

  /*
   * Los cálculos comerciales solo reciben la cantidad
   * seleccionada cuando el producto es comprable.
   *
   * Agotado puede mostrar precio unitario, pero nunca
   * escalas, ahorro por cantidad ni total transaccional.
   */
  const pricingQty =
    available
      ? effectiveQty
      : 1;

  const unitPrice =
    product &&
    canShowPricing
      ? getVolumeUnitPrice(
          product,
          pricingQty,
        )
      : 0;

  const total =
    available
      ? unitPrice *
        effectiveQty
      : unitPrice;

  const nextVolumePrice =
    product &&
    canShowVolumePricing
      ? getNextVolumePrice(
          product,
          effectiveQty,
        )
      : null;

  const savingsByQty =
    product &&
    available &&
    product.price_1 >
      unitPrice
      ? (
          product.price_1 -
          unitPrice
        ) *
        effectiveQty
      : 0;

  const related =
    useRelatedProducts(
      products,
      product,
    );

  const stockPresentation =
    product
      ? getStockPresentation(
          product,
          isPreventa,
        )
      : null;

  const handleBack =
    useCallback(
      () => {
        if (
          fromSearch
        ) {
          navigate(
            "/catalogo",
            {
              state: {
                restoreSearch:
                  searchQuery,
              },
            },
          );

          return;
        }

        navigate(
          currentCategory
            ? `/catalogo/categoria.html?cat=${encodeURIComponent(
                currentCategory,
              )}`
            : "/catalogo",
        );
      },
      [
        navigate,
        currentCategory,
        fromSearch,
        searchQuery,
      ],
    );

  useEffect(
    () => {
      const onKeyDown =
        (
          event:
            KeyboardEvent,
        ) => {
          const target =
            event.target as
              HTMLElement;

          const isTyping =
            [
              "INPUT",
              "TEXTAREA",
            ].includes(
              target.tagName,
            ) ||
            target.isContentEditable;

          if (
            isTyping
          ) {
            return;
          }

          if (
            event.key ===
            "Backspace"
          ) {
            event.preventDefault();

            handleBack();
          }
        };

      window.addEventListener(
        "keydown",
        onKeyDown,
      );

      return () =>
        window.removeEventListener(
          "keydown",
          onKeyDown,
        );
    },
    [
      handleBack,
    ],
  );

  const handleShare =
    useCallback(
      async () => {
        const url =
          window.location.href;

        try {
          if (
            navigator.share
          ) {
            await navigator.share({
              title:
                product?.title,

              text:
                product?.description,

              url,
            });

            return;
          }

          await navigator.clipboard
            .writeText(
              url,
            );
        } catch {
          console.warn(
            "No se pudo compartir el producto",
          );
        }
      },
      [
        product,
      ],
    );

  const updateQty =
    useCallback(
      (
        nextQty:
          number,
      ) => {
        if (
          !product ||
          !canSelectQuantity
        ) {
          return;
        }

        const cleanQty =
          Math.max(
            1,
            nextQty,
          );

        setQty(
          cleanQty,
        );

        setQtyInput(
          String(
            cleanQty,
          ),
        );

        const nextUnitPrice =
          getVolumeUnitPrice(
            product,
            cleanQty,
          );

        const nextVolumePriceQty =
          cleanQty >= 100
            ? 100
            : cleanQty >= 50
              ? 50
              : cleanQty >= 12
                ? 12
                : cleanQty >= 3
                  ? 3
                  : 1;

        if (
          nextVolumePriceQty >
          lastVolumePrice
        ) {
          setShowUnlock(
            true,
          );

          window.setTimeout(
            () =>
              setShowUnlock(
                false,
              ),
            1400,
          );
        }

        if (
          nextUnitPrice !==
          unitPrice
        ) {
          setPricePulse(
            true,
          );

          window.setTimeout(
            () =>
              setPricePulse(
                false,
              ),
            220,
          );
        }

        setLastVolumePrice(
          nextVolumePriceQty,
        );
      },
      [
        product,
        canSelectQuantity,
        lastVolumePrice,
        unitPrice,
      ],
    );

  const handleQtyInputChange =
    useCallback(
      (
        value:
          string,
      ) => {
        if (
          !canSelectQuantity
        ) {
          return;
        }

        if (
          value ===
            "" ||
          /^\d+$/.test(
            value,
          )
        ) {
          setQtyInput(
            value,
          );
        }
      },
      [
        canSelectQuantity,
      ],
    );

  const handleQtyInputBlur =
    useCallback(
      () => {
        if (
          !canSelectQuantity
        ) {
          return;
        }

        if (
          !isQtyInputValid
        ) {
          setQtyInput(
            String(
              qty,
            ),
          );

          return;
        }

        updateQty(
          effectiveQty,
        );
      },
      [
        canSelectQuantity,
        effectiveQty,
        isQtyInputValid,
        qty,
        updateQty,
      ],
    );

  const handleQtyInputKeyDown =
    useCallback(
      (
        event:
          React.KeyboardEvent<HTMLInputElement>,
      ) => {
        if (
          event.key ===
          "Enter"
        ) {
          event.currentTarget
            .blur();
        }
      },
      [],
    );

  const handleAddToCart =
    useCallback(
      () => {
        if (
          !product ||
          !available ||
          !isQtyInputValid ||
          !isProductPurchasable(
            product,
          )
        ) {
          return;
        }

        addToCart(
          product,
          effectiveQty,
        );

        setCartOpen(
          true,
        );
      },
      [
        product,
        available,
        isQtyInputValid,
        addToCart,
        effectiveQty,
      ],
    );

  const handleRelatedAddToCart =
    useCallback(
      (
        relatedProduct:
          Product,
      ) => {
        if (
          !isProductPurchasable(
            relatedProduct,
          )
        ) {
          return;
        }

        addToCart(
          relatedProduct,
          1,
        );

        setSelectedRelated(
          relatedProduct,
        );

        setAddModalOpen(
          true,
        );
      },
      [
        addToCart,
      ],
    );

  const handleRelatedExtra =
    useCallback(
      (
        extraQty:
          number,
      ) => {
        if (
          !selectedRelated ||
          extraQty <=
            0 ||
          !isProductPurchasable(
            selectedRelated,
          )
        ) {
          return;
        }

        addToCart(
          selectedRelated,
          extraQty,
        );
      },
      [
        selectedRelated,
        addToCart,
      ],
    );

  const handleRelatedOpenCart =
    useCallback(
      () => {
        setAddModalOpen(
          false,
        );

        setCartOpen(
          true,
        );
      },
      [],
    );

  const handleWhatsApp =
    useCallback(
      () => {
        if (
          !product
        ) {
          return;
        }

        const intent:
          ProductWhatsappIntent =
            isPreventa
              ? "preorder"
              : isAgotado
                ? "restock"
                : "information";

        const message =
          buildProductWhatsappMessage(
            product,
            {
              intent,

              productUrl:
                window.location.href,
            },
          );

        window.open(
          buildProductWhatsappUrl(
            message,
          ),
          "_blank",
        );
      },
      [
        product,
        isPreventa,
        isAgotado,
      ],
    );

  if (
    loading ||
    !pageReady
  ) {
    return (
      <ProductSkeleton />
    );
  }

  if (
    !product ||
    !commercialState
      ?.isPubliclyVisible
  ) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground font-black text-lg">
          Producto no encontrado
        </p>

        <button
          onClick={() => {
            if (
              window.history.length >
              1
            ) {
              navigate(
                -1,
              );

              return;
            }

            navigate(
              currentCategory
                ? `/catalogo/categoria.html?cat=${encodeURIComponent(
                    currentCategory,
                  )}`
                : "/catalogo",
            );
          }}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-muted text-muted-foreground shadow-sm transition-all hover:bg-accent hover:text-foreground active:scale-95"
          aria-label="Volver"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background pb-28 md:pb-40">
      <ProductSeo
        seo={
          productSeo
        }
        product={
          product
        }
      />

      <ProductDetailHeader
        product={
          product
        }
        onBack={
          handleBack
        }
        onShare={
          handleShare
        }
      />

      <main className="max-w-7xl mx-auto px-4 md:px-6 mt-4 md:mt-10">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,560px)_minmax(420px,1fr)] xl:grid-cols-[minmax(0,620px)_minmax(460px,1fr)] lg:gap-8 xl:gap-10 items-start">
          <ProductGallery
            product={
              product
            }
            available={
              galleryAvailable
            }
            onZoom={(
              index,
            ) =>
              setZoomGallery({
                initialIndex:
                  index,
              })
            }
          />

          <div className="flex flex-col gap-4 md:gap-6 card-shop p-4 md:p-7 bg-white">
            <div className="mb-2 flex flex-wrap justify-center gap-2 md:justify-start">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-600">
                Código:{" "}
                {
                  product.id
                }
              </span>

              <span className="rounded-full bg-[#e6f6f8] px-3 py-1 text-[11px] font-black capitalize text-[#1d8299]">
                {
                  product.category
                }
              </span>
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-[28px] tracking-tight font-black text-foreground leading-tight mb-3">
                {
                  product.title
                }
              </h2>

              <p className="text-sm md:text-base text-[#64748b] leading-relaxed">
                {
                  product.description
                }
              </p>
            </div>

            <ProductStockInfo
              product={
                product
              }
              available={
                available
              }
              viewers={
                viewers
              }
              stockPresentation={
                stockPresentation
              }
            />

            {canShowVolumePricing && (
              <ProductVolumePriceSelector
                product={
                  product
                }
                effectiveQty={
                  effectiveQty
                }
                onSelectQty={
                  updateQty
                }
              />
            )}

            {canShowPricing && (
              <ProductPriceBlock
                unitPrice={
                  unitPrice
                }
                total={
                  total
                }
                effectiveQty={
                  available
                    ? effectiveQty
                    : 1
                }
                pricePulse={
                  available &&
                  pricePulse
                }
                showUnlock={
                  available &&
                  showUnlock
                }
                savingsByQty={
                  available
                    ? savingsByQty
                    : 0
                }
                basePrice={
                  product.price_1
                }
                nextVolumePrice={
                  available
                    ? nextVolumePrice
                    : null
                }
                isQtyInputValid={
                  available
                    ? isQtyInputValid
                    : true
                }
              />
            )}

            {canShowVolumePricing && (
              <ProductVolumePriceProgress
                product={
                  product
                }
                effectiveQty={
                  effectiveQty
                }
                nextVolumePrice={
                  nextVolumePrice
                }
              />
            )}

            {canSelectQuantity && (
              <ProductQuantitySelector
                value={
                  qtyInput
                }
                effectiveQty={
                  effectiveQty
                }
                onDecrease={() =>
                  updateQty(
                    effectiveQty -
                      1,
                  )
                }
                onIncrease={() =>
                  updateQty(
                    effectiveQty +
                      1,
                  )
                }
                onChange={
                  handleQtyInputChange
                }
                onBlur={
                  handleQtyInputBlur
                }
                onKeyDown={
                  handleQtyInputKeyDown
                }
              />
            )}

            <ProductPurchaseActions
              showWhatsAppButton={
                showWhatsAppButton
              }
              isPreventa={
                isPreventa
              }
              available={
                available
              }
              isQtyInputValid={
                isQtyInputValid
              }
              total={
                total
              }
              onWhatsApp={
                handleWhatsApp
              }
              onAddToCart={
                handleAddToCart
              }
            />
          </div>
        </div>

        <RelatedProducts
          products={
            related
          }
          onAddToCart={
            handleRelatedAddToCart
          }
          onImageClick={(
            relatedProduct,
          ) => {
            navigate(
              `/catalogo/producto.html?id=${relatedProduct.id}&cat=${encodeURIComponent(
                relatedProduct.category,
              )}`,
            );
          }}
        />
      </main>

      <FloatingButtons
        cartCount={
          totalItems
        }
        onCartClick={() =>
          setCartOpen(
            true,
          )
        }
      />

      <RecentActivity
        products={
          products
        }
      />

      <CartSidebar
        isOpen={
          cartOpen
        }
        onClose={() =>
          setCartOpen(
            false,
          )
        }
        cart={
          cart
        }
        totalItems={
          totalItems
        }
        totalPrice={
          totalPrice
        }
        savings={
          savings
        }
        onRemove={
          removeFromCart
        }
        onChangeQty={
          changeQty
        }
        onSetQty={
          setExactQty
        }
        onChangeNote={
          setItemNote
        }
        onClearCart={
          clearCart
        }
      />

      <ImageZoomModal
        media={
          productMedia
        }
        initialIndex={
          zoomGallery
            ?.initialIndex ??
          0
        }
        open={
          !!zoomGallery &&
          productMedia.length >
            0
        }
        title={
          product.title
        }
        onClose={() =>
          setZoomGallery(
            null,
          )
        }
      />

      <AddToCartModal
        open={
          addModalOpen
        }
        product={
          selectedRelated
        }
        currentQty={
          selectedRelatedQty
        }
        onClose={() =>
          setAddModalOpen(
            false,
          )
        }
        onAddExtra={
          handleRelatedExtra
        }
        onOpenCart={
          handleRelatedOpenCart
        }
        secondaryActionLabel="Seguir viendo"
        onSecondaryAction={() =>
          setAddModalOpen(
            false,
          )
        }
      />
    </div>
  );
};

export default ProductDetailPage;
