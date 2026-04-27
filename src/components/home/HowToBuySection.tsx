import {
  PackageOpen,
  ShoppingCart,
  FileCheck,
  CreditCard,
  Truck,
} from "lucide-react";
import HomeSectionHeader from "./HomeSectionHeader";

const steps = [
  {
    number: "1",
    label: "Paso 1",
    title: "Apertura tu caja",
    description:
      "Comienza tu pedido mayorista desde S/ 30. Luego entra al catálogo o escríbenos por WhatsApp y elige lo que necesitas.",
    icon: PackageOpen,
    color: "primary",
  },
  {
    number: "2",
    label: "Paso 2",
    title: "Acumula a tu ritmo",
    description:
      "Agrega productos desde 3, 12 unidades o por cajón. Cuando tengas todo listo, dale en enviar pedido.",
    icon: ShoppingCart,
    color: "secondary",
  },
  {
    number: "3",
    label: "Paso 3",
    title: "Recibe tu cotización",
    description:
      "Te enviamos el detalle completo con precios claros para que revises y confirmes las cantidades.",
    icon: FileCheck,
    color: "accent",
  },
  {
    number: "4",
    label: "Paso 4",
    title: "Confirma y paga",
    description:
      "Realiza tu pago por el medio que prefieras (Yape o Transferencia BCP) y comparte tus datos de envío.",
    icon: CreditCard,
    color: "primary",
  },
  {
    number: "5",
    label: "Paso 5",
    title: "Enviamos a tu ciudad",
    description:
      "Preparamos y alistamos tu pedido, embalamos con cuidado y lo enviamos con seguro de caja por Shalom Pro.",
    icon: Truck,
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

export default function HowToBuySection() {
  return (
    <section
      id="howtobySection"
      className="relative w-full overflow-hidden border-t border-slate-200/60 bg-gradient-to-b from-white via-slate-50 to-slate-50 py-12 md:py-16"
    >
      <div className="pointer-events-none absolute top-0 left-1/2 -z-0 h-full w-full max-w-4xl -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(29,130,153,0.06),transparent_70%)]" />

      <div className="home-container relative z-10">
        <HomeSectionHeader
          icon={ShoppingCart}
          kicker="¿ya sabes cómo comprar en Wooly?"
          title="realizar tu pedido es muy sencillo"
          description="sigue estos 5 pasos rápidos para abastecer tu negocio con los insumos más rentables."
        />

        <div className="relative z-10 flex flex-wrap justify-center gap-6 md:gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            const styles = colorStyles[step.color as keyof typeof colorStyles];

            return (
              <div
                key={step.number}
                className="group relative w-full max-w-sm overflow-hidden rounded-[30px] border border-slate-200/70 bg-white p-7 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-22px)]"
              >
                <div
                  className={`pointer-events-none absolute -right-4 -top-8 z-0 select-none text-[130px] font-black leading-none text-slate-200/70 transition-colors duration-500 ${styles.number}`}
                >
                  {step.number}
                </div>

                <div className="relative z-10 mb-6 flex items-center justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7b1d6]/20 text-[#f286be] shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:text-white ${styles.iconHover}`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>

                  <span
                    className={`inline-block rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm ${styles.label}`}
                  >
                    {step.label}
                  </span>
                </div>

                <h3
                  className={`relative z-10 mb-3 text-xl font-bold text-slate-950 transition-colors duration-300 ${styles.title}`}
                >
                  {step.title}
                </h3>

                <p className="relative z-10 text-sm leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}