import type { WorkflowStep } from "../contracts/WorkflowStep";

export const IntegrationStep: WorkflowStep = {
  key: "integration",
  name: "Ejecutar integración",
  enabled: true,

  async execute(context) {
    context.logs.push("✅ IntegrationStep ejecutado.");
    context.state["integration"] = "completed";
    return context;
  },
};
