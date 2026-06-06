import { loadAllProducts } from "@/modules/catalog/services/fetchProducts";
import { exportMetaCsv } from "@/modules/integrations/connectors/meta/exporter";

export const generateMetaFeedFromProducts = async () => {
  const products = await loadAllProducts();
  return exportMetaCsv(products);
};
