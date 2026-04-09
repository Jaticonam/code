export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price_1: number;
  price_3: number | null;
  price_12: number | null;
  price_50: number | null;
  price_100: number | null;
  stock: number | null;
  img: string;
}

export interface CartItem extends Product {
  qty: number;
  note?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const PRICE_TIERS = [
  { qty: 100, key: "price_100" as const, cls: "bg-dark text-primary-foreground", label: "100u+" },
  { qty: 50, key: "price_50" as const, cls: "bg-purple-500 text-primary-foreground", label: "50u+" },
  { qty: 12, key: "price_12" as const, cls: "bg-secondary text-secondary-foreground", label: "12u+" },
  { qty: 3, key: "price_3" as const, cls: "bg-tertiary text-tertiary-foreground", label: "3u+" },
  { qty: 1, key: "price_1" as const, cls: "bg-primary text-primary-foreground", label: "1u" },
] as const;

export const CATEGORIES: Category[] = [
  { id: "todas", name: "Todos", icon: "✨" },
  { id: "flores", name: "Flores", icon: "💐" },
  { id: "peluches", name: "Peluches", icon: "🧸" },
  { id: "papeles", name: "Papeles", icon: "📄" },
  { id: "cajas", name: "Cajas", icon: "📦" },
  { id: "cintas", name: "Cintas", icon: "🎀" },
  { id: "globos", name: "Globos", icon: "🎈" },
  { id: "accesorios", name: "Accesorios", icon: "✂️" },
  { id: "hotwheels", name: "HotWheels", icon: "🏎️" },
];