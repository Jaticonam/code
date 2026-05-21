import { LayoutGrid, Package, MessageCircle } from "lucide-react";

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
  const showCatalog = variant === "home";

  return (
    <div className="floating-buttons">
      <button
        type="button"
        onClick={onCartClick}
        className="floating-btn floating-btn-cart"
        aria-label={`Abrir mi caja, ${cartCount} productos`}
      >
        <Package className="floating-btn-icon" />
        <span className="floating-btn-label">Mi Caja</span>

        {cartCount > 0 && (
          <strong className="floating-btn-count">{cartCount}</strong>
        )}
      </button>

      {showCatalog && (
        <a href="/catalogo" className="floating-btn floating-btn-catalog">
          <LayoutGrid className="floating-btn-icon" />
          <span className="floating-btn-label">Catálogo</span>
        </a>
      )}

      <a
        href="https://wa.me/51936188636"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-btn floating-btn-whatsapp"
        aria-label="Escribir a una asesora por WhatsApp"
      >
        <MessageCircle className="floating-btn-icon" />
        <span className="floating-btn-label">Asesora</span>
      </a>
    </div>
  );
}