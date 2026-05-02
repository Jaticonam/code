import { useEffect, useMemo, useRef, useState } from "react";
import {
  ShoppingBag,
  X,
  Minus,
  Plus,
  Trash2,
  Sparkles,
  MessageCircle,
  Zap,
} from "lucide-react";
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
  onSetQty: (id: string, qty: number | null) => void;
  onChangeNote: (id: string, note: string) => void;
  onClearCart: () => void;
}
const CART_TIERS = [
  { qty: 1, key: "price_1" as const, cls: "active-1", label: "1u" },
  { qty: 3, key: "price_3" as const, cls: "active-3", label: "3u" },
  { qty: 12, key: "price_12" as const, cls: "active-12", label: "12u" },
  { qty: 50, key: "price_50" as const, cls: "active-50", label: "50u" },
  { qty: 100, key: "price_100" as const, cls: "active-100", label: "100u" },
];

const TIER_COLORS = {
  "active-1": "active-1",
  "active-3": "active-3",
  "active-12": "active-12",
  "active-50": "active-50",
  "active-100": "active-100",
};

function getBubbleClass(item: CartItem): string {
  if (item.price_100 && item.qty >= 100) return "bg-dark text-primary-foreground";
  if (item.price_50 && item.qty >= 50) return "bg-purple-500 text-primary-foreground";
  if (item.price_12 && item.qty >= 12) return "bg-secondary text-secondary-foreground";
  if (item.price_3 && item.qty >= 3) return "bg-tertiary text-tertiary-foreground";
  return "bg-primary text-primary-foreground";
}

function getActiveTierQty(item: CartItem): number {
  if (item.price_100 && item.qty >= 100) return 100;
  if (item.price_50 && item.qty >= 50) return 50;
  if (item.price_12 && item.qty >= 12) return 12;
  if (item.price_3 && item.qty >= 3) return 3;
  return 1;
}

function getTierUnlockMessage(item: CartItem): string | null {
  const activeTier = getActiveTierQty(item);
  if (activeTier >= 100) return "🔥 Precio por cajón activado";
  if (activeTier >= 50) return "⚡ Precio máximoactivado";
  if (activeTier >= 12) return "✨ Precio por pack activado";
  if (activeTier >= 3) return "🎉 Precio por mayor activado";
  return null;
}

function checkout(
  cart: CartItem[],
  total: string,
  savings: number,
  onClearCart: () => void,
  onClose: () => void
) {
  if (cart.length === 0) return;

  let m = "*NUEVO PEDIDO WOOLY - MAYORISTAS*\n\n";
  m += "Hola, deseo pedir lo siguiente:\n\n";

  cart.forEach((i) => {
    const p = getEffectivePrice(i);
    const subtotal = p * i.qty;
    const note = i.note?.trim().replace(/\s+/g, " ");

    m += `• *[ ${i.id} ]* | *${i.title}*\n`;
    m += `  Cantidad: ${i.qty} u\n`;
    m += `  Precio: S/${p.toFixed(2)}\n`;
    m += `  Subtotal: S/${subtotal.toFixed(2)}\n`;

    if (note) {
      m += `*Detalle:* ${note}\n`;
    }

    m += "\n";
  });

  m += "━━━━━━━━━━━━━━━\n";
  m += `*Total estimado: S/${total}*\n`;

  if (savings > 0) {
    m += `Ahorro estimado: S/${savings.toFixed(2)}\n`;
  }

  m += "\nConfirmar disponibilidad, gracias.";

  const url = `https://wa.me/51936188636?text=${encodeURIComponent(m)}`;
  window.open(url, "_blank");

    setTimeout(() => {
      onClearCart();
      onClose();
    }, 300);
  }

function QtyInput({
  item,
  onSetQty,
}: {
  item: CartItem;
  onSetQty: (id: string, qty: number | null) => void;
}) {
  const [qtyInput, setQtyInput] = useState(String(item.qty));
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setQtyInput(String(item.qty));
    }
  }, [item.qty, isEditing]);

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={qtyInput}
      onFocus={() => setIsEditing(true)}
      onBlur={() => setIsEditing(false)}
      onChange={(e) => {
        const value = e.target.value;

        if (value === "") {
          setQtyInput("");
          onSetQty(item.id, null);
          return;
        }

        if (!/^\d+$/.test(value)) return;

        setQtyInput(value);
        onSetQty(item.id, parseInt(value, 10));
      }}
      className="w-12 text-center text-xs font-black text-foreground bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      aria-label={`Cantidad de ${item.title}`}
    />
  );
}

function NoteTextarea({
  item,
  onChangeNote,
}: {
  item: CartItem;
  onChangeNote: (id: string, note: string) => void;
}) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${el.scrollHeight}px`;
  }, [item.note]);

  return (
    <div className="mt-1">
     <textarea
        ref={ref}
        rows={1}
        value={item.note || ""}
        onChange={(e) => onChangeNote(item.id, e.target.value)}
        placeholder="Detalla tu pedido. Ej.: 2 rojos, 4 azules, con moño, etc."
        className="cart-note"
      />
    </div>
  );
}

function CartRow({
  item,
  onRemove,
  onChangeQty,
  onSetQty,
  onChangeNote,
}: {
  item: CartItem;
  onRemove: (id: string) => void;
  onChangeQty: (id: string, delta: number) => void;
  onSetQty: (id: string, qty: number | null) => void;
  onChangeNote: (id: string, note: string) => void;
}) {
  const activePrice = getEffectivePrice(item);
  const subtotal = activePrice * item.qty;
  const activeTierQty = getActiveTierQty(item);
  const tierMessage = getTierUnlockMessage(item);

  const prevQtyRef = useRef(item.qty);
  const prevPriceRef = useRef(activePrice);
  const prevTierRef = useRef(activeTierQty);

  const [qtyPulse, setQtyPulse] = useState(false);
  const [pricePulse, setPricePulse] = useState(false);
  const [tierFlash, setTierFlash] = useState(false);

  useEffect(() => {
    if (prevQtyRef.current !== item.qty) {
      setQtyPulse(true);
      const timer = setTimeout(() => setQtyPulse(false), 220);
      prevQtyRef.current = item.qty;
      return () => clearTimeout(timer);
    }
  }, [item.qty]);

  useEffect(() => {
    if (prevPriceRef.current !== activePrice) {
      setPricePulse(true);
      const timer = setTimeout(() => setPricePulse(false), 280);
      prevPriceRef.current = activePrice;
      return () => clearTimeout(timer);
    }
  }, [activePrice]);

  useEffect(() => {
    if (prevTierRef.current !== activeTierQty) {
      setTierFlash(true);
      const timer = setTimeout(() => setTierFlash(false), 1500);
      prevTierRef.current = activeTierQty;
      return () => clearTimeout(timer);
    }
  }, [activeTierQty]);

  const itemTiers = useMemo(() => {
    return CART_TIERS.filter((tier) => {
      const value = item[tier.key];
      return value !== null && value !== undefined && value > 0;
    });
  }, [item]);

  return (
    <div className={`cart-item-card ${qtyPulse ? "scale-[1.01]" : ""}`}>
      <div className="flex gap-4">
        <div className="cart-product-img">
          <img
            src={item.img}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-grow text-left min-w-0">
          <div className="flex justify-between items-start gap-3">
            <div className="min-w-0">
              <h4 className="text-[13px] font-extrabold text-[#0f172a] leading-tight tracking-tight capitalize">
                {item.title}
              </h4>

              <p className="text-[10px] font-bold text-[#94a3b8] mt-1 uppercase tracking-wide">
                {item.id}
              </p>
            </div>

            <button
              onClick={() => onRemove(item.id)}
              className="text-[#cbd5e1] hover:text-[#ef4444] transition-colors flex-shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-baseline gap-1">
              <span className="text-[10px] font-black text-[#94a3b8]">S/</span>

              <span
                className={`text-2xl font-black tracking-tighter transition-all duration-300 ${
                  pricePulse
                    ? "scale-105 text-[#1d8299]"
                    : "text-[#0f172a]"
                }`}
              >
                {subtotal.toFixed(2)}
              </span>
            </div>

            <div
              className={`cart-unit-badge ${
                pricePulse ? "scale-105 shadow-md" : ""
              }`}
            >
              U: S/ {activePrice.toFixed(2)}
            </div>
          </div>

          {tierMessage && (
            <div
              className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                tierFlash
                  ? "bg-[#fff0f7] text-[#f286be] scale-[1.03]"
                  : "bg-[#e6f2f5] text-[#1d8299]"
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${tierFlash ? "animate-pulse" : ""}`} />
              {tierMessage}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex gap-1 flex-grow flex-wrap">
          {itemTiers.map((tier, index) => {
            const nextTier = itemTiers[index + 1];
            const isActive =
              item.qty >= tier.qty && (!nextTier || item.qty < nextTier.qty);

            return (
              <button
                key={tier.qty}
                onClick={() => onSetQty(item.id, tier.qty)}
                className={`cart-tier-btn ${
                  isActive
                    ? `${TIER_COLORS[tier.cls]} scale-[1.02] shadow-md`
                    : "cart-tier-btn-muted"
                }`}
              >
                {tier.label}
              </button>
            );
          })}
        </div>

        <div className={`cart-qty-box ${qtyPulse ? "ring-2 ring-[#1d8299]/10" : ""}`}>
          <button onClick={() => onChangeQty(item.id, -1)} className="cart-qty-btn">
            <Minus className="w-4 h-4" />
          </button>

          <QtyInput item={item} onSetQty={onSetQty} />

          <button onClick={() => onChangeQty(item.id, 1)} className="cart-qty-btn">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <NoteTextarea item={item} onChangeNote={onChangeNote} />
    </div>
  );
}

export function CartSidebar({
  isOpen,
  onClose,
  cart,
  totalItems,
  totalPrice,
  savings,
  onRemove,
  onChangeQty,
  onSetQty,
  onChangeNote,
  onClearCart,
}: CartSidebarProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1500] flex justify-end bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="cart-panel animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cart-header">
          <div className="flex items-center gap-3">
            <div className="cart-icon-box">
              <ShoppingBag className="w-5 h-5" />
            </div>

            <div>
              <h2 className="text-lg font-black leading-none text-[#0f172a]">
                Mi Pedido
              </h2>
              <span className="mt-1 block text-[10px] font-bold uppercase tracking-wide text-[#1d8299]">
                {cart.length} items seleccionados
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="cart-close-btn"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-[#94a3b8]">
              <ShoppingBag className="mb-3 h-12 w-12" />
              <p className="text-[11px] font-black tracking-wide">
                Carrito vacío
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <CartRow
                key={item.id}
                item={item}
                onRemove={onRemove}
                onChangeQty={onChangeQty}
                onSetQty={onSetQty}
                onChangeNote={onChangeNote}
              />
            ))
          )}
        </div>

        <div className="cart-footer">
          {savings > 0 && (
            <div className="cart-saving-box">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 fill-current animate-pulse" />
                <span className="text-[11px] font-black tracking-tight">
                  ¡Ahorro Wooly aplicado!
                </span>
              </div>

              <span className="text-sm font-black">
                - S/ {savings.toFixed(2)}
              </span>
            </div>
          )}

          <div className="mb-8 flex items-end justify-between">
            <div className="flex flex-col text-left">
              <span className="mb-1 text-[9px] font-black uppercase tracking-widest text-[#64748b]">
                Total estimado
              </span>

              <div className="flex items-baseline gap-1">
                <span className="text-xs font-black text-[#94a3b8]">S/</span>
                <span className="text-4xl font-black tracking-tighter text-[#1d8299]">
                  {totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="cart-total-box">
              <span className="block text-lg font-black leading-none text-[#0f172a]">
                {totalItems}
              </span>
              <span className="text-[8px] font-bold tracking-tight text-[#64748b]">
                Unidades
              </span>
            </div>
          </div>

          <button
            onClick={() =>
              checkout(
                cart,
                totalPrice.toFixed(2),
                savings,
                onClearCart,
                onClose
              )
            }
            disabled={cart.length === 0}
            className={
              cart.length > 0
                ? "cart-checkout-btn"
                : "w-full py-4 rounded-2xl font-black text-sm tracking-wide flex items-center justify-center gap-3 bg-[#f1f5f9] text-[#94a3b8] cursor-not-allowed"
            }
          >
            <MessageCircle className="w-5 h-5" />
            Confirmar pedido
          </button>
        </div>
      </div>
    </div>
  );
}