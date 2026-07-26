import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useProducts } from "@/modules/catalog/hooks/useProducts";
import type { BlogArticle } from "../../types/blog";

export default function BlogRelatedProducts({
  article,
}: {
  article: BlogArticle;
}) {
  const { data: products = [] } = useProducts();

  const related = products.filter((p) =>
    article.relatedProducts?.includes(p.id),
  );

  if (!related.length) return null;

  return (
    <section className="blog-related-products">
      <div className="blog-related-products-head">
        <span>
          <ShoppingBag size={16} /> Productos mencionados
        </span>
        <p>Insumos reales del catálogo Wooly relacionados con esta guía.</p>
      </div>

      <div className="blog-related-products-grid">
        {related.map((p) => (
          <Link
            key={p.id}
            to={`/catalogo/producto.html?id=${p.id}&cat=${p.category}`}
            className="blog-related-product"
          >
            <img src={p.img || "/placeholder.svg"} alt={p.title} />
            <div>
              <small>
                {p.id} • {p.category}
              </small>
              <h4>{p.title}</h4>
              <b>Ver producto</b>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
