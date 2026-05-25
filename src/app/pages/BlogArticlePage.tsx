import "@/shared/styles/blog/blog-article.css";

import { useBlogArticles } from "@/modules/blog/hooks/useBlogArticles";

import BlogRelatedArticles from "@/modules/blog/components/BlogRelatedArticles";
import BlogRelatedProducts from "@/modules/blog/components/BlogRelatedProducts";
import BlogArticleCTA from "@/modules/blog/components/BlogArticleCTA";
import BlogBlockRenderer from "@/modules/blog/components/BlogBlockRenderer";
import BlogFAQ from "@/modules/blog/components/BlogFAQ";
import BlogTOC from "@/modules/blog/components/BlogTOC";

import { useBlogSeo } from "@/modules/blog/hooks/useBlogSeo";
import { useFaqSchema } from "@/modules/blog/hooks/useFaqSchema";
import { useBreadcrumbSchema } from "@/modules/blog/hooks/useBreadcrumbSchema";

import { ArrowLeft, Clock, MessageCircle, BookOpen } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function BlogArticlePage(){
  const { slug }=useParams();
  const articles=useBlogArticles();
  const article=articles.find(a=>a.slug===slug);

  if(!article) return (
    <main className="min-h-screen grid place-items-center px-4 text-center">
      <div>
        <h1 className="text-3xl font-black">Artículo no encontrado</h1>
        <Link to="/blog" className="mt-4 inline-flex text-primary font-bold">Volver al Hub</Link>
      </div>
    </main>
  );

  useBlogSeo({title:article.title,description:article.excerpt,image:article.image,slug:article.slug});
  useFaqSchema(article.faq);
  useBreadcrumbSchema(article.title,article.slug);

  return (
    <main className="blog-article-page">
      <article className="blog-article">
        <Link to="/blog" className="blog-back"><ArrowLeft size={16}/> Volver al Hub</Link>

        <nav className="blog-breadcrumb">
          <Link to="/">Inicio</Link>
          <span>/</span>
          <Link to="/blog">Blog</Link>
          <span>/</span>
          <b>{article.title}</b>
        </nav>

        <header className="blog-article-header">
          <span className="blog-pill"><BookOpen size={14}/>{article.category}</span>
          <h1>{article.title}</h1>
          <p>{article.excerpt}</p>

          <div className="blog-article-meta">
            <span><Clock size={14}/>{article.readTime} min lectura</span>
            <span>{article.published}</span>
          </div>
        </header>

        <img className="blog-article-cover" src={article.image} alt={article.title}/>

        <BlogTOC sections={article.content}/>

        <section className="blog-article-content">
          <BlogBlockRenderer sections={article.content}/>
          <BlogArticleCTA article={article}/>
        </section>

        <BlogRelatedProducts article={article}/>

        <BlogFAQ article={article}/>

        <BlogRelatedArticles article={article}/>

        <div className="blog-article-cta">
          <div>
            <h3>¿Listo para abastecerte?</h3>
            <p>Cotiza insumos mayoristas para tu negocio.</p>
          </div>

          <a href="https://wa.me/51956762686" target="_blank" rel="noreferrer">
            <MessageCircle size={18}/> Cotizar por WhatsApp
          </a>
        </div>
      </article>
    </main>
  );
}
