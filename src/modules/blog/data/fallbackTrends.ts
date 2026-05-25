export interface HubTrend{
  id:string;
  emoji:string;
  title:string;
  label:string;
  metric:string;
  description:string;
  href:string;
}

export const FALLBACK_TRENDS:HubTrend[]=[
  {
    id:"papel-coreano",
    emoji:"🔥",
    title:"Papel coreano",
    label:"Alta rotación",
    metric:"+25 variantes",
    description:"Ideal para ramos premium, campañas románticas y arreglos con mayor valor visual.",
    href:"/blog/tipos-papel-coreano"
  },
  {
    id:"cajas-premium",
    emoji:"📦",
    title:"Cajas premium",
    label:"Mayor ticket",
    metric:"Percepción alta",
    description:"Perfectas para regalos corporativos, detalles elegantes y presentaciones con más margen.",
    href:"/blog/guia-cajas-premium"
  },
  {
    id:"peluches",
    emoji:"🧸",
    title:"Peluches tendencia",
    label:"Impulso regalo",
    metric:"Compra emocional",
    description:"Funcionan como complemento para elevar el ticket promedio en fechas especiales.",
    href:"/catalogo"
  }
];
