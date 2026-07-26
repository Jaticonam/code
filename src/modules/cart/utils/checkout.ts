import type { CartItem } from "@/modules/cart/types";
import {
  getCartLinePricing,
} from "@/modules/cart/domain/CartLinePricing";
import {
  getTotalPrice,
} from "@/modules/cart/store/cart.selectors";

export function buildCheckoutMessage(
  cart: CartItem[],
  savings: number,
): string {
  let message = "*NUEVO PEDIDO WOOLY - MAYORISTAS*\n\n";
  message += "Hola, deseo pedir lo siguiente:\n\n";

  cart.forEach((item) => {
    const {
      quantity,
      unitPrice,
      subtotal,
    } =
      getCartLinePricing(
        item,
      );

    const note = item.note?.trim().replace(/\s+/g, " ");

    message += `• *[ ${item.id} ]* | *${item.title}*\n`;
    message += `  Cantidad: ${quantity} u\n`;
    message += `  Precio: S/${unitPrice.toFixed(2)}\n`;
    message += `  Subtotal: S/${subtotal.toFixed(2)}\n`;

    if (note) {
      message += `  Detalle: ${note}\n`;
    }

    message += "\n";
  });

  const total =
    getTotalPrice(
      cart,
    );

  message += "━━━━━━━━━━━━━━━\n";
  message += `*Total estimado: S/${total.toFixed(2)}*\n`;

  if (savings > 0) {
    message += `Ahorro estimado: S/${savings.toFixed(2)}\n`;
  }

  message += "\nConfirmar disponibilidad, gracias.";

  return message;
}

export function checkout(
  cart: CartItem[],
  savings: number,
  onClearCart: () => void,
  onClose: () => void
) {
  if (cart.length === 0) return;

  const message =
    buildCheckoutMessage(
      cart,
      savings,
    );

  const url = `https://wa.me/51936188636?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");

  setTimeout(() => {
    onClearCart();
    onClose();
  }, 300);
}
