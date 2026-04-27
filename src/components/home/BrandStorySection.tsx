import { MessageCircle, Store, MapPin } from "lucide-react";
import HomeSectionHeader from "./HomeSectionHeader";

export default function BrandStorySection() {
  return (
    <section className="home-container pt-10 pb-16 md:pt-14 md:pb-20">
      <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
        
        {/* imagen */}
        <div className="relative">
          <div className="absolute -inset-4 z-0 rounded-[28px] bg-[#f7b1d6]/25 transition-transform duration-500 hover:rotate-6 md:rotate-3" />

          <img
            src="https://dl.dropboxusercontent.com/scl/fi/ixrlm1m9hoia84zuuoef5/NAT_AMA_001.jpg?rlkey=07e39hpq6i8hogrdxi6stcqvu&st=o4fc1nh4&raw=1"
            alt="wooly import peru"
            className="relative z-10 h-[380px] w-full rounded-[26px] object-cover shadow-2xl md:h-[500px]"
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

          <div className="space-y-5 text-sm font-medium leading-relaxed text-slate-600 md:text-base">
            
            <p>
              en <strong className="text-slate-950">wooly import peru</strong>{" "}
              abastecemos a mayoristas y emprendedores con insumos para regalos
              y detalles que realmente se venden.
            </p>

            <p>
              nos especializamos en flores naturales y artificiales, globos,
              papel coreano, cajas decorativas, cintas, peluches y accesorios
              diseñados para crear arreglos llamativos y rentables.
            </p>

            <p>
              trabajamos con variedad constante y precios por cajón para que tu
              negocio tenga mejor margen y siempre cuente con productos en
              tendencia.
            </p>

            <p>
              atendemos emprendedores, florerías y tiendas de detalles que
              buscan calidad, rapidez y buen stock.
            </p>

            <div className="flex items-start gap-3 text-sm text-slate-700">
              <MapPin className="mt-1 h-5 w-5 text-[#1d8299]" />
              <span>
                estamos ubicados en <strong>tacna</strong> y brindamos atención
                directa para ayudarte a elegir lo que mejor se venda en tu
                tienda.
              </span>
            </div>

            <p className="font-semibold text-slate-950">
              si buscas un proveedor confiable para hacer crecer tu negocio,
              wooly import es tu mejor aliado.
            </p>
          </div>

          {/* cta */}
          <a
            href="https://wa.me/51936188636?text=Hola,%20quiero%20información%20sobre%20Wooly%20Import"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center gap-3 rounded-full bg-[#1d8299] px-8 py-4 text-sm font-black text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#f286be] hover:shadow-xl"
          >
            <MessageCircle className="h-5 w-5" />
            escríbenos ahora
          </a>
        </div>
      </div>
    </section>
  );
}