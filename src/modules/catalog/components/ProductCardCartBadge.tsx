import { CheckCircle } from "lucide-react";

interface ProductCardCartBadgeProps {
  qty: number;
}

export function ProductCardCartBadge({ qty }: ProductCardCartBadgeProps) {
  if (qty <= 0) return null;

  return (
    <div className="absolute top-2 right-2 z-10">
      <div className="inline-flex items-center gap-1 rounded-full bg-green-600 text-white px-2 py-1 shadow-md">
        <CheckCircle className="w-3.5 h-3.5" />
        <span className="text-[10px] md:text-[11px] font-bold leading-none">
          {qty} en caja
        </span>
      </div>
    </div>
  );
}
