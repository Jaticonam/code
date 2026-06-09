import fs from "node:fs/promises";
import path from "node:path";

import { loadAllProducts } from "../../src/modules/catalog/services/fetchProducts";
import { IntegrationEngine } from "../../src/modules/integrations/engine/IntegrationEngine";
import { MetaConnector } from "../../src/modules/integrations/connectors/meta/connector";
import { PublicationEngine } from "../../src/modules/integrations/publication";
import type { PublicationPlan } from "../../src/modules/integrations/publication";
import { getCliArg } from "../utils/cli";

const PLANS_FILE = path.resolve(process.cwd(), "public/config/publication-plans.json");

async function loadPlan(planId: string): Promise<PublicationPlan | null> {
  if (!planId) return null;
  const raw = await fs.readFile(PLANS_FILE, "utf8");
  const plans = JSON.parse(raw) as PublicationPlan[];
  return plans.find((plan) => plan.id === planId) || null;
}

async function main() {
  const planId = getCliArg("plan", "meta-all");

  console.log("🚀 Generando feed Meta desde catálogo...");
  console.log(`📋 Plan: ${planId}`);

  const products = await loadAllProducts();
  const plan = await loadPlan(planId);

  const selectedProducts = plan
    ? PublicationEngine.apply(products, plan).items
    : products;

  const result = await IntegrationEngine.publish(selectedProducts, MetaConnector);

  console.log(`✅ Feed generado: ${result.outputFile}`);
  console.log(`🧾 Status generado: ${result.statusFile}`);
  console.log(`📦 Productos cargados: ${products.length}`);
  console.log(`🟣 Productos seleccionados: ${selectedProducts.length}`);
  console.log(`🟢 Productos exportados: ${result.status.items_exported}`);
  console.log(`⚪ Productos omitidos: ${products.length - selectedProducts.length}`);
  console.log(`🔴 Productos con errores: ${result.status.items_invalid}`);
  console.log(`🔗 Cache buster: https://www.woolyimports.com${result.status.cache_buster_url}`);

  if (plan) {
    console.log(`📌 Estrategia aplicada: ${plan.name}`);
  }

  result.invalid.slice(0, 20).forEach(({ product, errors }) => {
    console.log(` - ${product.id || "SIN_ID"} | ${product.title || "SIN_TITULO"} → ${errors.join(", ")}`);
  });
}

main().catch((error) => {
  console.error("❌ Error generando feed Meta:", error);
  process.exit(1);
});
