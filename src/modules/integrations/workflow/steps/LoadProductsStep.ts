import type { WorkflowStep } from "../contracts/WorkflowStep";

export const LoadProductsStep: WorkflowStep = {
  key: "load-products",
  name: "Cargar productos",
  enabled: true,

  async execute(context) {
    context.logs.push("✅ LoadProductsStep ejecutado.");
    context.state["load-products"] = "completed";
    return context;
  },
};
