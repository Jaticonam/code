import { useEffect, useState } from "react";
import type { Campaign } from "@/shared/types/product";
import { loadCatalogCampaigns } from "@/modules/catalog/services/productService";

export function useCatalogCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setIsLoading(true);

      try {
        const result = await loadCatalogCampaigns();

        if (!cancelled) {
          setCampaigns(result);
        }
      } catch (error) {
        console.error("Error cargando campañas:", error);

        if (!cancelled) {
          setCampaigns([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    campaigns,
    isLoading,
  };
}
