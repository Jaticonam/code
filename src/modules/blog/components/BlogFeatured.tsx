import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { BlogArticle } from "../types/blog";

export default function BlogFeatured({article}:{article?:BlogArticle}){
  if(!article) return null;

  return (
    <Link to={`/blog/${article.slug}`} className="blog-featured">
      <div className="blog-featured-img">
        <img src={article.image} alt={article.title}/>
      </div>

      <div className="blog-featured-info">
        <span>Destacado</span>
        <h2>{article.title}</h2>
        <p>{article.excerpt}</p>
        <b>Leer más <ChevronRight size={18}/></b>
      </div>
    </Link>
  );
}
