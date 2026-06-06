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
import BlogSectionPage from "./pages/BlogSectionPage";
<<<<<<< HEAD
import { HelmetProvider } from "react-helmet-async";
=======
import WoolyConnectPage from "@/modules/wooly-connect/pages/WoolyConnectPage";

>>>>>>> 821061a (feat: nuevos modulos)

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter future={{ v7_relativeSplatPath: true }}>
            <Routes>
              {/* HOME */}
              <Route path="/" element={<HomePage />} />

              {/* BLOG */}

              <Route path="/blog" element={<BlogPage />} />

              <Route path="/blog/laboratorio" element={<BlogSectionPage />} />
              <Route path="/blog/tendencias" element={<BlogSectionPage />} />
              <Route path="/blog/oportunidades" element={<BlogSectionPage />} />
              <Route path="/blog/herramientas" element={<BlogSectionPage />} />
              <Route
                path="/blog/herramientas/:tool"
                element={<BlogSectionPage />}
              />
              <Route path="/blog/campanas" element={<BlogSectionPage />} />
              <Route
                path="/blog/campanas/:campaign"
                element={<BlogSectionPage />}
              />
              <Route path="/blog/catalogo" element={<BlogSectionPage />} />
              <Route path="/blog/guias" element={<BlogSectionPage />} />
              <Route path="/blog/:slug" element={<BlogArticlePage />} />
              {/* CATALOGO */}
              <Route path="/catalogo" element={<CatalogPage />} />
              <Route
                path="/catalogo/producto.html"
                element={<ProductDetailPage />}
              />
              <Route
                path="/catalogo/categoria.html"
                element={<CategoryPage />}
              />

              {/* LEGACY */}
              <Route path="/producto/:id" element={<ProductDetailPage />} />
              <Route path="/categoria/:id" element={<CategoryPage />} />

<<<<<<< HEAD
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
=======
            {/* WOOLY CONNECT */}
            <Route path="/wooly-connect" element={<WoolyConnectPage />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
>>>>>>> 821061a (feat: nuevos modulos)
    </QueryClientProvider>
  );
}


