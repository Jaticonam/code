import {
  Map,
  ShieldCheck,
  Package,
  Zap,
  FileCheck,
  MapPin,
  Truck,
} from "lucide-react";
import HomeSectionHeader from "./HomeSectionHeader";

const features = [
  {
    number: "1",
    label: "cobertura",
    title: "llegamos a todo el perú",
    desc: "más de 350 destinos entre ciudades principales y provincias.",
    icon: Map,
    color: "primary",
  },
  {
    number: "2",
    label: "seguro",
    title: "compra 100% respaldada",
    desc: "caja con seguro incluido, responsables hasta su entrega.",
    icon: ShieldCheck,
    color: "secondary",
  },
  {
    number: "3",
    label: "embalaje",
    title: "protección de productos",
    desc: "cajas con film, cintas de seguridad y señalización frágil.",
    icon: Package,
    color: "accent",
  },
  {
    number: "4",
    label: "beneficio",
    title: "traslado gratis",
    desc: "lunes, miércoles y viernes el traslado a agencia es gratis.",
    icon: Zap,
    color: "primary",
  },
  {
    number: "5",
    label: "legal",
    title: "respaldo sunat",
    desc: "emitimos boleta o factura válida ante sunat, ruc 10 o 20.",
    icon: FileCheck,
    color: "secondary",
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

export default function ShippingSection() {
  return (
    <section className="home-container pt-10 pb-16 md:pt-14 md:pb-20">
      <HomeSectionHeader
        icon={Truck}
        kicker="logística garantizada"
        title="envíos a todo el perú"
        description="tu pedido viaja protegido, embalado y con seguimiento para que compres con tranquilidad."
        align="center"
      />

      <div className="relative overflow-hidden rounded-[40px] border border-slate-200/70 bg-white shadow-2xl">
        <div className="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-[#1d8299]/5 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[420px] w-[420px] rounded-full bg-[#f7b1d6]/10 blur-[100px]" />

        <div className="relative z-10 grid gap-0 lg:grid-cols-2">
          <div className="p-6 md:p-10 lg:p-12">
            <div className="grid gap-4">
              {features.map((item) => {
                const Icon = item.icon;
                const styles =
                  colorStyles[item.color as keyof typeof colorStyles];

                return (
                  <div
                    key={item.title}
                    className="group relative overflow-hidden rounded-[26px] border border-slate-200/70 bg-white p-5 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl md:p-6"
                  >
                    <div
                      className={`pointer-events-none absolute -right-4 -top-8 z-0 select-none text-[96px] font-black leading-none text-slate-200/70 transition-colors duration-500 ${styles.number}`}
                    >
                      {item.number}
                    </div>

                    <div className="relative z-10 flex items-start gap-4">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f7b1d6]/20 text-[#f286be] shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:text-white ${styles.iconHover}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <h3
                            className={`text-base font-bold text-slate-950 transition-colors duration-300 md:text-lg ${styles.title}`}
                          >
                            {item.title}
                          </h3>

                          <span
                            className={`hidden rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm sm:inline-block ${styles.label}`}
                          >
                            {item.label}
                          </span>
                        </div>

                        <p className="text-sm leading-relaxed text-slate-600">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative min-h-[390px] p-6 md:min-h-[460px] md:p-10 lg:min-h-full">
            <div className="group relative h-full min-h-[360px] overflow-hidden rounded-[32px] border-4 border-white shadow-[0_20px_50px_rgba(0,0,0,0.16)]">
              <img
                src="https://scontent.faqp5-1.fna.fbcdn.net/v/t1.6435-9/118468095_3836541133040959_3203898273981614328_n.jpg"
                alt="logística y despacho wooly"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="absolute right-5 top-5 flex items-center gap-3 rounded-2xl border border-white bg-white/85 px-4 py-2.5 shadow-lg backdrop-blur-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1d8299]/20 text-[#1d8299]">
                  <MapPin className="h-5 w-5" />
                </div>

                <div>
                  <strong className="block text-sm font-black leading-tight text-slate-950">
                    desde tacna
                  </strong>
                  <small className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    a todo el país
                  </small>
                </div>
              </div>

              <div className="absolute bottom-5 left-5 right-5 flex items-center gap-4 rounded-2xl border border-white bg-white/85 px-4 py-3 shadow-lg backdrop-blur-md md:right-auto">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-inner">
                  <span className="absolute inset-0 animate-ping rounded-full bg-green-100 opacity-50" />
                  <ShieldCheck className="relative z-10 h-6 w-6" />
                </div>

                <div>
                  <strong className="mb-0.5 block text-sm font-black text-slate-950">
                    compra protegida
                  </strong>
                  <p className="text-xs font-medium text-slate-600">
                    seguimiento garantizado por shalom pro
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}