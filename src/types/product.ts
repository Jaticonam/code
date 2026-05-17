export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  featured?: boolean;
}

export const CATEGORIES = [
  "Todos",
  "Hoodies",
  "Jackets",
  "Polos",
  "Accesorios",
] as const;
