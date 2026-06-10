import type { WorkflowStep } from "../contracts/WorkflowStep";

export const PublicationStep: WorkflowStep = {
  key: "publication",
  name: "Aplicar plan de publicación",
  enabled: true,

  async execute(context) {
    context.logs.push("✅ PublicationStep ejecutado.");
    context.state["publication"] = "completed";
    return context;
  },
};
