import type { CartItem } from "@/modules/cart/types";
import { getEffectivePrice } from "@/modules/catalog/utils/products";

export function checkout(
  cart: CartItem[],
  total: string,
  savings: number,
  onClearCart: () => void,
  onClose: () => void
) {
  if (cart.length === 0) return;

  let message = "*NUEVO PEDIDO WOOLY - MAYORISTAS*\n\n";
  message += "Hola, deseo pedir lo siguiente:\n\n";

  cart.forEach((item) => {
    const price = getEffectivePrice(item);
    const subtotal = price * item.qty;
    const note = item.note?.trim().replace(/\s+/g, " ");

    message += `• *[ ${item.id} ]* | *${item.title}*\n`;
    message += `  Cantidad: ${item.qty} u\n`;
    message += `  Precio: S/${price.toFixed(2)}\n`;
    message += `  Subtotal: S/${subtotal.toFixed(2)}\n`;

    if (note) {
      message += `  Detalle: ${note}\n`;
    }

    message += "\n";
  });

  message += "━━━━━━━━━━━━━━━\n";
  message += `*Total estimado: S/${total}*\n`;

  if (savings > 0) {
    message += `Ahorro estimado: S/${savings.toFixed(2)}\n`;
  }

  message += "\nConfirmar disponibilidad, gracias.";

  const url = `https://wa.me/51936188636?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");

  setTimeout(() => {
    onClearCart();
    onClose();
  }, 300);
}
