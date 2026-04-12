import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import HomePage from "./pages/HomePage.tsx";
import Index from "./pages/Index.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import CategoryPage from "./pages/CategoryPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter
        future={{
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          {/* Landing principal */}
          <Route path="/" element={<HomePage />} />

          {/* Catálogo */}
          <Route path="/catalogo" element={<Index />} />
          <Route path="/catalogo/producto.html" element={<ProductDetail />} />
          <Route path="/catalogo/categoria.html" element={<CategoryPage />} />

          {/* Legacy routes */}
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/categoria/:id" element={<CategoryPage />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;