export interface HubOpportunity{
  id:string;
  emoji:string;
  title:string;
  subtitle:string;
  action:string;
  href:string;
  metrics:{label:string;score:number;}[];
}

export const FALLBACK_OPPORTUNITIES:HubOpportunity[]=[
  {
    id:"dia-madre-premium",
    emoji:"🌷",
    title:"Día de la Madre Premium",
    subtitle:"Alta oportunidad para arreglos, cajas y regalos emocionales.",
    action:"Abastecer stock 7 días antes y preparar combos por ticket.",
    href:"/catalogo",
    metrics:[
      {label:"Flores premium",score:92},
      {label:"Papel coreano",score:84},
      {label:"Cajas premium",score:78}
    ]
  },
  {
    id:"san-valentin-regalos",
    emoji:"❤️",
    title:"Regalos románticos",
    subtitle:"Campaña fuerte para peluches, papeles decorativos y empaques premium.",
    action:"Armar combos listos: detalle básico, premium y full sorpresa.",
    href:"/blog/tipos-papel-coreano",
    metrics:[
      {label:"Peluches",score:88},
      {label:"Papel coreano",score:82},
      {label:"Cintas",score:70}
    ]
  },
  {
    id:"hotwheels-coleccion",
    emoji:"🏎️",
    title:"Hot Wheels coleccionable",
    subtitle:"Nicho con compra impulsiva, regalos temáticos y rotación por modelos.",
    action:"Crear packs por colección, regalo infantil y edición especial.",
    href:"/catalogo",
    metrics:[
      {label:"Coleccionables",score:86},
      {label:"Cajas regalo",score:64},
      {label:"Empaque premium",score:58}
    ]
  }
];
