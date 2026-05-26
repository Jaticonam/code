export const CAMPAIGN_CONFIG = [
  { id: "san-valentin", name: "San Valentín", icon: "❤️" },
  { id: "escolar", name: "Escolar", icon: "🎒" },
  { id: "dia-mujer", name: "Día Mujer", icon: "🌷" },
  { id: "dia-madre", name: "Día Madre", icon: "💐" },
  { id: "dia-padre", name: "Día Padre", icon: "👔" },
  { id: "graduaciones", name: "Graduaciones", icon: "🎓" },
  { id: "flores-amarillas", name: "Flores Amarillas", icon: "🌻" },
  { id: "hot-wheels", name: "Hot Wheels", icon: "🏎️" },
] as const;

export type CampaignId = (typeof CAMPAIGN_CONFIG)[number]["id"];