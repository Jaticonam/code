import { CAMPAIGN_CONFIG } from "@/shared/config/campaigns";
import type { Campaign } from "@/shared/types/product";

import { getCampaignColorClass } from "@/modules/catalog/integrations/googleSheets/campaignColors";
import {
  buildCampaignNameToIdMap,
  isCampaignActive,
} from "@/modules/catalog/integrations/googleSheets/normalizeCampaign";

import { catalogProvider } from "@/modules/catalog/providers/DefaultCatalogProvider";

/* =========================================================
   TIPOS INTERNOS
   ========================================================= */

type CampaignCacheEntry = {
  savedAt: number;
  items: Campaign[];
};

export interface LoadCatalogCampaignsOptions {
  includeInactive?: boolean;
  forceRefresh?: boolean;
}

/* =========================================================
   CONFIGURACIÓN
   ========================================================= */

const CACHE_TTL = 1000 * 60 * 5;
const CAMPAIGNS_CACHE_KEY = "jung_catalog_campaigns_v2";

/* =========================================================
   CACHE EN MEMORIA
   ========================================================= */

let campaignsMemoryCache: CampaignCacheEntry | null = null;
let pendingCampaignsRequest: Promise<Campaign[]> | null = null;

/* =========================================================
   HELPERS
   ========================================================= */

const now = () => Date.now();

const isFresh = (savedAt: number) => now() - savedAt <= CACHE_TTL;

const sortCampaigns = (items: Campaign[]) =>
  [...items].sort((a, b) => b.priority - a.priority);

/* =========================================================
   FALLBACK DE CAMPAÑAS
   Si Google Sheets falla, el catálogo sigue funcionando.
   ========================================================= */

function getFallbackCampaigns(): Campaign[] {
  return CAMPAIGN_CONFIG.map((campaign) => ({
    id: campaign.id,
    name: campaign.name,
    icon: campaign.icon,

    color: campaign.color,
    colorClass: getCampaignColorClass(campaign.color),

    startDate: "",
    endDate: "",
    priority: campaign.priority,

    publicationStatus: "Publicado",
    computedStatus: "activa",
  }));
}

/* =========================================================
   CACHE LOCAL
   ========================================================= */

function readStoredCampaigns(): Campaign[] | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(CAMPAIGNS_CACHE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as CampaignCacheEntry;

    if (!parsed?.savedAt || !isFresh(parsed.savedAt)) {
      return null;
    }

    if (!Array.isArray(parsed.items)) {
      return null;
    }

    campaignsMemoryCache = parsed;

    return parsed.items;
  } catch {
    return null;
  }
}

function writeCampaignsCache(items: Campaign[]): void {
  const entry: CampaignCacheEntry = {
    savedAt: now(),
    items,
  };

  campaignsMemoryCache = entry;

  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(CAMPAIGNS_CACHE_KEY, JSON.stringify(entry));
  } catch {
    // Si localStorage falla, se conserva el cache en memoria.
  }
}

/* =========================================================
   GOOGLE SHEETS
   ========================================================= */

async function fetchCampaignsFromProvider(): Promise<Campaign[]> {
  const campaigns = await catalogProvider.loadCampaigns();

  return sortCampaigns(campaigns);
}

/* =========================================================
   CARGA INTERNA
   ========================================================= */

async function loadAllCatalogCampaigns(
  options: Pick<LoadCatalogCampaignsOptions, "forceRefresh"> = {},
): Promise<Campaign[]> {
  if (!options.forceRefresh) {
    if (campaignsMemoryCache && isFresh(campaignsMemoryCache.savedAt)) {
      return campaignsMemoryCache.items;
    }

    const storedCampaigns = readStoredCampaigns();

    if (storedCampaigns) {
      return storedCampaigns;
    }
  }

  if (pendingCampaignsRequest) {
    return pendingCampaignsRequest;
  }

  pendingCampaignsRequest = fetchCampaignsFromProvider()
    .then((campaigns) => {
      writeCampaignsCache(campaigns);

      return campaigns;
    })
    .catch((error: unknown) => {
      console.error("Error cargando campañas. Usando fallback:", error);

      const fallbackCampaigns = sortCampaigns(getFallbackCampaigns());

      writeCampaignsCache(fallbackCampaigns);

      return fallbackCampaigns;
    })
    .finally(() => {
      pendingCampaignsRequest = null;
    });

  return pendingCampaignsRequest;
}

/* =========================================================
   API PÚBLICA
   ========================================================= */

export async function loadCatalogCampaigns(
  options: LoadCatalogCampaignsOptions = {},
): Promise<Campaign[]> {
  const campaigns = await loadAllCatalogCampaigns({
    forceRefresh: options.forceRefresh,
  });

  if (options.includeInactive) {
    return campaigns;
  }

  return campaigns.filter(isCampaignActive);
}

export async function getCampaignNameToIdMap() {
  const campaigns = await loadCatalogCampaigns({
    includeInactive: true,
  });

  return buildCampaignNameToIdMap(campaigns);
}
