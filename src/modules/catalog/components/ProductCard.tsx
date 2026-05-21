import { useNavigate } from "react-router-dom";
import { MessageCircle, PlusCircle } from "lucide-react";

import { CartItem, Product } from "@/shared/types/product";
import { ProductCardBadges } from "@/modules/catalog/components/ProductCardBadges";
import { ProductCardPrice } from "@/modules/catalog/components/ProductCardPrice";
import { ProductCardStock } from "@/modules/catalog/components/ProductCardStock";
import { ProductCardTierBadges } from "@/modules/catalog/components/ProductCardTierBadges";
import { useProductCard } from "@/modules/product-detail/hooks/useProductCard";
import { useProductViewers } from "@/modules/catalog/hooks/useProductViewers";
import { getCategoryColor } from "@/shared/config/categoryColors";

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
    <div className="card-product flex flex-col text-center p-[6px] md:p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-[340px] md:h-[300px] overflow-hidden rounded-[14px] md:rounded-[20px] mb-2.5 bg-muted">
        <ProductCardBadges product={p} />

        {isInCart && (
          <div className="absolute top-2 right-2 z-20 rounded-full bg-green-600 px-2 py-1 text-[10px] font-bold leading-none text-white shadow-md md:text-[11px]">
            {qtyInCart} en caja
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
        <div>
          <div className="mb-1.5 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[10px] font-semibold text-muted-foreground">
              {p.id}
            </span>

            <span
              className={`rounded-full px-2.5 py-[3px] text-[10px] font-bold uppercase ${getCategoryColor(p.category)}`}
            >
              {p.category}
            </span>
          </div>

          <h3
            onClick={goToDetail}
            className={`cursor-pointer text-[15px] font-extrabold leading-snug line-clamp-2 transition-colors hover:text-primary md:text-[17px] ${
              !available && !isPreventa ? "opacity-60" : ""
            }`}
          >
            {p.title}
          </h3>

          <p className="mt-1.5 line-clamp-2 text-[12px] text-muted-foreground">
            {p.description || (isPreventa ? "Consulta más información sobre esta preventa." : "")}
          </p>
        </div>

        <ProductCardPrice product={p} />

        <ProductCardStock
          stock={p.stock}
          price={p.price_1}
          status={p.status}
        />

        <p className="inline-flex items-center justify-center gap-1 text-[11px] text-slate-500">
          👀 <span>{viewers} viendo ahora</span>
        </p>

        <button
          onClick={showWhatsAppButton ? handleWhatsApp : handleAdd}
          disabled={!available && !showWhatsAppButton}
          className={[
            "mt-3 w-full rounded-2xl px-4 py-3 font-bold transition-all duration-200",
            showWhatsAppButton
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-[#1d8299] text-white hover:bg-[#156f84]",
            !available && !showWhatsAppButton ? "opacity-50" : "",
          ].join(" ")}
        >
          <span className="flex items-center justify-center gap-2">
            {showWhatsAppButton ? (
              <MessageCircle className="h-4 w-4" />
            ) : (
              <PlusCircle className="h-4 w-4" />
            )}

            {showWhatsAppButton
              ? "Consultar"
              : isInCart
              ? `Agregar más (${qtyInCart})`
              : "Agregar pedido"}
          </span>
        </button>
      </div>
    </div>
  );
}