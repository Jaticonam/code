import { ZoomIn } from "lucide-react";
import type { Product } from "@/shared/types/product";
import { getBadgePresentation, sortBadges } from "@/shared/config/badgeRules";

interface ProductGalleryProps {
  product: Product;
  available: boolean;
  onZoom: (src: string, title: string) => void;
}

export function ProductGallery({
  product,
  available,
  onZoom,
}: ProductGalleryProps) {
  return (
    <div className="relative">
      <div
        className="aspect-square overflow-hidden rounded-3xl bg-white border border-[#e2e8f0] shadow-[0_10px_30px_rgba(0,0,0,0.08)] group cursor-zoom-in"
        onClick={() => onZoom(product.img, product.title)}
      >
        <img
          src={product.img}
          alt={product.title}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
            !available ? "opacity-60 grayscale-[50%]" : ""
          }`}
        />

        {product.badges && product.badges.length > 0 && (
          <div className="absolute top-4 left-4 flex flex-col gap-2 items-start max-w-[75%] z-10">
            {sortBadges(product.badges)
              .slice(0, 3)
              .map((badge, index) => {
                const presentation = getBadgePresentation(badge);

                return (
                  <div
                    key={`${product.id}-detail-image-badge-${index}`}
                    className={[
                      "px-3 py-1.5 rounded-full text-[10px] md:text-[11px] font-semibold leading-tight tracking-normal border border-white/10 shadow-md backdrop-blur-sm",
                      presentation.className,
                      presentation.animation,
                    ].join(" ")}
                  >
                    {badge}
                  </div>
                );
              })}
          </div>
        )}

        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md border border-[#e2e8f0] p-2 rounded-xl text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
