export async function getCommercialDashboard() {
  const res = await fetch("/api/dashboard/commercial.json");
  if (!res.ok) throw new Error("No se pudo cargar commercial.json");
  return res.json();
}
