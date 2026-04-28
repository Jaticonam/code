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
    title: "Llegamos a todo el Perú",
    desc: "Más de 350 destinos entre ciudades principales y provincias.",
    icon: Map,
    color: "primary",
  },
  {
    number: "2",
    label: "seguro",
    title: "Compra 100% respaldada",
    desc: "Caja con seguro incluido, responsables hasta su entrega.",
    icon: ShieldCheck,
    color: "secondary",
  },
  {
    number: "3",
    label: "embalaje",
    title: "Protección de productos",
    desc: "Cajas con film, cintas de seguridad y señalización frágil.",
    icon: Package,
    color: "accent",
  },
  {
    number: "4",
    label: "beneficio",
    title: "Traslado gratis",
    desc: "Lunes, miércoles y viernes el traslado a agencia es gratis.",
    icon: Zap,
    color: "primary",
  },
  {
    number: "5",
    label: "legal",
    title: "Respaldo legal SUNAT",
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
    <section
      id="shipping"
      className="home-container scroll-mt-24 pt-10 pb-16 md:pt-14 md:pb-20"
    >
      <HomeSectionHeader
        icon={Truck}
        kicker="Logística garantizada"
        title="Envíos a todo el perú"
        description="Tu pedido viaja protegido, embalado y con seguimiento para que compres con tranquilidad."
        align="center"
      />

      <div className="grid items-stretch gap-8 lg:grid-cols-2">
        {/* tarjetas */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
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
                  className={`pointer-events-none absolute right-5 top-5 z-0 select-none text-[88px] font-black leading-none text-slate-200/70 transition-colors duration-500 md:text-[96px] ${styles.number}`}
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
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <h3
                        className={`min-w-0 pr-2 text-base font-bold text-slate-950 transition-colors duration-300 md:text-lg ${styles.title}`}
                      >
                        {item.title}
                      </h3>

                      <span
                        className={`inline-block shrink-0 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm ${styles.label}`}
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

        {/* imagen */}
        <div className="relative min-h-[390px] md:min-h-[460px] lg:min-h-full">
          <div className="group relative h-full min-h-[390px] overflow-hidden rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.16)] md:min-h-[460px]">
            <img
              src="https://scontent.faqp5-1.fna.fbcdn.net/v/t1.6435-9/118468095_3836541133040959_3203898273981614328_n.jpg"
              alt="logística y despacho wooly"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />

            <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="absolute right-5 top-5 flex items-center gap-3 rounded-2xl bg-white/85 px-4 py-2.5 shadow-lg backdrop-blur-md">
              <MapPin className="h-5 w-5 text-[#1d8299]" />

              <div>
                <strong className="block text-sm font-black text-slate-950">
                  desde tacna
                </strong>
                <small className="text-[10px] font-bold uppercase text-slate-500">
                  a todo el país
                </small>
              </div>
            </div>

            <div className="absolute bottom-5 left-5 right-5 flex items-center gap-4 rounded-2xl bg-white/85 px-4 py-3 shadow-lg backdrop-blur-md">
              <ShieldCheck className="h-6 w-6 shrink-0 text-green-600" />

              <div>
                <strong className="block text-sm font-black text-slate-950">
                  compra protegida
                </strong>
                <p className="text-xs text-slate-600">
                  seguimiento garantizado por shalom pro
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}