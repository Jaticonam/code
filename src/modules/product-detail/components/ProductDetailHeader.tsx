import { ArrowLeft, Share2 } from "lucide-react";
import type { Product } from "@/shared/types/product";
import { CountdownTimer } from "@/shared/components/commerce/CountdownTimer";

interface ProductDetailHeaderProps {
  product: Product;
  onBack: () => void;
  onShare: () => void;
}

export function ProductDetailHeader({
  product,
  onBack,
  onShare,
}: ProductDetailHeaderProps) {
  return (
    <header className="sticky top-0 z-[100] w-full flex flex-col">
      <CountdownTimer />

      <div className="bg-white/90 backdrop-blur-md border-b border-[#e2e8f0] shadow-sm px-4 py-3 md:py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 bg-[#f1f5f9] rounded-xl text-[#334155] hover:bg-[#e2e8f0] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex-grow min-w-0">
            <h1 className="text-base md:text-lg font-extrabold tracking-tight text-[#0f172a] truncate">
              {product.title}
            </h1>

            <p className="text-[11px] text-[#94a3b8] font-semibold">
              {product.id}
            </p>
          </div>

          <button
            onClick={onShare}
            className="p-2 bg-[#f1f5f9] rounded-xl text-[#334155] hover:bg-[#e2e8f0] transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
