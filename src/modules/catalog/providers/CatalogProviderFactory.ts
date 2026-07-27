import {
  contractFixtureCatalogProvider,
} from "@/modules/catalog/integrations/contractFixtures/ContractFixtureCatalogProvider";
import {
  googleSheetsCatalogProvider,
} from "@/modules/catalog/integrations/googleSheets/GoogleSheetsCatalogProvider";

import type {
  CatalogProvider,
} from "./CatalogProvider";

export type CatalogSourceMode =
  | "google-sheets"
  | "contract-fixture";

export interface CatalogProviderDependencies {
  googleSheets:
    CatalogProvider;
  contractFixture:
    CatalogProvider;
}

const DEFAULT_DEPENDENCIES:
  CatalogProviderDependencies = {
    googleSheets:
      googleSheetsCatalogProvider,
    contractFixture:
      contractFixtureCatalogProvider,
  };

export function resolveCatalogSourceMode(
  value: unknown,
): CatalogSourceMode {
  return value ===
    "contract-fixture"
    ? "contract-fixture"
    : "google-sheets";
}

export function createCatalogProvider(
  value: unknown,
  dependencies:
    CatalogProviderDependencies =
      DEFAULT_DEPENDENCIES,
): CatalogProvider {
  const mode =
    resolveCatalogSourceMode(value);

  return mode ===
    "contract-fixture"
    ? dependencies.contractFixture
    : dependencies.googleSheets;
}
