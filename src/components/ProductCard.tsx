import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBadgePresentation, sortBadges } from "@/config/badgeRules";
import { getAvailablePriceTiers } from "@/config/priceTiers";
import {
  PlusCircle,
  CheckCircle,
  AlertTriangle,
  Clock,
  XCircle,
} from "lucide-react";
import { CartItem, Product } from "@/types/product";
import { getMinPrice, isProductAvailable } from "@/lib/products";

interface ProductCardProps {
  product: Product;
  cart?: CartItem[];
  onAddToCart: (product: Product) => void;
  onImageClick?: (src: string, title: string) => void;
}

const BADGE_STYLE_RULES = [
  {
    keywords: ["preventa", "pre venta", "lanzamiento", "proximamente", "próximamente"],
    className: "bg-green-500 text-white",
    animation: "animate-pulse",
  },
  {
    keywords: ["nuevo", "new"],
    className: "bg-purple-600 text-white",
    animation: "animate-pulse",
  },
  {
    keywords: ["oferta", "promo", "promocion", "promoción", "descuento"],
    className: "bg-red-600 text-white",
    animation: "",
  },
  {
    keywords: ["cyber", "cybermom", "campaña", "campana"],
    className: "bg-rose-700 text-white",
    animation: "",
  },
  {
    keywords: ["top", "top ventas", "destacado", "recomendado"],
    className: "bg-amber-500 text-white",
    animation: "",
  },
  {
    keywords: ["premium", "exclusivo", "vip"],
    className: "bg-slate-800 text-white",
    animation: "",
  },
  {
    keywords: ["regalo", "gift", "detalle"],
    className: "bg-pink-600 text-white",
    animation: "",
  },
];

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
  const minPrice = getMinPrice(p);
  const getBestTier = (product: Product) => {
    const tiers = [
      { qty: 1, price: Number(product.price_1) },
      { qty: 3, price: Number(product.price_3) },
      { qty: 12, price: Number(product.price_12) },
      { qty: 50, price: Number(product.price_50) },
      { qty: 100, price: Number(product.price_100) },
    ].filter((tier) => tier.price > 0);

    if (!tiers.length) return null;

    return [...tiers].sort((a, b) => a.price - b.price || a.qty - b.qty)[0];
  };
  
  const bestTier = getBestTier(p);

  const showBestTierMessage =
    bestTier &&
    bestTier.qty > 1 &&
    p.price_1 > bestTier.price;

  const cartItem = cart.find((item) => item.id === p.id);
  const qtyInCart = cartItem?.qty ?? 0;
  const isInCart = qtyInCart > 0;

  const [viewers, setViewers] = useState(Math.floor(Math.random() * 8) + 6);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(Math.floor(Math.random() * 8) + 6);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const goToDetail = () => navigate(`/catalogo/producto.html?id=${p.id}&cat=${p.category}`);

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

  let stockText: string;
  let stockColorClass: string;
  let StockIcon: typeof CheckCircle;

  if (isPreventa) {
    stockText = "Preventa";
    stockColorClass = "bg-green-100 text-green-700";
    StockIcon = Clock;

  } else if (!p.price_1 || p.price_1 <= 0 || p.stock === null || p.stock === undefined) {
    stockText = "Próximo";
    stockColorClass = "bg-muted text-muted-foreground";
    StockIcon = Clock;

  } else if (p.stock === 0) {
    stockText = "Agotado";
    stockColorClass = "bg-destructive/10 text-destructive";
    StockIcon = XCircle;

  } else if (p.stock <= 12) {
    // 🔥 SOLO AQUÍ mostramos número
    stockText = `Últimas unidades:${p.stock}`;
    stockColorClass = "bg-red-100 text-red-600";
    StockIcon = AlertTriangle;

  } else if (p.stock <= 36) {
    stockText = "Stock limitado";
    stockColorClass = "bg-orange-100 text-orange-600";
    StockIcon = AlertTriangle;

  } else if (p.stock <= 50) {
    stockText = "Stock disponible";
    stockColorClass = "bg-green-100 text-green-700";
    StockIcon = CheckCircle;

  } else {
    stockText = "🚀 Alto stock disponible";
    stockColorClass = "bg-emerald-100 text-emerald-700";
    StockIcon = CheckCircle;
  }

  return (
    <div className="bg-card rounded-[20px] md:rounded-[28px] border border-border p-2.5 md:p-4 flex flex-col shadow-sm text-center transition-all duration-400 hover:-translate-y-2 hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
      <div className="relative aspect-square overflow-hidden rounded-[14px] md:rounded-[20px] mb-2.5 bg-muted">
        <img
          src={p.img || "/placeholder.svg"}
          alt={p.title}
          onClick={goToDetail}
          className={`cursor-pointer w-full h-full object-cover transition-transform duration-700 hover:scale-110 ${
            !available && !isPreventa ? "opacity-60 grayscale-[50%]" : ""
          }`}
          loading="lazy"
        />

        {p.badges && p.badges.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-col gap-1.5 items-start max-w-[75%] z-10">
            {sortBadges(p.badges)
              .slice(0, 2)
              .map((badge, index) => {
                const presentation = getBadgePresentation(badge);

                return (
                  <div
                    key={`${p.id}-badge-${index}`}
                    className={[
                      "text-[10px] md:text-[11px] font-semibold px-3 py-1 rounded-full leading-tight tracking-normal backdrop-blur-sm border border-white/10 shadow-md",
                      presentation.className,
                      presentation.animation,
                    ].join(" ")}
                  >
                    {badge}
                  </div>
                );
              })}
          </div>
        )}

        {isInCart && (
          <div className="absolute top-2 right-2 z-10">
            <div className="inline-flex items-center gap-1 rounded-full bg-green-600 text-white px-2 py-1 shadow-md">
              <CheckCircle className="w-3.5 h-3.5" />
              <span className="text-[10px] md:text-[11px] font-bold leading-none">
                {qtyInCart} en caja
              </span>
            </div>
          </div>
        )}

        {available && !isPreventa && (
          <div className="absolute bottom-2 right-2 flex flex-col gap-1 items-end">
            {getAvailablePriceTiers(p).map((t, i) => {
              const price = p[t.key];

              if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
                return null;
              }

              return (
                <div
                  key={t.key}
                  className={`${t.className} price-badge-bounce text-[11px] font-black px-2.5 py-1 rounded-md shadow`}
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  {t.label} S/{price.toFixed(1)}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="px-1 md:px-2 flex-grow flex flex-col justify-between">
        <div className="flex items-center justify-center gap-2 mb-1.5 flex-wrap">
          <span className="text-[10px] text-muted-foreground font-semibold">
            {p.id}
          </span>

          <span className="px-2 py-[2px] rounded-full bg-muted text-[9px] font-semibold text-foreground uppercase tracking-wide">
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
          {p.description || (isPreventa ? "Consulta más información sobre esta preventa." : "")}
        </p>

        {isPreventa && (
          <p className="text-[12px] text-green-600 font-semibold mt-2">
            🚀 Disponible para consulta anticipada
          </p>
        )}

        <div className="mt-3 pt-3 border-t border-border flex flex-col items-center gap-1.5">
          {isPreventa ? (
            <>
              <span className="text-[13px] text-muted-foreground font-semibold">
                Próximamente
              </span>

              <div className="flex items-baseline gap-1">
                <span className="text-[13px] text-muted-foreground">💬</span>
                <span className="text-[20px] md:text-[22px] font-black text-green-600 tracking-tight">
                  Consultar
                </span>
              </div>

              <span className="text-[11px] text-muted-foreground font-medium">
                Te brindamos más información por WhatsApp
              </span>
            </>
          ) : (
            <>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-[13px] text-muted-foreground font-semibold">S/</span>
                <span className="text-[26px] md:text-[30px] font-black text-primary tracking-tight leading-none">
                  {p.price_1.toFixed(1)}
                </span>
              </div>

              <span className="text-[11px] text-muted-foreground font-medium">
                Precio por unidad
              </span>

              {showBestTierMessage && (
                <span className="inline-flex items-center justify-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                  🔥 Lleva {bestTier.qty} y paga S/ {bestTier.price.toFixed(1)} c/u
                </span>
              )}
            </>
          )}
        </div>

        <div
          className={`mt-2 inline-flex items-center justify-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold ${stockColorClass}`}
        >
          <StockIcon className="w-3 h-3" />
          {stockText}
        </div>

        {(available || isPreventa) && (
          <p className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold mt-1">
            👀 {viewers} viendo ahora
          </p>
        )}

        <button
          onClick={showWhatsAppButton ? handleWhatsApp : handleAdd}
          disabled={!available && !showWhatsAppButton}
          className={[
            "w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12px] font-semibold transition-all duration-200",
            showWhatsAppButton
              ? "bg-green-500 text-white hover:bg-green-600"
              : isInCart
              ? "bg-green-600 text-white hover:bg-green-700 active:scale-[0.96]"
              : available
              ? "bg-primary/95 text-primary-foreground active:scale-[0.96]"
              : "bg-muted text-muted-foreground cursor-not-allowed",
          ].join(" ")}
        >
          {showWhatsAppButton ? (
            <>
              <span>
                {isPreventa ? "Consultar por WhatsApp" : "Pedir reposición"}
              </span>
            </>
          ) : available ? (
            isInCart ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Agregar más</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Agregar a caja</span>
              </>
            )
          ) : (
            <span>Agotado</span>
          )}
        </button>
      </div>
    </div>
  );
}