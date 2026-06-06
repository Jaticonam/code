import fs from "node:fs/promises";
import path from "node:path";
import type { CatalogConnector } from "../types/connector";
import { ExportEngine } from "./ExportEngine";
import { ValidationEngine } from "./ValidationEngine";

const stamp = () => new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "Z");

export const CatalogEngine = {
  async publish<TProduct extends { status?: string; id?: string; title?: string }, TMapped>(
    products: TProduct[],
    connector: CatalogConnector<TProduct, TMapped>,
    outDir = "public/api/exports"
  ) {
    const report = ValidationEngine.validate(products, connector);
    const invalid = ValidationEngine.getInvalid(report);
    const exportable = ValidationEngine.getValid(report).filter((p) => p.status !== "Oculto");
    const outputFile = await ExportEngine.write(connector, exportable, outDir);

    const generatedAt = new Date().toISOString();
    const version = stamp();
    const status = {
      connector: connector.key,
      name: connector.name,
      status: invalid.length ? "warning" : "ok",
      products_loaded: products.length,
      products_exported: exportable.length,
      products_invalid: invalid.length,
      generated_at: generatedAt,
      version,
      stable_feed: `/api/exports/${connector.outputFile}`,
      cache_buster_url: `/api/exports/${connector.outputFile}?v=${version}`,
    };

    const statusFile = path.resolve(process.cwd(), outDir, `${connector.key}-status.json`);
    const globalStatusFile = path.resolve(process.cwd(), outDir, "status.json");

    await fs.writeFile(statusFile, JSON.stringify(status, null, 2), "utf8");
    await fs.writeFile(globalStatusFile, JSON.stringify(status, null, 2), "utf8");

    return { outputFile, statusFile, globalStatusFile, status, invalid };
  },
};
