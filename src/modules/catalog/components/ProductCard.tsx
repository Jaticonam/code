import { useNavigate } from "react-router-dom";
import { MessageCircle, PlusCircle } from "lucide-react";

import { CartItem, Product } from "@/shared/types/product";
import { getCategoryColor } from "@/shared/config/categoryColors";
import { ProductCardBadges } from "@/modules/catalog/components/ProductCardBadges";
import { ProductCardPrice } from "@/modules/catalog/components/ProductCardPrice";
import { ProductCardStock } from "@/modules/catalog/components/ProductCardStock";
import { ProductCardTierBadges } from "@/modules/catalog/components/ProductCardTierBadges";
import { useProductCard } from "@/modules/product-detail/hooks/useProductCard";

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

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const selectedText = window.getSelection()?.toString().trim();
    if (selectedText) return;

    const target = e.target as HTMLElement;
    if (target.closest("[data-no-card-click],button,a,input,textarea,select"))
      return;

    goToDetail();
  };

  return (
    <div
      onClick={handleCardClick}
      className="card-product group flex flex-col p-2 text-center md:p-2.5"
    >
      <div className="card-product-image relative mb-2 h-[140px] overflow-hidden rounded-[18px] sm:h-[160px] md:h-[250px] xl:h-[220px]">
        <ProductCardBadges product={p} />

        {isInCart && (
          <div className="absolute right-2 top-2 z-20 rounded-full bg-[#1d8299] px-2.5 py-1 text-[10px] font-black leading-none text-white shadow-[0_6px_16px_rgba(29,130,153,.25)]">
            +{qtyInCart}
          </div>
        )}

        <img
          src={p.img || "/placeholder.svg"}
          alt={p.title}
          onClick={(e) => {
            e.stopPropagation();
            onImageClick?.(p.img, p.title);
          }}
          className="h-full w-full cursor-pointer object-cover object-center transition-transform duration-700 group-hover:scale-[1.035]"
          loading="lazy"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between px-1">
        <div>
          <div
            data-no-card-click
            className="mb-1.5 flex flex-wrap items-center justify-center gap-0.5"
          >
            <span className="rounded-full bg-slate-100 px-2 py-[3px] text-[9px] font-black uppercase text-slate-500">
              {p.id}
            </span>
            <span
              className={`rounded-full px-2 py-[3px] text-[9px] font-black uppercase ${getCategoryColor(p.category)}`}
            >
              {p.category}
            </span>
          </div>

          <h3
            data-no-card-click
            className="mb-0.3 card-product-title line-clamp-2"
          >
            {p.title}
          </h3>
        </div>

        <ProductCardPrice product={p} />

        <ProductCardStock stock={p.stock} price={p.price_1} status={p.status} />

        <ProductCardTierBadges
          product={p}
          available={available}
          isPreventa={isPreventa}
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (showWhatsAppButton) {
              handleWhatsApp();
              return;
            }
            handleAdd();
          }}
          disabled={!available && !showWhatsAppButton}
          className={[
            "card-product-button mt-2.5 w-full min-h-[36px] rounded-2xl px-2.5 py-2 text-[12px] font-black text-white shadow-md transition-all active:scale-[.98] md:min-h-[38px] md:text-[13px]",
            showWhatsAppButton
              ? "bg-green-600 hover:bg-green-700"
              : isInCart
                ? "bg-gradient-to-r from-[#156f84] to-[#1d8299] hover:shadow-lg"
                : "bg-gradient-to-r from-[#1d8299] to-[#156f84] hover:scale-[1.01] hover:shadow-lg",
            !available && !showWhatsAppButton
              ? "cursor-not-allowed opacity-50 shadow-none"
              : "",
          ].join(" ")}
        >
          <span className="flex items-center justify-center gap-1.5">
            {showWhatsAppButton ? (
              <MessageCircle className="h-4 w-4" />
            ) : (
              <PlusCircle className="h-4 w-4" />
            )}
            {showWhatsAppButton
              ? "Consultar"
              : isInCart
                ? `Sumar (${qtyInCart})`
                : "Agregar"}
          </span>
        </button>
      </div>
    </div>
  );
}
