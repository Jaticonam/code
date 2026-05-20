import type { Product } from "@/types/product";
import { getAvailablePriceTiers } from "@/config/priceTiers";

const COLORS:Record<string,string>={
  price_1:"bg-[#1d8299]",
  price_3:"bg-[#f5b025]",
  price_12:"bg-[#f286be]",
  price_50:"bg-[#7c3aed]",
  price_100:"bg-slate-700",
};

interface Props{
  product:Product;
  available:boolean;
  isPreventa:boolean;
}

export function ProductCardTierBadges({product,available,isPreventa}:Props){
  if(!available||isPreventa)return null;

  return(
    <div className="absolute bottom-2 left-2 right-2 z-20 flex justify-center gap-1">
      {getAvailablePriceTiers(product).map(t=>{
        const v=product[t.key];
        if(typeof v!=="number"||v<=0)return null;

        return(
          <span
            key={t.key}
            className={`${COLORS[t.key]||"bg-slate-500"} rounded-full px-2 py-[5px] text-[9px] font-black text-white shadow-md transition hover:scale-110 hover:-translate-y-[1px]`}
          >
            {t.label}
          </span>
        );
      })}
    </div>
  );
}
