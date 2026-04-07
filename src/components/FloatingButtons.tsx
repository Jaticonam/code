import { ShoppingBag, Sparkles, MessageCircle } from "lucide-react";

interface FloatingButtonsProps {
  cartCount: number;
  onCartClick: () => void;
}

export function FloatingButtons({ cartCount, onCartClick }: FloatingButtonsProps) {
  return (
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+25px)] right-5 flex flex-col items-end gap-3 z-[1000]">
      {/* Carrito */}
      <button
        onClick={onCartClick}
        className="flex items-center gap-2.5 px-6 py-3.5 rounded-[30px] text-primary-foreground font-extrabold text-[13px] bg-[linear-gradient(110deg,hsl(var(--primary))_40%,hsl(191_67%_55%)_50%,hsl(var(--primary))_60%)] bg-[length:200%_100%] animate-shimmer shadow-lg border border-primary-foreground/20 transition-all hover:scale-105 hover:-translate-y-1 hover:brightness-110 active:scale-[0.92] capitalize tracking-wide"
      >
        <ShoppingBag className="w-5 h-5" />
        <span>
          Mi Pedido{" "}
          <strong className="bg-primary-foreground/95 text-primary px-2 py-0.5 rounded-xl text-[11px] font-black shadow-md ml-1 inline-block transition-transform">
            {cartCount}
          </strong>
        </span>
      </button>

      {/* Packs */}
      <a
        href="https://packs.woolyimports.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-6 py-3.5 rounded-[30px] bg-secondary text-secondary-foreground font-extrabold text-[13px] shadow-lg shadow-secondary/30 transition-all hover:scale-105 active:scale-[0.92] capitalize tracking-wide"
      >
        <Sparkles className="w-5 h-5" />
        <span>Ver Packs</span>
      </a>

      {/* Asesora WhatsApp */}
      <a
        href="https://wa.me/51936188636"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-6 py-3.5 rounded-[30px] bg-whatsapp text-primary-foreground font-extrabold text-[13px] shadow-lg shadow-whatsapp/30 transition-all hover:scale-105 active:scale-[0.92] capitalize tracking-wide"
      >
        <MessageCircle className="w-5 h-5" />
        <span>Asesora</span>
      </a>
    </div>
  );
}
