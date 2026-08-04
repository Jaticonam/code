import { createRoot } from "react-dom/client";

import App from "@/app/App";
import "@/index.css";

import { CartProvider } from "@/modules/cart/store";

import {
  registerCatalogProviderHealthCollector,
} from "@/modules/catalog/providers/DefaultCatalogProvider";

import { AOSProvider } from "@/shared/providers/AOSProvider";

registerCatalogProviderHealthCollector();

createRoot(document.getElementById("root")!).render(
  <CartProvider>
    <AOSProvider>
      <App />
    </AOSProvider>
  </CartProvider>,
);
