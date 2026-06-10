import type { WorkflowStep } from "../contracts/WorkflowStep";

export const PreviewStep: WorkflowStep = {
  key: "preview",
  name: "Generar vista previa",
  enabled: true,

  async execute(context) {
    context.logs.push("✅ PreviewStep ejecutado.");
    context.state["preview"] = "completed";
    return context;
  },
};
