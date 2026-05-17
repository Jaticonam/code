import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Tags } from "lucide-react";
import HomeSectionHeader from "./HomeSectionHeader";

const categories = [
  { 
    name: "Flores & Rosas", 
    tag: "Alta demanda",
    description: "Ideales para ramos, campañas y ventas rápidas",
    slug: "flores", 
    image: "https://woolyimports.com/og/flores.jpg",
    priority: 100
  },
  { 
    name: "Peluches", 
    tag: "Sube ticket",
    description: "Perfectos para aumentar el valor del pedido",
    slug: "peluches", 
    image: "https://woolyimports.com/og/peluches.jpg",
    priority: 90
  },
  { 
    name: "Papel Coreano", 
    tag: "Acabado premium",
    description: "Eleva la presentación de cualquier detalle",
    slug: "papeles", 
    image: "https://woolyimports.com/og/papeles.jpg",
    priority: 85
  },
  { 
    name: "Cajas & Bolsas", 
    tag: "Empaque listo",
    description: "Solución directa para empaquetar y vender",
    slug: "cajas", 
    image: "https://woolyimports.com/og/cajas.jpg",
    priority: 95
  },
  { 
    name: "Cintas & Deco", 
    tag: "Detalle clave",
    description: "El toque final que hace destacar el producto",
    slug: "cintas", 
    image: "https://woolyimports.com/og/cintas.jpg",
    priority: 80
  },
  { 
    name: "Globos", 
    tag: "Venta rápida",
    description: "Alta rotación en fechas y campañas",
    slug: "globos", 
    image: "https://woolyimports.com/og/globos.jpg",
    priority: 88
  },
  { 
    name: "Accesorios", 
    tag: "Producción total",
    description: "Complementos para armar pedidos completos",
    slug: "accesorios", 
    image: "https://woolyimports.com/og/accesorios.jpg",
    priority: 75
  },
  { 
    name: "Hot Wheels", 
    tag: "Alta rotación",
    description: "Producto coleccionable con alta demanda",
    slug: "hotwheels", 
    image: "https://woolyimports.com/og/hotwheels.jpg",
    priority: 92
  },
];

const loopCategories = [...categories, ...categories];

export default function CategoriesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    // 🔒 En móvil desactivamos auto-scroll
    if (isMobile) return;

    const intervalSpeed = 16;
    const scrollStep = 1;

    const interval = window.setInterval(() => {
      if (isPaused.current) return;

      container.scrollLeft += scrollStep;

      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      }
    }, intervalSpeed);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="home-container home-categories-section">

      <div className="home-categories-header">
        <HomeSectionHeader
          icon={Tags}
          kicker="Categorías más vendidas"
          title="Elige productos que ya tienen salida"
          description="Arma tu pedido por categorías, combina productos estratégicamente y compra más rápido sin perder margen."
        />
      </div>

      <div
        ref={scrollRef}
        onMouseEnter={() => (isPaused.current = true)}
        onMouseLeave={() => (isPaused.current = false)}
        onTouchStart={() => (isPaused.current = true)}
        onTouchEnd={() => (isPaused.current = false)}
        className="home-categories-track scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {loopCategories.map((cat, index) => (
          <Link
            key={`${cat.slug}-${index}`}
            to={`/catalogo/categoria.html?cat=${cat.slug}`}
            className="home-category-card group bg-slate-200 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] hover:ring-2 hover:ring-[#1d8299]/40"
          >
            {/* Imagen */}
            <img
              src={cat.image}
              alt={cat.name}
              className="home-category-image transition-transform duration-700 group-hover:scale-110"
            />

            {/* Overlay */}
            <div className="home-category-overlay" />

            {/* Contenido inferior (CLAVE para que no se suba) */}
            <div className="home-category-content">

              {/* Tag */}
              <span className="home-category-tag drop-shadow-md">
                🔥 {cat.tag}
              </span>

              {/* Texto + flecha */}
              <div className="flex items-end justify-between gap-4">

                {/* Texto */}
                <div className="flex max-w-[78%] flex-col gap-1">
                  <h3 className="home-category-title drop-shadow-md">
                    {cat.name}
                  </h3>

                  <p className="line-clamp-2 text-sm font-medium leading-snug text-white/85 drop-shadow-md md:text-[15px]">
                    {cat.description}
                  </p>
                </div>

                {/* Flecha */}
                <span className="home-category-arrow mb-1 backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-[#1d8299]">
                  <ArrowRight size={18} />
                </span>

              </div>
            </div>

          </Link>
        ))}
      </div>

    </section>
  );
}
