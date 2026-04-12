import { useState, useEffect } from "react";
import { Timer } from "lucide-react";

type UrgencyLevel = "normal" | "warning" | "danger";

export function CountdownTimer() {
  const [time, setTime] = useState("00h : 00m : 00s");
  const [urgency, setUrgency] = useState<UrgencyLevel>("normal");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const end = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59
      );

      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setTime("00h : 00m : 00s");
        setUrgency("danger");
        return;
      }

      const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");

      setTime(`${h}h : ${m}m : ${s}s`);

      const minutesLeft = Math.floor(diff / 60000);

      if (minutesLeft <= 60) {
        setUrgency("danger"); // 🔴
      } else if (minutesLeft <= 180) {
        setUrgency("warning"); // 🟡
      } else {
        setUrgency("normal"); // 🟢
      }
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const bannerClass =
    urgency === "danger"
      ? "bg-gradient-to-r from-red-700 via-red-600 to-red-700 border-red-500"
      : urgency === "warning"
      ? "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 border-amber-300"
      : "bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500 border-emerald-300";

  const textColor =
    urgency === "warning"
      ? "text-slate-900"
      : "text-white";

  const timerBoxClass =
    urgency === "danger"
      ? "bg-white text-red-700 shadow-[0_0_15px_rgba(220,38,38,0.5)]"
      : urgency === "warning"
      ? "bg-white text-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
      : "bg-white text-green-600 shadow-[0_0_15px_rgba(34,197,94,0.4)]";

  const labelText =
    urgency === "danger"
      ? "🔥 Última hora"
      : urgency === "warning"
      ? "⏳ Se está acabando"
      : "Ofertas activas hoy";

  return (
    <div
      className={`w-full flex justify-center items-center py-3 px-2 gap-2 md:gap-4 shadow-xl z-20 border-b transition-all duration-300 ${bannerClass}`}
    >
      <Timer
        className={`w-5 h-5 md:w-6 md:h-6 ${textColor} ${
          urgency === "danger" ? "animate-pulse" : ""
        }`}
      />

      <span
        className={`text-[10px] md:text-sm font-black uppercase tracking-widest ${textColor}`}
      >
        {labelText}
      </span>

      <div
        className={`px-3 py-1.5 md:px-5 md:py-2 rounded-xl text-[14px] md:text-[20px] font-black tracking-widest transition-all duration-300 ${timerBoxClass} ${
          urgency === "danger" ? "animate-pulse" : ""
        }`}
      >
        {time}
      </div>
    </div>
  );
}