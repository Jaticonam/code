import{

Product

}

from "@/shared/types/product";

interface Props{

product:Product;

currentQty:number;

pulse:boolean;

nextTier:any;

}

export function AddToCartModalInfo({

product,

currentQty,

pulse,

nextTier

}:Props){

return(

<div

className={[

"mt-4",

"rounded-xl",

"border",

"bg-[#f8fafc]",

"p-3",

pulse

?

"scale-[1.02]"

:""

].join(" ")}

>

contenido actual

</div>

);

}
