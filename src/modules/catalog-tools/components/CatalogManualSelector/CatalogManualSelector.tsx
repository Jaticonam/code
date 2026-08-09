import {
  useMemo,
  useState,
} from "react";

import {
  CATEGORY_CONFIG,
} from "@/modules/catalog/config/categories";

import {
  isProductPubliclyVisible,
} from "@/modules/catalog/domain/ProductCommercialPolicy";

import CatalogProductExplorer, {
  type CatalogProductExplorerItem,
} from "@/modules/catalog-tools/components/CatalogProductExplorer/CatalogProductExplorer";

import type {
  Product,
} from "@/shared/types/product";

import "./CatalogManualSelector.css";

interface CatalogManualSelectorProps {
  products: readonly Product[];
  includedProductIds: readonly string[];
  isReady: boolean;
  onToggleProduct: (
    productId: string,
  ) => void;
}

type ManualStatusFilter =
  | "all"
  | "selected";

const normalizeValue = (
  value?: string | null,
) =>
  String(
    value ?? "",
  )
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    );

export default function CatalogManualSelector({
  products,
  includedProductIds,
  isReady,
  onToggleProduct,
}: CatalogManualSelectorProps) {
  const [
    search,
    setSearch,
  ] = useState("");

  const [
    categoryId,
    setCategoryId,
  ] = useState("todas");

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<ManualStatusFilter>(
      "all",
    );

  const visibleProducts =
    useMemo(
      () =>
        products.filter(
          isProductPubliclyVisible,
        ),
      [products],
    );

  const selectedIds =
    useMemo(
      () =>
        new Set(
          includedProductIds.map(
            normalizeValue,
          ),
        ),
      [includedProductIds],
    );

  const selectedProducts =
    useMemo(
      () =>
        visibleProducts.filter(
          (product) =>
            selectedIds.has(
              normalizeValue(
                product.id,
              ),
            ),
        ),
      [
        visibleProducts,
        selectedIds,
      ],
    );

  const selectedCategoryCount =
    useMemo(
      () =>
        new Set(
          selectedProducts.map(
            (product) =>
              normalizeValue(
                product.category,
              ),
          ),
        ).size,
      [selectedProducts],
    );

  const availableCategoryIds =
    useMemo(
      () =>
        new Set(
          visibleProducts.map(
            (product) =>
              normalizeValue(
                product.category,
              ),
          ),
        ),
      [visibleProducts],
    );

  const categoryOptions =
    useMemo(
      () =>
        CATEGORY_CONFIG.filter(
          (category) =>
            category.id === "todas" ||
            availableCategoryIds.has(
              normalizeValue(
                category.id,
              ),
            ),
        ),
      [
        availableCategoryIds,
      ],
    );

  const filteredProducts =
    useMemo(
      () => {
        const normalizedSearch =
          normalizeValue(
            search,
          );

        const normalizedCategory =
          normalizeValue(
            categoryId,
          );

        return visibleProducts.filter(
          (product) => {
            const productId =
              normalizeValue(
                product.id,
              );

            const isSelected =
              selectedIds.has(
                productId,
              );

            const matchesCategory =
              normalizedCategory ===
                "todas" ||
              normalizeValue(
                product.category,
              ) ===
                normalizedCategory;

            if (!matchesCategory) {
              return false;
            }

            if (
              statusFilter ===
                "selected" &&
              !isSelected
            ) {
              return false;
            }

            if (!normalizedSearch) {
              return true;
            }

            return normalizeValue(
              [
                product.id,
                product.title,
                product.description,
                product.category,
              ].join(" "),
            ).includes(
              normalizedSearch,
            );
          },
        );
      },
      [
        visibleProducts,
        search,
        categoryId,
        statusFilter,
        selectedIds,
      ],
    );

  const explorerItems =
    useMemo<
      CatalogProductExplorerItem[]
    >(
      () =>
        filteredProducts.map(
          (product) => {
            const isSelected =
              selectedIds.has(
                normalizeValue(
                  product.id,
                ),
              );

            return {
              product,

              stateLabel:
                isSelected
                  ? "En mi catálogo"
                  : "Disponible",

              stateTone:
                isSelected
                  ? "included"
                  : "available",

              actionLabel:
                isSelected
                  ? "Quitar"
                  : "+ Agregar",

              actionTone:
                isSelected
                  ? "secondary"
                  : "primary",

              onAction: () =>
                onToggleProduct(
                  product.id,
                ),
            };
          },
        ),
      [
        filteredProducts,
        selectedIds,
        onToggleProduct,
      ],
    );

  return (
    <article className="catalog-manual-selector">
      <div className="catalog-manual-selector__workspaceToolbar">
  <div className="catalog-manual-selector__controls">
    <label aria-label="Buscar producto">
      <input
        type="search"
        value={
          search
        }
        placeholder="Buscar ID, nombre o descripción..."
        disabled={
          !isReady
        }
        onChange={(event) =>
          setSearch(
            event.target.value,
          )
        }
      />
    </label>

    <label aria-label="Categoría">
      <select
        value={
          categoryId
        }
        disabled={
          !isReady
        }
        onChange={(event) =>
          setCategoryId(
            event.target.value,
          )
        }
      >
        {categoryOptions.map(
          (category) => (
            <option
              key={
                category.id
              }
              value={
                category.id
              }
            >
              {category.id ===
              "todas"
                ? "Todas las categorías"
                : category.name}
            </option>
          ),
        )}
      </select>
    </label>
  </div>

  <div className="catalog-manual-selector__metrics">
    <div className="is-selected">
      <strong>
        {selectedProducts.length}
      </strong>

      <span>
        en catálogo
      </span>
    </div>

    <div>
      <strong>
        {selectedCategoryCount}
      </strong>

      <span>
        categorías
      </span>
    </div>
  </div>
</div>
<div className="catalog-manual-selector__statusFilters">
        <div>
          <button
            type="button"
            className={
              statusFilter ===
              "all"
                ? "is-active"
                : ""
            }
            aria-pressed={
              statusFilter ===
              "all"
            }
            onClick={() =>
              setStatusFilter(
                "all",
              )
            }
          >
            Todos
          </button>

          <button
            type="button"
            className={
              statusFilter ===
              "selected"
                ? "is-active"
                : ""
            }
            aria-pressed={
              statusFilter ===
              "selected"
            }
            onClick={() =>
              setStatusFilter(
                "selected",
              )
            }
          >
            En mi catálogo
          </button>
        </div>
      </div>

      <CatalogProductExplorer
        items={
          explorerItems
        }
        isReady={
          isReady
        }
        emptyMessage="No encontramos productos con estos filtros."
      />
    </article>
  );
}