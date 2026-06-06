import fs from "node:fs/promises";
import path from "node:path";

import { loadAllProducts } from "../src/modules/catalog/services/fetchProducts";
import { exportMetaCsv, getMetaValidationReport } from "../src/modules/integrations/connectors/meta/exporter";

const OUT_DIR = path.resolve(process.cwd(), "public/api/exports");
const OUT_FILE = path.join(OUT_DIR, "meta.csv");

async function main() {
  console.log("🚀 Generando feed Meta desde Google Sheets...");

  const products = await loadAllProducts();
  const report = getMetaValidationReport(products);
  const invalid = report.filter((item) => item.errors.length > 0);
  const exportable = report.filter((item) => item.errors.length === 0 && item.product.status !== "Oculto");
  const csv = exportMetaCsv(products);

  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(OUT_FILE, csv, "utf8");

  console.log(`✅ Feed generado: ${OUT_FILE}`);
  console.log(`📦 Productos cargados: ${products.length}`);
  console.log(`🟢 Productos exportados: ${exportable.length}`);
  console.log(`⚪ Productos omitidos: ${products.length - exportable.length}`);
  console.log(`🔴 Productos con errores: ${invalid.length}`);

  invalid.slice(0, 20).forEach(({ product, errors }) => {
    console.log(` - ${product.id || "SIN_ID"} | ${product.title || "SIN_TITULO"} → ${errors.join(", ")}`);
  });
}

main().catch((error) => {
  console.error("❌ Error generando feed Meta:", error);
  process.exit(1);
});
