import {
  canProductExportToTransactionalChannel,
} from "@/modules/catalog/domain/ProductCommercialPolicy";

import type {
  FeedProduct,
} from "../../types/feed";

import {
  toCsv,
} from "../../utils/csv";

import {
  mapProductToMeta,
} from "./mapper";

import {
  validateMetaProduct,
} from "./validator";

export const getMetaValidationReport = (
  products:
    FeedProduct[],
) =>
  products.map(
    (
      product,
    ) => ({
      product,

      errors:
        validateMetaProduct(
          product,
        ),
    }),
  );

export const exportMetaCsv = (
  products:
    FeedProduct[],
) => {
  const report =
    getMetaValidationReport(
      products,
    );

  const valid =
    report
      .filter(
        (
          item,
        ) =>
          item.errors.length ===
            0 &&
          canProductExportToTransactionalChannel(
            item.product,
          ),
      )
      .map(
        (
          item,
        ) =>
          item.product,
      );

  return toCsv(
    valid.map(
      mapProductToMeta,
    ),
  );
};
