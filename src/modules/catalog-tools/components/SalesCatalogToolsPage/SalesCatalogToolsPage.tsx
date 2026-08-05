import {
  useMemo,
  useState,
} from "react";

import {
  resolveCatalogSelection,
} from "@/modules/catalog/domain/CatalogSelection";

import {
  filterActiveCampaigns,
} from "@/modules/catalog/domain/CampaignRules";

import {
  useCatalogCampaigns,
} from "@/modules/catalog/hooks/useCatalogCampaigns";

import {
  useCatalogData,
} from "@/modules/catalog/hooks/useCatalogData";

import CatalogSyncPanel from "@/modules/catalog-tools/components/CatalogSyncPanel/CatalogSyncPanel";

import {
  buildCatalogPdfPath,
  buildCatalogPdfUrl,
} from "@/modules/catalog-tools/services/BuildCatalogPdfUrl";

import {
  CATEGORY_CONFIG,
} from "@/modules/catalog";
import {
  buildApplicationWhatsAppUrl,
} from "@/shared/config/application";

import "./SalesCatalogToolsPage.css";

/* =========================================================
   TIPOS
   ========================================================= */

type Option = {
  id: string;
  label: string;
  count: number;
  icon: string;
};

type SalesCopyParams = {
  selectedCategory: string;
  selectedCategoryLabel: string;
  selectedCampaign: string;
  selectedCampaignLabel: string;
  productCount: number;
  pdfUrl: string;
};

/* =========================================================
   CATEGORÍAS OFICIALES
   ========================================================= */

const CATEGORY_BY_ID =
  new Map(
    CATEGORY_CONFIG.map(
      (category) => [
        category.id,
        category,
      ],
    ),
  );

const getCategoryIcon = (
  categoryId: string,
) =>
  CATEGORY_BY_ID.get(
    categoryId as typeof CATEGORY_CONFIG[number]["id"],
  )?.icon ?? "📁";

/* =========================================================
   PORTAPAPELES
   ========================================================= */

const copyToClipboard = async (
  value: string,
) => {
  if (
    navigator.clipboard?.writeText
  ) {
    await navigator.clipboard.writeText(
      value,
    );

    return;
  }

  const textarea =
    document.createElement(
      "textarea",
    );

  textarea.value =
    value;

  textarea.setAttribute(
    "readonly",
    "true",
  );

  textarea.style.position =
    "fixed";

  textarea.style.opacity =
    "0";

  document.body.appendChild(
    textarea,
  );

  textarea.select();

  document.execCommand(
    "copy",
  );

  document.body.removeChild(
    textarea,
  );
};

/* =========================================================
   MENSAJE COMERCIAL
   ========================================================= */

const buildSalesWhatsappCopy = ({
  selectedCategory,
  selectedCategoryLabel,
  selectedCampaign,
  selectedCampaignLabel,
  productCount,
  pdfUrl,
}: SalesCopyParams) => {
  const hasCategory =
    selectedCategory !== "todas";

  const hasCampaign =
    Boolean(selectedCampaign);

  let opening =
    "Hola 👋, te comparto el catálogo mayorista Wooly completo.";

  if (
    hasCategory &&
    hasCampaign
  ) {
    opening =
      `Hola 👋, te comparto el catálogo mayorista Wooly de ${selectedCategoryLabel} en campaña ${selectedCampaignLabel}.`;
  } else if (
    hasCategory
  ) {
    opening =
      `Hola 👋, te comparto el catálogo mayorista Wooly de ${selectedCategoryLabel}.`;
  } else if (
    hasCampaign
  ) {
    opening =
      `Hola 👋, te comparto el catálogo mayorista Wooly de la campaña ${selectedCampaignLabel}.`;
  }

  const productLine =
    productCount > 0
      ? `Incluye ${productCount} productos referenciales para revisar.`
      : "Esta combinación no tiene productos cargados por ahora. Te recomiendo confirmar con ventas antes de compartirla.";

  return [
    opening,
    productLine,
    "Los precios por escala y el stock están sujetos a disponibilidad.",
    "Puedes revisarlo aquí:",
    pdfUrl,
    "Wooly Imports",
  ].join("\n");
};

export default function SalesCatalogToolsPage() {
  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState(
    "todas",
  );

  const [
    selectedCampaign,
    setSelectedCampaign,
  ] = useState(
    "",
  );

  const [
    copyStatus,
    setCopyStatus,
  ] = useState(
    "",
  );

  const [
    messageCopyStatus,
    setMessageCopyStatus,
  ] = useState(
    "",
  );

  const {
    data,
    isLoading,
    isFullCatalogLoaded,
  } = useCatalogData(
    "todas",
  );

  const {
    campaigns,
    isLoading:
      isCampaignRegistryLoading,
  } = useCatalogCampaigns({ includeInactive: true });

  const isPanelReady =
    isFullCatalogLoaded &&
    !isCampaignRegistryLoading;

  /* =======================================================
     OPCIONES DE CATEGORÍA
     ======================================================= */

  const categoryOptions =
    useMemo<Option[]>(
      () =>
        CATEGORY_CONFIG
          .map(
            (category) => {
              const selection =
                resolveCatalogSelection({
                  products: data,

                  categories:
                    CATEGORY_CONFIG,

                  campaigns,

                  categoryId:
                    category.id,

                  campaignId:
                    selectedCampaign,
                });

              return {
                id:
                  category.id,

                label:
                  category.id === "todas"
                    ? selectedCampaign
                      ? "Toda la campaña"
                      : "Todo el catálogo"
                    : category.name,

                count:
                  selection.productCount,

                icon:
                  category.icon,
              };
            },
          )
          .filter(
            (category) =>
              category.id === "todas" ||
              !selectedCampaign ||
              category.count > 0,
          ),
      [
        data,
        campaigns,
        selectedCampaign,
      ],
    );

  /* =======================================================
     CAMPAÑAS OFICIALES ACTIVAS
     ======================================================= */

  const campaignOptions =
    useMemo<Option[]>(
      () =>
        filterActiveCampaigns(
          campaigns,
        )
          .map(
            (campaign) => {
              const selection =
                resolveCatalogSelection({
                  products: data,

                  categories:
                    CATEGORY_CONFIG,

                  campaigns,

                  categoryId:
                    "todas",

                  campaignId:
                    campaign.id,
                });

              return {
                id:
                  campaign.id,

                label:
                  campaign.name,

                count:
                  selection.productCount,

                icon:
                  campaign.icon,
              };
            },
          )
          .filter(
            (campaign) =>
              campaign.count > 0,
          ),
      [
        data,
        campaigns,
      ],
    );

  /* =======================================================
     SELECCIÓN ACTUAL
     ======================================================= */

  const selection =
    useMemo(
      () =>
        resolveCatalogSelection({
          products: data,

          categories:
            CATEGORY_CONFIG,

          campaigns,

          categoryId:
            selectedCategory,

          campaignId:
            selectedCampaign,
        }),
      [
        data,
        campaigns,
        selectedCategory,
        selectedCampaign,
      ],
    );

  const selectedCategoryLabel =
    selection.categoryLabel;

  const selectedCampaignLabel =
    selection.campaignLabel;

  const hasEmptyResult =
    selection.isEmpty &&
    isPanelReady;

  /* =======================================================
     URL
     ======================================================= */

  const pdfPath =
    useMemo(
      () =>
        buildCatalogPdfPath({
          categoryId:
            selectedCategory,

          campaignId:
            selectedCampaign,
        }),
      [
        selectedCategory,
        selectedCampaign,
      ],
    );

  const pdfUrl =
    useMemo(
      () =>
        buildCatalogPdfUrl({
          origin:
            window.location.origin,

          categoryId:
            selectedCategory,

          campaignId:
            selectedCampaign,
        }),
      [
        selectedCategory,
        selectedCampaign,
      ],
    );

  /* =======================================================
     RESUMEN COMERCIAL
     ======================================================= */

  const resultTitle =
    useMemo(
      () => {
        if (
          selection.isCombination
        ) {
          return `${selectedCategoryLabel} + ${selectedCampaignLabel}`;
        }

        if (
          selection.hasCategory
        ) {
          return selectedCategoryLabel;
        }

        if (
          selection.hasCampaign
        ) {
          return selectedCampaignLabel;
        }

        return "Catálogo completo";
      },
      [
        selection.isCombination,
        selection.hasCategory,
        selection.hasCampaign,
        selectedCategoryLabel,
        selectedCampaignLabel,
      ],
    );

  const whatsappMessage =
    useMemo(
      () =>
        buildSalesWhatsappCopy({
          selectedCategory,

          selectedCategoryLabel,

          selectedCampaign,

          selectedCampaignLabel,

          productCount:
            selection.productCount,

          pdfUrl,
        }),
      [
        selectedCategory,
        selectedCategoryLabel,
        selectedCampaign,
        selectedCampaignLabel,
        selection.productCount,
        pdfUrl,
      ],
    );

  const whatsappUrl =
    buildApplicationWhatsAppUrl(
      whatsappMessage,
    );

  /* =======================================================
     ACCIONES
     ======================================================= */

  const clearCopyStatuses =
    () => {
      setCopyStatus(
        "",
      );

      setMessageCopyStatus(
        "",
      );
    };

  const resetSelection =
    () => {
      setSelectedCategory(
        "todas",
      );

      setSelectedCampaign(
        "",
      );

      clearCopyStatuses();
    };

  const selectCategory =
    (
      categoryId: string,
    ) => {
      setSelectedCategory(
        categoryId,
      );

      clearCopyStatuses();
    };

  const selectCampaign =
    (
      campaignId: string,
    ) => {
      setSelectedCampaign(
        (
          currentCampaign,
        ) =>
          currentCampaign ===
          campaignId
            ? ""
            : campaignId,
      );

      clearCopyStatuses();
    };

  const handleCopy =
    async () => {
      await copyToClipboard(
        pdfUrl,
      );

      setCopyStatus(
        "Link copiado",
      );

      window.setTimeout(
        () => {
          setCopyStatus(
            "",
          );
        },
        1800,
      );
    };

  const handleCopyMessage =
    async () => {
      await copyToClipboard(
        whatsappMessage,
      );

      setMessageCopyStatus(
        "Mensaje copiado",
      );

      window.setTimeout(
        () => {
          setMessageCopyStatus(
            "",
          );
        },
        1800,
      );
    };

  return (
    <main className="sales-catalog-tools">
      <section className="sales-catalog-tools__hero">
        <div>
          <p className="sales-catalog-tools__eyebrow">
            Wooly Ventas
          </p>

          <h1>
            Explorer de catálogos PDF
          </h1>

          <p>
            Herramienta interna para que ventas arme
            catálogos mayoristas por categoría,
            campaña o combinación comercial.
          </p>
        </div>

        <div className="sales-catalog-tools__heroActions">
          <a
            className="sales-catalog-tools__back"
            href="/catalogo"
          >
            Ver catálogo público
          </a>

          <button
            type="button"
            onClick={resetSelection}
          >
            Reiniciar
          </button>
        </div>
      </section>

      <CatalogSyncPanel
        currentProductCount={
          data.length
        }
        campaignCount={
          campaigns.length
        }
        isReady={
          isPanelReady
        }
      />

      {!isPanelReady ? (
        <section className="sales-catalog-tools__notice">
          {isLoading ||
          isCampaignRegistryLoading
            ? "Cargando catálogo y campañas oficiales..."
            : "El catálogo aún puede estar cargando categorías. Espera unos segundos antes de compartir un PDF."}
        </section>
      ) : null}

      <section className="sales-catalog-tools__layout">
        <section className="sales-catalog-tools__workspace">
          <article className="sales-catalog-tools__panel">
            <div className="sales-catalog-tools__sectionHead">
              <span>01</span>

              <div>
                <h2>
                  {selectedCampaign
                    ? `Categorías de ${selectedCampaignLabel}`
                    : "Catálogos por categoría"}
                </h2>

                <p>
                  {selectedCampaign
                    ? "Elige una categoría para combinarla con la campaña activa."
                    : "Elige la familia principal del catálogo mayorista."}
                </p>
              </div>
            </div>

            <div className="sales-catalog-tools__categoryGrid">
              {categoryOptions.map(
                (category) => {
                  const isActive =
                    selectedCategory ===
                    category.id;

                  return (
                    <button
                      type="button"
                      key={category.id}
                      className={`sales-catalog-tools__categoryCard ${
                        isActive
                          ? "is-active"
                          : ""
                      }`}
                      onClick={() =>
                        selectCategory(
                          category.id,
                        )
                      }
                    >
                      <span className="sales-catalog-tools__categoryIcon">
                        {category.icon}
                      </span>

                      <strong>
                        {category.label}
                      </strong>

                      <small>
                        {selectedCampaign
                          ? `${category.count} en campaña`
                          : `${category.count} productos`}
                      </small>
                    </button>
                  );
                },
              )}
            </div>
          </article>

          <article className="sales-catalog-tools__panel">
            <div className="sales-catalog-tools__sectionHead">
              <span>02</span>

              <div>
                <h2>
                  Campañas disponibles
                </h2>

                <p>
                  Activa una campaña oficial para
                  combinarla con categoría.
                </p>
              </div>
            </div>

            {isCampaignRegistryLoading ? (
              <p className="sales-catalog-tools__empty">
                Cargando campañas oficiales...
              </p>
            ) : campaignOptions.length > 0 ? (
              <div className="sales-catalog-tools__campaignGrid">
                {campaignOptions.map(
                  (campaign) => {
                    const isActive =
                      selectedCampaign ===
                      campaign.id;

                    return (
                      <button
                        type="button"
                        key={campaign.id}
                        className={`sales-catalog-tools__campaignCard ${
                          isActive
                            ? "is-active"
                            : ""
                        }`}
                        onClick={() =>
                          selectCampaign(
                            campaign.id,
                          )
                        }
                      >
                        <span>
                          {isActive
                            ? "✓"
                            : campaign.icon ||
                              "Campaña"}
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
              <p className="sales-catalog-tools__empty">
                No hay campañas activas con productos
                disponibles.
              </p>
            )}
          </article>

        </section>

        <aside className="sales-catalog-tools__result">
          <div className="sales-catalog-tools__sectionHead">
            <span>PDF</span>

            <div>
              <h2>
                Catálogo listo
              </h2>

              <p>
                Link preparado para abrir, copiar o
                enviar.
              </p>
            </div>
          </div>

          <div className="sales-catalog-tools__resultHero">
            <span>
              {getCategoryIcon(
                selectedCategory,
              )}
            </span>

            <div>
              <p>
                Combinación actual
              </p>

              <h3>
                {resultTitle}
              </h3>
            </div>
          </div>

          {hasEmptyResult ? (
            <div className="sales-catalog-tools__zeroWarning">
              Esta combinación no tiene productos.
              Revisa categoría y campaña antes de
              compartir el catálogo.
            </div>
          ) : null}

          <div className="sales-catalog-tools__summary">
            <div>
              <span>
                Categoría
              </span>

              <strong>
                {selectedCategoryLabel}
              </strong>
            </div>

            <div>
              <span>
                Campaña
              </span>

              <strong>
                {selectedCampaignLabel}
              </strong>
            </div>

            <div>
              <span>
                Productos estimados
              </span>

              <strong>
                {selection.productCount}
              </strong>
            </div>
          </div>

          <div className="sales-catalog-tools__fieldGroup">
            <div className="sales-catalog-tools__field">
              <label htmlFor="sales-category">
                Categoría
              </label>

              <select
                id="sales-category"
                value={selectedCategory}
                onChange={(event) => {
                  setSelectedCategory(
                    event.target.value,
                  );

                  clearCopyStatuses();
                }}
              >
                {categoryOptions.map(
                  (category) => (
                    <option
                      value={category.id}
                      key={category.id}
                    >
                      {category.label} (
                      {category.count})
                    </option>
                  ),
                )}
              </select>
            </div>

            <div className="sales-catalog-tools__field">
              <label htmlFor="sales-campaign">
                Campaña
              </label>

              <select
                id="sales-campaign"
                value={selectedCampaign}
                onChange={(event) => {
                  setSelectedCampaign(
                    event.target.value,
                  );

                  clearCopyStatuses();
                }}
              >
                <option value="">
                  Sin campaña específica
                </option>

                {campaignOptions.map(
                  (campaign) => (
                    <option
                      value={campaign.id}
                      key={campaign.id}
                    >
                      {campaign.label} (
                      {campaign.count})
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>

          <div className="sales-catalog-tools__urlBox">
            <span>
              URL generada
            </span>

            <code>
              {pdfPath}
            </code>
          </div>

          <div className="sales-catalog-tools__actions">
            <a
              href={pdfPath}
              target="_blank"
              rel="noreferrer"
            >
              Ver PDF
            </a>

            <button
              type="button"
              onClick={handleCopy}
            >
              {copyStatus ||
                "Copiar link"}
            </button>

            <button
              type="button"
              onClick={handleCopyMessage}
            >
              {messageCopyStatus ||
                "Copiar mensaje"}
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
          </div>

          <div className="sales-catalog-tools__messagePreview">
            <span>
              Mensaje WhatsApp
            </span>

            <pre>
              {whatsappMessage}
            </pre>
          </div>
        </aside>
      </section>
    </main>
  );
}
