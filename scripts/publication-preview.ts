import fs from "node:fs/promises";
import path from "node:path";

import { loadAllProducts } from "../src/modules/catalog/services/fetchProducts";
import { PublicationEngine } from "../src/modules/integrations/publication";
import type { PublicationPlan } from "../src/modules/integrations/publication";
import { getCliArg } from "./utils/cli";

const PLANS_FILE = path.resolve(process.cwd(), "public/config/publication-plans.json");
const OUT_DIR = path.resolve(process.cwd(), "public/api/previews");
const OUT_FILE = path.join(OUT_DIR, "publication-preview.json");

async function loadPlan(planId: string): Promise<PublicationPlan> {
  const raw = await fs.readFile(PLANS_FILE, "utf8");
  const plans = JSON.parse(raw) as PublicationPlan[];
  const plan = plans.find((item) => item.id === planId);
  if (!plan) throw new Error(`No se encontró el plan: ${planId}`);
  return plan;
}

async function main() {
  const planId = getCliArg("plan", "meta-all");

  console.log("👀 Generando vista previa de publicación...");
  console.log(`📋 Plan: ${planId}`);

  const products = await loadAllProducts();
  const plan = await loadPlan(planId);
  const preview = PublicationEngine.apply(products, plan);

  const data = {
    plan: {
      id: preview.plan.id,
      name: preview.plan.name,
      connector: preview.plan.connector,
      mode: preview.plan.mode,
    },
    totalItems: preview.totalItems,
    selectedItems: preview.selectedItems,
    omittedItems: preview.omittedItems,
    generatedAt: preview.generatedAt,
    items: preview.items.map((product) => ({
      id: product.id,
      title: product.title,
      category: product.category,
      status: product.status,
      stock: product.stock,
      priority: product.priority,
      price: product.price_offer || product.price_1,
    })),
  };

  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(OUT_FILE, JSON.stringify(data, null, 2), "utf8");

  console.log(`✅ Preview generado: ${OUT_FILE}`);
  console.log(`📦 Total catálogo: ${preview.totalItems}`);
  console.log(`🟣 Seleccionados: ${preview.selectedItems}`);
  console.log(`⚪ Omitidos: ${preview.omittedItems}`);
}

main().catch((error) => {
  console.error("❌ Error generando preview:", error);
  process.exit(1);
});
