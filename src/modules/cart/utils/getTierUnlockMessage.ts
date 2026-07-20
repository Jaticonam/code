import type { CartItem } from "@/modules/cart/types";
import { getActiveTierQty } from "@/modules/cart/utils/getActiveTierQty";

export function getTierUnlockMessage(item: CartItem): string | null {
  const activeTier = getActiveTierQty(item);

  if (activeTier >= 100) return "🔥 Precio por cajón activado";
  if (activeTier >= 50) return "⚡ Precio máximo activado";
  if (activeTier >= 12) return "✨ Precio por pack activado";
  if (activeTier >= 3) return "🎉 Precio por mayor activado";

  return null;
}
