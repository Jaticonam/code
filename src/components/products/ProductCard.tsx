import { CartItem, Product } from "@/types/product";

import { ProductCardPrice } from "@/components/ProductCardPrice";
import { ProductCardStock } from "@/components/ProductCardStock";

import { ProductCardBadges } from "@/components/product/ProductCardBadges";
import { ProductCardMeta } from "@/components/product/ProductCardMeta";
import { ProductCardCTA } from "@/components/product/ProductCardCTA";
import { ProductCardViewers } from "@/components/product/ProductCardViewers";
import { ProductCardTierBadges } from "@/components/product/ProductCardTierBadges";

import { useProductCard } from "@/hooks/product/useProductCard";
import { useProductViewers } from "@/hooks/products/useProductViewers";

interface Props {
  product: Product;
  cart?: CartItem[];
  onAddToCart: (product: Product) => void;
  onImageClick?: (src: string, title: string) => void;
}

export function ProductCard({
  product: p,
  cart = [],
  onAddToCart,
  onImageClick,
}: Props) {
  const viewers = useProductViewers();

  const {
    available,
    isPreventa,
    showWhatsAppButton,
    isInCart,
    qtyInCart,
    goToDetail,
    handleAdd,
    handleWhatsApp,
  } = useProductCard(p, cart, onAddToCart);

  return (
    <div className="card-product flex flex-col text-center p-[6px] md:p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-[340px] md:h-[300px] overflow-hidden rounded-[14px] md:rounded-[20px] mb-2.5 bg-muted">
        <ProductCardBadges product={p} />

        {isInCart && (
          <div className="absolute top-2 right-2 z-20">
            <div className="inline-flex items-center gap-1 rounded-full bg-green-600 px-2 py-1 text-white shadow-md">
              <span className="text-[10px] md:text-[11px] font-bold leading-none">
                {qtyInCart} en caja
              </span>
            </div>
          </div>
        )}

        <img
          src={p.img || "/placeholder.svg"}
          alt={p.title}
          onClick={() => onImageClick?.(p.img, p.title)}
          className="h-full w-full cursor-pointer object-cover transition-transform duration-700 hover:scale-110"
          loading="lazy"
        />

        <ProductCardTierBadges
          product={p}
          available={available}
          isPreventa={isPreventa}
        />
      </div>

      <div className="flex flex-grow flex-col justify-between px-1 md:px-2">
        <ProductCardMeta
          product={p}
          available={available}
          isPreventa={isPreventa}
          goToDetail={goToDetail}
        />

        <ProductCardPrice product={p} />

        <ProductCardStock
          stock={p.stock}
          price={p.price_1}
          status={p.status}
        />

        <ProductCardViewers viewers={viewers} />

        <ProductCardCTA
          available={available}
          isPreventa={isPreventa}
          showWhatsAppButton={showWhatsAppButton}
          isInCart={isInCart}
          qtyInCart={qtyInCart}
          onAdd={handleAdd}
          onWhatsapp={handleWhatsApp}
        />
      </div>
    </div>
  );
}