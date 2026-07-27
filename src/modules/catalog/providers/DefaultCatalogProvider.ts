import type { CatalogProvider } from "./CatalogProvider";
import {
  createCatalogProvider,
} from "./CatalogProviderFactory";
import {
  getApplicationConfig,
} from "@/shared/config/application";

/* =========================================================
   PROVIDER ACTIVO
   ========================================================= */

const configuredSource =
  getApplicationConfig().catalog.source;

export const catalogProvider:
  CatalogProvider =
    createCatalogProvider(
      configuredSource,
    );
