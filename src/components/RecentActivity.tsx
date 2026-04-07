import { useState, useEffect, useCallback } from "react";
import { ShoppingBag } from "lucide-react";
import { Product } from "@/types/product";

const NAMES = ["María","Carmen","Rosa","Ana","Lucía","Patricia","Milagros","Diana","Katherine","Yessenia","Fiorella","Valeria","Andrea","Fernanda","Daniela","Paola","Alejandra","Claudia","Roxana","Verónica","Jessica","Carla","Tatiana","Brenda","Mayra","Noelia","Leslie","Nicole","Camila","Renata","Sofía","Maricielo","Gianella","Kiara"];
const PLACES = ["Lima","Callao","Miraflores","Surco","San Isidro","San Borja","La Molina","Los Olivos","San Juan de Lurigancho","Comas","Piura","Trujillo","Chiclayo","Arequipa","Cusco","Huancayo","Iquitos","Tarapoto"];

function random<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface RecentActivityProps {
  products: Product[];
}

export function RecentActivity({ products }: RecentActivityProps) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [data, setData] = useState({ name: "", place: "", product: "", time: 0 });

  const show = useCallback(() => {
    if (products.length === 0) return;
    setData({
      name: random(NAMES),
      place: random(PLACES),
      product: random(products).title,
      time: Math.floor(Math.random() * 15) + 2,
    });
    setLeaving(false);
    setVisible(true);

    setTimeout(() => {
      setLeaving(true);
      setTimeout(() => {
        setVisible(false);
        setTimeout(show, Math.floor(Math.random() * 20000) + 15000);
      }, 500);
    }, 6000);
  }, [products]);

  useEffect(() => {
    const timer = setTimeout(show, 5000);
    return () => clearTimeout(timer);
  }, [show]);

  if (!visible) return null;

  return (
    <div className={`fixed bottom-[calc(env(safe-area-inset-bottom)+25px)] left-5 z-[1000] ${leaving ? "animate-slide-down" : "animate-slide-up"}`}>
      <div className="bg-card shadow-2xl rounded-2xl p-4 border border-border flex items-center space-x-4 w-72">
        <div className="bg-primary/10 h-12 w-12 rounded-xl flex items-center justify-center text-primary shrink-0">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <div className="text-left">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Compra Reciente</p>
          <p className="text-xs font-bold text-foreground leading-snug">
            <span className="text-primary">{data.name} de {data.place}</span> compró un{" "}
            <span>{data.product}</span>
          </p>
          <p className="text-[10px] text-primary font-bold mt-0.5">hace {data.time} minutos</p>
        </div>
      </div>
    </div>
  );
}
