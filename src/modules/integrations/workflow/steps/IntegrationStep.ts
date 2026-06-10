import { IntegrationEngine } from "../../engine/IntegrationEngine";
import { ConnectorRegistry } from "../../registry/ConnectorRegistry";
import type { WorkflowStep } from "../contracts/WorkflowStep";

export const IntegrationStep: WorkflowStep = {
  key: "integration",
  name: "Ejecutar integración",
  enabled: true,

  async execute(context) {
    const connectorKey = String(context.metadata.connector || "meta");
    const connector = ConnectorRegistry.getByKey(connectorKey);

    if (!connector) {
      throw new Error(`No se encontró el conector: ${connectorKey}`);
    }

    const result = await IntegrationEngine.publish(context.data as any[], connector as any);

    context.state.integration = result;
    context.logs.push(`✅ Feed generado: ${result.outputFile}`);
    context.logs.push(`🧾 Status generado: ${result.statusFile}`);
    context.logs.push(`🟢 Exportados: ${result.status.items_exported}`);

    return context;
  },
};
