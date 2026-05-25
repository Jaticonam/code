import { Search, BookOpen, FlaskConical, TrendingUp, CalendarDays, ShoppingBag } from "lucide-react";

interface Props{
  q:string;
  setQ:(value:string)=>void;
  setCat:(value:string)=>void;
}

const QUICK_LINKS=[
  {href:"#laboratorio",label:"Laboratorio Ideas",icon:FlaskConical},
  {href:"#tendencias",label:"Tendencias",icon:TrendingUp},
  {href:"#campanas",label:"Campañas",icon:CalendarDays},
  {href:"#catalogo-wooly",label:"Catálogo Wooly",icon:ShoppingBag},
];

export default function BlogHero({q,setQ,setCat}:Props){
  return(
    <section className="blog-center-hero">
      <span className="blog-center-kicker">CENTRO DE CRECIMIENTO EMPRESARIAL WOOLY</span>

      <h1>Aprende. Crece. Vende más.</h1>

      <p>
        Guías, ideas, tendencias y oportunidades para emprendedores que quieren comprar mejor,
        vender con más margen y construir negocios sostenibles.
      </p>

      <div className="blog-center-search">
        <Search size={18}/>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar ideas, guías o productos..."/>
      </div>

      <div className="blog-center-links">
        {QUICK_LINKS.map(item=>{
          const Icon=item.icon;
          return(
            <a key={item.href} href={item.href}>
              <Icon size={16}/>
              {item.label}
            </a>
          );
        })}
      </div>
    </section>
  );
}
