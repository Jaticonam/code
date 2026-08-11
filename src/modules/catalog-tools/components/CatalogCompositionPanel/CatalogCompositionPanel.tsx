import {
  useMemo,
  useState,
} from "react";

import {
  createEmptyCatalogComposition,
  type CatalogComposition,
  type CatalogCompositionMode,
} from "@/modules/catalog/domain/CatalogComposition";

import {
  resolveCatalogComposition,
} from "@/modules/catalog/domain/CatalogCompositionResolver";

import {
  filterActiveCampaigns,
} from "@/modules/catalog/domain/CampaignRules";

import {
  CATEGORY_CONFIG,
} from "@/modules/catalog/config/categories";

import type {
  Campaign,
  Product,
} from "@/shared/types/product";

import CatalogHybridAdjuster, { type CatalogHybridAction } from "@/modules/catalog-tools/components/CatalogHybridAdjuster/CatalogHybridAdjuster";

import CatalogManualSelector from "@/modules/catalog-tools/components/CatalogManualSelector/CatalogManualSelector";

import CatalogCompositionPreview from "@/modules/catalog-tools/components/CatalogCompositionPreview/CatalogCompositionPreview";

import {
  createDefaultCatalogPublicationIdentity,
  type CatalogPublicationIdentity,
} from "@/modules/catalog/domain/CatalogPublicationIdentity";

import CatalogDraftManager from "@/modules/catalog-tools/components/CatalogDraftManager/CatalogDraftManager";
import CatalogPosSummary from "@/modules/catalog-tools/components/CatalogPosSummary/CatalogPosSummary";

import AdminModal from "@/modules/admin/components/AdminModal/AdminModal";

import "./CatalogCompositionPanel.css";

interface CatalogCompositionPanelProps {
  products: readonly Product[];
  campaigns: readonly Campaign[];
  isReady: boolean;
  onOpenCatalogSync?: () => void;
}

interface ModeOption {
  id: CatalogCompositionMode;
  label: string;
  description: string;
  status: string;
}

const MODE_OPTIONS: readonly ModeOption[] = [
  {
    id: "automatic",
    label: "Catálogo",
    description:
      "Selecciona categorías y campañas para construir la base de tu catálogo.",
    status: "Disponible",
  },
  {
    id: "hybrid",
    label: "Personalizado",
    description:
      "Parte de tu catálogo y agrega o retira productos según lo que necesita tu cliente.",
    status: "Recomendado",
  },
  {
    id: "manual",
    label: "Catálogo a medida",
    description:
      "Selecciona producto por producto para crear una propuesta específica.",
    status: "Disponible",
  },
];
const MODE_TABS: readonly {
  id: CatalogCompositionMode;
  label: string;
}[] = [
  {
    id: "automatic",
    label: "Catálogo",
  },
  {
    id: "hybrid",
    label: "Personalizado",
  },
];
const SELECTABLE_CATEGORIES =
  CATEGORY_CONFIG.filter(
    (category) =>
      category.id !== "todas",
  );

const toggleValue = (
  values: readonly string[],
  value: string,
) =>
  values.includes(value)
    ? values.filter(
        (item) =>
          item !== value,
      )
    : [
        ...values,
        value,
      ];

export default function CatalogCompositionPanel({
  products,
  campaigns,
  isReady,
  onOpenCatalogSync,
}: CatalogCompositionPanelProps) {
  const [
    isCatalogDetailsOpen,
    setIsCatalogDetailsOpen,
  ] = useState(
    false,
  );

  const [
    publicationIdentity,
    setPublicationIdentity,
  ] = useState<CatalogPublicationIdentity>(
    () =>
      createDefaultCatalogPublicationIdentity(),
  );

const [
    composition,
    setComposition,
  ] = useState<CatalogComposition>(
    () =>
      createEmptyCatalogComposition(
        "automatic",
      ),
  );

  const activeCampaigns =
    useMemo(
      () =>
        filterActiveCampaigns(
          [...campaigns],
        ),
      [campaigns],
    );

  const resolution =
    useMemo(
      () =>
        resolveCatalogComposition({
          products,
          composition,
        }),
      [
        products,
        composition,
      ],
    );

  const categoryOptions =
    useMemo(
      () =>
        SELECTABLE_CATEGORIES.map(
          (category) => {
            const optionComposition:
              CatalogComposition = {
                ...composition,

                mode:
                  "automatic",

                filters: {
                  ...composition.filters,

                  categoryIds: [
                    category.id,
                  ],
                },
              };

            const optionResolution =
              resolveCatalogComposition({
                products,

                composition:
                  optionComposition,
              });

            return {
              id:
                category.id,

              label:
                category.name,

              icon:
                category.icon,

              count:
                optionResolution
                  .productIds
                  .length,
            };
          },
        ),
      [
        products,
        composition,
      ],
    );

  const campaignOptions =
    useMemo(
      () =>
        activeCampaigns
          .map(
            (campaign) => {
              const optionComposition:
                CatalogComposition = {
                  ...composition,

                  mode:
                    "automatic",

                  filters: {
                    ...composition.filters,

                    campaignIds: [
                      campaign.id,
                    ],
                  },
                };

              const optionResolution =
                resolveCatalogComposition({
                  products,

                  composition:
                    optionComposition,
                });

              return {
                id:
                  campaign.id,

                label:
                  campaign.name,

                icon:
                  campaign.icon,

                count:
                  optionResolution
                    .productIds
                    .length,
              };
            },
          )
          .filter(
            (campaign) =>
              campaign.count > 0,
          ),
      [
        products,
        composition,
        activeCampaigns,
      ],
    );

  const categoryById =
    useMemo(
      () =>
        new Map(
          CATEGORY_CONFIG.map(
            (category) => [
              category.id,
              category,
            ],
          ),
        ),
      [],
    );

  const campaignById =
    useMemo(
      () =>
        new Map(
          activeCampaigns.map(
            (campaign) => [
              campaign.id,
              campaign,
            ],
          ),
        ),
      [activeCampaigns],
    );

  const selectedCategoryLabels =
    composition.filters
      .categoryIds
      .map(
        (categoryId) =>
          categoryById.get(
            categoryId as typeof CATEGORY_CONFIG[number]["id"],
          )?.name ??
          categoryId,
      );

  const selectedCampaignLabels =
    composition.filters
      .campaignIds
      .map(
        (campaignId) =>
          campaignById.get(
            campaignId,
          )?.name ??
          campaignId,
      );

  const filtersEnabled =
    composition.mode !==
    "manual";

  const selectedMode =
    MODE_OPTIONS.find(
      (mode) =>
        mode.id ===
        composition.mode,
    ) ??
    MODE_OPTIONS[0];

  const categorySummary =
    selectedCategoryLabels.length > 0
      ? selectedCategoryLabels.join(
          ", ",
        )
      : "Todas las categorías";

  const campaignSummary =
    selectedCampaignLabels.length > 0
      ? selectedCampaignLabels.join(
          ", ",
        )
      : "Sin campaña específica";

  const hasRules =
    composition.filters
      .categoryIds.length > 0 ||
    composition.filters
      .campaignIds.length > 0;

    const automaticProductIdSet =
    useMemo(
      () =>
        new Set(
          resolution
            .automaticProductIds
            .map(
              (productId) =>
                String(
                  productId,
                )
                  .trim()
                  .toLowerCase(),
            ),
        ),
      [
        resolution
          .automaticProductIds,
      ],
    );

  const manuallyIncludedProductCount =
    useMemo(
      () =>
        composition
          .overrides
          .includedProductIds
          .filter(
            (productId) =>
              !automaticProductIdSet.has(
                String(
                  productId,
                )
                  .trim()
                  .toLowerCase(),
              ),
          ).length,
      [
        automaticProductIdSet,
        composition
          .overrides
          .includedProductIds,
      ],
    );

  const manuallyExcludedProductCount =
    useMemo(
      () =>
        composition
          .overrides
          .excludedProductIds
          .filter(
            (productId) =>
              automaticProductIdSet.has(
                String(
                  productId,
                )
                  .trim()
                  .toLowerCase(),
              ),
          ).length,
      [
        automaticProductIdSet,
        composition
          .overrides
          .excludedProductIds,
      ],
    );
const changeMode =
    (
      mode: CatalogCompositionMode,
    ) => {
      setComposition(
        (current) => ({
          ...current,
          mode,
        }),
      );
    };

  const toggleCategory =
    (
      categoryId: string,
    ) => {
      if (!filtersEnabled) {
        return;
      }

      setComposition(
        (current) => ({
          ...current,

          filters: {
            ...current.filters,

            categoryIds:
              toggleValue(
                current.filters
                  .categoryIds,
                categoryId,
              ),
          },
        }),
      );
    };

  const toggleCampaign =
    (
      campaignId: string,
    ) => {
      if (!filtersEnabled) {
        return;
      }

      setComposition(
        (current) => ({
          ...current,

          filters: {
            ...current.filters,

            campaignIds:
              toggleValue(
                current.filters
                  .campaignIds,
                campaignId,
              ),
          },
        }),
      );
    };

  const applyHybridProductAction =
    (
      productId: string,
      action: CatalogHybridAction,
    ) => {
      setComposition(
        (current) => {
          let includedProductIds =
            [
              ...current.overrides
                .includedProductIds,
            ];

          let excludedProductIds =
            [
              ...current.overrides
                .excludedProductIds,
            ];

          if (action === "include") {
            if (
              !includedProductIds.includes(
                productId,
              )
            ) {
              includedProductIds.push(
                productId,
              );
            }

            excludedProductIds =
              excludedProductIds.filter(
                (currentId) =>
                  currentId !==
                  productId,
              );
          }

          if (
            action ===
            "remove-included"
          ) {
            includedProductIds =
              includedProductIds.filter(
                (currentId) =>
                  currentId !==
                  productId,
              );
          }

          if (action === "exclude") {
            if (
              !excludedProductIds.includes(
                productId,
              )
            ) {
              excludedProductIds.push(
                productId,
              );
            }

            includedProductIds =
              includedProductIds.filter(
                (currentId) =>
                  currentId !==
                  productId,
              );
          }

          if (action === "restore") {
            excludedProductIds =
              excludedProductIds.filter(
                (currentId) =>
                  currentId !==
                  productId,
              );
          }

          return {
            ...current,

            overrides: {
              ...current.overrides,
              includedProductIds,
              excludedProductIds,
            },
          };
        },
      );
    };
  const toggleManualProduct =
    (
      productId: string,
    ) => {
      setComposition(
        (current) => {
          const isIncluded =
            current.overrides
              .includedProductIds
              .includes(
                productId,
              );

          return {
            ...current,

            overrides: {
              ...current.overrides,

              includedProductIds:
                isIncluded
                  ? current.overrides
                      .includedProductIds
                      .filter(
                        (currentId) =>
                          currentId !==
                          productId,
                      )
                  : [
                      ...current.overrides
                        .includedProductIds,
                      productId,
                    ],

              excludedProductIds:
                current.overrides
                  .excludedProductIds
                  .filter(
                    (currentId) =>
                      currentId !==
                      productId,
                  ),
            },
          };
        },
      );
    };
  const resetComposition =
    () => {
      setComposition(
        (current) =>
          createEmptyCatalogComposition(
            current.mode,
          ),
      );
    };

  return (
    <section className="catalog-composition-panel">
      {/* ADMIN 1.0 - A5-E CATALOGO PERSONALIZADO */}
      <header className="catalog-composition-panel__commandBar">
  <div className="catalog-composition-panel__commandModeGroup">
    

    <div
      className="catalog-composition-panel__commandModes"
      role="group"
      aria-label="Flujo de catálogo"
    >
      {MODE_TABS.map(
        (mode) => {
          const isActive =
            composition.mode ===
            mode.id;

          return (
            <button
              type="button"
              key={
                mode.id
              }
              className={
                isActive
                  ? "is-active"
                  : ""
              }
              aria-pressed={
                isActive
              }
              onClick={() =>
                changeMode(
                  mode.id,
                )
              }
            >
              {mode.label}
            </button>
          );
        },
      )}
    </div>
  </div>

  <div className="catalog-composition-panel__commandActions">
    

        
{onOpenCatalogSync ? (
      <button
        type="button"
        className="is-utility"
        onClick={
          onOpenCatalogSync
        }
      >
        Google Sheets
      </button>
    ) : null}

    <button
      type="button"
      className="is-danger"
      onClick={
        resetComposition
      }
    >
      Limpiar
    </button>
  </div>
</header>

      <AdminModal
  open={
    isCatalogDetailsOpen
  }
  size="large"
  title="Publicar catálogo"
  description="Realiza los ajustes finales, revisa la presentación y publica el catálogo."
  onClose={() =>
    setIsCatalogDetailsOpen(
      false,
    )
  }
>
<div className="catalog-composition-panel__publishCheckout">
  <div className="catalog-composition-panel__publishMain">
<CatalogDraftManager
        composition={
          composition
        }
        publicationIdentity={
          publicationIdentity
        }
        onPublicationIdentityChange={
          setPublicationIdentity
        }
        onLoadComposition={
          (nextComposition) =>
            setComposition(
              nextComposition,
            )
        }
        onNewComposition={
          () =>
            setComposition(
              createEmptyCatalogComposition(
                "automatic",
              ),
            )
        }
      />

  </div>

  <aside
    className="catalog-composition-panel__publishSummary"
    aria-label="Resumen rápido del catálogo"
  >
    <div className="catalog-composition-panel__publishSummarySticky">
      <div className="catalog-composition-panel__publishSummaryHead">
        <div>
          <span>
            Tu catálogo
          </span>

          <h3>
            {selectedMode.label}
          </h3>
        </div>

        <div className="catalog-composition-panel__publishSummaryCount">
          <strong>
            {isReady
              ? resolution.productIds.length
              : "—"}
          </strong>

          <small>
            productos
          </small>
        </div>
      </div>

      {composition.mode ===
      "hybrid" ? (
        <div className="catalog-composition-panel__publishSummaryCart">
          <div>
            <span>
              Base
            </span>

            <strong>
              {
                resolution
                  .automaticProductIds
                  .length
              }
            </strong>
          </div>

          <div className="is-added">
            <span>
              Agregados
            </span>

            <strong>
              {
                manuallyIncludedProductCount
              }
            </strong>
          </div>

          <div className="is-removed">
            <span>
              Retirados
            </span>

            <strong>
              {
                manuallyExcludedProductCount
              }
            </strong>
          </div>

          <div className="is-total">
            <span>
              Resultado final
            </span>

            <strong>
              {
                resolution
                  .productIds
                  .length
              }
            </strong>
          </div>
        </div>
      ) : (
        <div className="catalog-composition-panel__publishSummaryCart">
          <div>
            <span>
              Tipo
            </span>

            <strong>
              {composition.mode ===
              "manual"
                ? "Producto por producto"
                : hasRules
                  ? "Categorías y campañas"
                  : "Catálogo completo"}
            </strong>
          </div>

          <div className="is-total">
            <span>
              Resultado final
            </span>

            <strong>
              {isReady
                ? resolution.productIds.length
                : "—"}
            </strong>
          </div>
        </div>
      )}

      <div className="catalog-composition-panel__publishSummaryDetails">
        <div>
          <span>
            Categorías
          </span>

          <strong>
            {composition.mode ===
            "manual"
              ? "Según los productos elegidos"
              : categorySummary}
          </strong>
        </div>

        <div>
          <span>
            Campañas
          </span>

          <strong>
            {composition.mode ===
            "manual"
              ? "No aplica"
              : campaignSummary}
          </strong>
        </div>
      </div>

      {composition.mode !==
        "manual" &&
      selectedCategoryLabels.length >
        0 ? (
        <div className="catalog-composition-panel__publishSummaryChips">
          {selectedCategoryLabels.map(
            (label) => (
              <span key={label}>
                {label}
              </span>
            ),
          )}
        </div>
      ) : null}

      {composition.mode !==
        "manual" &&
      selectedCampaignLabels.length >
        0 ? (
        <div className="catalog-composition-panel__publishSummaryChips catalog-composition-panel__publishSummaryChips--campaigns">
          {selectedCampaignLabels.map(
            (label) => (
              <span key={label}>
                {label}
              </span>
            ),
          )}
        </div>
      ) : null}

      <div className="catalog-composition-panel__publishSummaryStatus">
        <span
          className={
            isReady &&
            resolution.productIds.length >
              0
              ? "is-ready"
              : ""
          }
        >
          {isReady &&
          resolution.productIds.length >
            0
            ? "✓ Selección lista"
            : "Esperando selección"}
        </span>

        <p>
          Este resumen se actualiza con la selección actual. Revisa la vista completa de abajo antes de publicar.
        </p>
      </div>
    </div>
  </aside>
</div>
</AdminModal>
      {!isReady ? (
        <div className="catalog-composition-panel__notice">
          Esperando que termine de cargar el catálogo
          completo y el registro de campañas.
        </div>
      ) : null}
            <div className="catalog-composition-panel__posWorkspace">
        <div className="catalog-composition-panel__posMain">
{composition.mode ===
      "hybrid" ? (
        <CatalogHybridAdjuster
          products={
            products
          }
          automaticProductIds={
            resolution
              .automaticProductIds
          }
          includedProductIds={
            composition.overrides
              .includedProductIds
          }
          excludedProductIds={
            composition.overrides
              .excludedProductIds
          }
          isReady={
            isReady
          }
          onProductAction={
            applyHybridProductAction
          }
        />
      ) : null}
      {composition.mode ===
      "manual" ? (
        <CatalogManualSelector
          products={
            products
          }
          includedProductIds={
            composition.overrides
              .includedProductIds
          }
          isReady={
            isReady
          }
          onToggleProduct={
            toggleManualProduct
          }
        />
      ) : null}

      {composition.mode === "automatic" ? (
<div
        className={`catalog-composition-panel__grid ${
          filtersEnabled
            ? ""
            : "is-disabled"
        }`}
      >
        <article className="catalog-composition-panel__section">
          <div className="catalog-composition-panel__sectionHead">
            <span>
              02
            </span>

            <div>
              <h3>
                Categorías
              </h3>

              <p>
                Selecciona una o varias familias.
              </p>
            </div>
          </div>

          <div className="catalog-composition-panel__options">
            {categoryOptions.map(
              (category) => {
                const isActive =
                  composition.filters
                    .categoryIds
                    .includes(
                      category.id,
                    );

                const isDisabled =
                  !isReady ||
                  !filtersEnabled ||
                  category.count === 0;

                return (
                  <button
                    type="button"
                    key={
                      category.id
                    }
                    disabled={
                      isDisabled
                    }
                    aria-pressed={
                      isActive
                    }
                    className={
                      isActive
                        ? "is-active"
                        : ""
                    }
                    onClick={() =>
                      toggleCategory(
                        category.id,
                      )
                    }
                  >
                    <span>
                      {isActive
                        ? "✓"
                        : category.icon}
                    </span>

                    <strong>
                      {category.label}
                    </strong>

                    <small>
                      {category.count} productos
                    </small>
                  </button>
                );
              },
            )}
          </div>
        </article>

        <article className="catalog-composition-panel__section">
          <div className="catalog-composition-panel__sectionHead">
            <span>
              03
            </span>

            <div>
              <h3>
                Campañas
              </h3>

              <p>
                Puedes combinar varias campañas activas.
              </p>
            </div>
          </div>

          {campaignOptions.length > 0 ? (
            <div className="catalog-composition-panel__options">
              {campaignOptions.map(
                (campaign) => {
                  const isActive =
                    composition.filters
                      .campaignIds
                      .includes(
                        campaign.id,
                      );

                  return (
                    <button
                      type="button"
                      key={
                        campaign.id
                      }
                      disabled={
                        !isReady ||
                        !filtersEnabled
                      }
                      aria-pressed={
                        isActive
                      }
                      className={
                        isActive
                          ? "is-active"
                          : ""
                      }
                      onClick={() =>
                        toggleCampaign(
                          campaign.id,
                        )
                      }
                    >
                      <span>
                        {isActive
                          ? "✓"
                          : campaign.icon ||
                            "●"}
                      </span>

                      <strong>
                        {campaign.label}
                      </strong>

                      <small>
                        {campaign.count} productos
                      </small>
                    </button>
                  );
                },
              )}
            </div>
          ) : (
            <div className="catalog-composition-panel__empty">
              No hay campañas activas con productos.
            </div>
          )}
        </article>
      </div>
) : null}

              </div>

        <CatalogPosSummary
          mode={
            composition.mode
          }
          modeLabel={
            selectedMode.label
          }
          products={
            products
          }
          isReady={
            isReady
          }
          automaticProductIds={
            resolution
              .automaticProductIds
          }
          includedProductIds={
            composition
              .overrides
              .includedProductIds
          }
          excludedProductIds={
            composition
              .overrides
              .excludedProductIds
          }
          resolvedProductIds={
            resolution
              .productIds
          }
          selectedCategoryLabels={
            selectedCategoryLabels
          }
          selectedCampaignLabels={
            selectedCampaignLabels
          }
          onPublish={() =>
            setIsCatalogDetailsOpen(
              true,
            )
          }
          onRemoveManual={
            toggleManualProduct
          }
          onRemoveIncluded={
            (productId) =>
              applyHybridProductAction(
                productId,
                "remove-included",
              )
          }
          onRestoreExcluded={
            (productId) =>
              applyHybridProductAction(
                productId,
                "restore",
              )
          }
        />
      </div>
<CatalogCompositionPreview
        products={
          resolution.products
        }
        isReady={
          isReady
        }
      />
    </section>
  );
}