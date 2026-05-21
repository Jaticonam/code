import { Minus, Plus } from "lucide-react";

interface ProductQuantitySelectorProps {
  value: string;
  effectiveQty: number;
  onDecrease: () => void;
  onIncrease: () => void;
  onChange: (value: string) => void;
  onBlur: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function ProductQuantitySelector({
  value,
  effectiveQty,
  onDecrease,
  onIncrease,
  onChange,
  onBlur,
  onKeyDown,
}: ProductQuantitySelectorProps) {
  return (
    <div className="flex justify-center md:justify-start items-center gap-4">
      <button
        type="button"
        onClick={onDecrease}
        className="w-10 h-10 bg-[#f1f5f9] rounded-xl flex items-center justify-center text-[#334155] hover:bg-[#e2e8f0] transition-colors"
        aria-label="Disminuir cantidad"
      >
        <Minus className="w-4 h-4" />
      </button>

      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        placeholder="0"
        className="w-24 h-12 rounded-xl border border-[#d8e2ed] bg-white text-center text-2xl font-black text-[#334155] shadow-sm outline-none focus:border-[#1d8299] placeholder:text-muted-foreground/50"
        aria-label="Cantidad"
      />

      <button
        type="button"
        onClick={onIncrease}
        className="w-10 h-10 bg-[#f1f5f9] rounded-xl flex items-center justify-center text-[#334155] hover:bg-[#e2e8f0] transition-colors"
        aria-label="Aumentar cantidad"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
