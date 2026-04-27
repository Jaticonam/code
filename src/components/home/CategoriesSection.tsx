import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Tags } from "lucide-react";
import HomeSectionHeader from "./HomeSectionHeader";

const categories = [
  { name: "Flores & Rosas", tag: "Detalles especiales", slug: "flores", image: "https://woolyimports.com/og/flores.jpg" },
  { name: "Peluches", tag: "Suaves y tiernos", slug: "peluches", image: "https://woolyimports.com/og/peluches.jpg" },
  { name: "Papel Coreano", tag: "Envolturas premium", slug: "papeles", image: "https://woolyimports.com/og/papeles.jpg" },
  { name: "Cajas & Bolsas", tag: "Empaques perfectos", slug: "cajas", image: "https://woolyimports.com/og/cajas.jpg" },
  { name: "Cintas & Deco", tag: "Toques finales", slug: "cintas", image: "https://woolyimports.com/og/cintas.jpg" },
  { name: "Globos", tag: "Celebraciones", slug: "globos", image: "https://woolyimports.com/og/globos.jpg" },
  { name: "Herramientas", tag: "Para crear", slug: "accesorios", image: "https://woolyimports.com/og/accesorios.jpg" },
  { name: "Hot Wheels", tag: "Coleccionables", slug: "hotwheels", image: "https://woolyimports.com/og/hotwheels.jpg" },
];

const loopCategories = [...categories, ...categories];

export default function CategoriesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;
    const intervalSpeed = isMobile ? 18 : 10;
    const scrollStep = isMobile ? 2 : 3;

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
    <section className="home-container pt-10 pb-4 md:pt-12 md:pb-0">
      <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <HomeSectionHeader
          icon={Tags}
          kicker="Categorías que venden"
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
        className="flex gap-5 overflow-x-auto scroll-smooth pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-6"
      >
        {loopCategories.map((cat, index) => (
          <Link
            key={`${cat.slug}-${index}`}
            to={`/catalogo/categoria.html?cat=${cat.slug}`}
            className="group relative h-[360px] min-w-[260px] flex-shrink-0 overflow-hidden rounded-[26px] bg-slate-200 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl md:h-[430px] md:min-w-[340px] md:rounded-[30px]"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            <div className="absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-7">
              <span className="mb-2 block text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#f7b1d6] drop-shadow-md md:text-xs">
                {cat.tag}
              </span>

              <div className="flex items-end justify-between gap-4">
                <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow-md md:text-3xl">
                  {cat.name}
                </h3>

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-[#1d8299] md:h-12 md:w-12">
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