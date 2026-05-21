import{
getCategoryColor
}
from "@/config/categoryColors";

import type{
Product
}
from "@/types/product";

interface Props{

product:Product;

available:boolean;

isPreventa:boolean;

goToDetail:()=>void;

}

export function ProductCardMeta({

product,

available,
isPreventa,

goToDetail

}:Props){

return(

<>

<div className="flex items-center justify-center gap-2 mb-1.5 flex-wrap">

<span className="text-[10px] text-muted-foreground font-semibold">

{product.id}

</span>

<span

className={[

"px-2.5 py-[3px] rounded-full text-[10px] font-bold uppercase",

getCategoryColor(
product.category
)

].join(" ")}

>

{product.category}

</span>

</div>

<h3

onClick={goToDetail}

className={`

cursor-pointer

hover:text-primary

transition-colors

font-extrabold

text-[15px]

md:text-[17px]

line-clamp-2

leading-snug

${

!available
&&
!isPreventa

?"opacity-60":""

}

`}

>

{product.title}

</h3>

<p className="text-[12px] text-muted-foreground mt-1.5 line-clamp-2">

{

product.description||

(

isPreventa

? "Consulta más información sobre esta preventa."

:""

)

}

</p>

</>

);

}
