import type { CatalogProvider } from "./CatalogProvider";
import {
  createCatalogProvider,
} from "./CatalogProviderFactory";

/* =========================================================
   PROVIDER ACTIVO
   ========================================================= */

const configuredSource =
  import.meta.env.DEV
    ? import.meta.env
        .VITE_CATALOG_SOURCE
    : undefined;

export const catalogProvider:
  CatalogProvider =
    createCatalogProvider(
      configuredSource,
    );
