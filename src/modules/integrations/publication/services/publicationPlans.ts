import type { PublicationPlan } from "../models";

export async function loadPublicationPlans(): Promise<PublicationPlan[]> {
  const res = await fetch("/config/publication-plans.json");
  if (!res.ok) throw new Error("No se pudieron cargar los planes de publicación.");
  return res.json();
}

export async function loadPublicationPlan(planId: string): Promise<PublicationPlan> {
  const plans = await loadPublicationPlans();
  const plan = plans.find((item) => item.id === planId);
  if (!plan) throw new Error(`No se encontró el plan de publicación: ${planId}`);
  return plan;
}
