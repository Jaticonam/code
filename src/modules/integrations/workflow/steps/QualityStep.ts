import type { WorkflowStep } from "../contracts/WorkflowStep";

export const QualityStep: WorkflowStep = {
  key: "quality",
  name: "Evaluar calidad",
  enabled: true,

  async execute(context) {
    context.logs.push("✅ QualityStep ejecutado.");
    context.state["quality"] = "completed";
    return context;
  },
};
