import { googleSheetsCatalogProvider } from "@/modules/catalog/integrations/googleSheets/GoogleSheetsCatalogProvider";

import type { CatalogProvider } from "./CatalogProvider";

/* =========================================================
   PROVIDER ACTIVO
   ========================================================= */

export const catalogProvider: CatalogProvider = googleSheetsCatalogProvider;
