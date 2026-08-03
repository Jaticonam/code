import { describe, expect, it } from "vitest";

import {
  buildApplicationWhatsAppUrl,
  buildProductPublicPath,
  buildPublicUrl,
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
      expect(Object.isFrozen(result.config.assets)).toBe(true);
      expect(result.config.assets.brandStoryImageUrl).toContain(
        "NAT_AMA_001.jpg",
      );
      expect(result.config.assets.shippingImageUrl).toContain(
        "118468095_3836541133040959_3203898273981614328_n.jpg",
      );
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
    ["homepage asset", { assets: { ...woolyApplicationConfig.assets, shippingImageUrl: "javascript:alert(1)" } }, "INVALID_ASSET_URL"],
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

  it("protege producción y permite fuentes simuladas solo fuera de producción", () => {
    const productionFixture =
      resolveApplicationConfig(
        {
          catalogSource:
            "contract-fixture",
        },
        "production",
      );

    const productionJungCore =
      resolveApplicationConfig(
        {
          catalogSource:
            "jung-core",
        },
        "production",
      );

    expect(
      productionFixture
        .config.catalog.source,
    ).toBe("google-sheets");

    expect(
      productionJungCore
        .config.catalog.source,
    ).toBe("google-sheets");

    expect(
      productionJungCore
        .issues.map(
          (item) =>
            item.code,
        ),
    ).toContain(
      "UNKNOWN_CATALOG_SOURCE",
    );

    expect(
      resolveApplicationConfig(
        {
          catalogSource:
            "contract-fixture",
        },
        "development",
      ).config.catalog.source,
    ).toBe(
      "contract-fixture",
    );

    expect(
      resolveApplicationConfig(
        {
          catalogSource:
            "jung-core",
        },
        "development",
      ).config.catalog.source,
    ).toBe(
      "jung-core",
    );

    expect(
      resolveApplicationConfig(
        {
          catalogSource:
            "jung-core",
        },
        "test",
      ).config.catalog.source,
    ).toBe(
      "jung-core",
    );

    const productionValidation =
      validateApplicationConfig(
        {
          ...woolyApplicationConfig,

          catalog: {
            source:
              "jung-core",
          },
        },
        "production",
      );

    const developmentValidation =
      validateApplicationConfig(
        {
          ...woolyApplicationConfig,

          catalog: {
            source:
              "jung-core",
          },
        },
        "development",
      );

    expect(
      productionValidation.ok,
    ).toBe(false);

    expect(
      developmentValidation.ok,
    ).toBe(true);
  });

  it("descarta origin inválido y conserva el default seguro", () => {
    const result = resolveApplicationConfig({ publicSiteOrigin: "javascript:alert(1)" });
    expect(result.config.publicSite.origin).toBe(woolyApplicationConfig.publicSite.origin);
    expect(result.issues.map((item) => item.code)).toContain("INVALID_ORIGIN");
  });

  it("construye URLs públicas sin duplicar slash", () => {
    expect(buildPublicUrl("/catalogo")).toBe(
      "https://www.woolyimports.com/catalogo",
    );
  });

  it("construye la ruta productiva escapando parámetros", () => {
    expect(buildProductPublicPath("A B", "flores finas")).toBe(
      "/catalogo/producto.html?id=A+B&cat=flores+finas",
    );
  });

  it("construye WhatsApp con teléfono configurado y copy intacto", () => {
    expect(buildApplicationWhatsAppUrl("Hola Wooly")).toBe(
      "https://wa.me/51936188636?text=Hola+Wooly",
    );
  });
});
