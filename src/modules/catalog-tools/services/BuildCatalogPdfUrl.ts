import {
  CATALOG_PDF_LINK_VERSION,
  CATALOG_PDF_LINK_VERSION_V2,
} from "./CatalogPdfLinkContract";

import {
  buildCatalogPdfPublicUrl,
  getApplicationConfig,
} from "@/shared/config/application";

export interface BuildCatalogPdfPathV1Params {
  version?:
    "1";

  categoryId?:
    string;

  campaignId?:
    string;

  categoryIds?:
    never;

  campaignIds?:
    never;
}

export interface BuildCatalogPdfPathV2Params {
  version:
    "2";

  categoryIds?:
    readonly string[];

  campaignIds?:
    readonly string[];

  categoryId?:
    never;

  campaignId?:
    never;
}

export type BuildCatalogPdfPathParams =
  | BuildCatalogPdfPathV1Params
  | BuildCatalogPdfPathV2Params;

export type BuildCatalogPdfUrlParams =
  BuildCatalogPdfPathParams & {
    origin?:
      string;
  };

const cleanValue = (
  value?:
    string |
    null,
) =>
  String(
    value ||
    "",
  )
    .trim()
    .toLowerCase();

const normalizeValues = (
  values:
    readonly string[] |
    undefined,
) =>
  Array.from(
    new Set(
      (
        values ??
        []
      )
        .map(
          cleanValue,
        )
        .filter(
          Boolean,
        ),
    ),
  )
    .sort();

const serializeValues = (
  values:
    readonly string[],
) =>
  values
    .map(
      (value) =>
        encodeURIComponent(
          value,
        ),
    )
    .join(",");

export const buildCatalogPdfPath = (
  params:
    BuildCatalogPdfPathParams,
) => {
  const route =
    getApplicationConfig()
      .routes
      .catalogPdf;

  if (
    params.version ===
    CATALOG_PDF_LINK_VERSION_V2
  ) {
    const categoryIds =
      normalizeValues(
        params.categoryIds,
      );

    const campaignIds =
      normalizeValues(
        params.campaignIds,
      );

    const query:
      string[] =
      [
        `v=${CATALOG_PDF_LINK_VERSION_V2}`,
      ];

    if (
      categoryIds.length >
      0
    ) {
      query.push(
        `cats=${serializeValues(
          categoryIds,
        )}`,
      );
    }

    if (
      campaignIds.length >
      0
    ) {
      query.push(
        `cpgs=${serializeValues(
          campaignIds,
        )}`,
      );
    }

    return `${route}?${query.join("&")}`;
  }

  const cleanCategoryId =
    cleanValue(
      params.categoryId,
    );

  const cleanCampaignId =
    cleanValue(
      params.campaignId,
    );

  const searchParams =
    new URLSearchParams();

  searchParams.set(
    "v",
    CATALOG_PDF_LINK_VERSION,
  );

  if (
    cleanCategoryId &&
    cleanCategoryId !==
      "todas"
  ) {
    searchParams.set(
      "cat",
      cleanCategoryId,
    );
  }

  if (
    cleanCampaignId
  ) {
    searchParams.set(
      "cpg",
      cleanCampaignId,
    );
  }

  return `${route}?${searchParams.toString()}`;
};

export const buildCatalogPdfUrl = (
  params:
    BuildCatalogPdfUrlParams,
) => {
  const path =
    buildCatalogPdfPath(
      params,
    );

  if (
    !params.origin
  ) {
    return path;
  }

  const config =
    getApplicationConfig();

  return (
    buildCatalogPdfPublicUrl({
      ...config,

      publicSite: {
        ...config.publicSite,

        origin:
          String(
            params.origin,
          )
            .replace(
              /\/+$/,
              "",
            ),
      },
    }) +
    path.slice(
      config
        .routes
        .catalogPdf
        .length,
    )
  );
};
