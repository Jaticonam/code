import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createEmptyCatalogComposition,
} from "@/modules/catalog/domain/CatalogComposition";

import {
  CATALOG_PUBLIC_PUBLICATION_VERSION,
  type CatalogPublicPublication,
} from "@/modules/catalog/domain/CatalogPublicPublication";

import {
  createDefaultCatalogPublicationIdentity,
} from "@/modules/catalog/domain/CatalogPublicationIdentity";

type ExpectedPublicPublicationKeys =
  | "publicId"
  | "composition"
  | "publicationIdentity"
  | "publication"
  | "version";

type MissingPublicPublicationKeys =
  Exclude<
    ExpectedPublicPublicationKeys,
    keyof CatalogPublicPublication
  >;

type UnexpectedPublicPublicationKeys =
  Exclude<
    keyof CatalogPublicPublication,
    ExpectedPublicPublicationKeys
  >;

const HAS_ALL_PUBLIC_KEYS:
  [MissingPublicPublicationKeys] extends [never]
    ? true
    : false =
  true;

const HAS_NO_PRIVATE_KEYS:
  [UnexpectedPublicPublicationKeys] extends [never]
    ? true
    : false =
  true;

describe(
  "CatalogPublicPublication",
  () => {
    it(
      "congela la versión pública en 1",
      () => {
        expect(
          CATALOG_PUBLIC_PUBLICATION_VERSION,
        ).toBe(
          1,
        );
      },
    );

    it(
      "expone únicamente el contrato público aprobado",
      () => {
        expect(
          HAS_ALL_PUBLIC_KEYS,
        ).toBe(
          true,
        );

        expect(
          HAS_NO_PRIVATE_KEYS,
        ).toBe(
          true,
        );

        const resource:
          CatalogPublicPublication =
        {
          publicId:
            "PUB-AbC123",

          composition:
            createEmptyCatalogComposition(
              "hybrid",
            ),

          publicationIdentity:
            createDefaultCatalogPublicationIdentity(
              "Catálogo cliente",
            ),

          publication: {
            strategy:
              "fixed",

            productIds: [
              "P-1",
            ],

            publishedAt:
              "2026-08-13T20:00:00.000Z",

            validUntil:
              "2026-08-20T20:00:00.000Z",

            version:
              1,
          },

          version:
            CATALOG_PUBLIC_PUBLICATION_VERSION,
        };

        expect(
          Object.keys(
            resource,
          ).sort(),
        ).toEqual(
          [
            "composition",
            "publicId",
            "publication",
            "publicationIdentity",
            "version",
          ],
        );

        expect(
          resource,
        ).not.toHaveProperty(
          "draftId",
        );

        expect(
          resource,
        ).not.toHaveProperty(
          "name",
        );

        expect(
          resource,
        ).not.toHaveProperty(
          "status",
        );

        expect(
          resource,
        ).not.toHaveProperty(
          "createdAt",
        );

        expect(
          resource,
        ).not.toHaveProperty(
          "updatedAt",
        );
      },
    );

    it(
      "acepta la semántica dynamic existente sin inventar otro snapshot",
      () => {
        const resource:
          CatalogPublicPublication =
        {
          publicId:
            "PUB-DYNAMIC",

          composition:
            createEmptyCatalogComposition(
              "automatic",
            ),

          publicationIdentity:
            createDefaultCatalogPublicationIdentity(),

          publication: {
            strategy:
              "dynamic",

            productIds:
              [],

            publishedAt:
              "2026-08-13T20:00:00.000Z",

            validUntil:
              "2026-08-20T20:00:00.000Z",

            version:
              1,
          },

          version:
            CATALOG_PUBLIC_PUBLICATION_VERSION,
        };

        expect(
          resource.publication.strategy,
        ).toBe(
          "dynamic",
        );

        expect(
          resource.publication.productIds,
        ).toEqual(
          [],
        );
      },
    );
  },
);
