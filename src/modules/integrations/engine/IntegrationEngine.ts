import fs from "node:fs/promises";
import path from "node:path";
import type { IntegrationConnector } from "../types/connector";
import { ConnectorRegistry } from "../registry/ConnectorRegistry";
import { ExportEngine } from "./ExportEngine";
import { ValidationEngine } from "./ValidationEngine";

const stamp = () => new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "Z");

export const IntegrationEngine = {
  async publish<TInput extends { status?: string; id?: string; title?: string }, TOutput>(
    data: TInput[],
    connector: IntegrationConnector<TInput, TOutput>,
    outDir = "public/api/exports"
  ) {
    const report = ValidationEngine.validate(data, connector);
    const invalid = ValidationEngine.getInvalid(report);
    const exportable = ValidationEngine.getValid(report).filter((item) => item.status !== "Oculto");
    const outputFile = await ExportEngine.write(connector, exportable, outDir);

    const generatedAt = new Date().toISOString();
    const version = stamp();
    const status = {
      connector: connector.key,
      name: connector.name,
      status: invalid.length ? "warning" : "ok",
      items_loaded: data.length,
      items_exported: exportable.length,
      items_invalid: invalid.length,
      products_loaded: data.length,
      products_exported: exportable.length,
      products_invalid: invalid.length,
      generated_at: generatedAt,
      version,
      stable_feed: `/api/exports/${connector.outputFile}`,
      cache_buster_url: `/api/exports/${connector.outputFile}?v=${version}`,
    };

    const outputDir = path.resolve(process.cwd(), outDir);
    const statusFile = path.join(outputDir, `${connector.key}-status.json`);
    const globalStatusFile = path.join(outputDir, "status.json");

    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(statusFile, JSON.stringify(status, null, 2), "utf8");
    await fs.writeFile(globalStatusFile, JSON.stringify(status, null, 2), "utf8");

    return { outputFile, statusFile, globalStatusFile, status, invalid };
  },

  async publishAll<TInput extends { status?: string; id?: string; title?: string }>(
    data: TInput[],
    outDir = "public/api/exports"
  ) {
    const connectors = ConnectorRegistry.getAll();
    const results = [];

    for (const connector of connectors) {
      const result = await this.publish(data, connector as IntegrationConnector<TInput, unknown>, outDir);
      results.push(result);
    }

    return results;
  },
};
