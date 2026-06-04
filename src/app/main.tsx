import { createRoot } from "react-dom/client";

import App from "@/app/App";
import "@/index.css";

import { CartProvider } from "@/modules/cart/store";
import { AOSProvider } from "@/shared/providers/AOSProvider";

createRoot(document.getElementById("root")!).render(
  <CartProvider>
    <AOSProvider>
      <App />
    </AOSProvider>
  </CartProvider>,
);
