import { useState, useEffect } from "react";
import { Timer } from "lucide-react";

export function CountdownTimer() {
  const [time, setTime] = useState("00h : 00m : 00s");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      const diff = end.getTime() - now.getTime();
      if (diff <= 0) { setTime("00h : 00m : 00s"); return; }
      const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
      setTime(`${h}h : ${m}m : ${s}s`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-[length:200%_auto] animate-shimmer w-full flex justify-center items-center py-3 px-2 gap-2 md:gap-4 shadow-xl z-20 border-b border-red-400">
      <Timer className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground animate-pulse" />
      <span className="text-[10px] md:text-sm font-black uppercase tracking-widest text-primary-foreground">
        Ofertas terminan en:
      </span>
      <div className="bg-card text-red-600 px-3 py-1.5 md:px-5 md:py-2 rounded-xl text-[14px] md:text-[20px] font-black tracking-widest shadow-[0_0_15px_rgba(220,38,38,0.4)]">
        {time}
      </div>
    </div>
  );
}
