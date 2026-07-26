import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type {
  CartItem,
} from "@/modules/cart/types";

import {
  buildCheckoutMessage,
  checkout,
} from "./checkout";

function createItem(
  overrides:
    Partial<CartItem> = {},
): CartItem {
  return {
    id: "TEST-001",
    title: "Producto de prueba",
    description:
      "Producto para checkout.",
    category: "pruebas",
    price_1: 10,
    price_3: 9,
    price_12: 7,
    price_50: 6.5,
    price_100: 6,
    price_offer: null,
    stock: 200,
    img:
      "https://example.com/product.jpg",
    status: "publicado",
    campaigns: [],
    priority: 0,
    qty: 1,
    note: "",
    ...overrides,
  };
}

function expectLine(
  item: CartItem,
  expected: {
    quantity: number;
    unitPrice: number;
    subtotal: number;
  },
) {
  const message =
    buildCheckoutMessage(
      [
        item,
      ],
      0,
    );

  expect(
    message,
  ).toContain(
    `Cantidad: ${expected.quantity} u`,
  );
  expect(
    message,
  ).toContain(
    `Precio: S/${expected.unitPrice.toFixed(2)}`,
  );
  expect(
    message,
  ).toContain(
    `Subtotal: S/${expected.subtotal.toFixed(2)}`,
  );
  expect(
    message,
  ).toContain(
    `Total estimado: S/${expected.subtotal.toFixed(2)}`,
  );
  expect(
    message,
  ).not.toMatch(
    /NaN|Infinity|S\/-\d/,
  );
}

afterEach(
  () => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  },
);

describe(
  "buildCheckoutMessage",
  () => {
    it.each([
      {
        name: "precio base",
        overrides: {},
        quantity: 1,
        unitPrice: 10,
        subtotal: 10,
      },
      {
        name: "oferta válida",
        overrides: {
          price_offer: 8,
        },
        quantity: 1,
        unitPrice: 8,
        subtotal: 8,
      },
      {
        name:
          "oferta superior al precio base",
        overrides: {
          price_offer: 12,
        },
        quantity: 1,
        unitPrice: 10,
        subtotal: 10,
      },
      {
        name:
          "oferta válida en cantidad 2",
        overrides: {
          qty: 2,
          price_offer: 8,
        },
        quantity: 2,
        unitPrice: 8,
        subtotal: 16,
      },
      {
        name: "tier exacto 3",
        overrides: {
          qty: 3,
        },
        quantity: 3,
        unitPrice: 9,
        subtotal: 27,
      },
      {
        name: "tier exacto 12",
        overrides: {
          qty: 12,
        },
        quantity: 12,
        unitPrice: 7,
        subtotal: 84,
      },
      {
        name: "tier parcial",
        overrides: {
          qty: 12,
          price_12: null,
        },
        quantity: 12,
        unitPrice: 9,
        subtotal: 108,
      },
      {
        name: "tier negativo",
        overrides: {
          qty: 3,
          price_3: -5,
        },
        quantity: 3,
        unitPrice: 10,
        subtotal: 30,
      },
      {
        name: "tier infinito",
        overrides: {
          qty: 3,
          price_3:
            Number.POSITIVE_INFINITY,
        },
        quantity: 3,
        unitPrice: 10,
        subtotal: 30,
      },
      {
        name: "tier NaN",
        overrides: {
          qty: 3,
          price_3:
            Number.NaN,
        },
        quantity: 3,
        unitPrice: 10,
        subtotal: 30,
      },
      {
        name: "tier cero",
        overrides: {
          qty: 3,
          price_3: 0,
        },
        quantity: 3,
        unitPrice: 10,
        subtotal: 30,
      },
      {
        name:
          "producto sin precio válido",
        overrides: {
          price_1: 0,
          price_3: null,
          price_12: null,
          price_50: null,
          price_100: null,
        },
        quantity: 1,
        unitPrice: 0,
        subtotal: 0,
      },
      {
        name:
          "cantidad cero persistida",
        overrides: {
          qty: 0,
        },
        quantity: 1,
        unitPrice: 10,
        subtotal: 10,
      },
      {
        name:
          "cantidad NaN persistida",
        overrides: {
          qty: Number.NaN,
        },
        quantity: 1,
        unitPrice: 10,
        subtotal: 10,
      },
      {
        name:
          "cantidad infinita persistida",
        overrides: {
          qty:
            Number.POSITIVE_INFINITY,
        },
        quantity: 1,
        unitPrice: 10,
        subtotal: 10,
      },
    ])(
      "usa pricing canónico para $name",
      ({
        overrides,
        quantity,
        unitPrice,
        subtotal,
      }) => {
        expectLine(
          createItem(
            overrides,
          ),
          {
            quantity,
            unitPrice,
            subtotal,
          },
        );
      },
    );

    it(
      "calcula internamente el total de múltiples líneas",
      () => {
        const message =
          buildCheckoutMessage(
            [
              createItem({
                id: "OFFER-001",
                price_offer: 8,
              }),
              createItem({
                id: "TIER-003",
                qty: 3,
              }),
            ],
            5,
          );

        expect(
          message,
        ).toContain(
          "Total estimado: S/35.00",
        );
        expect(
          message,
        ).toContain(
          "Ahorro estimado: S/5.00",
        );
      },
    );

    it(
      "preserva notas y estructura comercial",
      () => {
        const message =
          buildCheckoutMessage(
            [
              createItem({
                note:
                  "  envolver   para regalo  ",
              }),
            ],
            0,
          );

        expect(
          message,
        ).toContain(
          "*NUEVO PEDIDO WOOLY - MAYORISTAS*",
        );
        expect(
          message,
        ).toContain(
          "*[ TEST-001 ]* | *Producto de prueba*",
        );
        expect(
          message,
        ).toContain(
          "Detalle: envolver para regalo",
        );
        expect(
          message,
        ).toContain(
          "Confirmar disponibilidad, gracias.",
        );
      },
    );
  },
);

describe(
  "checkout",
  () => {
    it(
      "no abre WhatsApp para un carrito vacío",
      () => {
        const open =
          vi.spyOn(
            window,
            "open",
          )
            .mockImplementation(
              () => null,
            );

        checkout(
          [],
          0,
          vi.fn(),
          vi.fn(),
        );

        expect(
          open,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "abre WhatsApp y limpia el carrito después del envío",
      () => {
        vi.useFakeTimers();

        const open =
          vi.spyOn(
            window,
            "open",
          )
            .mockImplementation(
              () => null,
            );
        const onClearCart =
          vi.fn();
        const onClose =
          vi.fn();

        checkout(
          [
            createItem({
              price_offer: 8,
            }),
          ],
          2,
          onClearCart,
          onClose,
        );

        expect(
          open,
        ).toHaveBeenCalledWith(
          expect.stringContaining(
            "https://wa.me/51936188636?text=",
          ),
          "_blank",
        );

        const url =
          String(
            open.mock.calls[0][0],
          );
        const message =
          decodeURIComponent(
            url.split(
              "?text=",
            )[1],
          );

        expect(
          message,
        ).toContain(
          "Precio: S/8.00",
        );
        expect(
          message,
        ).toContain(
          "Total estimado: S/8.00",
        );

        vi.advanceTimersByTime(
          300,
        );

        expect(
          onClearCart,
        ).toHaveBeenCalledOnce();
        expect(
          onClose,
        ).toHaveBeenCalledOnce();
      },
    );
  },
);
