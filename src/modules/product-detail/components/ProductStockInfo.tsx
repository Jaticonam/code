import type { Product } from "@/shared/types/product";

interface ProductStockInfoProps {
  product: Product;
  available: boolean;
  viewers: number;
  stockPresentation: {
    text: string;
    className: string;
    icon: React.ElementType;
  } | null;
}

export function ProductStockInfo({
  available,
  viewers,
  stockPresentation,
}: ProductStockInfoProps) {
  const StockIcon = stockPresentation?.icon;

  return (
    <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
      {stockPresentation && StockIcon && (
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold ${stockPresentation.className}`}
        >
          <StockIcon className="w-4 h-4" />
          <span>{stockPresentation.text}</span>
        </div>
      )}

      {available && (
        <p className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e6f2f5] text-[#1d8299] text-[12px] font-bold">
          👀 {viewers} viendo ahora
        </p>
      )}
    </div>
  );
}
