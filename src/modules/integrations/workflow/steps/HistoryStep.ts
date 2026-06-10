import type { WorkflowStep } from "../contracts/WorkflowStep";

export const HistoryStep: WorkflowStep = {
  key: "history",
  name: "Guardar historial",
  enabled: true,

  async execute(context) {
    context.logs.push("✅ HistoryStep ejecutado.");
    context.state["history"] = "completed";
    return context;
  },
};
