import { createRoot } from "react-dom/client";

import App from "@/app/App";
import "@/index.css";

import { CartProvider } from "@/modules/cart/store";

createRoot(document.getElementById("root")!).render(
  <CartProvider>
    <App />
  </CartProvider>
);
