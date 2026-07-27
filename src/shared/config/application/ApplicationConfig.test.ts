import { describe, expect, it } from "vitest";

import {
  resolveApplicationConfig,
  validateApplicationConfig,
  woolyApplicationConfig,
} from ".";

describe("ApplicationConfig", () => {
  it("valida y congela la configuración Wooly", () => {
    const result = validateApplicationConfig(woolyApplicationConfig);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.config.app.id).toBe("wooly-web");
      expect(Object.isFrozen(result.config)).toBe(true);
      expect(Object.isFrozen(result.config.app)).toBe(true);
    }
  });

  it.each([
    ["app id", { app: { ...woolyApplicationConfig.app, id: "" } }, "EMPTY_IDENTIFIER"],
    ["origin", { publicSite: { ...woolyApplicationConfig.publicSite, origin: "ftp://example.com" } }, "INVALID_ORIGIN"],
    ["domain", { publicSite: { ...woolyApplicationConfig.publicSite, domain: "https://example.com" } }, "INVALID_DOMAIN"],
    ["currency", { locale: { ...woolyApplicationConfig.locale, currency: "SOLES" } }, "INVALID_CURRENCY"],
    ["locale", { locale: { ...woolyApplicationConfig.locale, locale: "es_pe" } }, "INVALID_LOCALE"],
    ["phone", { contact: { whatsappNumber: "+51 936" } }, "INVALID_PHONE"],
    ["route", { routes: { ...woolyApplicationConfig.routes, catalog: "catalogo" } }, "INVALID_ROUTE"],
    ["asset", { assets: { ...woolyApplicationConfig.assets, logoUrl: "javascript:alert(1)" } }, "INVALID_ASSET_URL"],
    ["validity", { commerce: { pdfValidityDays: 0 } }, "INVALID_NUMBER"],
    ["source", { catalog: { source: "unknown" } }, "UNKNOWN_CATALOG_SOURCE"],
  ])("rechaza %s", (_label, patch, code) => {
    const result = validateApplicationConfig({
      ...woolyApplicationConfig,
      ...patch,
    });
    expect(result.ok).toBe(false);
    if (!("errors" in result))
      throw new Error("La configuración debía ser inválida.");
    expect(result.errors.map((item) => item.code)).toContain(code);
  });

  it("protege producción y permite fixture solo en desarrollo", () => {
    expect(resolveApplicationConfig({ catalogSource: "contract-fixture" }, "production").config.catalog.source)
      .toBe("google-sheets");
    expect(resolveApplicationConfig({ catalogSource: "contract-fixture" }, "development").config.catalog.source)
      .toBe("contract-fixture");
  });

  it("descarta origin inválido y conserva el default seguro", () => {
    const result = resolveApplicationConfig({ publicSiteOrigin: "javascript:alert(1)" });
    expect(result.config.publicSite.origin).toBe(woolyApplicationConfig.publicSite.origin);
    expect(result.issues.map((item) => item.code)).toContain("INVALID_ORIGIN");
  });
});
