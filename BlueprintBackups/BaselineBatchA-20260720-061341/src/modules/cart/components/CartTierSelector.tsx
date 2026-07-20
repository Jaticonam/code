import { CartItem } from "@/shared/types/product";
import { CART_TIERS,TIER_COLORS } from "@/shared/config/cartTiers";

interface CartTierSelectorProps{
  item:CartItem;
  onSetQty:(id:string,qty:number|null)=>void;
}

export function CartTierSelector({item,onSetQty}:CartTierSelectorProps){
  const itemTiers=CART_TIERS.filter(tier=>{
    const value=item[tier.key];
    return value!==null&&value!==undefined&&value>0;
  });

  const gridCols=
    itemTiers.length<=1?"grid-cols-1":
    itemTiers.length===2?"grid-cols-2":
    "grid-cols-3";

  return(
    <div className={`grid ${gridCols} gap-1 flex-1`}>
      {itemTiers.map((tier,index)=>{
        const nextTier=itemTiers[index+1];
        const isActive=item.qty>=tier.qty&&(!nextTier||item.qty<nextTier.qty);

        return(
          <button
            key={tier.qty}
            type="button"
            onClick={()=>onSetQty(item.id,tier.qty)}
            className={[
              "cart-tier-btn",
              "w-full py-1.5",
              "transition-all duration-300",
              isActive?`${TIER_COLORS[tier.cls]} scale-[1.02] shadow-md`:"cart-tier-btn-muted hover:scale-[1.02]"
            ].join(" ")}
          >
            {tier.label}
          </button>
        );
      })}
    </div>
  );
}