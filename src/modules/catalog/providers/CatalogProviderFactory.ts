import type {
  CatalogSourceMode,
} from "@/shared/config/application/CatalogSourceMode";

import type {
  CatalogProvider,
} from "./CatalogProvider";

export interface CatalogProviderDependencies {
  googleSheets:
    CatalogProvider;

  contractFixture:
    CatalogProvider;

  jungCore:
    CatalogProvider;
}

export function resolveCatalogSourceMode(
  value:
    unknown,
): CatalogSourceMode {
  if (
    value ===
      "contract-fixture"
  ) {
    return "contract-fixture";
  }

  if (
    value ===
      "jung-core"
  ) {
    return "jung-core";
  }

  return "google-sheets";
}

export function createCatalogProvider(
  value:
    unknown,

  dependencies:
    CatalogProviderDependencies,
): CatalogProvider {
  const mode =
    resolveCatalogSourceMode(
      value,
    );

  if (
    mode ===
      "contract-fixture"
  ) {
    return dependencies
      .contractFixture;
  }

  if (
    mode ===
      "jung-core"
  ) {
    return dependencies
      .jungCore;
  }

  return dependencies
    .googleSheets;
}