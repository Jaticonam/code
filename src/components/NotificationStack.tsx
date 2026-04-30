import { useState, useEffect, useCallback } from "react";
import { CheckCircle } from "lucide-react";

interface Toast {
  id: number;
  title: string;
  message: string;
  leaving: boolean;
}

let toastId = 0;

type Listener = (title: string, message: string) => void;
const listeners: Set<Listener> = new Set();

export function showNotification(title: string, message: string) {
  listeners.forEach((fn) => fn(title, message));
}

export function NotificationStack() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((title: string, message: string) => {
    const id = ++toastId;

    setToasts((prev) => [
      ...prev.slice(-2),
      { id, title, message, leaving: false },
    ]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
      );

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, 2600);
  }, []);

  useEffect(() => {
    listeners.add(addToast);
    return () => {
      listeners.delete(addToast);
    };
  }, [addToast]);

  return (
    <div className="fixed bottom-6 right-4 md:right-6 z-[9999] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={t.leaving ? "animate-toast-out" : "animate-toast-in"}
        >
          <div className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-[#e2e8f0] bg-white/95 px-4 py-3 shadow-[0_18px_45px_rgba(15,23,42,0.16)] backdrop-blur-xl">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e6f2f5] text-[#1d8299]">
              <CheckCircle className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-black leading-tight text-[#0f172a]">
                {t.title}
              </p>
              <p className="mt-0.5 line-clamp-2 text-xs font-semibold leading-snug text-[#64748b]">
                {t.message}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}