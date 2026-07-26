import type { CartItem } from "@/modules/cart/types";

import {
  normalizeCartQuantity,
} from "@/modules/cart/domain/CartLinePricing";

import {
  getBaseUnitPrice,
} from "@/shared/domain/volumePricing/VolumePricing";

export const CART_KEY = "wooly_cart";

interface PersistedCartCandidate
  extends Record<string, unknown> {
  id: string;
  title: string;
  description: string;
  category: string;
  price_1: number;
  img: string;
}

function isPersistedCartCandidate(
  value: unknown,
): value is PersistedCartCandidate {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const candidate =
    value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    candidate.id.trim().length > 0 &&
    typeof candidate.title === "string" &&
    candidate.title.trim().length > 0 &&
    typeof candidate.description === "string" &&
    typeof candidate.category === "string" &&
    typeof candidate.price_1 === "number" &&
    typeof candidate.img === "string" &&
    candidate.img.trim().length > 0
  );
}

export function sanitizePersistedCart(
  value: unknown,
): CartItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap(
    (candidate) => {
      if (
        !isPersistedCartCandidate(
          candidate,
        )
      ) {
        return [];
      }

      const item = {
        ...candidate,
        qty:
          normalizeCartQuantity(
            candidate.qty,
          ),
        note:
          typeof candidate.note ===
          "string"
            ? candidate.note
            : "",
      } as CartItem;

      const baseUnitPrice =
        getBaseUnitPrice(
          item,
        );

      return Number.isFinite(
        baseUnitPrice,
      ) &&
        baseUnitPrice > 0
        ? [item]
        : [];
    },
  );
}

export function parsePersistedCart(
  value: string | null,
): CartItem[] {
  if (!value) {
    return [];
  }

  try {
    return sanitizePersistedCart(
      JSON.parse(value),
    );
  } catch {
    return [];
  }
}

export function loadCart(): CartItem[] {
  try {
    return parsePersistedCart(
      localStorage.getItem(
        CART_KEY,
      ),
    );
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  try {
    localStorage.setItem(
      CART_KEY,
      JSON.stringify(
        sanitizePersistedCart(
          cart,
        ),
      ),
    );
  } catch {
    // noop
  }
}
