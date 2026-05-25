export interface HubCampaign{
 id:string;
 emoji:string;
 title:string;
 season:string;
 description:string;
 checklist:string[];
 href:string;
}

export const FALLBACK_CAMPAIGNS:HubCampaign[]=[
 {
  id:"san-valentin",
  emoji:"❤️",
  title:"San Valentín",
  season:"Alta demanda emocional",
  description:"La campaña más fuerte para flores, peluches, papel coreano y regalos premium.",
  checklist:[
   "Papel coreano",
   "Peluches",
   "Cajas premium",
   "Cintas"
  ],
  href:"/catalogo"
 },

 {
  id:"hotwheels",
  emoji:"🏎️",
  title:"Hot Wheels",
  season:"Coleccionismo y regalo",
  description:"Productos coleccionables con alto impulso de compra y oportunidad para campañas temáticas.",
  checklist:[
   "Hot Wheels",
   "Cajas regalo",
   "Complementos",
  ],
  href:"/catalogo"
 },

 {
  id:"dia-madre",
  emoji:"🌷",
  title:"Día de la Madre",
  season:"Temporada principal",
  description:"Una de las campañas más potentes para arreglos, detalles personalizados y regalos emocionales.",
  checklist:[
   "Flores",
   "Peluches",
   "Papel coreano",
   "Globos"
  ],
  href:"/catalogo"
 }
];