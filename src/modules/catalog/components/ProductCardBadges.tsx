import { getBadgePresentation, sortBadges } from "@/shared/config/badgeRules";

interface ProductCardBadgesProps {
  productId: string;
  badges?: string[];
}

export function ProductCardBadges({
  productId,
  badges,
}: ProductCardBadgesProps) {
  if (!badges || badges.length === 0) return null;

  return (
    <div className="absolute top-2 left-2 flex flex-col gap-1.5 items-start max-w-[75%] z-10">
      {sortBadges(badges)
        .slice(0, 2)
        .map((badge, index) => {
          const presentation = getBadgePresentation(badge);

          return (
            <div
              key={`${productId}-badge-${index}`}
              className={[
                "text-[10px] md:text-[11px] font-bold px-3 py-1 rounded-full leading-tight tracking-normal backdrop-blur-sm border border-white/10 shadow-md",
                presentation.className,
                presentation.animation,
              ].join(" ")}
            >
              {badge}
            </div>
          );
        })}
    </div>
  );
}
