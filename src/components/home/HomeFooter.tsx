import { Link } from "react-router-dom";

export default function HomeFooter() {
  return (
    <footer className="relative overflow-hidden border-t-[6px] border-[#1d8299] bg-[#0d5c6d] pt-14 pb-8 text-white">
      
      {/* glow superior */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-24 w-3/4 -translate-x-1/2 bg-[#1d8299]/30 blur-[80px]" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        
        {/* logo */}
        <Link
          to="/"
          className="mb-6 inline-block transition-transform duration-300 hover:scale-105"
        >
          <img
            src="https://dl.dropboxusercontent.com/scl/fi/pnsqsg5o0v9sce32wi0n5/Logo_Wooly.png?rlkey=jjfdddx66emkv2rdh9dp4kosd&st=xbp3j3ks&raw=1"
            alt="wooly import peru"
            className="mx-auto h-12 object-contain brightness-0 invert"
          />
        </Link>

        {/* descripción */}
        <p className="mx-auto mb-10 max-w-md text-sm leading-relaxed text-white/70">
          tu proveedor confiable en tacna. abastecemos insumos mayoristas
          para que tu negocio crezca con productos que sí se venden.
        </p>

        {/* navegación */}
        <div className="mb-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-semibold text-white/80">
          
          <Link
            to="/catalogo"
            className="transition-all duration-300 hover:scale-105 hover:text-white"
          >
            catálogo
          </Link>

          <a
            href="https://packs.woolyimports.com/"
            target="_blank"
            className="transition-all duration-300 hover:scale-105 hover:text-white"
          >
            precios por cajón
          </a>

          <a
            href="#howtobySection"
            className="transition-all duration-300 hover:scale-105 hover:text-white"
          >
            envíos
          </a>

          <a
            href="https://wa.me/51936188636"
            target="_blank"
            className="transition-all duration-300 hover:scale-105 hover:text-white"
          >
            contacto
          </a>
        </div>

        {/* línea final */}
        <div className="flex flex-col items-center justify-between border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row">
          
          <p>© 2026 wooly import peru. todos los derechos reservados.</p>

          <div className="mt-3 flex gap-6 md:mt-0">
            <a href="#" className="hover:text-white transition">
              privacidad
            </a>
            <a href="#" className="hover:text-white transition">
              términos mayoristas
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}