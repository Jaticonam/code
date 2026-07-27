import type {
  CartItem,
} from "@/modules/cart/types";
import type {
  Product,
} from "@/shared/types/product";
import type {
  CatalogProvider,
} from "@/modules/catalog/providers/CatalogProvider";
import {
  normalizeCartQuantity,
} from "./CartLinePricing";
import {
  isCartItemCommerciallyEligible,
} from "./CartCommercialEligibility";

export type CartReconciliationChangeCode =
  | "PRODUCT_NOT_FOUND"
  | "PRODUCT_UNPUBLISHED"
  | "PRODUCT_OUT_OF_STOCK"
  | "PRICE_CHANGED"
  | "QUANTITY_NORMALIZED"
  | "PRODUCT_DATA_REFRESHED";

export interface CartReconciliationChange {
  code:
    CartReconciliationChangeCode;
  productId: string;
}

export type CartReconciliationResult =
  | {
      ok: true;
      items: CartItem[];
      changes:
        readonly CartReconciliationChange[];
    }
  | {
      ok: false;
      reason: "PROVIDER_ERROR";
      originalItems: CartItem[];
    };

function hasPriceChanged(
  current: CartItem,
  product: Product,
): boolean {
  return (
    current.price_1 !==
      product.price_1 ||
    current.price_offer !==
      product.price_offer ||
    current.price_3 !==
      product.price_3 ||
    current.price_12 !==
      product.price_12 ||
    current.price_50 !==
      product.price_50 ||
    current.price_100 !==
      product.price_100
  );
}

function unavailableCode(
  product: Product,
): CartReconciliationChangeCode {
  const status =
    String(
      product.status ?? "",
    )
      .trim()
      .toLowerCase();

  return (
    status === "agotado" ||
    (
      typeof product.stock ===
        "number" &&
      product.stock <= 0
    )
  )
    ? "PRODUCT_OUT_OF_STOCK"
    : "PRODUCT_UNPUBLISHED";
}

export async function reconcileCartWithProvider(
  originalItems:
    readonly CartItem[],
  provider:
    CatalogProvider,
): Promise<
  CartReconciliationResult
> {
  try {
    const campaigns =
      await provider
        .loadCampaigns();
    const categoryProducts =
      await Promise.all(
        provider
          .getCategories()
          .map(
            (category) =>
              provider
                .loadCategoryProducts(
                  category,
                  campaigns,
                ),
          ),
      );
    const productsById =
      new Map(
        categoryProducts
          .flat()
          .map(
            (product) => [
              product.id,
              product,
            ],
          ),
      );
    const items:
      CartItem[] = [];
    const changes:
      CartReconciliationChange[] = [];

    originalItems.forEach(
      (current) => {
        const product =
          productsById.get(
            current.id,
          );

        if (!product) {
          changes.push({
            code:
              "PRODUCT_NOT_FOUND",
            productId:
              current.id,
          });
          return;
        }

        const qty =
          normalizeCartQuantity(
            current.qty,
          );
        const refreshed:
          CartItem = {
          ...product,
          qty,
          note:
            typeof current.note ===
              "string"
              ? current.note
              : "",
        };

        if (
          !isCartItemCommerciallyEligible(
            refreshed,
          )
        ) {
          changes.push({
            code:
              unavailableCode(
                product,
              ),
            productId:
              current.id,
          });
          return;
        }

        if (
          hasPriceChanged(
            current,
            product,
          )
        ) {
          changes.push({
            code:
              "PRICE_CHANGED",
            productId:
              current.id,
          });
        }

        if (
          qty !== current.qty
        ) {
          changes.push({
            code:
              "QUANTITY_NORMALIZED",
            productId:
              current.id,
          });
        }

        if (
          current.title !==
            product.title ||
          current.img !==
            product.img ||
          current.description !==
            product.description
        ) {
          changes.push({
            code:
              "PRODUCT_DATA_REFRESHED",
            productId:
              current.id,
          });
        }

        items.push(refreshed);
      },
    );

    return {
      ok: true,
      items,
      changes,
    };
  } catch {
    return {
      ok: false,
      reason:
        "PROVIDER_ERROR",
      originalItems: [
        ...originalItems,
      ],
    };
  }
}
