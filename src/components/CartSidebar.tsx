import { ShoppingBag, X, Minus, Plus, Trash2, Sparkles, MessageCircle } from "lucide-react";
import { CartItem } from "@/types/product";
import { getEffectivePrice } from "@/lib/products";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  totalItems: number;
  totalPrice: number;
  savings: number;
  onRemove: (id: string) => void;
  onChangeQty: (id: string, delta: number) => void;
  onSetQty: (id: string, qty: number) => void;
}

const CART_TIERS = [
  { qty: 1, key: "price_1" as const, cls: "active-1" },
  { qty: 3, key: "price_3" as const, cls: "active-3" },
  { qty: 12, key: "price_12" as const, cls: "active-12" },
  { qty: 50, key: "price_50" as const, cls: "active-50" },
  { qty: 100, key: "price_100" as const, cls: "active-100" },
];

const TIER_COLORS: Record<string, string> = {
  "active-1": "bg-primary text-primary-foreground",
  "active-3": "bg-tertiary text-tertiary-foreground",
  "active-12": "bg-secondary text-secondary-foreground",
  "active-50": "bg-purple-500 text-primary-foreground",
  "active-100": "bg-dark text-primary-foreground",
};

function getBubbleClass(item: CartItem): string {
  if (item.price_100 && item.qty >= 100) return "bg-dark text-primary-foreground";
  if (item.price_50 && item.qty >= 50) return "bg-purple-500 text-primary-foreground";
  if (item.price_12 && item.qty >= 12) return "bg-secondary text-secondary-foreground";
  if (item.price_3 && item.qty >= 3) return "bg-tertiary text-tertiary-foreground";
  return "bg-primary text-primary-foreground";
}

function checkout(cart: CartItem[], total: string) {
  if (cart.length === 0) return;
  let m = "🛒 *NUEVO PEDIDO WOOLY*\n\n";
  cart.forEach((i) => {
    const p = getEffectivePrice(i);
    m += `• *[${i.id}]* ${i.qty}u x S/${p.toFixed(1)} → *${i.title}*\n`;
  });
  m += `\n💰 *TOTAL ESTIMADO: S/ ${total}*`;
  window.open(`https://wa.me/51936188636?text=${encodeURIComponent(m)}`);
}

export function CartSidebar({
  isOpen, onClose, cart, totalItems, totalPrice, savings,
  onRemove, onChangeQty, onSetQty,
}: CartSidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-[1500] flex justify-end" onClick={onClose}>
      <div
        className="w-full max-w-md bg-card h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-foreground leading-none capitalize">Mi Pedido</h2>
              <span className="text-[10px] font-bold text-muted-foreground mt-1 uppercase">{cart.length} items seleccionados</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-grow overflow-y-auto p-5 space-y-4 bg-muted/30">
          {cart.length === 0 ? (
            <div className="py-20 flex flex-col items-center opacity-30 text-center">
              <ShoppingBag className="w-12 h-12 mb-3" />
              <p className="font-black text-[11px] capitalize tracking-wide">Carrito Vacío</p>
            </div>
          ) : (
            cart.map((item) => {
              const activePrice = getEffectivePrice(item);
              const subtotal = activePrice * item.qty;
              const itemTiers = CART_TIERS.filter((t) => {
                const val = item[t.key];
                return val !== null && val !== undefined && val > 0;
              });

              return (
                <div key={item.id} className="bg-card p-4 rounded-[28px] border border-border flex flex-col gap-4 shadow-sm animate-pop-in">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-muted flex-shrink-0">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow text-left">
                      <div className="flex justify-between items-start">
                        <h4 className="text-[12px] font-black text-foreground leading-tight pr-4 tracking-tight capitalize">{item.title}</h4>
                        <button onClick={() => onRemove(item.id)} className="text-border hover:text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-baseline gap-1">
                          <span className="text-[9px] font-black text-muted-foreground uppercase">S/</span>
                          <span className="text-xl font-black text-foreground tracking-tighter">{subtotal.toFixed(1)}</span>
                        </div>
                        <div className={`px-3 py-1 rounded-full font-black text-[10px] ${getBubbleClass(item)}`}>
                          U: S/ {activePrice.toFixed(1)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1 flex-grow flex-wrap">
                      {itemTiers.map((tier, idx) => {
                        const nextTier = itemTiers[idx + 1];
                        const isActive = item.qty >= tier.qty && (!nextTier || item.qty < nextTier.qty);
                        return (
                          <button
                            key={tier.qty}
                            onClick={() => onSetQty(item.id, tier.qty)}
                            className={`flex-1 h-[38px] rounded-[14px] text-[11px] font-extrabold transition-all ${
                              isActive ? TIER_COLORS[tier.cls] : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {tier.qty}u
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex items-center bg-muted rounded-2xl p-1 min-w-[90px]">
                      <button onClick={() => onChangeQty(item.id, -1)} className="w-8 h-8 bg-card rounded-xl shadow-sm flex items-center justify-center text-primary active:scale-90 transition-transform">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="flex-grow text-center text-xs font-black text-foreground">{item.qty}</span>
                      <button onClick={() => onChangeQty(item.id, 1)} className="w-8 h-8 bg-card rounded-xl shadow-sm flex items-center justify-center text-primary active:scale-90 transition-transform">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-8 bg-card border-t border-border">
          {savings > 0 && (
            <div className="mb-6 bg-secondary/10 border border-secondary/20 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-secondary">
                <Sparkles className="w-4 h-4 fill-current" />
                <span className="text-[11px] font-black tracking-tight capitalize">¡Ahorro Wooly Aplicado!</span>
              </div>
              <span className="text-sm font-black text-secondary">- S/ {savings.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between items-end mb-8">
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-black text-muted-foreground tracking-widest mb-1 capitalize">Total Estimado</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-black text-muted-foreground">S/</span>
                <span className="text-4xl font-black text-foreground tracking-tighter">{totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <div className="bg-muted px-4 py-2 rounded-xl text-center border border-border">
              <span className="block text-lg font-black text-foreground leading-none">{totalItems}</span>
              <span className="text-[8px] font-bold text-muted-foreground tracking-tighter capitalize">Unidades</span>
            </div>
          </div>
          <button
            onClick={() => checkout(cart, totalPrice.toFixed(2))}
            className="w-full bg-whatsapp hover:bg-whatsapp-dark text-primary-foreground py-4 rounded-2xl font-black text-sm capitalize tracking-wide shadow-lg shadow-whatsapp/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <MessageCircle className="w-5 h-5" />
            Confirmar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}
