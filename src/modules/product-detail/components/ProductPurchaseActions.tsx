import { PlusCircle } from "lucide-react";

interface ProductPurchaseActionsProps {
  showWhatsAppButton: boolean;
  isPreventa: boolean;
  available: boolean;
  isQtyInputValid: boolean;
  total: number;
  onWhatsApp: () => void;
  onAddToCart: () => void;
}

export function ProductPurchaseActions({
  showWhatsAppButton,
  isPreventa,
  available,
  isQtyInputValid,
  total,
  onWhatsApp,
  onAddToCart,
}: ProductPurchaseActionsProps) {
  if (showWhatsAppButton) {
    return (
      <button
        onClick={onWhatsApp}
        className="btn-shop-whatsapp w-full py-4 text-base font-black flex items-center justify-center gap-3"
      >
        <PlusCircle className="w-5 h-5" />
        {isPreventa ? "Consultar por WhatsApp" : "Pedir reposición"}
      </button>
    );
  }

  if (!available) return null;

  return (
    <button
      onClick={onAddToCart}
      disabled={!isQtyInputValid}
      className={`w-full py-4 rounded-2xl font-black text-base shadow-xl transition-all flex items-center justify-center gap-3 ${
        isQtyInputValid
          ? "bg-[#1d8299] text-white hover:bg-[#16677a] hover:scale-[1.02] active:scale-[0.98]"
          : "bg-muted text-muted-foreground cursor-not-allowed shadow-none"
      }`}
    >
      <PlusCircle className="w-5 h-5" />
      {isQtyInputValid
        ? `Agregar a caja — S/ ${total.toFixed(2)}`
        : "Ingresa una cantidad"}
    </button>
  );
}
