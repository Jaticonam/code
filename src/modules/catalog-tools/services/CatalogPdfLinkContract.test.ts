import {
  describe,
  expect,
  it,
} from "vitest";

import {
  buildCatalogPdfPath,
} from "./BuildCatalogPdfUrl";
import {
  parseCatalogPdfLink,
} from "./CatalogPdfLinkContract";

describe("CatalogPdfLinkContract v1", () => {
  it.each([
    ["general", {}, "/catalogo/pdf?v=1"],
    ["categoría", { categoryId: "Flores" }, "/catalogo/pdf?v=1&cat=flores"],
    ["campaña", { campaignId: "Navidad" }, "/catalogo/pdf?v=1&cpg=navidad"],
    [
      "combinación",
      { categoryId: "Flores", campaignId: "Navidad" },
      "/catalogo/pdf?v=1&cat=flores&cpg=navidad",
    ],
  ])("genera URL canónica %s", (_case, input, expected) => {
    expect(buildCatalogPdfPath(input)).toBe(expected);
  });

  it.each([
    ["categoria", "categoria=flores", "categoryId"],
    ["category", "category=flores", "categoryId"],
    ["campania", "campania=navidad", "campaignId"],
    ["campaign", "campaign=navidad", "campaignId"],
  ])("lee alias %s con warning", (alias, query, field) => {
    const result = parseCatalogPdfLink(query);
    expect(result).toMatchObject({
      ok: true,
      warnings: [{ code: "LEGACY_PARAMETER_USED", parameter: alias }],
    });
    if (result.ok) {
      expect(result.contract[field as "categoryId" | "campaignId"]).toBe(
        field === "categoryId" ? "flores" : "navidad",
      );
    }
  });

  it("acepta versión ausente legacy y v1", () => {
    expect(parseCatalogPdfLink("cat=flores")).toMatchObject({ ok: true });
    expect(parseCatalogPdfLink("v=1&cat=flores")).toMatchObject({
      ok: true,
      contract: { version: "1", categoryId: "flores" },
    });
  });

  it.each(["v=2", "v=abc"])("rechaza versión desconocida %s", (query) => {
    expect(parseCatalogPdfLink(query)).toMatchObject({
      ok: false,
      errors: [{ code: "UNSUPPORTED_VERSION" }],
    });
  });

  it.each([
    ["categoría", "v=1&cat=valor%20inválido", "INVALID_CATEGORY_ID"],
    ["campaña", "v=1&cpg=%2Fhack", "INVALID_CAMPAIGN_ID"],
  ])("rechaza ID de %s inválido", (_case, query, code) => {
    expect(parseCatalogPdfLink(query)).toMatchObject({
      ok: false,
      errors: expect.arrayContaining([expect.objectContaining({ code })]),
    });
  });

  it("normaliza valores vacíos como catálogo general", () => {
    expect(parseCatalogPdfLink("v=1&cat=&cpg=")).toMatchObject({
      ok: true,
      contract: { version: "1" },
    });
  });

  it("rechaza parámetros canónicos y legacy en conflicto", () => {
    expect(parseCatalogPdfLink("v=1&cat=flores&categoria=cajas")).toMatchObject({
      ok: false,
      errors: [{ code: "CONFLICTING_PARAMETER" }],
    });
  });

  it("el builder nunca genera aliases legacy", () => {
    const path = buildCatalogPdfPath({
      categoryId: "flores",
      campaignId: "navidad",
    });
    expect(path).toContain("v=1");
    expect(path).not.toMatch(/categoria|category|campania|campaign/);
  });

  it("diagnostica e ignora parámetros desconocidos", () => {
    expect(parseCatalogPdfLink("v=1&cat=flores&extra=valor")).toMatchObject({
      ok: true,
      warnings: [{ code: "UNKNOWN_PARAMETER", parameter: "extra" }],
    });
  });
});
