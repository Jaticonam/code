import { ShoppingBag, X } from "lucide-react";

interface CartHeaderProps {
  itemsCount: number;
  onClose: () => void;
}

export function CartHeader({
  itemsCount,
  onClose,
}: CartHeaderProps) {
  return (
    <div className="cart-header">
      <div className="flex items-center gap-3">
        <div className="cart-icon-box">
          <ShoppingBag className="w-5 h-5" />
        </div>

        <div>
          <h2 className="text-lg font-black leading-none text-[#0f172a]">
            Mi Caja
          </h2>

          <span className="mt-1 block text-[10px] font-bold Capitalize tracking-wide text-[#1d8299]">
            {itemsCount} Unidades Acumuladas
          </span>
        </div>
      </div>

      <button
        onClick={onClose}
        className="cart-close-btn"
        aria-label="Cerrar carrito"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
