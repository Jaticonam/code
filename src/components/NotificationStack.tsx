import { useState, useEffect, useCallback } from "react";
import { CheckCircle } from "lucide-react";

interface Toast {
  id: number;
  title: string;
  message: string;
  leaving: boolean;
}

let toastId = 0;

// Singleton event emitter para notificaciones
type Listener = (title: string, message: string) => void;
const listeners: Set<Listener> = new Set();

export function showNotification(title: string, message: string) {
  listeners.forEach((fn) => fn(title, message));
}

export function NotificationStack() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((title: string, message: string) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, title, message, leaving: false }]);
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 300);
    }, 2500);
  }, []);

  useEffect(() => {
    listeners.add(addToast);
    return () => { listeners.delete(addToast); };
  }, [addToast]);

  return (
    <div className="fixed inset-x-0 top-6 flex flex-col items-center gap-3 z-[3000] pointer-events-none px-4">
      {toasts.map((t) => (
        <div key={t.id} className={t.leaving ? "animate-toast-out" : "animate-toast-in"}>
          <div className="pointer-events-auto flex items-center gap-3 bg-card/98 backdrop-blur-lg px-4 py-2 rounded-3xl shadow-xl border border-border">
            <div className="bg-success/10 p-2 rounded-xl text-success">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-black text-foreground capitalize tracking-wide">{t.title}</span>
              <span className="text-[10px] font-bold text-muted-foreground line-clamp-1 capitalize">{t.message}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
