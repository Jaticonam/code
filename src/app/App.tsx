import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

import {
  HelmetProvider,
} from "react-helmet-async";

import {
  Toaster,
} from "@/shared/components/ui/toaster";

import {
  Toaster as Sonner,
} from "@/shared/components/ui/sonner";

import {
  TooltipProvider,
} from "@/shared/components/ui/tooltip";

import HomePage from "@/app/pages/HomePage";
import CatalogPage from "@/app/pages/CatalogPage";
import CatalogPdfPage from "@/app/pages/CatalogPdfPage";
import SalesCatalogToolsPage from "@/app/pages/SalesCatalogToolsPage";
import ProductDetailPage from "@/app/pages/ProductDetailPage";
import CategoryPage from "@/app/pages/CategoryPage";
import BlogPage from "@/app/pages/BlogPage";
import BlogArticlePage from "@/app/pages/BlogArticlePage";
import BlogSectionPage from "@/app/pages/BlogSectionPage";
import NotFound from "@/app/pages/NotFound";

import IntegrationsPage from "@/modules/integrations/pages/IntegrationsPage";
import CommercialCenter from "@/modules/commercial/pages/CommercialCenter";

import {
  CatalogCampaignRegistryProvider,
} from "@/modules/catalog/context/CatalogCampaignRegistryContext";

const queryClient =
  new QueryClient();

function CommerceCampaignScope() {
  return (
    <CatalogCampaignRegistryProvider>
      <Outlet />
    </CatalogCampaignRegistryProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider
      client={queryClient}
    >
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter
            future={{
              v7_relativeSplatPath:
                true,
            }}
          >
            <Routes>
              {/* SUPERFICIES COMERCIALES */}
              <Route
                element={
                  <CommerceCampaignScope />
                }
              >
                <Route
                  path="/"
                  element={
                    <HomePage />
                  }
                />

                <Route
                  path="/catalogo"
                  element={
                    <CatalogPage />
                  }
                />

                <Route
                  path="/catalogo/pdf"
                  element={
                    <CatalogPdfPage />
                  }
                />

                {/* PANEL ADMINISTRATIVO */}
                <Route
                  path="/admin"
                  element={
                    <SalesCatalogToolsPage />
                  }
                />

                {/* REDIRECCIÓN LEGACY */}
                <Route
                  path="/ventas/catalogos"
                  element={
                    <Navigate
                      to="/admin"
                      replace
                    />
                  }
                />

                <Route
                  path="/catalogo/producto.html"
                  element={
                    <ProductDetailPage />
                  }
                />

                <Route
                  path="/catalogo/categoria.html"
                  element={
                    <CategoryPage />
                  }
                />

                {/* LEGACY COMERCIAL */}
                <Route
                  path="/producto/:id"
                  element={
                    <ProductDetailPage />
                  }
                />

                <Route
                  path="/categoria/:id"
                  element={
                    <CategoryPage />
                  }
                />
              </Route>

              {/* BLOG */}
              <Route
                path="/blog"
                element={
                  <BlogPage />
                }
              />

              <Route
                path="/blog/laboratorio"
                element={
                  <BlogSectionPage />
                }
              />

              <Route
                path="/blog/tendencias"
                element={
                  <BlogSectionPage />
                }
              />

              <Route
                path="/blog/oportunidades"
                element={
                  <BlogSectionPage />
                }
              />

              <Route
                path="/blog/herramientas"
                element={
                  <BlogSectionPage />
                }
              />

              <Route
                path="/blog/herramientas/:tool"
                element={
                  <BlogSectionPage />
                }
              />

              <Route
                path="/blog/campanas"
                element={
                  <BlogSectionPage />
                }
              />

              <Route
                path="/blog/campanas/:campaign"
                element={
                  <BlogSectionPage />
                }
              />

              <Route
                path="/blog/catalogo"
                element={
                  <BlogSectionPage />
                }
              />

              <Route
                path="/blog/guias"
                element={
                  <BlogSectionPage />
                }
              />

              <Route
                path="/blog/:slug"
                element={
                  <BlogArticlePage />
                }
              />

              {/* COMMERCIAL CENTER */}
              <Route
                path="/admin/commercial"
                element={
                  <CommercialCenter />
                }
              />

              {/* WOOLY CONNECT */}
              <Route
                path="/admin/integrations"
                element={
                  <IntegrationsPage />
                }
              />

              {/* 404 */}
              <Route
                path="*"
                element={
                  <NotFound />
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}
