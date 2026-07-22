import type {
  Campaign,
} from "@/shared/types/product";

import {
  buildCampaignNameToIdMap,
  isCampaignActive,
} from "@/modules/catalog/domain/CampaignRules";

import {
  catalogProvider,
} from "@/modules/catalog/providers/DefaultCatalogProvider";

/* =========================================================
   TIPOS
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

const CACHE_TTL =
  1000 * 60 * 5;

const CAMPAIGNS_CACHE_KEY =
  "jung_catalog_campaigns_v3";

/* =========================================================
   CACHE EN MEMORIA
   ========================================================= */

let campaignsMemoryCache:
  CampaignCacheEntry | null =
    null;

let pendingCampaignsRequest:
  Promise<Campaign[]> | null =
    null;

const now = () =>
  Date.now();

const isFresh = (
  savedAt: number,
): boolean =>
  now() - savedAt <=
  CACHE_TTL;

const sortCampaigns = (
  campaigns: Campaign[],
): Campaign[] =>
  [...campaigns].sort(
    (a, b) =>
      b.priority -
      a.priority,
  );

/* =========================================================
   CACHE LOCAL
   ========================================================= */

function readStoredCampaigns():
  Campaign[] | null {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  try {
    const raw =
      localStorage.getItem(
        CAMPAIGNS_CACHE_KEY,
      );

    if (!raw) {
      return null;
    }

    const parsed =
      JSON.parse(
        raw,
      ) as CampaignCacheEntry;

    if (
      !parsed?.savedAt ||
      !isFresh(
        parsed.savedAt,
      )
    ) {
      return null;
    }

    if (
      !Array.isArray(
        parsed.items,
      )
    ) {
      return null;
    }

    campaignsMemoryCache =
      parsed;

    return parsed.items;
  } catch {
    return null;
  }
}

function writeCampaignsCache(
  campaigns: Campaign[],
): void {
  const entry:
    CampaignCacheEntry = {
      savedAt: now(),
      items: campaigns,
    };

  campaignsMemoryCache =
    entry;

  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  try {
    localStorage.setItem(
      CAMPAIGNS_CACHE_KEY,
      JSON.stringify(entry),
    );
  } catch {
    // El cache en memoria continúa disponible.
  }
}

/* =========================================================
   FUENTE OFICIAL
   ========================================================= */

async function fetchCampaignsFromProvider():
  Promise<Campaign[]> {
  const campaigns =
    await catalogProvider
      .loadCampaigns();

  return sortCampaigns(
    campaigns,
  );
}

/* =========================================================
   CARGA INTERNA
   ========================================================= */

async function loadAllCatalogCampaigns(
  options: Pick<
    LoadCatalogCampaignsOptions,
    "forceRefresh"
  > = {},
): Promise<Campaign[]> {
  if (
    !options.forceRefresh
  ) {
    if (
      campaignsMemoryCache &&
      isFresh(
        campaignsMemoryCache.savedAt,
      )
    ) {
      return campaignsMemoryCache.items;
    }

    const storedCampaigns =
      readStoredCampaigns();

    if (storedCampaigns) {
      return storedCampaigns;
    }
  }

  if (
    pendingCampaignsRequest
  ) {
    return pendingCampaignsRequest;
  }

  pendingCampaignsRequest =
    fetchCampaignsFromProvider()
      .then((campaigns) => {
        writeCampaignsCache(
          campaigns,
        );

        return campaigns;
      })
      .catch(
        (error: unknown) => {
          console.error(
            "No se pudieron cargar las campañas oficiales de Google Sheets:",
            error,
          );

          /**
           * No se inventan campañas.
           * Si la fuente falla, se devuelve un registro vacío.
           */
          const emptyCampaigns:
            Campaign[] = [];

          writeCampaignsCache(
            emptyCampaigns,
          );

          return emptyCampaigns;
        },
      )
      .finally(() => {
        pendingCampaignsRequest =
          null;
      });

  return pendingCampaignsRequest;
}

/* =========================================================
   API PÚBLICA
   ========================================================= */

export async function loadCatalogCampaigns(
  options:
    LoadCatalogCampaignsOptions = {},
): Promise<Campaign[]> {
  const campaigns =
    await loadAllCatalogCampaigns({
      forceRefresh:
        options.forceRefresh,
    });

  if (
    options.includeInactive
  ) {
    return campaigns;
  }

  return campaigns.filter(
    isCampaignActive,
  );
}

export async function getCampaignNameToIdMap() {
  const campaigns =
    await loadCatalogCampaigns({
      includeInactive: true,
    });

  return buildCampaignNameToIdMap(
    campaigns,
  );
}
