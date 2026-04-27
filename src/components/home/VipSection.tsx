import { Crown, MessageCircle, Users, Video, Zap } from "lucide-react";
import HomeSectionHeader from "./HomeSectionHeader";

const vipBenefits = [
  {
    number: "1",
    label: "beneficio",
    title: "precios y preventas",
    description:
      "compra con mejores precios por cajón y asegura mercadería antes de su llegada.",
    icon: Zap,
    color: "secondary",
  },
  {
    number: "2",
    label: "directo",
    title: "videollamadas",
    description:
      "te mostramos productos en tiempo real para que compres con seguridad.",
    icon: Video,
    color: "primary",
  },
  {
    number: "3",
    label: "exclusivo",
    title: "grupo vip",
    description:
      "recibe preventas, promociones y oportunidades antes que el resto.",
    icon: Users,
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

export default function VipSection() {
  return (
    <section className="home-container pt-10 pb-16 md:pt-14 md:pb-20">
      <HomeSectionHeader
        icon={Crown}
        kicker="acceso preferencial"
        title="mayoristas vip"
        description="beneficios exclusivos para quienes quieren comprar mejor, acceder antes y vender con más estrategia."
        align="center"
      />

      <div className="relative overflow-hidden rounded-[40px] border border-slate-200/70 bg-white p-6 shadow-2xl md:p-10 lg:p-12">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#f5b025]/10 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#f7b1d6]/20 blur-[90px]" />

        <div className="relative z-10">
          <div className="mx-auto mb-10 flex max-w-3xl flex-col items-center gap-3 rounded-full border border-slate-200/80 bg-slate-50 px-5 py-3 text-center text-sm font-medium text-slate-700 md:flex-row md:justify-center">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#f5b025] opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-[#f5b025]" />
            </span>
            <span>
              acceso vip por grupos para mantener atención rápida y ordenada.
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {vipBenefits.map((item) => {
              const Icon = item.icon;
              const styles =
                colorStyles[item.color as keyof typeof colorStyles];

              return (
                <div
                  key={item.title}
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
                      <Icon className="h-7 w-7" />
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm ${styles.label}`}
                    >
                      {item.label}
                    </span>
                  </div>

                  <h3
                    className={`relative z-10 mb-3 text-xl font-bold text-slate-950 transition-colors duration-300 ${styles.title}`}
                  >
                    {item.title}
                  </h3>

                  <p className="relative z-10 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <a
              href="https://wa.me/51936188636?text=Hola,%20quiero%20ser%20mayorista%20VIP"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#f5b025] to-[#e69b15] px-8 py-4 text-sm font-black text-slate-950 shadow-[0_10px_25px_rgba(245,176,37,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(245,176,37,0.5)]"
            >
              <MessageCircle className="h-5 w-5" />
              quiero ser mayorista ahora
            </a>

            <p className="mt-4 text-xs font-medium text-slate-500">
              acceso inmediato por whatsapp con atención rápida y directa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}