import {
  describe,
  expect,
  it,
} from "vitest";

import {
  isObsoleteLegacyBadgeValue,
  normalizeLegacyBadgeValue,
  resolveLegacyBadgeValue,
} from "./LegacyBadgeAliases";

describe(
  "LegacyBadgeAliases",
  () => {
    it.each([
      ["Best Seller", "best seller"],
      ["✨ Más vendido", "mas vendido"],
      ["🔥🚀 Bestseller", "bestseller"],
      ["⚡️ Favorito", "favorito"],
      ["Más Vendido", "mas vendido"],
      ["Top 10", "top 10"],
      ["best-seller", "best-seller"],
      ["", ""],
      ["producto clasico", "producto clasico"],
    ])(
      "normaliza %j como %j",
      (
        input,
        expected,
      ) => {
        expect(
          normalizeLegacyBadgeValue(
            input,
          ),
        ).toBe(
          expected,
        );
      },
    );

    it.each([
      "Todo el Año",
      "✨Todo el Año",
      "todo-el-ano",
    ])(
      "no reconoce %j como alias válido",
      (
        value,
      ) => {
        expect(
          resolveLegacyBadgeValue(
            value,
          ),
        ).toBeNull();
      },
    );

    it.each([
      "Todo el Año",
      "✨Todo el Año",
      "todo-el-ano",
    ])(
      "identifica %j como valor legacy obsoleto",
      (
        value,
      ) => {
        expect(
          isObsoleteLegacyBadgeValue(
            value,
          ),
        ).toBe(
          true,
        );
      },
    );

    it.each([
      "Más vendido",
      "valor desconocido",
    ])(
      "no identifica %j como valor legacy obsoleto",
      (
        value,
      ) => {
        expect(
          isObsoleteLegacyBadgeValue(
            value,
          ),
        ).toBe(
          false,
        );
      },
    );
  },
);
