import { useMemo, useState } from "react";

import { useCatalogData } from "@/modules/catalog/hooks/useCatalogData";
import {
  buildCatalogPdfPath,
  buildCatalogPdfUrl,
} from "@/modules/catalog-tools/services/BuildCatalogPdfUrl";

import "./SalesCatalogToolsPage.css";

type Option = {
  id: string;
  label: string;
  count: number;
};

const CATEGORY_LABELS: Record<string, string> = {
  todas: "Todo el catálogo",
  flores: "Flores",
  peluches: "Peluches",
  papeles: "Papeles",
  cajas: "Cajas",
  cintas: "Cintas",
  globos: "Globos",
  accesorios: "Accesorios",
  llaveros: "Llaveros",
  hotwheels: "Hot Wheels",
};

const CATEGORY_ICONS: Record<string, string> = {
  todas: "📦",
  flores: "🌸",
  peluches: "🧸",
  papeles: "🎁",
  cajas: "📦",
  cintas: "🎀",
  globos: "🎈",
  accesorios: "✨",
  llaveros: "🔑",
  hotwheels: "🏎️",
};

const normalizeText = (value?: string | null) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const toDisplayLabel = (value: string) => {
  const cleanValue = decodeURIComponent(value || "")
    .replace(/hotwheels/gi, "hot wheels")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleanValue) return "";

  return cleanValue
    .split(" ")
    .map((word) =>
      word.length <= 2
        ? word.toUpperCase()
        : `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`,
    )
    .join(" ");
};

const getCategoryLabel = (categoryId: string) =>
  CATEGORY_LABELS[categoryId] || toDisplayLabel(categoryId);

const getCategoryIcon = (categoryId: string) =>
  CATEGORY_ICONS[categoryId] || "📁";

const copyToClipboard = async (value: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";

  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};

export default function SalesCatalogToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

  const { data, isLoading, isFullCatalogLoaded } = useCatalogData("todas");

  const categoryOptions = useMemo<Option[]>(() => {
    const counts = new Map<string, number>();

    data.forEach((product) => {
      const categoryId = normalizeText(product.category);

      if (!categoryId) return;

      counts.set(categoryId, (counts.get(categoryId) || 0) + 1);
    });

    const options = Array.from(counts.entries())
      .map(([id, count]) => ({
        id,
        label: getCategoryLabel(id),
        count,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, "es"));

    return [
      {
        id: "todas",
        label: "Todo el catálogo",
        count: data.length,
      },
      ...options,
    ];
  }, [data]);

  const campaignOptions = useMemo<Option[]>(() => {
    const counts = new Map<string, number>();

    data.forEach((product) => {
      const campaigns = Array.from(new Set(product.campaigns || []));

      campaigns.forEach((campaignId) => {
        const cleanCampaignId = normalizeText(campaignId);

        if (!cleanCampaignId) return;

        counts.set(cleanCampaignId, (counts.get(cleanCampaignId) || 0) + 1);
      });
    });

    return Array.from(counts.entries())
      .map(([id, count]) => ({
        id,
        label: toDisplayLabel(id),
        count,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, "es"));
  }, [data]);

  const selectedCampaignCategoryOptions = useMemo<Option[]>(() => {
    const normalizedCampaign = normalizeText(selectedCampaign);

    if (!normalizedCampaign) return [];

    const counts = new Map<string, number>();

    data.forEach((product) => {
      const matchesCampaign = product.campaigns?.some(
        (campaignId) => normalizeText(campaignId) === normalizedCampaign,
      );

      if (!matchesCampaign) return;

      const categoryId = normalizeText(product.category);

      if (!categoryId) return;

      counts.set(categoryId, (counts.get(categoryId) || 0) + 1);
    });

    return Array.from(counts.entries())
      .map(([id, count]) => ({
        id,
        label: getCategoryLabel(id),
        count,
      }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "es"));
  }, [data, selectedCampaign]);

  const selectedCategoryLabel = getCategoryLabel(selectedCategory);
  const selectedCampaignLabel = selectedCampaign
    ? toDisplayLabel(selectedCampaign)
    : "Sin campaña específica";

  const filteredProducts = useMemo(() => {
    const normalizedCategory = normalizeText(selectedCategory);
    const normalizedCampaign = normalizeText(selectedCampaign);

    return data.filter((product) => {
      const matchesCategory =
        !normalizedCategory ||
        normalizedCategory === "todas" ||
        normalizeText(product.category) === normalizedCategory;

      const matchesCampaign =
        !normalizedCampaign ||
        product.campaigns?.some(
          (campaign) => normalizeText(campaign) === normalizedCampaign,
        );

      return matchesCategory && matchesCampaign;
    });
  }, [data, selectedCategory, selectedCampaign]);

  const pdfPath = useMemo(
    () =>
      buildCatalogPdfPath({
        categoryId: selectedCategory,
        campaignId: selectedCampaign,
      }),
    [selectedCategory, selectedCampaign],
  );

  const pdfUrl = useMemo(() => {
    const origin = window.location.origin;

    return buildCatalogPdfUrl({
      origin,
      categoryId: selectedCategory,
      campaignId: selectedCampaign,
    });
  }, [selectedCategory, selectedCampaign]);

  const resultTitle = useMemo(() => {
    if (selectedCategory !== "todas" && selectedCampaign) {
      return `${selectedCategoryLabel} + ${selectedCampaignLabel}`;
    }

    if (selectedCategory !== "todas") {
      return selectedCategoryLabel;
    }

    if (selectedCampaign) {
      return selectedCampaignLabel;
    }

    return "Catálogo completo";
  }, [
    selectedCategory,
    selectedCategoryLabel,
    selectedCampaign,
    selectedCampaignLabel,
  ]);

  const whatsappMessage = useMemo(() => {
    const parts = ["Hola 👋, te comparto el catálogo mayorista Wooly."];

    if (selectedCategory !== "todas") {
      parts.push(`Categoría: ${selectedCategoryLabel}.`);
    }

    if (selectedCampaign) {
      parts.push(`Campaña: ${selectedCampaignLabel}.`);
    }

    parts.push("Precios y stock sujetos a disponibilidad.");
    parts.push("Puedes revisarlo aquí:");
    parts.push(pdfUrl);

    return parts.join(" ");
  }, [
    pdfUrl,
    selectedCategory,
    selectedCategoryLabel,
    selectedCampaign,
    selectedCampaignLabel,
  ]);

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    whatsappMessage,
  )}`;

  const resetSelection = () => {
    setSelectedCategory("todas");
    setSelectedCampaign("");
    setCopyStatus("");
  };

  const selectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCopyStatus("");
  };

  const selectCampaign = (campaignId: string) => {
    setSelectedCampaign((currentCampaign) =>
      currentCampaign === campaignId ? "" : campaignId,
    );
    setCopyStatus("");
  };

  const handleCopy = async () => {
    await copyToClipboard(pdfUrl);
    setCopyStatus("Link copiado");

    window.setTimeout(() => {
      setCopyStatus("");
    }, 1800);
  };

  return (
    <main className="sales-catalog-tools">
      <section className="sales-catalog-tools__hero">
        <div>
          <p className="sales-catalog-tools__eyebrow">Wooly Ventas</p>

          <h1>Explorer de catálogos PDF</h1>

          <p>
            Herramienta interna para que ventas arme catálogos mayoristas por
            categoría, campaña o combinación comercial.
          </p>
        </div>

        <div className="sales-catalog-tools__heroActions">
          <a className="sales-catalog-tools__back" href="/catalogo">
            Ver catálogo público
          </a>

          <button type="button" onClick={resetSelection}>
            Reiniciar
          </button>
        </div>
      </section>

      {!isFullCatalogLoaded ? (
        <section className="sales-catalog-tools__notice">
          {isLoading
            ? "Cargando catálogo completo..."
            : "El catálogo aún puede estar cargando categorías. Espera unos segundos antes de compartir un PDF."}
        </section>
      ) : null}

      <section className="sales-catalog-tools__layout">
        <section className="sales-catalog-tools__workspace">
          <article className="sales-catalog-tools__panel">
            <div className="sales-catalog-tools__sectionHead">
              <span>01</span>
              <div>
                <h2>Catálogos por categoría</h2>
                <p>Elige la familia principal del catálogo mayorista.</p>
              </div>
            </div>

            <div className="sales-catalog-tools__categoryGrid">
              {categoryOptions.map((category) => {
                const isActive = selectedCategory === category.id;

                return (
                  <button
                    type="button"
                    key={category.id}
                    className={`sales-catalog-tools__categoryCard ${
                      isActive ? "is-active" : ""
                    }`}
                    onClick={() => selectCategory(category.id)}
                  >
                    <span className="sales-catalog-tools__categoryIcon">
                      {getCategoryIcon(category.id)}
                    </span>

                    <strong>{category.label}</strong>

                    <small>{category.count} productos</small>
                  </button>
                );
              })}
            </div>
          </article>

          <article className="sales-catalog-tools__panel">
            <div className="sales-catalog-tools__sectionHead">
              <span>02</span>
              <div>
                <h2>Campañas disponibles</h2>
                <p>Activa una campaña para combinarla con categoría.</p>
              </div>
            </div>

            {campaignOptions.length > 0 ? (
              <div className="sales-catalog-tools__campaignGrid">
                {campaignOptions.map((campaign) => {
                  const isActive = selectedCampaign === campaign.id;

                  return (
                    <button
                      type="button"
                      key={campaign.id}
                      className={`sales-catalog-tools__campaignCard ${
                        isActive ? "is-active" : ""
                      }`}
                      onClick={() => selectCampaign(campaign.id)}
                    >
                      <span>{isActive ? "✓" : "Campaña"}</span>

                      <strong>{campaign.label}</strong>

                      <small>{campaign.count} productos</small>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="sales-catalog-tools__empty">
                No hay campañas detectadas en los productos cargados.
              </p>
            )}
          </article>

          {selectedCampaign ? (
            <article className="sales-catalog-tools__panel">
              <div className="sales-catalog-tools__sectionHead">
                <span>03</span>
                <div>
                  <h2>Combinar campaña con categoría</h2>
                  <p>
                    Atajos rápidos para crear un PDF más específico de la
                    campaña seleccionada.
                  </p>
                </div>
              </div>

              <div className="sales-catalog-tools__comboGrid">
                <button
                  type="button"
                  className={`sales-catalog-tools__comboCard ${
                    selectedCategory === "todas" ? "is-active" : ""
                  }`}
                  onClick={() => selectCategory("todas")}
                >
                  <strong>Toda la campaña</strong>
                  <small>{selectedCampaignLabel}</small>
                </button>

                {selectedCampaignCategoryOptions.map((category) => (
                  <button
                    type="button"
                    key={category.id}
                    className={`sales-catalog-tools__comboCard ${
                      selectedCategory === category.id ? "is-active" : ""
                    }`}
                    onClick={() => selectCategory(category.id)}
                  >
                    <strong>
                      {getCategoryIcon(category.id)} {category.label}
                    </strong>
                    <small>{category.count} productos en campaña</small>
                  </button>
                ))}
              </div>
            </article>
          ) : null}
        </section>

        <aside className="sales-catalog-tools__result">
          <div className="sales-catalog-tools__sectionHead">
            <span>PDF</span>
            <div>
              <h2>Catálogo listo</h2>
              <p>Link preparado para abrir, copiar o enviar.</p>
            </div>
          </div>

          <div className="sales-catalog-tools__resultHero">
            <span>{getCategoryIcon(selectedCategory)}</span>
            <div>
              <p>Combinación actual</p>
              <h3>{resultTitle}</h3>
            </div>
          </div>

          <div className="sales-catalog-tools__summary">
            <div>
              <span>Categoría</span>
              <strong>{selectedCategoryLabel}</strong>
            </div>

            <div>
              <span>Campaña</span>
              <strong>{selectedCampaignLabel}</strong>
            </div>

            <div>
              <span>Productos estimados</span>
              <strong>{filteredProducts.length}</strong>
            </div>
          </div>

          <div className="sales-catalog-tools__fieldGroup">
            <div className="sales-catalog-tools__field">
              <label htmlFor="sales-category">Categoría</label>

              <select
                id="sales-category"
                value={selectedCategory}
                onChange={(event) => {
                  setSelectedCategory(event.target.value);
                  setCopyStatus("");
                }}
              >
                {categoryOptions.map((category) => (
                  <option value={category.id} key={category.id}>
                    {category.label} ({category.count})
                  </option>
                ))}
              </select>
            </div>

            <div className="sales-catalog-tools__field">
              <label htmlFor="sales-campaign">Campaña</label>

              <select
                id="sales-campaign"
                value={selectedCampaign}
                onChange={(event) => {
                  setSelectedCampaign(event.target.value);
                  setCopyStatus("");
                }}
              >
                <option value="">Sin campaña específica</option>

                {campaignOptions.map((campaign) => (
                  <option value={campaign.id} key={campaign.id}>
                    {campaign.label} ({campaign.count})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="sales-catalog-tools__urlBox">
            <span>URL generada</span>
            <code>{pdfPath}</code>
          </div>

          <div className="sales-catalog-tools__actions">
            <a href={pdfPath} target="_blank" rel="noreferrer">
              Ver PDF
            </a>

            <button type="button" onClick={handleCopy}>
              {copyStatus || "Copiar link"}
            </button>

            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </div>

          <div className="sales-catalog-tools__messagePreview">
            <span>Mensaje WhatsApp</span>
            <p>{whatsappMessage}</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
