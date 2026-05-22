import { Product } from "@/shared/types/product";

interface Props{
  product:Product;
  currentQty:number;
  pulse:boolean;
  nextTier:any;
}

export function AddToCartModalInfo({product,currentQty,pulse,nextTier}:Props){
  const bestTarget=product.price_100?100:product.price_50?50:product.price_12?12:product.price_3?3:1;
  const targetQty=nextTier?.targetQty??nextTier?.qty??bestTarget;
  const unitPrice=nextTier?.unitPrice??nextTier?.price??product.price_1;
  const missingQty=Math.max(targetQty-currentQty,0);
  const progress=Math.min((currentQty/bestTarget)*100,100);
  const unlocked=currentQty>=bestTarget;

  return(
    <div className={["mt-4 rounded-2xl border border-slate-200 bg-[#f8fafc] p-3 transition-transform",pulse?"scale-[1.02]":""].join(" ")}>
      <img src={product.img||"/placeholder.svg"} alt={product.title} className="mb-3 h-[180px] w-full rounded-2xl border border-slate-200 bg-white object-contain" />

      <div className="text-center">
        <p className="line-clamp-1 text-[14px] font-black text-slate-800">{product.title}</p>
        <p className="mt-1 text-[11px] font-semibold text-slate-500">Código {product.id}</p>
      </div>

      <div className="mt-3 rounded-xl bg-white p-3 shadow-sm">
        <div className="mb-2 flex items-center justify-between text-[12px] font-black">
          <span className="text-slate-600">Ya tienes {currentQty}</span>
          <span className={unlocked?"text-emerald-600":"text-orange-500"}>{currentQty}/{bestTarget}</span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div className={["h-full rounded-full transition-all duration-500",unlocked?"bg-gradient-to-r from-emerald-500 to-green-600":"bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500"].join(" ")} style={{width:`${progress}%`}} />
        </div>

        <p className="mt-2 text-center text-[12px] font-bold leading-snug text-slate-700">
          {unlocked ? (
            <>🎉 Mejor precio desbloqueado</>
          ) : nextTier ? (
            <>🚀 Agrega <span className="text-[#1d8299]">{missingQty}</span> más y paga <span className="text-[#1d8299]">S/{unitPrice.toFixed(1)}</span> c/u</>
          ) : (
            <>✅ Ya tienes el mejor precio disponible</>
          )}
        </p>
      </div>
    </div>
  );
}