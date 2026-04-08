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

const CART_NOTES_KEY = "wooly_cart_notes";

function loadCartNotes(): Record<string, string> {
  try {
    const saved = localStorage.getItem(CART_NOTES_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveCartNotes(notes: Record<string, string>) {
  try {
    localStorage.setItem(CART_NOTES_KEY, JSON.stringify(notes));
  } catch {}
}

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
}

const CART_TIERS = [
  { qty: 1, key: "price_1" as const, cls: "active-1", label: "1u" },
  { qty: 3, key: "price_3" as const, cls: "active-3", label: "3u" },
  { qty: 12, key: "price_12" as const, cls: "active-12", label: "12u" },
  { qty: 50, key: "price_50" as const, cls: "active-50", label: "50u" },
  { qty: 100, key: "price_100" as const, cls: "active-100", label: "100u" },
];

const TIER_COLORS: Record<string, string> = {
  "active-1": "bg-primary text-primary-foreground border-primary shadow-primary/20",
  "active-3": "bg-tertiary text-tertiary-foreground border-tertiary shadow-tertiary/20",
  "active-12": "bg-secondary text-secondary-foreground border-secondary shadow-secondary/20",
  "active-50": "bg-purple-500 text-white border-purple-500 shadow-purple-500/20",
  "active-100": "bg-dark text-primary-foreground border-dark shadow-black/20",
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
  if (activeTier >= 100) return "🔥 Mejor precio máximo activado";
  if (activeTier >= 50) return "⚡ Precio mayorista fuerte activado";
  if (activeTier >= 12) return "✨ Precio por volumen activado";
  if (activeTier >= 3) return "🎉 Precio por pack activado";
  return null;
}

function checkout(cart: CartItem[], total: string, savings: number) {
  if (cart.length === 0) return;

  const notes = loadCartNotes();

  let m = "🚨 *NUEVO PEDIDO WOOLY - MAYORISTAS*\n\n";
  m += "Hola, deseo pedir lo siguiente:\n\n";

  cart.forEach((i) => {
    const p = getEffectivePrice(i);
    const subtotal = p * i.qty;
    const note = notes[i.id]?.trim();

    m += `• *[ ${i.id} ]* | *${i.title}*\n`;
    m += `  Cantidad: ${i.qty} u\n`;
    m += `  Precio: S/${p.toFixed(2)}\n`;
    m += `  Subtotal: S/${subtotal.toFixed(2)}\n`;

    if (note) {
      m += `  Detalle: ${note}\n`;
    }

    m += "\n";
  });

  m += "━━━━━━━━━━━━━━━\n";
  m += `*Total estimado: S/${total}*\n`;

  if (savings > 0) {
    m += `Ahorro estimado: S/${savings.toFixed(2)}\n`;
  }

  m += "\nConfirmar disponibilidad, gracias.";

  window.open(`https://wa.me/51936188636?text=${encodeURIComponent(m)}`, "_blank");
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

function NoteTextarea({ item }: { item: CartItem }) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const notes = loadCartNotes();
    setValue(notes[item.id] || "");
  }, [item.id]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  const handleChange = (next: string) => {
    setValue(next);
    const notes = loadCartNotes();
    notes[item.id] = next;
    saveCartNotes(notes);
  };

  return (
    <div className="mt-1">
      <label className="block text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-wide">
        Detalles del pedido <span className="normal-case opacity-70">(opcional)</span>
      </label>

      <textarea
        ref={ref}
        rows={1}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Detalla tu pedido. Ej.: 02 rojos, 04 azules"
        className="w-full resize-none overflow-hidden rounded-2xl border border-border bg-muted/60 px-4 py-3 text-[12px] text-foreground placeholder:text-muted-foreground/70 outline-none focus:border-primary focus:bg-background transition-colors"
      />
    </div>
  );
}

function CartRow({
  item,
  onRemove,
  onChangeQty,
  onSetQty,
}: {
  item: CartItem;
  onRemove: (id: string) => void;
  onChangeQty: (id: string, delta: number) => void;
  onSetQty: (id: string, qty: number | null) => void;
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
    <div
      className={`bg-card p-4 rounded-[28px] border border-border flex flex-col gap-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-[1px] ${
        qtyPulse ? "scale-[1.01]" : "scale-100"
      }`}
    >
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-muted flex-shrink-0">
          <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
        </div>

        <div className="flex-grow text-left min-w-0">
          <div className="flex justify-between items-start gap-3">
            <div className="min-w-0">
              <h4 className="text-[12px] font-black text-foreground leading-tight tracking-tight capitalize">
                {item.title}
              </h4>
              <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-wide">
                {item.id}
              </p>
            </div>

            <button
              onClick={() => onRemove(item.id)}
              className="text-border hover:text-destructive transition-colors flex-shrink-0"
              aria-label={`Eliminar ${item.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="flex items-baseline gap-1 min-w-0">
              <span className="text-[9px] font-black text-muted-foreground uppercase">S/</span>
              <span
                className={`text-xl font-black text-foreground tracking-tighter transition-all duration-300 ${
                  pricePulse ? "scale-105 text-primary" : "scale-100"
                }`}
              >
                {subtotal.toFixed(2)}
              </span>
            </div>

            <div
              className={`px-3 py-1 rounded-full font-black text-[10px] transition-all duration-300 ${
                getBubbleClass(item)
              } ${pricePulse ? "scale-105 shadow-md" : "scale-100"}`}
            >
              U: S/ {activePrice.toFixed(2)}
            </div>
          </div>

          {tierMessage && (
            <div
              className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black transition-all duration-300 ${
                tierFlash
                  ? "bg-secondary/15 text-secondary scale-[1.03]"
                  : "bg-muted text-muted-foreground"
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
                className={`flex-1 h-[38px] rounded-[14px] border text-[11px] font-extrabold transition-all duration-300 ${
                  isActive
                    ? `${TIER_COLORS[tier.cls]} scale-[1.02] shadow-md`
                    : "bg-muted text-muted-foreground border-transparent hover:bg-background"
                }`}
              >
                {tier.label}
              </button>
            );
          })}
        </div>

        <div
          className={`flex items-center bg-muted rounded-2xl p-1 min-w-[116px] border border-border transition-all duration-300 ${
            qtyPulse ? "shadow-md ring-2 ring-primary/10" : ""
          }`}
        >
          <button
            onClick={() => onChangeQty(item.id, -1)}
            className="w-8 h-8 bg-card rounded-xl shadow-sm flex items-center justify-center text-primary active:scale-90 hover:scale-105 transition-transform"
            aria-label={`Disminuir cantidad de ${item.title}`}
          >
            <Minus className="w-4 h-4" />
          </button>

          <QtyInput item={item} onSetQty={onSetQty} />

          <button
            onClick={() => onChangeQty(item.id, 1)}
            className="w-8 h-8 bg-card rounded-xl shadow-sm flex items-center justify-center text-primary active:scale-90 hover:scale-105 transition-transform"
            aria-label={`Aumentar cantidad de ${item.title}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <NoteTextarea item={item} />
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
}: CartSidebarProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-[1500] flex justify-end"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-card h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-foreground leading-none capitalize">
                Mi Pedido
              </h2>
              <span className="text-[10px] font-bold text-muted-foreground mt-1 uppercase">
                {cart.length} items seleccionados
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-5 space-y-4 bg-muted/30">
          {cart.length === 0 ? (
            <div className="py-20 flex flex-col items-center opacity-30 text-center">
              <ShoppingBag className="w-12 h-12 mb-3" />
              <p className="font-black text-[11px] capitalize tracking-wide">
                Carrito Vacío
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
              />
            ))
          )}
        </div>

        <div className="p-8 bg-card border-t border-border">
          {savings > 0 && (
            <div className="mb-6 bg-secondary/10 border border-secondary/20 p-4 rounded-2xl flex items-center justify-between animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-secondary">
                <Sparkles className="w-4 h-4 fill-current animate-pulse" />
                <span className="text-[11px] font-black tracking-tight capitalize">
                  ¡Ahorro Wooly Aplicado!
                </span>
              </div>
              <span className="text-sm font-black text-secondary">
                - S/ {savings.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-end mb-8">
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-black text-muted-foreground tracking-widest mb-1 capitalize">
                Total Estimado
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-black text-muted-foreground">S/</span>
                <span className="text-4xl font-black text-foreground tracking-tighter transition-all duration-300">
                  {totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-muted px-4 py-2 rounded-xl text-center border border-border">
              <span className="block text-lg font-black text-foreground leading-none">
                {totalItems}
              </span>
              <span className="text-[8px] font-bold text-muted-foreground tracking-tighter capitalize">
                Unidades
              </span>
            </div>
          </div>

          <button
            onClick={() => checkout(cart, totalPrice.toFixed(2), savings)}
            disabled={cart.length === 0}
            className={`w-full py-4 rounded-2xl font-black text-sm capitalize tracking-wide transition-all flex items-center justify-center gap-3 ${
              cart.length > 0
                ? "bg-whatsapp hover:bg-whatsapp-dark text-primary-foreground shadow-lg shadow-whatsapp/30 active:scale-[0.98]"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            Confirmar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}