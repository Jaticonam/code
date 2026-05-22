import type { Product } from "@/shared/types/product";
import {
  getBadgePresentation,
  sortBadges,
} from "@/shared/config/badgeRules";

interface ProductCardBadgesProps{
  product:Product;
}

export function ProductCardBadges({
  product,
}:ProductCardBadgesProps){

  const badges=[
    ...(product.price_offer &&
      product.price_offer>0 &&
      product.price_offer<product.price_1
        ? ["Promo Flash  ⚡"]
        : []),

    ...(product.badges||[]),
  ];

  const unique=[
    ...new Set(badges),
  ];

  if(!unique.length)
    return null;

  return(

    <div className="
      absolute
      top-2
      left-2
      z-10

      flex
      flex-col
      gap-1.5

      max-w-[75%]
      items-start
    ">

      {
        sortBadges(unique)

        .slice(0,2)

        .map((badge,i)=>{

          const p=
            getBadgePresentation(
              badge
            );

          return(

            <div

              key={`${product.id}-${i}`}

              className={[
                "px-5 py-0.5",
                "rounded-full",
                "text-[10px] md:text-[11px]",
                "font-bold",
                "border border-white/10",
                "backdrop-blur-sm",
                "shadow-md",

                p.className,
                p.animation,

              ].join(" ")}

            >

              {badge}

            </div>

          );

        })

      }

    </div>

  );

}