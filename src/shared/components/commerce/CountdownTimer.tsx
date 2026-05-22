import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

type UrgencyLevel = "normal" | "warning" | "danger";

const dispatchDays = [1, 3, 5];
const cutoffHour = 16;

const dayNames = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

const getNextDispatch = () => {
  const now = new Date();
  const today = now.getDay();
  const todayCutoff = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    cutoffHour,
    0,
    0
  );

  if (dispatchDays.includes(today) && now < todayCutoff) {
    return { date: todayCutoff, mode: "today" as const };
  }

  for (let i = 1; i <= 7; i++) {
    const next = new Date(now);
    next.setDate(now.getDate() + i);

    if (dispatchDays.includes(next.getDay())) {
      next.setHours(cutoffHour, 0, 0);
      return { date: next, mode: "next" as const };
    }
  }

  return { date: todayCutoff, mode: "next" as const };
};

export function CountdownTimer() {
  const [time, setTime] = useState("00h : 00m : 00s");
  const [urgency, setUrgency] = useState<UrgencyLevel>("normal");
  const [labelText, setLabelText] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const { date, mode } = getNextDispatch();
      const diff = date.getTime() - now.getTime();

      if (diff <= 0) {
        setTime("00h : 00m : 00s");
        setUrgency("danger");
        return;
      }

      const hours = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const minutes = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
      const minutesLeft = Math.floor(diff / 60000);
      const dispatchDayName = dayNames[date.getDay()];
      const diffDays = Math.ceil(diff / 86400000);

      setTime(`${hours}h : ${minutes}m : ${seconds}s`);
      setUrgency(minutesLeft <= 90 ? "danger" : minutesLeft <= 240 ? "warning" : "normal");

      if (mode === "today") {
        setLabelText(
          minutesLeft <= 90
            ? "🔥 Últimos minutos — sale hoy"
            : minutesLeft <= 240
            ? "🚚 Sale hoy — aprovecha ahora"
            : "🚚 Sale hoy — quedan"
        );
      } else {
        setLabelText(
          diffDays === 1
            ? `📦 Sale mañana (${dispatchDayName})`
            : `📦 Sale ${dispatchDayName}`
        );
      }
    };

    update();

    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className={`countdown-timer countdown-timer-${urgency}`}>
      <Timer className="countdown-timer-icon" />

      <span className="countdown-timer-label">
        {labelText}
      </span>

      <strong className="countdown-timer-box">
        {time}
      </strong>
    </div>
  );
}