import type { Product } from "@/shared/types/product";

export interface CartItem extends Product {
  qty: number;
  note: string;
}