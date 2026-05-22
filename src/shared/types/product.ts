export interface Product {
  id: string;

  title: string;
  description: string;

  category: string;

  price_1: number;
  price_3?: number | null;
  price_12?: number | null;
  price_50?: number | null;
  price_100?: number | null;

  price_offer?: number | null;

  stock?: number | null;
  img: string;

  status?: string;
  badges?: string[];

  priority?: number;
}