import { useState, useEffect, useCallback, useRef } from "react";
import { Product } from "@/types/product";

const NAMES = [
  "María","Carmen","Rosa","Ana","Lucía","Patricia","Milagros","Diana",
  "Katherine","Fiorella","Valeria","Andrea","Fernanda","Daniela","Paola",
  "Alejandra","Claudia","Roxana","Jessica","Carla","Tatiana","Brenda",
  "Mayra","Noelia","Leslie","Nicole","Camila","Renata","Sofía"
];

const PLACES = [
  "Lima","Arequipa","Trujillo","Cusco","Piura","Chiclayo",
  "Huancayo","Tacna","Iquitos","Tarapoto"
];

const ACTIONS = [
  "compró",
  "acaba de comprar",
  "agregó a su pedido",
  "aprovechó la oferta de",
  "está comprando"
];

function random<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface RecentActivityProps {
  products: Product[];
}

export function RecentActivity({ products }: RecentActivityProps) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [data, setData] = useState({
    name: "",
    place: "",
    action: "",
    product: "",
    time: 0,
  });

  const lastProductRef = useRef<string | null>(null);
  const timersRef = useRef<number[]>([]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay);
    timersRef.current.push(id);
  }, []);

  const show = useCallback(() => {
    if (products.length === 0) return;

    let selected = random(products);

    // evitar repetir el mismo producto seguido
    if (products.length > 1 && selected.title === lastProductRef.current) {
      selected = random(products);
    }

    lastProductRef.current = selected.title;

    setData({
      name: random(NAMES),
      place: random(PLACES),
      action: random(ACTIONS),
      product: selected.title,
      time: Math.floor(Math.random() * 6) + 1,
    });

    setLeaving(false);
    setVisible(true);

    schedule(() => {
      setLeaving(true);

      schedule(() => {
        setVisible(false);

        // siguiente aparición más natural
        schedule(show, Math.floor(Math.random() * 12000) + 10000);
      }, 400);
    }, 5500);
  }, [products, schedule]);

  useEffect(() => {
    clearAllTimers();
    if (products.length === 0) return;

    schedule(show, 4000);

    return clearAllTimers;
  }, [products, show, schedule, clearAllTimers]);

  if (!visible) return null;

  const initial = data.name.charAt(0);

  return (
    <div
      className={`fixed bottom-[calc(env(safe-area-inset-bottom)+110px)] left-4 z-[999] ${
        leaving ? "animate-recent-activity-out" : "animate-recent-activity-in"
      }`}
    >
      <div className="w-[320px] rounded-3xl border border-[#e2e8f0] bg-white/95 px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.12)] backdrop-blur-xl">

        <div className="flex items-start gap-3">

          {/* Avatar */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1d8299] text-white text-sm font-semibold">
            {initial}
          </div>

          <div className="min-w-0">

            {/* Texto principal */}
            <p className="text-[13px] leading-snug text-[#334155]">
              <span className="font-semibold text-[#0f172a]">
                {data.name}
              </span>{" "}
              de{" "}
              <span className="text-[#64748b]">
                {data.place}
              </span>{" "}
              <span className="text-[#475569]">
                {data.action}
              </span>{" "}
              <span className="font-semibold text-[#0f172a] line-clamp-1">
                {data.product}
              </span>
            </p>

            {/* Tiempo */}
            <p className="mt-1 text-[11px] text-[#94a3b8]">
              {data.time <= 2 ? "hace unos segundos" : `hace ${data.time} min`}
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}