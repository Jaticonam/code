import { CheckCircle, PlusCircle } from "lucide-react";

interface ProductCardActionsProps {
  available: boolean;
  isPreventa: boolean;
  isInCart: boolean;
  showWhatsAppButton: boolean;
  onAdd: () => void;
  onWhatsApp: () => void;
}

export function ProductCardActions({
  available,
  isPreventa,
  isInCart,
  showWhatsAppButton,
  onAdd,
  onWhatsApp,
}: ProductCardActionsProps) {
  return (
    <button
      onClick={showWhatsAppButton ? onWhatsApp : onAdd}
      disabled={!available && !showWhatsAppButton}
      className={[
        "w-full flex items-center justify-center gap-1.5 rounded-2xl transition-all duration-200",
        "text-[11px] md:text-[13px]",
        "py-2 md:py-3",
        "font-semibold md:font-bold",
        showWhatsAppButton
          ? "btn-shop-whatsapp"
          : isInCart
          ? "btn-shop-primary"
          : available
          ? "btn-shop-primary"
          : "bg-muted text-muted-foreground cursor-not-allowed",
      ].join(" ")}
    >
      {showWhatsAppButton ? (
        <span>
          {isPreventa ? "Consultar por WhatsApp" : "Pedir reposición"}
        </span>
      ) : available ? (
        isInCart ? (
          <>
            <CheckCircle className="w-4 h-4" />
            <span>Agregar más</span>
          </>
        ) : (
          <>
            <PlusCircle className="w-4 h-4" />
            <span>Agregar a caja</span>
          </>
        )
      ) : (
        <span>Agotado</span>
      )}
    </button>
  );
}
