import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";

import { ArrowLeft, SearchX } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { searchProducts } from "@/lib/search";
import { sortByCommercialPriority } from "@/lib/sort";
import { Product, CATEGORIES } from "@/types/product";
import { CountdownTimer } from "@/components/CountdownTimer";
import { CategoryFilter } from "@/components/products/CategoryFilter";
import { ProductCard } from "@/components/products/ProductCard";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { FloatingButtons } from "@/components/layout/FloatingButtons";


import { useCart } from "@/hooks/use-cart";
import { useCategoryProducts } from "@/hooks/category/useCategoryProducts";
import { filterCategoryProducts } from "@/lib/category/filterCategoryProducts";
import type { Product } from "@/types/product";
import { CATEGORIES } from "@/types/product";

import { CategoryFilter } from "@/components/CategoryFilter";
import { CartSidebar } from "@/components/CartSidebar";
import { FloatingButtons } from "@/components/FloatingButtons";

import { RecentActivity } from "@/components/RecentActivity";
import { ImageZoomModal } from "@/components/ImageZoomModal";
import { AddToCartModal } from "@/components/cart/AddToCartModal";
import { CategorySkeleton } from "@/components/skeletons/CategorySkeleton";

import { SearchInput } from "@/components/products/SearchInput";
import { useProducts } from "@/hooks/products/useProducts";


import { CategoryHeader } from "@/components/category/CategoryHeader";
import { CategoryEmpty } from "@/components/category/CategoryEmpty";
import { CategoryGrid } from "@/components/category/CategoryGrid";

const CategoryPage = () => {
  const { id: paramCategoryId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();


  const categoryId = searchParams.get("cat") || paramCategoryId;
  const activeCategory = categoryId || "todas";

  const { products, loading } = useCategoryProducts();

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
  } = useCartStore();

  const {
    data: products = [],
    isLoading: loading,
  } = useProducts();

  useEffect(() => {
    if (categoryId === "todas") {
      navigate("/catalogo", { replace: true });
    }
  }, [categoryId, navigate]);

  useEffect(() => {
    setCategorySearch("");
  }, [categoryId]);

  const categoryInfo = CATEGORIES.find(
    (category) => category.id === activeCategory
  );

  const {
    categoryProducts,
    filteredProducts,
  } = useMemo(
    () => filterCategoryProducts(products, activeCategory, categorySearch),
    [products, activeCategory, categorySearch]
  );

  const hasSearch = categorySearch.trim().length > 0;

  const handleCategorySelect = useCallback(
    (id: string) => {
      if (id === "todas") {
        navigate("/catalogo");
        return;
      }

      navigate(`/catalogo/categoria.html?cat=${id}`);
    },
    [navigate]
  );

  const handleAddToCart = useCallback(
    (product: Product) => {
      addToCart(product, 1);
      setSelectedProduct(product);
      setAddModalOpen(true);
    },
    [addToCart]
  );

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

  return (
    <div className="min-h-screen bg-background pb-40">
      <CategoryHeader
        categoryInfo={categoryInfo}
        categoryProducts={categoryProducts}
        filteredCount={filteredProducts.length}
        searchValue={categorySearch}
        onSearchChange={setCategorySearch}
        onBack={() => navigate("/catalogo")}
      />

      <main className="max-w-7xl mx-auto px-2 md:px-4 mt-6 md:mt-8">
        <CategoryFilter
          categories={CATEGORIES}
          active={activeCategory}
          onSelect={handleCategorySelect}
        />

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
            onImageClick={(src, title) => setZoomImage({ src, title })}
          />
        )}
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
