import { MessageCircle,Sparkles } from "lucide-react";
import { CartItem } from "@/shared/types/product";
import { checkout } from "@/modules/cart/utils/checkout";

interface CartFooterProps{
  cart:CartItem[];
  totalItems:number;
  totalPrice:number;
  savings:number;
  onClearCart:()=>void;
  onClose:()=>void;
}

export function CartFooter({cart,totalItems,totalPrice,savings,onClearCart,onClose}:CartFooterProps){
  const disabled=cart.length===0;

  return(
    <div className="cart-footer">
      {savings>0&&(
        <div className="cart-saving-box">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3 w-4 fill-current animate-pulse"/>
            <span className="text-[11px] font-black tracking-tight">Ahorro Wooly aplicado</span>
          </div>
          <span className="text-sm font-black">- S/ {savings.toFixed(2)}</span>
        </div>
      )}

      <div className="mt-0 mb-0 flex items-end justify-between gap-4">
        <div className="cart-total-box">
          <span className="mt-2 mb-2 block text-[25px] font-black leading-none text-[#0f172a]">
            {totalItems}
          </span>
          <span className="mt-2 mb-2 text-[15px] font-black Capitalize tracking-wide text-[#64748b]">
            Unidades
          </span>
        </div>
        <div className="mt-0 mb-0 flex flex-col items-end">

          <div className="mt-0 mb-0 flex items-baseline gap-1">
            <span className="text-xs font-black text-[#94a3b8]">
              S/
            </span>
            <span className="text-[30px] font-black tracking-[-.05em] text-[#1d8299]">
              {totalPrice.toFixed(2)}
            </span>
          </div>
          <span className="mt-0 text-[14px] font-black Capitalize text-[#64748b]">
            Total de tu caja
          </span>
        </div>
      </div>

      {!disabled&&(
        <p className="mb-3 text-center text-[11px] mt-0 font-semibold leading-snug text-[#64748b]">
          Pedido para confirmar. Coordinamos la disponibilidad por WhatsApp.
        </p>
      )}

      <button
        onClick={()=>checkout(cart,totalPrice.toFixed(2),savings,onClearCart,onClose)}
        disabled={disabled}
        className={disabled?"w-full rounded-2xl bg-[#f1f5f9] py-4 text-sm font-black tracking-wide text-[#94a3b8] cursor-not-allowed flex items-center justify-center gap-3":"cart-checkout-btn"}
      >
        <MessageCircle className="h-5 w-5"/>
        Enviar pedido por WhatsApp
      </button>
    </div>
  );
}