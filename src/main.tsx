import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CartProvider } from "@/store/cart";

createRoot(document.getElementById("root")!).render(
  <CartProvider>
    <App />
  </CartProvider>
);
