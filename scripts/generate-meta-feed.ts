import { loadAllProducts } from "../src/modules/catalog/services/fetchProducts";
import { CatalogEngine } from "../src/modules/integrations/engine/CatalogEngine";
import { MetaConnector } from "../src/modules/integrations/connectors/meta/connector";

async function main() {
  console.log("🚀 Generando feed Meta desde catálogo...");

  const products = await loadAllProducts();
  const result = await CatalogEngine.publish(products, MetaConnector);

  console.log(`✅ Feed generado: ${result.outputFile}`);
  console.log(`🧾 Status generado: ${result.statusFile}`);
  console.log(`📦 Productos cargados: ${result.status.products_loaded}`);
  console.log(`🟢 Productos exportados: ${result.status.products_exported}`);
  console.log(`⚪ Productos omitidos: ${result.status.products_loaded - result.status.products_exported}`);
  console.log(`🔴 Productos con errores: ${result.status.products_invalid}`);
  console.log(`🔗 Cache buster: https://www.woolyimports.com${result.status.cache_buster_url}`);

  result.invalid.slice(0, 20).forEach(({ product, errors }) => {
    console.log(` - ${product.id || "SIN_ID"} | ${product.title || "SIN_TITULO"} → ${errors.join(", ")}`);
  });
}

main().catch((error) => {
  console.error("❌ Error generando feed Meta:", error);
  process.exit(1);
});
