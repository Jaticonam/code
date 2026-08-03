import {
  getCampaignColorClass,
} from "@/modules/catalog/domain/CampaignColorClass";

import {
  PRODUCT_SHEETS_CONFIG,
} from "@/modules/catalog/integrations/googleSheets/sheetsConfig";

import {
  JungCoreCatalogProvider,
} from "./JungCoreCatalogProvider";

import {
  simulatedJungCoreSnapshotLoader,
} from "./SimulatedJungCoreSnapshotLoader";

const bootstrapCategories =
  PRODUCT_SHEETS_CONFIG.map(
    (source) =>
      source.category,
  );

export const simulatedJungCoreCatalogProvider =
  new JungCoreCatalogProvider({
    loader:
      simulatedJungCoreSnapshotLoader,

    expectedBrandId:
      "wooly",

    bootstrapCategories,

    resolveColorClass:
      getCampaignColorClass,
  });