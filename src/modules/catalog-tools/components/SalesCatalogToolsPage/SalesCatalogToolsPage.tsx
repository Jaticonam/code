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

  const whatsappMessage = useMemo(() => {
    const parts = ["Hola 👋, te comparto el catálogo mayorista Wooly."];

    if (selectedCategory !== "todas") {
      parts.push(`Categoría: ${selectedCategoryLabel}.`);
    }

    if (selectedCampaign) {
      parts.push(`Campaña: ${selectedCampaignLabel}.`);
    }

    parts.push("Precios y stock sujetos a disponibilidad.");
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

          <h1>Panel de catálogos PDF</h1>

          <p>
            Herramienta interna para armar catálogos mayoristas por categoría,
            campaña o combinación comercial.
          </p>
        </div>

        <a className="sales-catalog-tools__back" href="/catalogo">
          Ver catálogo público
        </a>
      </section>

      {!isFullCatalogLoaded ? (
        <section className="sales-catalog-tools__notice">
          {isLoading
            ? "Cargando catálogo completo..."
            : "El catálogo aún puede estar cargando categorías. Espera unos segundos antes de compartir un PDF."}
        </section>
      ) : null}

      <section className="sales-catalog-tools__layout">
        <article className="sales-catalog-tools__panel">
          <div className="sales-catalog-tools__sectionHead">
            <span>01</span>
            <div>
              <h2>Selecciona combinación</h2>
              <p>Crea el PDF exacto que necesita la asesora.</p>
            </div>
          </div>

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

          <div className="sales-catalog-tools__quickActions">
            <button type="button" onClick={resetSelection}>
              Catálogo completo
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory("hotwheels");
                setSelectedCampaign("");
                setCopyStatus("");
              }}
            >
              Hot Wheels
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory("cintas");
                setSelectedCampaign("");
                setCopyStatus("");
              }}
            >
              Cintas
            </button>
          </div>
        </article>

        <article className="sales-catalog-tools__result">
          <div className="sales-catalog-tools__sectionHead">
            <span>02</span>
            <div>
              <h2>Resultado</h2>
              <p>Link listo para abrir, copiar o enviar.</p>
            </div>
          </div>

          <div className="sales-catalog-tools__summary">
            <div>
              <span>Categoría</span>
              <strong>
                {getCategoryIcon(selectedCategory)} {selectedCategoryLabel}
              </strong>
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
              Enviar por WhatsApp
            </a>
          </div>

          <div className="sales-catalog-tools__messagePreview">
            <span>Mensaje WhatsApp</span>
            <p>{whatsappMessage}</p>
          </div>
        </article>
      </section>
    </main>
  );
}
