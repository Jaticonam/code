import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Toaster } from "@/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";

import HomePage from "@/app/pages/HomePage";
import CatalogPage from "@/app/pages/CatalogPage";
import ProductDetailPage from "@/app/pages/ProductDetailPage";
import CategoryPage from "@/app/pages/CategoryPage";
import BlogPage from "@/app/pages/BlogPage";
import BlogArticlePage from "@/app/pages/BlogArticlePage";
import NotFound from "@/app/pages/NotFound";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter future={{ v7_relativeSplatPath: true }}>
          <Routes>
            {/* HOME */}
            <Route path="/" element={<HomePage />} />

            {/* BLOG */}
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogArticlePage />} />

            {/* CATALOGO */}
            <Route path="/catalogo" element={<CatalogPage />} />
            <Route path="/catalogo/producto.html" element={<ProductDetailPage />} />
            <Route path="/catalogo/categoria.html" element={<CategoryPage />} />

            {/* LEGACY */}
            <Route path="/producto/:id" element={<ProductDetailPage />} />
            <Route path="/categoria/:id" element={<CategoryPage />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
