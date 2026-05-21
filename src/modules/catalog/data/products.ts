import type { Product } from "../types/Product";

export const products: Product[] = [
  {
    id: 1,
    name: "Wool Hoodie",
    price: 129,
    image: "/images/hoodie.jpg",
    category: "hoodies",
    featured: true,
    description: "Premium oversized hoodie."
  },

  {
    id: 2,
    name: "Urban Jacket",
    price: 189,
    image: "/images/jacket.jpg",
    category: "jackets",
    featured: false,
    description: "Urban winter jacket."
  }
];
