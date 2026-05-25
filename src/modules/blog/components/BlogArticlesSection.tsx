import BlogFeatured from "./BlogFeatured";
import BlogGrid from "./BlogGrid";
import type { BlogArticle } from "../types/blog";
import { BookOpen } from "lucide-react";

export default function BlogArticlesSection({
  featured,
  items,
}:{
  featured?:BlogArticle;
  items:BlogArticle[];
}){
  return(
    <section className="blog-articles-section">
      <div className="blog-articles-head">
        <span>
          <BookOpen size={16}/>
          GUÍAS Y ESTRATEGIAS
        </span>

        <h2>
          Aprende con contenido práctico
        </h2>

        <p>
          Artículos pensados para emprendedores que quieren comprar mejor,
          vender más y tomar mejores decisiones.
        </p>
      </div>

      <BlogFeatured article={featured}/>

      <BlogGrid items={items}/>
    </section>
  );
}
