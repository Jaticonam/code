import {

PlusCircle,
MessageCircle

}

from "lucide-react";

interface Props{

available:boolean;

isPreventa:boolean;

showWhatsAppButton:boolean;

isInCart:boolean;

qtyInCart:number;

onAdd:()=>void;

onWhatsapp:()=>void;

}

export function ProductCardCTA({

available,

isPreventa,

showWhatsAppButton,

isInCart,

qtyInCart,

onAdd,

onWhatsapp

}:Props){

return(

<div className="mt-3 space-y-2">

<button

onClick={

showWhatsAppButton

?onWhatsapp

:onAdd

}

disabled={

!available
&&
!showWhatsAppButton

}

className={[

"w-full",

"rounded-2xl",

"px-4",

"py-3",

"font-bold",

"transition-all",

"duration-200",

showWhatsAppButton

?

"bg-green-600 text-white hover:bg-green-700"

:

"bg-[#1d8299] text-white hover:bg-[#156f84]",

!available
&&
!showWhatsAppButton

?

"opacity-50"

:""

].join(" ")}

>

<div className="flex items-center justify-center gap-2">

{

showWhatsAppButton

?

<MessageCircle
className="w-4 h-4"
/>

:

<PlusCircle
className="w-4 h-4"
/>

}

<span>

{

showWhatsAppButton

?

"Consultar"

:

isInCart

?

`Agregar más (${qtyInCart})`

:

"Agregar pedido"

}

</span>

</div>

</button>

</div>

);

}
