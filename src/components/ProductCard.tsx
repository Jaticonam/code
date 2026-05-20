import { useNavigate } from "react-router-dom";

import { CartItem, Product } from "@/types/product";
import { isProductAvailable } from "@/lib/products";
import { getCategoryColor } from "@/config/categoryColors";
import { useProductViewers } from "@/hooks/products/useProductViewers";

import { ProductCardBadges } from "@/components/ProductCardBadges";
import { ProductCardCartBadge } from "@/components/ProductCardCartBadge";
import { ProductCardTierBadges } from "@/components/ProductCardTierBadges";
import { ProductCardPrice } from "@/components/ProductCardPrice";
import { ProductCardStock } from "@/components/ProductCardStock";
import { ProductCardActions } from "@/components/ProductCardActions";

interface ProductCardProps {
  product: Product;
  cart?: CartItem[];
  onAddToCart: (product: Product) => void;
  onImageClick?: (src: string, title: string) => void;
}

export function ProductCard({
  product: p,
  cart = [],
  onAddToCart,
}: ProductCardProps) {
  const navigate = useNavigate();

  const available = isProductAvailable(p);
  const isPreventa = (p.status || "").trim().toLowerCase() === "preventa";
  const isOutOfStock = !isPreventa && !!p.price_1 && p.stock === 0;
  const showWhatsAppButton = isPreventa || isOutOfStock;

  const cartItem = cart.find((item) => item.id === p.id);
  const qtyInCart = cartItem?.qty ?? 0;
  const isInCart = qtyInCart > 0;

  const viewers = useProductViewers();

  const goToDetail = () => {
    navigate(`/catalogo/producto.html?id=${p.id}&cat=${p.category}`);
  };

  const handleAdd = () => {
    if (!available || isPreventa) return;
    onAddToCart(p);
  };

  const handleWhatsApp = () => {
    let message = "";

    if (isPreventa) {
      message =
        `Hola, quiero información sobre este producto en preventa:%0A%0A` +
        `ID: ${p.id}%0A` +
        `Producto: ${p.title}%0A` +
        `Categoría: ${p.category}`;
    } else if (isOutOfStock) {
      message =
        `Hola, quiero pedir reposición de este producto:%0A%0A` +
        `ID: ${p.id}%0A` +
        `Producto: ${p.title}%0A` +
        `Categoría: ${p.category}`;
    } else {
      message =
        `Hola, quiero más información sobre este producto:%0A%0A` +
        `ID: ${p.id}%0A` +
        `Producto: ${p.title}%0A` +
        `Categoría: ${p.category}`;
    }

    const url = `https://wa.me/51936188636?text=${message}`;
    window.open(url, "_blank");
  };

  return (
    <div className="card-product flex flex-col text-center p-[6px] md:p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-[340px] md:h-[300px] overflow-hidden rounded-[14px] md:rounded-[20px] mb-2.5 bg-muted">
        <img
          src={p.img || "/placeholder.svg"}
          alt={p.title}
          onClick={goToDetail}
          className={`cursor-pointer w-full h-full object-cover transition-transform duration-700 hover:scale-110 ${
            !available && !isPreventa ? "opacity-60 grayscale-[50%]" : ""
          }`}
          loading="lazy"
        />

        <ProductCardBadges productId={p.id} badges={p.badges} />

        <ProductCardCartBadge qty={qtyInCart} />

        <ProductCardTierBadges
          product={p}
          available={available}
          isPreventa={isPreventa}
        />
      </div>

      <div className="px-1 md:px-2 flex-grow flex flex-col justify-between">
        <div className="flex items-center justify-center gap-2 mb-1.5 flex-wrap">
          <span className="text-[10px] text-muted-foreground font-semibold">
            {p.id}
          </span>

          <span
            className={[
              "px-2.5 py-[3px] rounded-full text-[10px] font-bold uppercase tracking-tight",
              getCategoryColor(p.category),
            ].join(" ")}
          >
            {p.category}
          </span>
        </div>

        <h3
          onClick={goToDetail}
          className={`cursor-pointer hover:text-primary transition-colors font-extrabold text-[15px] md:text-[17px] line-clamp-2 leading-snug ${
            !available && !isPreventa ? "opacity-60" : ""
          }`}
        >
          {p.title}
        </h3>

        <p className="text-[12px] text-muted-foreground mt-1.5 line-clamp-2">
          {p.description ||
            (isPreventa ? "Consulta más información sobre esta preventa." : "")}
        </p>

        {isPreventa && (
          <p className="text-[12px] text-green-600 font-semibold mt-2">
            🚀 Disponible para consulta anticipada
          </p>
        )}

        <ProductCardPrice product={p} isPreventa={isPreventa} />

        <ProductCardStock
          stock={p.stock}
          price={p.price_1}
          status={p.status}
        />

        {(available || isPreventa) && (
          <p className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-[#1d8299]/10 text-[#1d8299] text-[11px] font-bold mt-1">
            👀 {viewers} viendo ahora
          </p>
        )}

        <ProductCardActions
          available={available}
          isPreventa={isPreventa}
          isInCart={isInCart}
          showWhatsAppButton={showWhatsAppButton}
          onAdd={handleAdd}
          onWhatsApp={handleWhatsApp}
        />
      </div>
    </div>
  );
}
