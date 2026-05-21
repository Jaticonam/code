type ToastProps = {
  title?: string;
  description?: string;
};

export function toast({ title, description }: ToastProps) {
  console.log("Toast:", title, description);
}

export function useToast() {
  return { toast };
}