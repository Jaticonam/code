import fs from "node:fs/promises";
import path from "node:path";

import { loadAllProducts } from "../../src/modules/catalog/services/fetchProducts";
import { IntegrationEngine } from "../../src/modules/integrations/engine/IntegrationEngine";
import { MetaConnector } from "../../src/modules/integrations/connectors/meta/connector";
import { PublicationEngine, savePublicationHistory } from "../../src/modules/integrations/publication";
import type { PublicationPlan, PublicationExecution, PublicationSnapshot } from "../../src/modules/integrations/publication";
import { getCliArg } from "../utils/cli";

const PLANS_FILE = path.resolve(process.cwd(), "public/config/publication-plans.json");

const stamp = () => new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "-");

const slug = (value: string) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

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

  const publication = plan
    ? PublicationEngine.apply(products, plan)
    : {
        plan: {
          id: "meta-all",
          name: "Meta - Todo el catálogo",
          connector: "meta",
          enabled: true,
          mode: "all" as const,
        },
        totalItems: products.length,
        selectedItems: products.length,
        omittedItems: 0,
        items: products,
        generatedAt: new Date().toISOString(),
      };

  const selectedProducts = publication.items;
  const result = await IntegrationEngine.publish(selectedProducts, MetaConnector);

  const executionId = `pub-${MetaConnector.key}-${slug(publication.plan.id)}-${stamp()}`;

  const execution: PublicationExecution = {
    id: executionId,
    connector: MetaConnector.key,
    planId: publication.plan.id,
    planName: publication.plan.name,
    executedAt: new Date().toISOString(),
    totalItems: products.length,
    selectedItems: selectedProducts.length,
    exportedItems: result.status.items_exported,
    omittedItems: products.length - selectedProducts.length,
    averageScore: undefined,
    status: result.status.items_invalid > 0 ? "warning" : "success",
    outputFile: result.status.stable_feed,
    statusFile: `/api/exports/${MetaConnector.key}-status.json`,
    notes: `Publicación generada desde el plan ${publication.plan.name}.`,
  };

  const snapshot: PublicationSnapshot = {
    executionId,
    connector: MetaConnector.key,
    planId: publication.plan.id,
    productIds: selectedProducts.map((product) => product.id),
    createdAt: new Date().toISOString(),
  };

  const history = await savePublicationHistory(execution, snapshot);

  console.log(`✅ Feed generado: ${result.outputFile}`);
  console.log(`🧾 Status generado: ${result.statusFile}`);
  console.log(`📜 Historial generado: ${history.executionFile}`);
  console.log(`📦 Productos cargados: ${products.length}`);
  console.log(`🟣 Productos seleccionados: ${selectedProducts.length}`);
  console.log(`🟢 Productos exportados: ${result.status.items_exported}`);
  console.log(`⚪ Productos omitidos: ${products.length - selectedProducts.length}`);
  console.log(`🔴 Productos con errores: ${result.status.items_invalid}`);
  console.log(`🔗 Cache buster: https://www.woolyimports.com${result.status.cache_buster_url}`);
  console.log(`📌 Estrategia aplicada: ${publication.plan.name}`);

  result.invalid.slice(0, 20).forEach(({ product, errors }) => {
    console.log(` - ${product.id || "SIN_ID"} | ${product.title || "SIN_TITULO"} → ${errors.join(", ")}`);
  });
}

main().catch((error) => {
  console.error("❌ Error generando feed Meta:", error);
  process.exit(1);
});
