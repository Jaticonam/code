import { ShoppingBag, Package, MessageCircle } from "lucide-react";

interface FloatingButtonsProps {
  cartCount: number;
  onCartClick: () => void;
  variant?: "shop" | "home";
}

export function FloatingButtons({
  cartCount,
  onCartClick,
  variant = "shop",
}: FloatingButtonsProps) {
  const isHome = variant === "home";

  return (
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+25px)] right-4 flex flex-col items-end gap-3 z-[1000]">

      {/* 🛒 Mi Caja */}
        <button
          onClick={onCartClick}
          className="floating-btn floating-btn-cart"
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="hidden sm:inline">Mi Caja</span>
          <strong className="floating-btn-count">{cartCount}</strong>
        </button>

        {/* 📦 Ver Catálogo */}
        <a
          href="/catalogo"
          className="floating-btn floating-btn-catalog"
        >
          <Package className="h-5 w-5" />
          <span className="hidden sm:inline">Ver Catálogo</span>
        </a>

        {/* 💬 Asesora */}
        <a
          href="https://wa.me/51936188636"
          target="_blank"
          rel="noopener noreferrer"
          className="floating-btn floating-btn-whatsapp"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="hidden sm:inline">Asesora</span>
        </a>
    </div>
  );
} 