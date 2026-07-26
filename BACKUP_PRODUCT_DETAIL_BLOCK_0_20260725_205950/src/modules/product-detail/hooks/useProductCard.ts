import {
  useNavigate,
} from "react-router-dom";

import {
  resolveProductCommercialPolicy,
} from "@/modules/catalog/domain/ProductCommercialPolicy";

import type {
  Product,
} from "@/shared/types/product";

import type {
  CartItem,
} from "@/modules/cart/types";

import {
  buildWhatsappMessage,
} from "@/modules/product-detail/utils/buildWhatsappMessage";

export function useProductCard(
  product: Product,
  cart: CartItem[],
  onAddToCart:
    (product: Product) => void,
) {
  const navigate =
    useNavigate();

  const policy =
    resolveProductCommercialPolicy(
      product,
    );

  const status =
    policy.status;

  const isPublicado =
    status === "publicado";

  const isPreventa =
    status === "preventa";

  const isAgotado =
    status === "agotado";

  /*
   * available conserva el nombre legacy
   * para no romper ProductCard.
   *
   * Desde ahora significa exclusivamente:
   * producto realmente comprable.
   */
  const available =
    policy.isPurchasable;

  /*
   * Compatibilidad temporal.
   * El agotamiento ya no se deduce desde stock.
   * Debe declararse mediante status="agotado".
   */
  const isOutOfStock = false;

  const showWhatsAppButton =
    policy.isConsultOnly;

  const cartItem =
    cart.find(
      (item) =>
        item.id === product.id,
    );

  const qtyInCart =
    cartItem?.qty ?? 0;

  const isInCart =
    qtyInCart > 0;

  function goToDetail() {
    navigate(
      `/catalogo/producto.html?id=${product.id}&cat=${product.category}`,
    );
  }

  function handleAdd() {
    if (!available) {
      return;
    }

    onAddToCart(product);
  }

  function handleWhatsApp() {
    const message =
      isAgotado
        ? [
            "Hola Wooly, quiero consultar reposición de este producto:",
            "",
            `Producto: ${product.title}`,
            `Código: ${product.id}`,
            `Categoría: ${product.category}`,
            "",
            `Link: ${window.location.href}`,
          ]
            .filter(Boolean)
            .join("\n")
        : buildWhatsappMessage(
            product,
            isPreventa,
            false,
          );

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
