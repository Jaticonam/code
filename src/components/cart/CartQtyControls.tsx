import { Minus, Plus } from "lucide-react";
import { CartItem } from "@/types/product";
import { CartQtyInput } from "@/components/cart/CartQtyInput";

interface CartQtyControlsProps {
  item: CartItem;
  qtyPulse: boolean;
  onChangeQty: (id: string, delta: number) => void;
  onSetQty: (id: string, qty: number | null) => void;
}

export function CartQtyControls({
  item,
  qtyPulse,
  onChangeQty,
  onSetQty,
}: CartQtyControlsProps) {
  return (
    <div className={`cart-qty-box ${qtyPulse ? "ring-2 ring-[#1d8299]/10" : ""}`}>
      <button
        onClick={() => onChangeQty(item.id, -1)}
        className="cart-qty-btn"
      >
        <Minus className="w-4 h-4" />
      </button>

      <CartQtyInput item={item} onSetQty={onSetQty} />

      <button
        onClick={() => onChangeQty(item.id, 1)}
        className="cart-qty-btn"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
