import {
  developmentContractFixtureCatalogProvider,
} from "@/modules/catalog/integrations/contractFixtures/DevelopmentContractFixtureCatalogProvider";

import {
  googleSheetsCatalogProvider,
} from "@/modules/catalog/integrations/googleSheets/GoogleSheetsCatalogProvider";

import {
  developmentJungCoreCatalogProvider,
} from "@/modules/catalog/integrations/jungCore/DevelopmentJungCoreCatalogProvider";

import {
  HealthCollectorRegistry,
} from "@/modules/monitoring/registry/HealthCollectorRegistry";

import {
  getApplicationConfig,
  type ApplicationRuntimeMode,
} from "@/shared/config/application";

import type {
  CatalogProvider,
} from "./CatalogProvider";

import {
  createCatalogRuntimeComposition,
} from "./CatalogRuntimeComposition";

/* =========================================================
   COMPOSICION RUNTIME DEL CATALOGO
   ========================================================= */

const viteEnv =
  (import.meta as ImportMeta & {
    readonly env?: ImportMetaEnv;
  }).env;

const runtimeMode:
  ApplicationRuntimeMode =
    viteEnv?.PROD === false
      ? "development"
      : "production";

export const catalogRuntimeComposition =
  createCatalogRuntimeComposition(
    getApplicationConfig(),
    runtimeMode,
    {},

    {
      googleSheets:
        googleSheetsCatalogProvider,

      contractFixture:
        developmentContractFixtureCatalogProvider,

      developmentJungCore:
        developmentJungCoreCatalogProvider,
    },
  );

export const catalogProvider:
  CatalogProvider =
    catalogRuntimeComposition
      .provider;

export const catalogProviderHealthCollector =
  catalogRuntimeComposition
    .healthCollector;

export function registerCatalogProviderHealthCollector():
  void {
  HealthCollectorRegistry.register(
    catalogProviderHealthCollector,
  );
}
