export interface BusinessTool{
  id:string;
  icon:string;
  title:string;
 description:string;
  status:"Activo"|"Próximamente";
  href:string;
}

export const FALLBACK_BUSINESS_TOOLS:BusinessTool[]=[
{
id:"margin",
icon:"🧮",
title:"Calculadora margen",
description:"Calcula utilidad, margen bruto y rentabilidad.",
status:"Próximamente",
href:"#"
},
{
id:"price",
icon:"💰",
title:"Precio sugerido",
description:"Define precio objetivo según costos.",
status:"Próximamente",
href:"#"
},
{
id:"campaign",
icon:"📅",
title:"Checklist campaña",
description:"Prepara campañas comerciales paso a paso.",
status:"Activo",
href:"/blog"
},
{
id:"inventory",
icon:"📦",
title:"Kit inventario inicial",
description:"Qué comprar primero para empezar.",
status:"Activo",
href:"/blog"
}
];