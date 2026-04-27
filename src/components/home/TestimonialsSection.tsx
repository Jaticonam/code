import { Quote, Star, Store, MapPin } from "lucide-react";
import HomeSectionHeader from "./HomeSectionHeader";

const testimonials = [
  {
    number: "1",
    label: "verificado",
    business: "detalles maría",
    city: "arequipa",
    product: "cajas y papel coreano",
    text: "compré cajas y papel coreano, armé 30 ramos para campaña y vendí todo en pocos días.",
    color: "primary",
  },
  {
    number: "2",
    label: "campaña",
    business: "regalos luz",
    city: "lima",
    product: "peluches y globos",
    text: "los peluches y globos se movieron rápido. en una semana ya había recuperado inversión.",
    color: "secondary",
  },
  {
    number: "3",
    label: "asesoría",
    business: "florería el jardín",
    city: "cusco",
    product: "flores y accesorios",
    text: "me ayudaron a elegir productos para mi tienda y no me equivoqué. todo salió muy bien.",
    color: "accent",
  },
  {
    number: "4",
    label: "mayorista",
    business: "detalles rosé",
    city: "tacna",
    product: "papeles y cintas",
    text: "comprar por caja me ayudó a mejorar margen. ahora planifico mis campañas con más orden.",
    color: "primary",
  },
  {
    number: "5",
    label: "rápido",
    business: "sorpresas vale",
    city: "moquegua",
    product: "globos y cajas",
    text: "la atención fue rápida y el pedido llegó bien embalado. eso da confianza para volver a comprar.",
    color: "secondary",
  },
  {
    number: "6",
    label: "stock",
    business: "florería luna",
    city: "puno",
    product: "flores artificiales",
    text: "encontré variedad y pude completar stock para varios pedidos. eso me salvó la campaña.",
    color: "accent",
  },
];

const colorStyles = {
  primary: {
    number: "group-hover:text-[#1d8299]/10",
    iconHover: "group-hover:bg-[#1d8299]",
    label: "bg-[#1d8299]/10 text-[#1d8299]",
    title: "group-hover:text-[#1d8299]",
  },
  secondary: {
    number: "group-hover:text-[#f286be]/10",
    iconHover: "group-hover:bg-[#f286be]",
    label: "bg-[#f286be]/10 text-[#f286be]",
    title: "group-hover:text-[#f286be]",
  },
  accent: {
    number: "group-hover:text-[#f5b025]/10",
    iconHover: "group-hover:bg-[#f5b025]",
    label: "bg-[#f5b025]/10 text-[#f5b025]",
    title: "group-hover:text-[#f5b025]",
  },
} as const;

export default function TestimonialsSection() {
  return (
    <section className="home-container pt-10 pb-16 md:pt-14 md:pb-20">
      <HomeSectionHeader
        icon={Quote}
        kicker="emprendedores que ya compran con wooly"
        title="historias reales que respaldan tu decisión"
        description="clientes que abastecen sus campañas, mejoran su margen y compran con más seguridad."
        align="center"
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-3">
        {testimonials.map((item) => {
          const styles = colorStyles[item.color as keyof typeof colorStyles];

          return (
            <article
              key={`${item.business}-${item.city}`}
              className="group relative overflow-hidden rounded-[30px] border border-slate-200/70 bg-white p-7 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div
                className={`pointer-events-none absolute -right-4 -top-8 z-0 select-none text-[120px] font-black leading-none text-slate-200/70 transition-colors duration-500 ${styles.number}`}
              >
                {item.number}
              </div>

              <div className="relative z-10 mb-6 flex items-center justify-between">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7b1d6]/20 text-[#f286be] shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:text-white ${styles.iconHover}`}
                >
                  <Quote className="h-7 w-7" />
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm ${styles.label}`}
                >
                  {item.label}
                </span>
              </div>

              <div className="relative z-10 mb-4 flex gap-1 text-[#f5b025]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>

              <p className="relative z-10 mb-6 text-sm font-medium leading-relaxed text-slate-700">
                “{item.text}”
              </p>

              <div className="relative z-10 border-t border-slate-100 pt-4">
                <div className="mb-2 flex items-center gap-2">
                  <Store className="h-4 w-4 text-[#1d8299]" />
                  <strong
                    className={`text-sm font-black text-slate-950 transition-colors duration-300 ${styles.title}`}
                  >
                    {item.business}
                  </strong>
                </div>

                <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <MapPin className="h-4 w-4" />
                  <span>{item.city}</span>
                </div>

                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">
                  compró: {item.product}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
