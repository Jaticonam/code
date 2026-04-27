import HomeSectionHeader from "./HomeSectionHeader";
import { Sparkles } from "lucide-react";

import {
  TikTokIcon,
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  PinterestIcon,
  XIcon,
  GoogleIcon,
} from "../ui/SocialIcons";

const socials = [
  {
    label: "video",
    title: "tiktok",
    description: "contenido viral",
    icon: TikTokIcon,
    link: "https://www.tiktok.com/@woolyimports",
    normalIcon: "bg-[#f7b1d6]/20 text-[#f286be] border-[#f7b1d6]/40",
    hover: "group-hover:bg-black group-hover:text-white group-hover:border-black",
    text: "group-hover:text-black",
  },
  {
    label: "comunidad",
    title: "facebook",
    description: "promos y novedades",
    icon: FacebookIcon,
    link: "https://www.facebook.com/WoolyImports/",
    normalIcon: "bg-[#1d8299]/10 text-[#1d8299] border-[#1d8299]/20",
    hover: "group-hover:bg-[#1877f2] group-hover:text-white group-hover:border-[#1877f2]",
    text: "group-hover:text-[#1877f2]",
  },
  {
    label: "visual",
    title: "instagram",
    description: "ideas y campañas",
    icon: InstagramIcon,
    link: "https://www.instagram.com/woolyimports/",
    normalIcon: "bg-[#f7b1d6]/20 text-[#f286be] border-[#f7b1d6]/40",
    hover: "group-hover:bg-[#e4405f] group-hover:text-white group-hover:border-[#e4405f]",
    text: "group-hover:text-[#e4405f]",
  },
  {
    label: "ideas",
    title: "pinterest",
    description: "inspiración",
    icon: PinterestIcon,
    link: "https://www.pinterest.com/woolyimports/",
    normalIcon: "bg-[#f5b025]/10 text-[#f5b025] border-[#f5b025]/30",
    hover: "group-hover:bg-[#bd081c] group-hover:text-white group-hover:border-[#bd081c]",
    text: "group-hover:text-[#bd081c]",
  },
  {
    label: "noticias",
    title: "x",
    description: "actualizaciones",
    icon: XIcon,
    link: "https://x.com/woolyimports",
    normalIcon: "bg-[#1d8299]/10 text-[#1d8299] border-[#1d8299]/20",
    hover: "group-hover:bg-black group-hover:text-white group-hover:border-black",
    text: "group-hover:text-black",
  },
  {
    label: "video",
    title: "youtube",
    description: "demostraciones",
    icon: YoutubeIcon,
    link: "https://www.youtube.com/@WoolyImports",
    normalIcon: "bg-[#f7b1d6]/20 text-[#f286be] border-[#f7b1d6]/40",
    hover: "group-hover:bg-[#ff0000] group-hover:text-white group-hover:border-[#ff0000]",
    text: "group-hover:text-[#ff0000]",
  },
  {
    label: "reseñas",
    title: "google",
    description: "opiniones reales",
    icon: GoogleIcon,
    link: "https://www.google.com/search?q=Wooly+import+Per%C3%BA",
    normalIcon: "bg-[#1d8299]/10 text-[#1d8299] border-[#1d8299]/20",
    hover: "group-hover:bg-[#4285f4] group-hover:text-white group-hover:border-[#4285f4]",
    text: "group-hover:text-[#4285f4]",
  },
];

export default function SocialSection() {
  return (
    <section className="home-container pt-8 pb-12 md:pt-10 md:pb-14">
      <HomeSectionHeader
        icon={Sparkles}
        kicker="conecta con wooly"
        title="síguenos y mantente actualizado"
        description="contenido, tendencias y oportunidades en nuestras plataformas."
        align="center"
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {socials.map((item) => {
          const Icon = item.icon;

          return (
            <a
              key={item.title}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.title}
              className="group flex min-h-[150px] flex-col items-center justify-center rounded-[26px] border border-slate-200/80 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.03] hover:shadow-xl"
            >
              <div
                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border shadow-sm transition-all duration-300 group-hover:scale-110 ${item.normalIcon} ${item.hover}`}
              >
                <Icon className="h-6 w-6" />
              </div>

              <h3
                className={`text-base font-extrabold text-slate-950 transition-colors duration-300 ${item.text}`}
              >
                {item.title}
              </h3>

              <p className="mt-1 text-xs font-medium leading-snug text-slate-500">
                {item.description}
              </p>

              <span className="mt-3 rounded-full bg-slate-100 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-slate-500 transition-all duration-300 group-hover:bg-slate-900 group-hover:text-white">
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}