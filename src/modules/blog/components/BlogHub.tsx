import BlogFeatured from "./BlogFeatured";
import BlogGrid from "./BlogGrid";
import { BLOG_CATEGORIES } from "../config/blogCategories";
import { useBlogArticles } from "../hooks/useBlogArticles";
import { useBlogSearch } from "../hooks/useBlogSearch";
import { Search, BookOpen, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function BlogHub(){
  const[q,setQ]=useState("");
  const[cat,setCat]=useState("all");
  const articles=useBlogArticles();
  const items=useBlogSearch(articles,q,cat);
  const [featured,...rest]=items;

  return(
    <div className="blog-hub">
      <aside className="blog-sidebar">
        <div className="blog-brand">WOOLY<span> HUB</span></div>

        <div className="blog-search">
          <Search size={16}/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar..."/>
        </div>

        <nav className="blog-nav">
          <button onClick={()=>setCat("all")} className={cat==="all"?"active":""}><BookOpen size={18}/>Inicio</button>
          {BLOG_CATEGORIES.map(c=>{
            const Icon=c.icon;
            return <button key={c.id} onClick={()=>setCat(c.id)} className={cat===c.id?"active":""}><Icon size={18}/>{c.name}</button>;
          })}
        </nav>

        <a className="blog-sales" href="https://wa.me/51956762686" target="_blank" rel="noreferrer">
          <MessageCircle size={16}/>Ventas
        </a>
      </aside>

      <main className="blog-main">
        <header className="blog-hero">
          <span>Centro Wooly B2B</span>
          <h1>Aprende • Vende más</h1>
          <p>Ideas, estrategias y crecimiento para emprendedores.</p>
        </header>

        {!items.length?(
          <div className="blog-empty">No encontramos artículos para esa búsqueda.</div>
        ):(
          <>
            <BlogFeatured article={featured}/>

            <div className="blog-banner">
              <div>
                <h3>🚀 ¿Listo para abastecerte?</h3>
                <p>Más de 1000 productos para emprendedores.</p>
              </div>
              <Link to="/catalogo" className="blog-banner-btn">Ver catálogo</Link>
            </div>

            <BlogGrid items={rest}/>
          </>
        )}
      </main>
    </div>
  );
}
