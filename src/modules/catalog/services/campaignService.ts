import type {
  Campaign,
} from "@/shared/types/product";

import {
  buildCampaignNameToIdMap,
  filterActiveCampaigns,
  getCampaignComputedStatus,
} from "@/modules/catalog/domain/CampaignRules";
import {
  readStorageEnvelope,
  serializeStorageEnvelope,
} from "@/shared/infrastructure/storage/StorageEnvelope";

import {
  catalogProvider,
} from "@/modules/catalog/providers/DefaultCatalogProvider";
import {
  isCatalogCacheSourceCompatible,
} from "@/modules/catalog/providers/CatalogProvider";

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
const CAMPAIGN_CACHE_SCHEMA_VERSION =
  1;

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

function sanitizeCachedCampaigns(
  value: unknown,
): Campaign[] | null {
  if (!Array.isArray(value)) return null;

  return value.flatMap((item): Campaign[] => {
    if (typeof item !== "object" || item === null) return [];
    const candidate = item as Record<string, unknown>;

    if (
      typeof candidate.id !== "string" ||
      !candidate.id.trim() ||
      typeof candidate.name !== "string" ||
      !candidate.name.trim() ||
      typeof candidate.startDate !== "string" ||
      typeof candidate.endDate !== "string" ||
      typeof candidate.publicationStatus !== "string" ||
      typeof candidate.priority !== "number" ||
      !Number.isFinite(candidate.priority)
    ) return [];

    const campaign = candidate as unknown as Campaign;

    return [{
      ...campaign,
      computedStatus: getCampaignComputedStatus(campaign),
    }];
  });
}

export function readCampaignCachePayload(raw: string | null) {
  return readStorageEnvelope({
    raw,
    schemaVersion: CAMPAIGN_CACHE_SCHEMA_VERSION,
    requireSavedAt: true,
    validateData: sanitizeCachedCampaigns,
    migrateLegacy: (legacy) => {
      if (typeof legacy !== "object" || legacy === null) return null;
      const candidate = legacy as Record<string, unknown>;
      const data = sanitizeCachedCampaigns(candidate.items);

      return data === null
        ? null
        : { data, savedAt: candidate.savedAt as number };
    },
  });
}

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

    const result =
      readCampaignCachePayload(
        raw,
      );

    if (
      !result.success ||
      result.savedAt ===
        undefined ||
      !isFresh(
        result.savedAt,
      )
    ) {
      return null;
    }

    if (
      !isCatalogCacheSourceCompatible(
        result.source,
        catalogProvider.source,
      )
    ) {
      return null;
    }

    campaignsMemoryCache = {
      savedAt:
        result.savedAt,
      items:
        result.data,
    };

    return result.data;
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
      serializeStorageEnvelope({
        schemaVersion:
          CAMPAIGN_CACHE_SCHEMA_VERSION,
        savedAt:
          entry.savedAt,
        data:
          entry.items,
        source:
          catalogProvider.source,
      }),
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

  return filterActiveCampaigns(
    campaigns,
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
