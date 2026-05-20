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
    <section className="tiktok-section">
      <div className="tiktok-inner">
        <div className="tiktok-header">
          <div className="tiktok-kicker-row">
            <span className="tiktok-kicker-icon">
              <Flame className="h-5 w-5" />
            </span>

            <span className="tiktok-kicker">
              Tendencias que venden
            </span>
          </div>

          <h2 className="tiktok-title">
            Productos que generan ventas
          </h2>

          <div className="tiktok-divider" />

          <p className="tiktok-description">
            Ideas reales para emprendedores: mira los productos en acción y
            entra directo al catálogo con la búsqueda lista.
          </p>
        </div>

        <div className="tiktok-video-track">
          {videos.map((video) => (
            <article key={video.id} className="tiktok-card">
              <div className="tiktok-iframe-wrapper">
                <iframe
                  src={video.embed}
                  title={video.title}
                  loading="lazy"
                  allow="encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="tiktok-iframe"
                />
              </div>

              <div className="tiktok-card-content">
                <h3 className="tiktok-card-title">
                  {video.title}
                </h3>

                <button
                  type="button"
                  onClick={() => handleExplore(video.searchTerm)}
                  className="tiktok-search-btn"
                >
                  <Search className="h-4 w-4" />
                  Ver insumos relacionados
                </button>

                <p className="tiktok-search-label">
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