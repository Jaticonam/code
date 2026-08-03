import {
  contractFixtureCatalogProvider,
} from "@/modules/catalog/integrations/contractFixtures/ContractFixtureCatalogProvider";

import {
  googleSheetsCatalogProvider,
} from "@/modules/catalog/integrations/googleSheets/GoogleSheetsCatalogProvider";

import {
  developmentJungCoreCatalogProvider,
} from "@/modules/catalog/integrations/jungCore/DevelopmentJungCoreCatalogProvider";

import {
  getApplicationConfig,
} from "@/shared/config/application";

import type {
  CatalogProvider,
} from "./CatalogProvider";

import {
  createCatalogProvider,
} from "./CatalogProviderFactory";

/* =========================================================
   PROVIDER ACTIVO
   ========================================================= */

const configuredSource =
  getApplicationConfig()
    .catalog.source;

export const catalogProvider:
  CatalogProvider =
    createCatalogProvider(
      configuredSource,

      {
        googleSheets:
          googleSheetsCatalogProvider,

        contractFixture:
          contractFixtureCatalogProvider,

        jungCore:
          developmentJungCoreCatalogProvider,
      },
    );