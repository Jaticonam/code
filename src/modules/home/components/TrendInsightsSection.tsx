import { TrendingUp, Eye, FlaskConical } from "lucide-react";

import { useProducts } from "@/modules/catalog/hooks/useProducts";
import { useProductViewers } from "@/modules/catalog/hooks/useProductViewers";

export default function TrendInsightsSection(){

 const {data:products=[]}=useProducts();

 const viewers=useProductViewers();

 const categories=
 Object.entries(
  products.reduce((acc,p)=>{
   acc[p.category]=(acc[p.category]||0)+1;
   return acc;
  },{} as Record<string,number>)
 )
 .sort((a,b)=>b[1]-a[1])
 .slice(0,3);

 const featured=
 products
 .slice()
 .sort((a,b)=>b.priority-a.priority)
 .slice(0,1);

 return(

 <section className="trend-insights">

 <div className="trend-header">

 <span>LABORATORIO WOOLY</span>

 <h2>
 Datos reales del mercado Wooly
 </h2>

 <p>
 Tendencias, categorías activas
 y oportunidades para emprender.
 </p>

 </div>

 <div className="trend-grid">

 <article>

 <TrendingUp size={24}/>

 <h3>Categorías creciendo</h3>

 {categories.map(([name,count])=>

 <div key={name}>

 {name}

 <strong>
 {count}
 </strong>

 </div>

 )}

 </article>

 <article>

 <Eye size={24}/>

 <h3>Actividad Wooly</h3>

 <strong>
 👀 {viewers}
 </strong>

 <small>
 interés actual catálogo
 </small>

 </article>

 <article>

 <FlaskConical size={24}/>

 <h3>Laboratorio Wooly</h3>

 {featured.map(p=>

 <div
 key={p.id}
 className="trend-product">

 <img
 src={p.img}
 alt={p.title}
 />

 <div>

 <strong>
 {p.title}
 </strong>

 <small>
 {p.category}
 </small>

 </div>

 </div>

 )}

 </article>

 </div>

 </section>

 );

}
