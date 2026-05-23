import { PackagePlus,X } from "lucide-react";
import type { Product } from "@/shared/types/product";

interface Props{product:Product;onClose:()=>void;}

export function AddToCartModalHeader({product,onClose}:Props){
  return(
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#dbe5ee] bg-white text-[#1d8299] shadow-[0_8px_20px_rgba(15,23,42,.08)]">
          <PackagePlus className="h-[19px] w-[19px] stroke-[2.4]" />
        </div>

        <div className="min-w-0">
          <p className="text-[13px] font-bold text-[#1d8299]">Tu caja está creciendo 🚀</p>
          <h3 className="line-clamp-1 text-[17px] font-black leading-tight text-[#0f172a] md:text-[16px]">{product.title}</h3>
        </div>
      </div>

      <button onClick={onClose} className="rounded-full p-1.5 text-[#94a3b8] transition hover:bg-[#f1f5f9] hover:text-[#334155]" aria-label="Cerrar modal">
        <X className="h-4 w-4"/>
      </button>
    </div>
  );
}