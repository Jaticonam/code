import type {
  ApplicationConfig,
  ApplicationPublicOverrides,
  ApplicationRuntimeMode,
} from "./ApplicationConfig";
import {
  type ApplicationConfigIssue,
  validateApplicationConfig,
} from "./ApplicationConfigValidation";
import { woolyApplicationConfig } from "./woolyApplicationConfig";

export interface ResolvedApplicationConfig {
  readonly config: ApplicationConfig;
  readonly issues: readonly ApplicationConfigIssue[];
}

export function resolveApplicationConfig(
  overrides: ApplicationPublicOverrides = {},
  mode: ApplicationRuntimeMode = "production",
): ResolvedApplicationConfig {
  const issues: ApplicationConfigIssue[] = [];
  const requestedSource = overrides.catalogSource;
  const source =
    requestedSource === "google-sheets" ||
    ((requestedSource === "contract-fixture" ||
      requestedSource === "jung-core") &&
      mode !== "production")
      ? requestedSource
      : woolyApplicationConfig.catalog.source;
  if (
    requestedSource !== undefined &&
    source !== requestedSource
  ) issues.push({ code: "UNKNOWN_CATALOG_SOURCE", field: "catalog.source" });

  const originCandidate =
    typeof overrides.publicSiteOrigin === "string"
      ? overrides.publicSiteOrigin.replace(/\/+$/, "")
      : woolyApplicationConfig.publicSite.origin;
  const candidate = {
    ...woolyApplicationConfig,
    publicSite: {
      ...woolyApplicationConfig.publicSite,
      origin: originCandidate,
    },
    catalog: { source },
  };
  const validation = validateApplicationConfig(candidate, mode);
  if (validation.ok) return { config: validation.config, issues };
  if (overrides.publicSiteOrigin !== undefined)
    issues.push({ code: "INVALID_ORIGIN", field: "publicSite.origin" });
  const fallback = validateApplicationConfig(woolyApplicationConfig, mode);
  if (!fallback.ok) throw new Error("La configuración Wooly incluida es inválida.");
  return { config: fallback.config, issues };
}

let cachedConfig: ApplicationConfig | undefined;

export function getApplicationConfig(): ApplicationConfig {
  if (!cachedConfig) {
    cachedConfig = resolveApplicationConfig(
      {
        catalogSource: import.meta.env.VITE_CATALOG_SOURCE,
        publicSiteOrigin: import.meta.env.VITE_PUBLIC_SITE_ORIGIN,
      },
      import.meta.env.PROD ? "production" : "development",
    ).config;
  }
  return cachedConfig;
}
