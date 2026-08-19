import {
  HttpCatalogPublicationProvider,
} from "@/modules/catalog/integrations/publication/HttpCatalogPublicationProvider";

import {
  getApplicationConfig,
  type ApplicationRuntimeMode,
} from "@/shared/config/application";

import {
  createCatalogPublicationRuntimeComposition,
} from "./CatalogPublicationRuntimeComposition";

const runtimeMode:
  ApplicationRuntimeMode =
    import.meta.env.PROD
      ? "production"
      : "development";

export const catalogPublicationRuntimeComposition =
  createCatalogPublicationRuntimeComposition(
    getApplicationConfig(),
    runtimeMode,
    {
      createHttpCatalogPublicationProvider:
        (
          options,
        ) =>
          new HttpCatalogPublicationProvider(
            options,
          ),
    },
  );

export const catalogPublicationProvider =
  catalogPublicationRuntimeComposition
    .provider;
