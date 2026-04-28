import { Store, MapPin } from "lucide-react";
import { WhatsAppIcon } from "../ui/SocialIcons";
import HomeSectionHeader from "./HomeSectionHeader";

export default function BrandStorySection() {
  return (
    <section className="home-container pt-10 pb-16 md:pt-14 md:pb-20">
      
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">

        {/* imagen */}
        <div className="relative order-1 md:order-none">
          <div className="absolute -inset-3 z-0 rounded-[26px] bg-[#f7b1d6]/20 md:rotate-2" />

          <img
            src="https://dl.dropboxusercontent.com/scl/fi/ixrlm1m9hoia84zuuoef5/NAT_AMA_001.jpg?rlkey=07e39hpq6i8hogrdxi6stcqvu&st=o4fc1nh4&raw=1"
            alt="wooly import peru"
            className="relative z-10 h-[360px] w-full rounded-[24px] object-cover shadow-xl md:h-[480px]"
            loading="lazy"
          />
        </div>

        {/* contenido */}
        <div className="text-center md:text-left">

          <HomeSectionHeader
            icon={Store}
            kicker="tu proveedor confiable"
            title="crecemos junto a tu negocio"
            align="left"
          />

          {/* texto optimizado */}
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600 md:text-base">

            <p>
              En <strong className="text-slate-950">Wooly import Perú</strong>{" "}
              abastecemos a mayoristas y emprendedores con insumos para regalos
              que realmente se venden.
            </p>

            <p>
              Trabajamos con flores, globos, cajas, papel coreano, cintas y
              accesorios pensados para crear productos llamativos y rentables.
            </p>

            <p>
              Ofrecemos variedad constante y precios por cajón para mejorar tu
              margen y asegurar stock en tendencia.
            </p>

            <div className="flex items-start gap-3 text-sm text-slate-700">
              <MapPin className="mt-1 h-5 w-5 text-[#1d8299]" />
              <span>
                Estamos en <strong>tacna</strong> y te ayudamos a elegir lo que
                mejor se vende en tu tienda.
              </span>
            </div>

            <p className="font-semibold text-slate-950">
              Si buscas crecer con productos que sí rotan, wooly es tu mejor aliado.
            </p>
          </div>

          {/* CTA PRO */}
          <a
            href="https://wa.me/51936188636?text=Hola,%20quiero%20información%20sobre%20Wooly%20Import"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center gap-3 rounded-full bg-[#25D366] px-8 py-4 text-sm font-black text-white shadow-[0_10px_25px_rgba(37,211,102,0.35)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#1ebe5d] hover:shadow-[0_15px_35px_rgba(37,211,102,0.5)] active:scale-95"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Escríbenos ahora
          </a>

        </div>
      </div>
    </section>
  );
}