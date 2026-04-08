import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  PlusCircle,
  Lock,
  CheckCircle,
  AlertTriangle,
  Clock,
  XCircle,
} from "lucide-react";
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

export function ProductCard({ product: p, onAddToCart }: ProductCardProps) {
  const navigate = useNavigate();
  const available = isProductAvailable(p);
  const minPrice = getMinPrice(p);

  const [viewers, setViewers] = useState(Math.floor(Math.random() * 8) + 6);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(Math.floor(Math.random() * 8) + 6);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const goToDetail = () => navigate(`/catalogo/producto.html?id=${p.id}`);

  const handleAdd = () => {
    if (!available) return;

    onAddToCart(p);
    setAdded(true);

    setTimeout(() => setAdded(false), 1200);
  };

  let stockText: string;
  let stockColorClass: string;
  let StockIcon: typeof CheckCircle;

  if (!p.price_1 || p.price_1 <= 0 || p.stock === null || p.stock === undefined) {
    stockText = "Próximo";
    stockColorClass = "bg-muted text-muted-foreground";
    StockIcon = Clock;
  } else if (p.stock === 0) {
    stockText = "Agotado";
    stockColorClass = "bg-destructive/10 text-destructive";
    StockIcon = XCircle;
  } else if (p.stock <= 3) {
    stockText = "Últimos";
    stockColorClass = "bg-tertiary/10 text-tertiary";
    StockIcon = AlertTriangle;
  } else if (p.stock <= 10) {
    stockText = "Limitado";
    stockColorClass = "bg-secondary/10 text-secondary";
    StockIcon = AlertTriangle;
  } else {
    stockText = "Disponible";
    stockColorClass = "bg-success/10 text-success";
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
          className={`cursor-pointer w-full h-full object-cover transition-transform duration-700 hover:scale-110 ${
            !available ? "opacity-60 grayscale-[50%]" : ""
          }`}
          loading="lazy"
        />

        {/* Badge campaña */}
        <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black px-3 py-1 rounded-md shadow uppercase tracking-widest">
          🎯 CyberMom
        </div>

        {/* Precios por volumen */}
        {available && (
          <div className="absolute bottom-2 right-2 flex flex-col gap-1 items-end">
            {TIER_TAGS.map((t, i) =>
              p[t.key] ? (
                <div
                  key={t.key}
                  className={`${t.cls} text-white text-[10px] font-black px-2 py-0.5 rounded shadow`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {t.label} S/{p[t.key]!.toFixed(1)}
                </div>
              ) : null
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-1 md:px-2 flex-grow flex flex-col justify-between">

        {/* Meta */}
        <div className="flex items-center justify-center gap-2 mb-1.5 flex-wrap">
          <span className="text-[10px] text-muted-foreground font-semibold">
            {p.id}
          </span>

          <span className="px-2 py-[2px] rounded-full bg-muted text-[9px] font-semibold text-foreground uppercase tracking-wide">
            {p.category}
          </span>
        </div>

        {/* Título */}
        <h3
          onClick={goToDetail}
          className={`cursor-pointer hover:text-primary transition-colors font-extrabold text-[15px] md:text-[17px] line-clamp-2 leading-snug ${
            !available ? "opacity-60" : ""
          }`}
        >
          {p.title}
        </h3>

        {/* Descripción */}
        <p className="text-[12px] text-muted-foreground mt-1.5 line-clamp-2">
          {p.description}
        </p>

        {/* Texto campaña */}
        {available && (
          <p className="text-[12px] text-primary font-semibold mt-2">
            🔥 Precios de campaña
          </p>
        )}

        {/* Precio */}
        <div className="mt-3 pt-3 border-t border-border flex flex-col items-center gap-1">
          <span className="text-[13px] text-muted-foreground line-through font-semibold">
            S/{p.price_1 ? p.price_1.toFixed(1) : "-.--"}
          </span>

          <div className="flex items-baseline gap-1">
            <span className="text-[13px] text-muted-foreground">S/</span>
            <span className="text-[26px] md:text-[30px] font-black text-primary tracking-tight">
              {minPrice.toFixed(1)}
            </span>
          </div>

          <span className="text-[11px] text-muted-foreground font-medium">
            💡 Mejor precio por volumen
          </span>
        </div>

        {/* Stock */}
        <div className={`mt-2 inline-flex items-center justify-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold ${stockColorClass}`}>
          <StockIcon className="w-3 h-3" />
          {stockText}
        </div>

        {/* Personas viendo (MEJORADO) */}
        {available && (
          <p className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold mt-1">
            👀 {viewers} viendo ahora
          </p>
        )}

        {/* Botón PRO */}
        <button
          onClick={handleAdd}
          disabled={!available}
          className={`
            w-full flex items-center justify-center gap-1.5
            py-2 rounded-lg text-[12px] font-semibold
            transition-all duration-200
            ${
              added
                ? "bg-success text-white"
                : available
                ? "bg-primary/95 text-primary-foreground active:scale-[0.96]"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }
          `}
        >
          {added ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Agregado</span>
            </>
          ) : available ? (
            <>
              <PlusCircle className="w-4 h-4" />
              <span>Agregar a caja</span>
            </>
          ) : (
            <span>Agotado</span>
          )}
        </button>

      </div>
    </div>
  );
}