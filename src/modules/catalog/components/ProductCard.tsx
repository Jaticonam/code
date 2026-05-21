import { useNavigate } from "react-router-dom";
import { MessageCircle, PlusCircle } from "lucide-react";

import { CartItem, Product } from "@/shared/types/product";
import { getCategoryColor } from "@/shared/config/categoryColors";
import { ProductCardBadges } from "@/modules/catalog/components/ProductCardBadges";
import { ProductCardPrice } from "@/modules/catalog/components/ProductCardPrice";
import { ProductCardStock } from "@/modules/catalog/components/ProductCardStock";
import { ProductCardTierBadges } from "@/modules/catalog/components/ProductCardTierBadges";
import { useProductCard } from "@/modules/product-detail/hooks/useProductCard";
import { useProductViewers } from "@/modules/catalog/hooks/useProductViewers";

interface Props {
  product: Product;
  cart?: CartItem[];
  onAddToCart: (product: Product) => void;
  onImageClick?: (src: string, title: string) => void;
}

export function ProductCard({ product: p, cart = [], onAddToCart, onImageClick }: Props) {
  const navigate = useNavigate();
  const viewers = useProductViewers();

  const {
    available,
    isPreventa,
    showWhatsAppButton,
    isInCart,
    qtyInCart,
    handleAdd,
    handleWhatsApp,
  } = useProductCard(p, cart, onAddToCart);

  const goToDetail = () =>
    navigate(`/catalogo/producto.html?id=${p.id}&cat=${p.category}`);

  return (
    <div className="card-product flex flex-col p-[10px] text-center md:p-3">
      <div className="card-product-image relative mb-3 h-[340px] md:h-[300px]">
        <ProductCardBadges productId={p.id} badges={p.badges} />

        {isInCart && (
          <div className="absolute right-2 top-2 z-20 rounded-full bg-green-600 px-2.5 py-1 text-[10px] font-black leading-none text-white shadow-md">
            {qtyInCart} en caja
          </div>
        )}

        <img
          src={p.img || "/placeholder.svg"}
          alt={p.title}
          onClick={() => onImageClick?.(p.img, p.title)}
          className="h-full w-full cursor-pointer object-cover"
          loading="lazy"
        />

        <ProductCardTierBadges product={p} available={available} isPreventa={isPreventa} />
      </div>

      <div className="flex flex-grow flex-col justify-between px-1 md:px-2">
        <div>
          <div className="mb-2 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[10px] font-semibold text-slate-500">{p.id}</span>
            <span className={`rounded-full px-2.5 py-[4px] text-[10px] font-black uppercase ${getCategoryColor(p.category)}`}>
              {p.category}
            </span>
          </div>

          <h3 onClick={goToDetail} className="card-product-title cursor-pointer line-clamp-2">
            {p.title}
          </h3>

          <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-slate-500">
            {p.description || "Producto seleccionado para tu negocio."}
          </p>
        </div>

        <ProductCardPrice product={p} />
        <ProductCardStock stock={p.stock} price={p.price_1} status={p.status} />

        <p className="card-product-viewers mt-1 inline-flex items-center justify-center gap-1">
          👀 <span>{viewers} viendo ahora</span>
        </p>

        <button
          onClick={showWhatsAppButton ? handleWhatsApp : handleAdd}
          disabled={!available && !showWhatsAppButton}
          className={[
            "card-product-button mt-4 w-full px-4 py-3.5 text-white shadow-lg",
            showWhatsAppButton ? "bg-green-600 hover:bg-green-700" : "bg-[#1d8299] hover:bg-[#156f84]",
            !available && !showWhatsAppButton ? "cursor-not-allowed opacity-50" : "hover:shadow-xl",
          ].join(" ")}
        >
          <span className="flex items-center justify-center gap-2">
            {showWhatsAppButton ? <MessageCircle className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
            {showWhatsAppButton ? "Consultar" : isInCart ? `Agregar más (${qtyInCart})` : "Agregar pedido"}
          </span>
        </button>
      </div>
    </div>
  );
}