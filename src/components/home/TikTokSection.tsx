import { useNavigate } from "react-router-dom";
import { Search, Flame } from "lucide-react";

const videos = [
  {
    id: "1",
    title: "Flores con alta rotación para campaña 😏",
    embed: "https://www.tiktok.com/embed/v2/7627220403026447636",
    searchTerm: "flores",
  },
  {
    id: "2",
    title: "Peluches que se mueven rápido 🧸",
    embed: "https://www.tiktok.com/embed/v2/7629189641916271893",
    searchTerm: "peluche",
  },
  {
    id: "3",
    title: "Papel coreano para elevar tus arreglos ✨",
    embed: "https://www.tiktok.com/embed/v2/7631220680201080084",
    searchTerm: "papel coreano",
  },
  {
    id: "4",
    title: "Insumos clave para vender en campaña 🎁",
    embed: "https://www.tiktok.com/embed/v2/7623962143922310420",
    searchTerm: "campaña",
  },
];

export default function TikTokSection() {
  const navigate = useNavigate();

  const handleExplore = (searchTerm: string) => {
    const encodedSearch = encodeURIComponent(searchTerm.trim());
    navigate(`/catalogo?search=${encodedSearch}`);
  };

  return (
    <section className="bg-[#f8fafc] px-4 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1d8299]/10 text-[#1d8299]">
              <Flame className="h-5 w-5" />
            </span>

            <span className="text-xs font-black uppercase tracking-[0.28em] text-[#1d8299]">
              Tendencias que venden
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-950 leading-tight">
            Productos que generan ventas
          </h2>

          <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-gradient-to-r from-[#1d8299] via-[#6a8fa0] to-[#f286be]" />

          <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-relaxed text-slate-500 md:text-lg">
            Ideas reales para emprendedores: mira los productos en acción y
            entra directo al catálogo con la búsqueda lista.
          </p>
        </div>

        {/* VIDEOS */}
        <div className="flex gap-6 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {videos.map((video) => (
            <article
              key={video.id}
              className="min-w-[280px] max-w-[280px] overflow-hidden rounded-[28px] border border-slate-200 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl md:min-w-[310px] md:max-w-[310px]"
            >
              <div className="overflow-hidden rounded-[22px] bg-slate-100">
                <iframe
                  src={video.embed}
                  title={video.title}
                  loading="lazy"
                  allow="encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="h-[500px] w-full border-0"
                />
              </div>

              <div className="p-3">
                <h3 className="min-h-[44px] text-sm font-black leading-snug text-slate-800">
                  {video.title}
                </h3>

                <button
                  type="button"
                  onClick={() => handleExplore(video.searchTerm)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1d8299] px-4 py-3 text-sm font-black text-white shadow-[0_12px_24px_rgba(29,130,153,0.22)] transition hover:-translate-y-0.5 hover:bg-[#156f84]"
                >
                  <Search className="h-4 w-4" />
                  Ver insumos relacionados
                </button>

                <p className="mt-2 text-center text-[11px] font-semibold text-slate-400">
                  Buscar: “{video.searchTerm}”
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}