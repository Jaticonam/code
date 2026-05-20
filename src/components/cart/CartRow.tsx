import { useEffect, useMemo, useRef, useState } from "react";
import { Trash2, Zap } from "lucide-react";

import { CartItem } from "@/types/product";
import { getEffectivePrice } from "@/lib/products";
import { getActiveTierQty } from "@/lib/cart/getActiveTierQty";
import { getTierUnlockMessage } from "@/lib/cart/getTierUnlockMessage";

import { CartTierSelector } from "@/components/cart/CartTierSelector";
import { CartQtyControls } from "@/components/cart/CartQtyControls";
import { CartNoteTextarea } from "@/components/cart/CartNoteTextarea";

interface CartRowProps {
  item: CartItem;
  onRemove: (id: string) => void;
  onChangeQty: (id: string, delta: number) => void;
  onSetQty: (id: string, qty: number | null) => void;
  onChangeNote: (id: string, note: string) => void;
}

export function CartRow({
  item,
  onRemove,
  onChangeQty,
  onSetQty,
  onChangeNote,
}: CartRowProps) {
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
              <span className="text-[10px] font-black text-[#94a3b8]">
                S/
              </span>

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
        <CartTierSelector item={item} onSetQty={onSetQty} />

        <CartQtyControls
          item={item}
          qtyPulse={qtyPulse}
          onChangeQty={onChangeQty}
          onSetQty={onSetQty}
        />
      </div>

      <CartNoteTextarea item={item} onChangeNote={onChangeNote} />
    </div>
  );
}
