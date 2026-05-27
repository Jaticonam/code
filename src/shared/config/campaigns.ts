export const CAMPAIGN_CONFIG = [
  { id: "san-valentin", name: "San Valentín", icon: "❤️" },
  { id: "escolar", name: "Vuelta a Clases", icon: "🎒" },
  { id: "dia-mujer", name: "Día de la Mujer", icon: "🌷" },
  { id: "dia-madre", name: "Día de la Madre", icon: "💐" },
  { id: "dia-padre", name: "Día del Padre", icon: "👔" },
  { id: "graduaciones", name: "Graduaciones", icon: "🎓" },
  { id: "flores-amarillas", name: "Flores Amarillas", icon: "🌻" },
  { id: "hot-wheels", name: "Hot Wheels", icon: "🏎️" },
] as const;

export type CampaignId = (typeof CAMPAIGN_CONFIG)[number]["id"];