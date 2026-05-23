import { Product } from "@/shared/types/product";

interface Props{
  product:Product;
  currentQty:number;
  pulse:boolean;
  nextTier:any;
}

export function AddToCartModalInfo({product,currentQty,pulse,nextTier}:Props){
  const tiers=[
  {qty:1,price:product.price_1},
  {qty:3,price:product.price_3},
  {qty:12,price:product.price_12},
  {qty:50,price:product.price_50},
  {qty:100,price:product.price_100},
  ].filter(t=>typeof t.price==="number"&&Number.isFinite(t.price)&&t.price>0)

  const bestTarget=tiers.at(-1)?.qty??1;
  const targetQty=nextTier?.targetQty??nextTier?.qty??bestTarget;
  const unitPrice=nextTier?.unitPrice??nextTier?.price??product.price_1;
  const missingQty=Math.max(targetQty-currentQty,0);
  const activeTiers=tiers.map(t=>t.qty);
  const currentTierIndex=activeTiers.reduce((acc,qty,i)=>currentQty>=qty?i:acc,0);
  const nextTierIndex=activeTiers.findIndex(qty=>currentQty<qty);
  const nextIndex=nextTierIndex===-1?activeTiers.length-1:nextTierIndex;
  const prevQty=activeTiers[currentTierIndex]??1;
  const nextQty=activeTiers[nextIndex]??prevQty;
  const segmentBase=activeTiers.length>1?100/(activeTiers.length-1):100;
  const segmentProgress=nextQty>prevQty?((currentQty-prevQty)/(nextQty-prevQty))*segmentBase:0;
  const rawProgress=Math.min((currentTierIndex*segmentBase)+segmentProgress,100);
  const progress=currentQty>0?Math.max(rawProgress,10):0;
  const unlocked=currentQty>=bestTarget;

  return(
    <div className={["mt-3 rounded-2xl border border-slate-200 bg-[#f8fafc] p-2.5 transition-transform",pulse?"scale-[1.02]":""].join(" ")}>
      <img src={product.img||"/placeholder.svg"} alt={product.title} className="mb-2 h-[300px] md:h-[240px] w-full rounded-2xl border border-slate-200 bg-white object-cover"/>

      <div className="mt-1 flex flex-wrap items-center justify-center gap-1.5">
        <span className="rounded-full bg-slate-100 px-2 py-[3px] text-[10px] font-black uppercase text-slate-500">Código: {product.id}</span>
        <span className="rounded-full bg-[#e6f6f8] px-2 py-[3px] text-[10px] font-black capitalize text-[#1d8299]">{product.category}</span>
      </div>

      <div className="mt-3 rounded-xl bg-white p-3 shadow-sm">
        <div className="mb-2 flex items-center justify-between text-[12px] font-black">
          <span className="text-slate-600">Ya tienes {currentQty} productos</span>
          <span className={unlocked?"text-emerald-600":"text-orange-500"}>{currentQty}/{bestTarget}</span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div className={["h-full rounded-full transition-all duration-500",unlocked?"bg-gradient-to-r from-emerald-500 to-green-600":"bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500"].join(" ")} style={{width:`${progress}%`}}/>
        </div>

        {tiers.length>0&&(
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
            {tiers.map(t=>{
              const active=currentQty>=t.qty;
              const next=nextTier&&(nextTier.targetQty??nextTier.qty)===t.qty;

              return(
                <button
                  key={t.qty}
                  type="button"
                  disabled
                  className={[
                    "rounded-full border px-2.5 py-1.5 text-[10px] font-black leading-none",
                    active
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : next
                      ? "border-[#1d8299]/30 bg-[#e6f6f8] text-[#1d8299]"
                      : "border-slate-200 bg-slate-50 text-slate-500",
                  ].join(" ")}
                >
                  {t.qty}u +<span className="ml-1 font-bold">S/{t.price!.toFixed(1)}</span>
                </button>
              );
            })}
          </div>
        )}

        <p className="mt-2 text-center text-[12px] font-bold leading-snug text-slate-700">
          {unlocked?(<>🎉 Mejor precio desbloqueado</>):nextTier?(<>🚀 Agrega <span className="text-[#1d8299]">{missingQty}</span> más y paga <span className="text-[#1d8299]">S/{unitPrice.toFixed(1)}</span> c/u</>):(<>✅ Ya tienes el mejor precio disponible</>)}
        </p>
      </div>
    </div>
  );
}