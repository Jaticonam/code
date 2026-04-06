import { useNavigate } from "react-router-dom";
import { ShoppingCart, Lock, CheckCircle, AlertTriangle, Clock, XCircle } from "lucide-react";
import { Product } from "@/types/product";
import { getMinPrice, isProductAvailable } from "@/lib/products";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onImageClick: (src: string, title: string) => void;
}

const TIER_TAGS = [
  { key: "price_3" as const, label: "3u+", cls: "bg-tertiary/90" },
  { key: "price_12" as const, label: "12u+", cls: "bg-secondary/90" },
  { key: "price_50" as const, label: "50u+", cls: "bg-purple-500/90" },
  { key: "price_100" as const, label: "100u+", cls: "bg-dark/90" },
];

export function ProductCard({ product: p, onAddToCart, onImageClick }: ProductCardProps) {
  const navigate = useNavigate();
  const available = isProductAvailable(p);
  const minPrice = getMinPrice(p);

  const goToDetail = () => navigate(`/catalogo/producto.html?id=${p.id}`);

  let stockText: string;
  let stockColorClass: string;
  let StockIcon: typeof CheckCircle;

  if (!p.price_1 || p.price_1 <= 0 || p.stock === null || p.stock === undefined) {
    stockText = "próximamente";
    stockColorClass = "bg-muted text-muted-foreground border-border";
    StockIcon = Clock;
  } else if (p.stock === 0) {
    stockText = "agotado";
    stockColorClass = "bg-destructive/10 text-destructive border-destructive/20";
    StockIcon = XCircle;
  } else if (p.stock <= 3) {
    stockText = `últimas ${p.stock} unidades 🔥`;
    stockColorClass = "bg-tertiary/10 text-tertiary border-tertiary/20 animate-pulse-stock";
    StockIcon = AlertTriangle;
  } else {
    stockText = `stock: ${p.stock} unid.`;
    stockColorClass = "bg-success/10 text-success border-success/20";
    StockIcon = CheckCircle;
  }

  return (
    <div className="bg-card rounded-[20px] md:rounded-[28px] border border-border p-2.5 md:p-4 flex flex-col shadow-sm text-center transition-all duration-400 hover:-translate-y-2 hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
      {/* Imagen */}
      <div className="relative aspect-square overflow-hidden rounded-[14px] md:rounded-[20px] mb-2.5 bg-muted">
        <img
          src={p.img}
          alt={p.title}
          onClick={goToDetail}
          className={`cursor-pointer w-full h-full object-cover transition-transform duration-700 hover:scale-110 ${!available ? "opacity-60 grayscale-[50%]" : ""}`}
          loading="lazy"
        />
        <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-red-600 text-primary-foreground text-[8px] md:text-[9px] font-black px-2 md:px-3 py-1 rounded-md md:rounded-lg shadow-lg z-10 animate-pop-in uppercase tracking-widest pointer-events-none">
          CYBERMOM ✨
        </div>
        {available && (
          <div className="absolute bottom-1.5 right-1.5 md:bottom-2 md:right-2 flex flex-col gap-1 items-end z-10 pointer-events-none">
            {TIER_TAGS.map((t, i) =>
              p[t.key] ? (
                <div
                  key={t.key}
                  className={`${t.cls} backdrop-blur-sm border border-primary-foreground/30 shadow-md px-1.5 py-0.5 rounded-md flex items-center gap-1 animate-pop-in`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <span className="text-[7px] md:text-[8px] font-black text-primary-foreground uppercase tracking-tighter">{t.label}</span>
                  <span className="text-[10px] md:text-[12px] font-black text-primary-foreground tracking-tighter">{p[t.key]!.toFixed(1)}</span>
                </div>
              ) : null
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-1 md:px-2 flex-grow flex flex-col items-center justify-between">
        <div className="flex flex-col items-center w-full">
          <div className="flex items-center gap-1 mb-1.5 flex-wrap justify-center">
            <span className="text-[9px] md:text-[10px] font-black text-muted-foreground tracking-widest">{p.id}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className="text-[8px] md:text-[9px] font-black text-primary uppercase tracking-[0.1em] opacity-80">{p.category}</span>
          </div>
          <h3 onClick={goToDetail} className={`cursor-pointer hover:text-primary transition-colors font-extrabold text-foreground text-[14px] sm:text-[15px] md:text-[17px] mt-0.5 line-clamp-2 leading-snug min-h-[2.5rem] md:min-h-[3rem] ${!available ? "opacity-60" : ""}`}>
            {p.title}
          </h3>
          <p className={`text-[11px] md:text-[12px] text-muted-foreground mt-1.5 line-clamp-2 leading-tight ${!available ? "opacity-50" : ""}`}>
            {p.description}
          </p>
          {available && <p className="text-[12px] md:text-[13px] font-bold text-primary mt-3 mb-1.5">Precio mayorista 🚀</p>}
        </div>

        {/* Precios y botón */}
        <div className="mt-2 pt-3 border-t border-border w-full flex flex-col gap-3">
          <div className="flex flex-col items-center justify-center gap-1.5 px-0.5">
            <div className={`${!available ? "opacity-30" : "opacity-50"} leading-none mb-0.5`}>
              <span className="text-[13px] md:text-[15px] text-muted-foreground line-through font-black">
                S/{p.price_1 ? p.price_1.toFixed(1) : "-.--"}
              </span>
            </div>
            <div className={`flex items-baseline gap-1 leading-none mb-1.5 ${!available ? "opacity-40" : ""}`}>
              <span className="text-[12px] md:text-[14px] font-black text-muted-foreground">S/</span>
              <span className="text-[24px] sm:text-[26px] md:text-[32px] font-black text-primary tracking-tighter">
                {minPrice.toFixed(1)}
              </span>
            </div>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 md:py-1.5 rounded-full ${stockColorClass} border w-fit mb-1`}>
              <StockIcon className="w-3 h-3 md:w-3.5 md:h-3.5" />
              <span className="text-[9px] md:text-[10px] font-black lowercase tracking-wider whitespace-nowrap">{stockText}</span>
            </div>
            <button
              onClick={() => available && onAddToCart(p)}
              disabled={!available}
              className={`${
                available
                  ? "bg-primary text-primary-foreground hover:bg-dark active:scale-95 shadow-lg shadow-primary/20"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              } w-full py-2.5 md:py-3.5 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 transition-all`}
            >
              {available ? <ShoppingCart className="w-3.5 h-3.5 md:w-5 md:h-5" /> : <Lock className="w-3.5 h-3.5 md:w-5 md:h-5" />}
              <span className="text-[12px] md:text-[14px] font-black tracking-wide">
                {available ? "Agrega a caja" : "Agotado"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
