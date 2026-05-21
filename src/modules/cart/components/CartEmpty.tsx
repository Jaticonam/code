import { ShoppingBag } from "lucide-react";

export function CartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center text-[#94a3b8]">
      <ShoppingBag className="mb-3 h-12 w-12" />

      <p className="text-[11px] font-black tracking-wide">
        Carrito vacío
      </p>
    </div>
  );
}
