import { Link } from "react-router-dom";
import { CalendarDays, Flame, MessageCircle, PlusCircle, ShoppingBag } from "lucide-react";
import type { ReactNode } from "react";

import type { BlogArticle } from "../types/blog";
import { useBlogArticles } from "../hooks/useBlogArticles";
import { useProducts } from "@/modules/catalog/hooks/useProducts";
import { useCart } from "@/modules/cart/store";

import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon,
} from "@/shared/components/ui/SocialIcons";

const CAMPAIGNS=["❤️ San Valentín","🏎️ Hot Wheels","🌷 Día de la Madre"];

const SOCIALS=[
  {label:"WhatsApp",href:"https://wa.me/51956762686",Icon:WhatsAppIcon},
  {label:"Instagram",href:"https://instagram.com/woolyimports",Icon:InstagramIcon},
  {label:"Facebook",href:"#",Icon:FacebookIcon},
  {label:"TikTok",href:"#",Icon:TikTokIcon},
];

export default function BlogArticleSidebar({article}:{article:BlogArticle}){
  const articles=useBlogArticles();
  const {data:products=[]}=useProducts();
  const {addToCart}=useCart();

  const topArticles=articles.filter(a=>a.slug!==article.slug).slice(0,5);
  const topProducts=products.filter(p=>article.relatedProducts?.includes(p.id)).slice(0,3);

  return(
    <aside className="blog-article-sidebar">
      <Card icon={<ShoppingBag size={16}/>} title="Productos oportunidad">
        <div className="blog-side-products">
          {topProducts.map(p=>(
            <div key={p.id} className="blog-side-product-card">
              <Link to={`/catalogo/producto.html?id=${p.id}&cat=${p.category}`} className="blog-side-product-info">
                <img src={p.img} alt={p.title}/>
                <div><small>{p.category}</small><strong>{p.title}</strong><b>S/ {p.price_1}</b></div>
              </Link>

              <button type="button" onClick={()=>addToCart(p,1)}>
                <PlusCircle size={15}/> Agregar
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card icon={<Flame size={16}/>} title="Más leído">
        <div className="blog-side-articles">
          {topArticles.map(a=>(
            <Link key={a.slug} to={`/blog/${a.slug}`} className="blog-side-article">
              <img src={a.image} alt={a.title}/>
              <div><strong>{a.title}</strong><small>{a.readTime} min lectura</small></div>
            </Link>
          ))}
        </div>
      </Card>

      <Card icon={<CalendarDays size={16}/>} title="Próximas campañas">
        <div className="blog-side-campaigns">
          {CAMPAIGNS.map(c=><Link key={c} to="/blog" className="blog-side-campaign">{c}</Link>)}
        </div>
      </Card>

      <Card icon={<MessageCircle size={16}/>} title="Conecta con Wooly">
        <div className="blog-side-socials">
          {SOCIALS.map(({label,href,Icon})=>(
            <a key={label} href={href} target="_blank" rel="noreferrer">
              <Icon width={16} height={16}/>{label}
            </a>
          ))}
        </div>
      </Card>
    </aside>
  );
}

function Card({icon,title,children}:{icon:ReactNode;title:string;children:ReactNode}){
  return <div className="blog-side-card"><h3>{icon}{title}</h3>{children}</div>;
}