import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { useCartStore } from "@/modules/cart/store";
import { useCategoryProducts } from "@/modules/category/hooks/useCategoryProducts";
import { filterCategoryProducts } from "@/modules/category/utils/filterCategoryProducts";
import { Product } from "@/shared/types/product";

import { CategoryFilter } from "@/modules/catalog/components/CategoryFilter";
import { CartSidebar } from "@/modules/cart/components/CartSidebar";
import { AddToCartModal } from "@/modules/cart/components/AddToCartModal";
import { CategoryHeader } from "@/modules/category/components/CategoryHeader";
import { CategoryEmpty } from "@/modules/category/components/CategoryEmpty";
import { CategoryGrid } from "@/modules/category/components/CategoryGrid";
import { FloatingButtons } from "@/shared/components/layout/FloatingButtons";
import { ImageZoomModal } from "@/shared/components/media/ImageZoomModal";
import { CategorySkeleton } from "@/shared/components/skeletons/CategorySkeleton";
import { RecentActivity } from "@/modules/feedback/components/RecentActivity";
import { CATEGORY_CONFIG } from "@/shared/config/categories";
import { getProductMedia, type ProductMedia } from "@/shared/lib/productMedia";

const CategoryPage = () => {
  const { id: paramCategoryId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const categoryId = searchParams.get("cat") || paramCategoryId;
  const activeCategory = categoryId || "todas";

  const { products: allProducts, loading } = useCategoryProducts();

  const [cartOpen, setCartOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [zoomGallery, setZoomGallery] = useState<{
    media: ProductMedia[];
    initialIndex: number;
    title: string;
  } | null>(null);

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
  } = useCartStore();

  useEffect(() => {
    if (categoryId === "todas") {
      navigate("/catalogo", { replace: true });
    }
  }, [categoryId, navigate]);

  useEffect(() => {
    setCategorySearch("");
  }, [categoryId]);

  const categoryInfo = CATEGORY_CONFIG.find((c) => c.id === activeCategory);

  const { categoryProducts, filteredProducts } = useMemo(
    () => filterCategoryProducts(allProducts, activeCategory, categorySearch),
    [allProducts, activeCategory, categorySearch],
  );

  const hasSearch = categorySearch.trim().length > 0;

  const handleCategorySelect = useCallback(
    (id: string) => {
      if (id === activeCategory) return;

      navigate(
        id === "todas" ? "/catalogo" : `/catalogo/categoria.html?cat=${id}`,
      );
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

  const handleAddExtra = useCallback(
    (qty: number) => {
      if (selectedProduct && qty > 0) {
        addToCart(selectedProduct, qty);
      }
    },
    [addToCart, selectedProduct],
  );

  const currentQtyInCart = selectedProduct
    ? (cart.find((item) => item.id === selectedProduct.id)?.qty ?? 0)
    : 0;

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-40">
      <CategoryHeader
        categoryInfo={categoryInfo}
        categoryProducts={categoryProducts}
        filteredCount={filteredProducts.length}
        searchValue={categorySearch}
        onSearchChange={setCategorySearch}
        onBack={() => navigate("/catalogo")}
        onOpenCategories={() => navigate("/catalogo")}
      />

      <main className="mx-auto mt-3 max-w-7xl px-2 md:mt-5 md:px-4">
        {loading ? (
          <CategorySkeleton />
        ) : filteredProducts.length === 0 ? (
          <CategoryEmpty
            hasSearch={hasSearch}
            onClearSearch={() => setCategorySearch("")}
          />
        ) : (
          <CategoryGrid
            products={filteredProducts}
            cart={cart}
            onAddToCart={handleAddToCart}
            onImageClick={(product) =>
              setZoomGallery({
                media: getProductMedia(product),
                initialIndex: 0,
                title: product.title,
              })
            }
          />
        )}
      </main>

      <FloatingButtons
        cartCount={totalItems}
        onCartClick={() => setCartOpen(true)}
      />

      <RecentActivity products={allProducts} />

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
        media={zoomGallery?.media ?? []}
        initialIndex={zoomGallery?.initialIndex ?? 0}
        open={!!zoomGallery}
        title={zoomGallery?.title ?? ""}
        onClose={() => setZoomGallery(null)}
      />

      <AddToCartModal
        open={addModalOpen}
        product={selectedProduct}
        currentQty={currentQtyInCart}
        onClose={() => setAddModalOpen(false)}
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
