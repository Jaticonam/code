import { MessageCircle, Sparkles } from "lucide-react";
import { CartItem } from "@/shared/types/product";
import { checkout } from "@/modules/cart/utils/checkout";

interface CartFooterProps {
  cart: CartItem[];
  totalItems: number;
  totalPrice: number;
  savings: number;
  onClearCart: () => void;
  onClose: () => void;
}

export function CartFooter({
  cart,
  totalItems,
  totalPrice,
  savings,
  onClearCart,
  onClose,
}: CartFooterProps) {
  return (
    <div className="cart-footer">
      {savings > 0 && (
        <div className="cart-saving-box">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 fill-current animate-pulse" />

            <span className="text-[11px] font-black tracking-tight">
              ¡Ahorro Wooly aplicado!
            </span>
          </div>

          <span className="text-sm font-black">
            - S/ {savings.toFixed(2)}
          </span>
        </div>
      )}

      <div className="mb-8 flex items-end justify-between">
        <div className="flex flex-col text-left">
          <span className="mb-1 text-[9px] font-black uppercase tracking-widest text-[#64748b]">
            Total estimado
          </span>

          <div className="flex items-baseline gap-1">
            <span className="text-xs font-black text-[#94a3b8]">S/</span>

            <span className="text-4xl font-black tracking-tighter text-[#1d8299]">
              {totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="cart-total-box">
          <span className="block text-lg font-black leading-none text-[#0f172a]">
            {totalItems}
          </span>

          <span className="text-[8px] font-bold tracking-tight text-[#64748b]">
            Unidades
          </span>
        </div>
      </div>

      <button
        onClick={() =>
          checkout(
            cart,
            totalPrice.toFixed(2),
            savings,
            onClearCart,
            onClose
          )
        }
        disabled={cart.length === 0}
        className={
          cart.length > 0
            ? "cart-checkout-btn"
            : "w-full py-4 rounded-2xl font-black text-sm tracking-wide flex items-center justify-center gap-3 bg-[#f1f5f9] text-[#94a3b8] cursor-not-allowed"
        }
      >
        <MessageCircle className="w-5 h-5" />
        Confirmar pedido
      </button>
    </div>
  );
}
