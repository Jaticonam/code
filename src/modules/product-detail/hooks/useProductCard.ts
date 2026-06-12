import { useNavigate } from "react-router-dom";
import type { CartItem, Product } from "@/shared/types/product";
import { isProductAvailable } from "@/modules/catalog/utils/products";
import { buildWhatsappMessage } from "@/modules/product-detail/utils/buildWhatsappMessage";

export function useProductCard(
  p: Product,
  cart: CartItem[],
  onAddToCart: (product: Product) => void,
) {
  const navigate = useNavigate();

  const status = (p.status || "").trim().toLowerCase();

  const isPublicado = status === "publicado";
  const isPreventa = status === "preventa";
  const isAgotado = status === "agotado";

  const available = isProductAvailable(p) && isPublicado;

  const isOutOfStock =
    !isPreventa && !isAgotado && !!p.price_1 && p.stock === 0;

  const showWhatsAppButton = isPreventa || isAgotado;

  const cartItem = cart.find((item) => item.id === p.id);
  const qtyInCart = cartItem?.qty ?? 0;
  const isInCart = qtyInCart > 0;

  function goToDetail() {
    navigate(`/catalogo/producto.html?id=${p.id}&cat=${p.category}`);
  }

  function handleAdd() {
    if (!available || isPreventa || isAgotado || isOutOfStock) return;
    onAddToCart(p);
  }

  function handleWhatsApp() {
    const message = isAgotado
      ? [
          "Hola Wooly, quiero consultar reposición de este producto:",
          "",
          `Producto: ${p.title}`,
          `Código: ${p.id}`,
          `Categoría: ${p.category}`,
          "",
          `Link: ${window.location.href}`,
        ]
          .filter(Boolean)
          .join("\n")
      : buildWhatsappMessage(p, isPreventa, isOutOfStock);

    window.open(
      `https://wa.me/51936188636?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  }

  return {
    available,
    isPublicado,
    isPreventa,
    isAgotado,
    isOutOfStock,
    showWhatsAppButton,
    qtyInCart,
    isInCart,
    goToDetail,
    handleAdd,
    handleWhatsApp,
  };
}
