import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Eye,
  ChevronRight,
  PackageCheck,
  TrendingUp,
  Sparkles,
  Boxes,
} from "lucide-react";

const slides = [
  {
    badge: "Compras mayorista para Emprendedores",
    title: "Compra insumos",
    highlight: "en un solo lugar",
    text: "Abastece tu negocio con Flores, Peluches, Papeles, Cajas y Accesorios listos para vender más rápido.",
    image: "https://woolyimports.com/og/flores.jpg",
    alert: "🔥 Ideal para florerías y tiendas de regalos",
    primaryText: "Ver Catálogo",
    primaryLink: "/catalogo",
    secondaryText: "Cotizar por WhatsApp",
    secondaryLink:
      "https://wa.me/51936188636?text=Hola,%20quiero%20comprar%20insumos%20por%20mayor",
    trust: "Stock por campaña · Precios por caja · Envíos a todo el Perú",
    icon: TrendingUp,
  },
  {
    badge: "Compras por cajón",
    title: "más volumen,",
    highlight: "más margen",
    text: "arma tu caja mayorista combinando productos de alta demanda y mejora tu rentabilidad desde el primer pedido.",
    image: "https://woolyimports.com/og/papeles.jpg",
    alert: "📦 compra inteligente: paquetes, docenas y cajones",
    primaryText: "ver categorías",
    primaryLink: "/catalogo",
    secondaryText: "pedir asesoría",
    secondaryLink:
      "https://wa.me/51936188636?text=Hola,%20quiero%20asesoría%20para%20comprar%20por%20cajón",
    trust: "atención directa · compra guiada · despacho seguro",
    icon: Boxes,
  },
  {
    badge: "campañas y preventas",
    title: "compra antes que",
    highlight: "tu competencia",
    text: "accede a productos para fechas fuertes, campañas comerciales y oportunidades de alta demanda.",
    image: "https://woolyimports.com/og/peluches.jpg",
    alert: "🚀 compra antes, vende primero y no te quedes sin stock",
    primaryText: "ver preventas",
    primaryLink: "https://preventas.woolyimports.com/",
    secondaryText: "hablar con asesora",
    secondaryLink:
      "https://wa.me/51936188636?text=Hola,%20quiero%20información%20sobre%20preventas",
    trust: "campañas · novedades · oportunidades mayoristas",
    icon: Sparkles,
    externalPrimary: true,
  },
];

export default function HeroSlider() {
  const [active, setActive] = useState(0);

  const nextSlide = () => setActive((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setActive((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[active];
  const SlideIcon = slide.icon;

  return (
    <section className="relative min-h-[720px] md:min-h-[calc(100vh-112px)] overflow-hidden bg-slate-950">
      {slides.map((item, index) => (
        <div
          key={item.badge}
          className={`absolute inset-0 transition-all duration-1000 ${
            index === active ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          <img
            src={item.image}
            alt={item.badge}
            className="h-full w-full object-cover"
          />
          </div>
      ))}

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-112px)] max-w-7xl items-end px-5 pb-20 pt-32 md:items-center md:px-6 md:py-14">
        <div
        key={active}
        className="animate-heroCardIn relative max-w-2xl overflow-hidden rounded-[30px] border border-white/60 bg-white/85 p-5 shadow-[0_30px_90px_rgba(15,23,42,0.22)] ring-1 ring-white/30 backdrop-blur-xl md:rounded-[34px] md:p-10"
      >
        {/* brillo superior tipo glass */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/45 via-white/10 to-transparent opacity-70" />

        {/* contenido encima del glass */}
        <div className="relative z-10">
      </div>
      
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#f7b1d6]/40 bg-white/80 px-4 py-2 text-xs font-black tracking-wide text-[#f286be] shadow-sm md:mb-5">
            <SlideIcon size={16} />
            {slide.badge}
          </div>

          <h1 className="mb-4 text-[clamp(2.15rem,10vw,4.8rem)] font-black leading-[0.94] tracking-[-0.045em] text-[#1d8299] md:mb-5">
            {slide.title}
            <span className="block text-[#f286be]">{slide.highlight}</span>
          </h1>

          <p className="mb-4 max-w-xl text-sm font-semibold leading-relaxed text-slate-700 md:mb-5 md:text-lg">
            {slide.text}
          </p>

          <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm font-bold text-slate-800 shadow-sm md:mb-6">
            {slide.alert}
          </div>

          <div className="mb-5 grid grid-cols-3 gap-3 rounded-3xl border border-white/80 bg-white/60 p-4 md:mb-6">
            <MiniStep icon={Eye} title="explora" text="elige rápido" />
            <MiniStep icon={ShoppingBag} title="cotiza" text="arma tu caja" />
            <MiniStep icon={Truck} title="recibe" text="en tu ciudad" />
          </div>

          <div className="mb-5 flex flex-col gap-3 sm:flex-row">
            {slide.externalPrimary ? (
              <a
                href={slide.primaryLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#1d8299] px-6 py-4 text-sm font-black text-white shadow-[0_16px_32px_rgba(29,130,153,0.28)] transition-all hover:-translate-y-1 hover:bg-[#156f84]"
              >
                <PackageCheck size={19} />
                {slide.primaryText}
                <ChevronRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
            ) : (
              <Link
                to={slide.primaryLink}
                className="group inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#1d8299] px-6 py-4 text-sm font-black text-white shadow-[0_16px_32px_rgba(29,130,153,0.28)] transition-all hover:-translate-y-1 hover:bg-[#156f84]"
              >
                <PackageCheck size={19} />
                {slide.primaryText}
                <ChevronRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            )}

            <a
              href={slide.secondaryLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-6 py-4 text-sm font-black text-white shadow-[0_16px_32px_rgba(37,211,102,0.25)] transition-all hover:-translate-y-1 hover:bg-[#1EAD54]"
            >
              <MessageCircle size={19} />
              {slide.secondaryText}
            </a>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <ShieldCheck size={16} className="shrink-0 text-[#1d8299]" />
            <span>{slide.trust}</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/80 bg-white/80 px-4 py-3 shadow-lg backdrop-blur-xl md:bottom-6 md:left-auto md:right-8 md:translate-x-0">
        <button
          type="button"
          onClick={prevSlide}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#1d8299] transition hover:bg-[#1d8299] hover:text-white"
          aria-label="slide anterior"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActive(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === active
                  ? "w-8 bg-[#1d8299]"
                  : "w-2.5 bg-slate-400/50 hover:bg-[#f286be]"
              }`}
              aria-label={`ir al slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#1d8299] transition hover:bg-[#1d8299] hover:text-white"
          aria-label="slide siguiente"
        >
          <ArrowRight size={18} />
        </button>
      </div>

      <style>{`
        @keyframes heroCardIn {
          0% {
            opacity: 0;
            transform: translateY(26px) scale(0.98);
          }
          42% {
            opacity: 0;
            transform: translateY(26px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-heroCardIn {
          animation: heroCardIn 2.2s ease-out both;
        }

        @media (max-width: 768px) {
          .animate-heroCardIn {
            animation-duration: 2.8s;
          }
        }
      `}</style>
    </section>
  );
}

function MiniStep({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
}) {
  return (
    <div className="text-center">
      <Icon className="mx-auto mb-2 h-5 w-5 text-[#1d8299]" />
      <p className="text-[11px] font-black text-slate-900">{title}</p>
      <p className="hidden text-[11px] font-semibold text-slate-500 sm:block">
        {text}
      </p>
    </div>
  );
}