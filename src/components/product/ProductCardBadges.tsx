import {
getBadgePresentation,
sortBadges
}
from "@/config/badgeRules";

import type{
Product
}
from "@/types/product";

export function ProductCardBadges({

product

}:{

product:Product

}){

if(
!product.badges?.length
)return null;

return(

<div className="absolute top-3 left-3 z-20 flex flex-col gap-2">

{sortBadges(
product.badges
)

.slice(0,3)

.map(

(badge,index)=>{

const style=

getBadgePresentation(
badge
);

return(

<div

key={`${badge}-${index}`}

className={[

"px-2.5 py-1 rounded-full text-[10px] font-bold",

style.className,
style.animation

].join(" ")}

>

{badge}

</div>

);

}

)}

</div>

);

}
