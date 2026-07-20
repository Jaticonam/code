type Toast = {
  id: string;
  title?: string;
  description?: string;
};

const toasts: Toast[] = [];

export function toast(data: Omit<Toast, "id">) {
  toasts.push({
    id: crypto.randomUUID(),
    ...data,
  });
}

export function useToast() {
  return {
    toasts,
    toast,
    dismiss: () => {},
  };
}