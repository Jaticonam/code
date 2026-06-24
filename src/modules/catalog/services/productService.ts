import type { Campaign, Product } from "@/shared/types/product";
import { CAMPAIGN_CONFIG } from "@/shared/config/campaigns";
import {
  CAMPAIGNS_SHEET_CONFIG,
  PRODUCT_SHEETS_CONFIG,
  type SheetSource,
  type SheetCategory,
} from "@/modules/catalog/integrations/googleSheets/sheetsConfig";
import { fetchSheetRows } from "@/modules/catalog/integrations/googleSheets/fetchSheets";
import {
  CAMPAIGN_REQUIRED_HEADERS,
  buildCampaignNameToIdMap,
  isCampaignActive,
  normalizeCampaign,
} from "@/modules/catalog/integrations/googleSheets/normalizeCampaign";
import { normalizeProduct } from "@/modules/catalog/integrations/googleSheets/normalizeProduct";
import { validateProducts } from "@/modules/catalog/integrations/googleSheets/validateProducts";

type CategoryCacheEntry = {
  savedAt: number;
  items: Product[];
};

type CampaignCacheEntry = {
  savedAt: number;
  items: Campaign[];
};

export type CatalogCategory = SheetCategory | "todas";

const CACHE_TTL = 1000 * 60 * 5;

const PRODUCT_REQUIRED_HEADERS = [
  "id",
  "title",
  "description",
  "category",
  "price_1",
  "price_3",
  "price_12",
  "price_50",
  "price_100",
  "stock",
  "img",
  "badge",
  "campaigns",
  "priority",
  "status",
  "updated_at",
] as const;

/* =========================================================
   CACHE EN MEMORIA
   ========================================================= */

const memoryCache = new Map<SheetCategory, CategoryCacheEntry>();
const pendingRequests = new Map<SheetCategory, Promise<Product[]>>();

let campaignsMemoryCache: CampaignCacheEntry | null = null;
let pendingCampaignsRequest: Promise<Campaign[]> | null = null;

const productKey = (category: string) => `jung_catalog_v3_${category}`;
const campaignsKey = () => "jung_catalog_campaigns_v2";
const now = () => Date.now();

const isFresh = (savedAt: number) => now() - savedAt <= CACHE_TTL;

export const getCatalogCategories = () =>
  PRODUCT_SHEETS_CONFIG.map((source) => source.category);

const sortProducts = (items: Product[]) =>
  [...items].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

const sortCampaigns = (items: Campaign[]) =>
  [...items].sort((a, b) => b.priority - a.priority);

const flattenByCategory = (
  byCategory: Partial<Record<SheetCategory, Product[]>>,
) => sortProducts(Object.values(byCategory).flatMap((items) => items ?? []));

/* =========================================================
   FALLBACK CAMPAIGNS
   Si Google Sheets falla, el catálogo sigue respirando.
   ========================================================= */

function getFallbackCampaigns(): Campaign[] {
  return CAMPAIGN_CONFIG.map((campaign) => ({
    id: campaign.id,
    name: campaign.name,
    icon: campaign.icon,
    color: campaign.color,
    colorClass: campaign.colorClass,
    startDate: "",
    endDate: "",
    priority: campaign.priority,
    publicationStatus: "Publicado",
    computedStatus: "activa",
  }));
}

/* =========================================================
   CACHE LOCAL CAMPAIGNS
   ========================================================= */

function readStoredCampaigns(): Campaign[] | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(campaignsKey());
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CampaignCacheEntry;

    if (!parsed?.savedAt || !isFresh(parsed.savedAt)) return null;
    if (!Array.isArray(parsed.items)) return null;

    campaignsMemoryCache = parsed;

    return parsed.items;
  } catch {
    return null;
  }
}

function writeCampaignsCache(items: Campaign[]) {
  const entry: CampaignCacheEntry = {
    savedAt: now(),
    items,
  };

  campaignsMemoryCache = entry;

  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(campaignsKey(), JSON.stringify(entry));
  } catch {
    // Si localStorage falla, seguimos con cache en memoria.
  }
}

async function fetchCampaignsFromSheet(): Promise<Campaign[]> {
  const rows = await fetchSheetRows(
    CAMPAIGNS_SHEET_CONFIG,
    CAMPAIGN_REQUIRED_HEADERS,
  );

  return sortCampaigns(rows.map(normalizeCampaign));
}

async function loadAllCatalogCampaigns(
  options: { forceRefresh?: boolean } = {},
): Promise<Campaign[]> {
  if (!options.forceRefresh) {
    if (campaignsMemoryCache && isFresh(campaignsMemoryCache.savedAt)) {
      return campaignsMemoryCache.items;
    }

    const stored = readStoredCampaigns();
    if (stored) return stored;
  }

  if (pendingCampaignsRequest) return pendingCampaignsRequest;

  pendingCampaignsRequest = fetchCampaignsFromSheet()
    .then((campaigns) => {
      writeCampaignsCache(campaigns);
      return campaigns;
    })
    .catch((error) => {
      console.error("Error cargando Campaigns Sheet. Usando fallback:", error);

      const fallback = sortCampaigns(getFallbackCampaigns());
      writeCampaignsCache(fallback);

      return fallback;
    })
    .finally(() => {
      pendingCampaignsRequest = null;
    });

  return pendingCampaignsRequest;
}

export async function loadCatalogCampaigns(
  options: { includeInactive?: boolean; forceRefresh?: boolean } = {},
): Promise<Campaign[]> {
  const campaigns = await loadAllCatalogCampaigns({
    forceRefresh: options.forceRefresh,
  });

  return options.includeInactive
    ? campaigns
    : campaigns.filter(isCampaignActive);
}

async function getCampaignNameToIdMap() {
  const campaigns = await loadCatalogCampaigns({
    includeInactive: true,
  });

  return buildCampaignNameToIdMap(campaigns);
}

/* =========================================================
   CACHE LOCAL PRODUCTOS
   ========================================================= */

function readStorageCache(category: SheetCategory): Product[] | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(productKey(category));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CategoryCacheEntry;

    if (!parsed?.savedAt || !isFresh(parsed.savedAt)) return null;
    if (!Array.isArray(parsed.items)) return null;

    memoryCache.set(category, {
      savedAt: parsed.savedAt,
      items: parsed.items,
    });

    return parsed.items;
  } catch {
    return null;
  }
}

export function readCachedCategoryProducts(
  category: SheetCategory,
): Product[] | null {
  const memoryEntry = memoryCache.get(category);

  if (memoryEntry && isFresh(memoryEntry.savedAt)) {
    return sortProducts(memoryEntry.items);
  }

  if (memoryEntry && !isFresh(memoryEntry.savedAt)) {
    memoryCache.delete(category);
  }

  const storageItems = readStorageCache(category);
  return storageItems ? sortProducts(storageItems) : null;
}

function writeCache(category: SheetCategory, items: Product[]) {
  const entry: CategoryCacheEntry = {
    savedAt: now(),
    items,
  };

  memoryCache.set(category, entry);

  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(productKey(category), JSON.stringify(entry));
  } catch {
    // Si localStorage falla, seguimos con cache en memoria.
  }
}

export function getCachedCatalogSnapshot() {
  const byCategory: Partial<Record<SheetCategory, Product[]>> = {};

  PRODUCT_SHEETS_CONFIG.forEach((source) => {
    const cached = readCachedCategoryProducts(source.category);
    if (cached) byCategory[source.category] = cached;
  });

  const loadedCategories = PRODUCT_SHEETS_CONFIG.filter(
    (source) => byCategory[source.category],
  ).map((source) => source.category);

  const isFullCatalogLoaded =
    loadedCategories.length === PRODUCT_SHEETS_CONFIG.length;

  return {
    byCategory,
    products: flattenByCategory(byCategory),
    loadedCategories,
    isFullCatalogLoaded,
  };
}

/* =========================================================
   FETCH REAL POR CATEGORÍA
   ========================================================= */

function getSource(category: SheetCategory) {
  return PRODUCT_SHEETS_CONFIG.find((source) => source.category === category);
}

async function fetchCategoryProducts(
  category: SheetCategory,
): Promise<Product[]> {
  const source = getSource(category);
  if (!source) return [];

  const campaignNameToIdMap = await getCampaignNameToIdMap();

  const rows = await fetchSheetRows(source, PRODUCT_REQUIRED_HEADERS);

  const normalized = rows.map((row) =>
    normalizeProduct(row, source.category, campaignNameToIdMap),
  );

  const products = validateProducts(normalized).map(
    ({ updated_at, ...product }) => product,
  );

  const sorted = sortProducts(products);
  writeCache(category, sorted);

  return sorted;
}

/* =========================================================
   API DE CARGA POR CATEGORÍA
   ========================================================= */

export async function loadCategoryProducts(
  category: SheetCategory,
  options: { forceRefresh?: boolean } = {},
): Promise<Product[]> {
  if (!options.forceRefresh) {
    const cached = readCachedCategoryProducts(category);
    if (cached) return cached;
  }

  const pending = pendingRequests.get(category);
  if (pending) return pending;

  const request = fetchCategoryProducts(category).finally(() => {
    pendingRequests.delete(category);
  });

  pendingRequests.set(category, request);

  return request;
}

export async function loadAllProducts(): Promise<Product[]> {
  const results = await Promise.all(
    PRODUCT_SHEETS_CONFIG.map((source) =>
      loadCategoryProducts(source.category).catch((error) => {
        console.error(`Error en fuente "${source.category}":`, error);
        return [];
      }),
    ),
  );

  return sortProducts(results.flat());
}

/* =========================================================
   LEGACY COMPATIBLE
   ========================================================= */

export async function loadCatalogProgressive(
  activeCategory: CatalogCategory,
  onUpdate: (products: Product[], isFullCatalogLoaded: boolean) => void,
) {
  const categories = getCatalogCategories();
  const preferred = activeCategory !== "todas" ? activeCategory : null;

  const order = preferred
    ? [preferred, ...categories.filter((category) => category !== preferred)]
    : categories;

  const byCategory = getCachedCatalogSnapshot().byCategory;

  onUpdate(
    flattenByCategory(byCategory),
    Object.keys(byCategory).length === categories.length,
  );

  for (const category of order) {
    if (byCategory[category]) continue;

    try {
      byCategory[category] = await loadCategoryProducts(category);
    } catch (error) {
      console.error(`Error cargando "${category}":`, error);
      byCategory[category] = [];
    }

    onUpdate(
      flattenByCategory(byCategory),
      Object.keys(byCategory).length === categories.length,
    );
  }
}
