import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";

import { useProducts } from "@/modules/catalog/hooks/useProducts";

export default function BlogCatalogSection(){

  const {data:products=[],isLoading}=useProducts();

  const catalog=products
    .slice()
    .sort((a,b)=>b.priority-a.priority)
    .slice(0,4);

  if(isLoading){
    return(
      <section className="blog-catalog-section">
        <h2>Cargando catálogo...</h2>
      </section>
    );
  }

  if(!catalog.length)return null;

  return(
    <section className="blog-catalog-section">

      <div className="blog-catalog-head">

        <span>
          <ShoppingBag size={16}/>
          CATÁLOGO WOOLY
        </span>

        <h2>
          Productos para empezar hoy
        </h2>

        <p>
          Descubre productos reales del catálogo Wooly
          para convertir ideas en ventas.
        </p>

      </div>

      <div className="blog-catalog-grid">

        {catalog.map(product=>(

          <Link
            key={product.id}
            to={`/catalogo/producto.html?id=${product.id}&cat=${product.category}`}
            className="blog-catalog-card"
          >

            <img
              src={product.img}
              alt={product.title}
              loading="lazy"
            />

            <small>
              {product.category}
            </small>

            <h3>
              {product.title}
            </h3>

            <strong>
              S/ {product.price_1}
            </strong>

          </Link>

        ))}

      </div>

      <div className="blog-catalog-action">

        <Link to="/catalogo">

          Ver catálogo completo

          <ArrowRight size={18}/>

        </Link>

      </div>

    </section>
  );

}
