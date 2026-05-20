import {

CartItem,
Product

}

from "@/types/product";

import {

getAvailablePriceTiers

}

from "@/config/priceTiers";

import {

ProductCardPrice

}

from "@/components/ProductCardPrice";

import {

ProductCardStock

}

from "@/components/ProductCardStock";

import {

ProductCardBadges

}

from "@/components/product/ProductCardBadges";

import {

ProductCardMeta

}

from "@/components/product/ProductCardMeta";

import {

ProductCardCTA

}

from "@/components/product/ProductCardCTA";

import {

ProductCardViewers

}

from "@/components/product/ProductCardViewers";

import {

useProductCard

}

from "@/hooks/product/useProductCard";

import {

useProductViewers

}

from "@/hooks/products/useProductViewers";

interface Props{

product:Product;

cart?:CartItem[];

onAddToCart:(p:Product)=>void;

onImageClick?:(

src:string,
title:string

)=>void;

}

export function ProductCard({

product:p,

cart=[],

onAddToCart,

onImageClick

}:Props){

const viewers=

useProductViewers();

const{

available,

isPreventa,

showWhatsAppButton,

isInCart,

qtyInCart,

goToDetail,

handleAdd,

handleWhatsApp

}=

useProductCard(

p,
cart,
onAddToCart

);

return(

<div
className="card-product flex flex-col text-center p-[6px] md:p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
>

<div
className="relative h-[340px] md:h-[300px] overflow-hidden rounded-[14px] md:rounded-[20px] mb-2.5 bg-muted"
>

<ProductCardBadges
product={p}
/>

<img

src={
p.img||
"/placeholder.svg"
}

alt={p.title}

onClick={()=>{

onImageClick?.(

p.img,
p.title

);

}}

className="w-full h-full object-cover cursor-pointer"

/>

</div>

<div
className="px-1 md:px-2 flex-grow flex flex-col justify-between"
>

<ProductCardMeta

product={p}

available={available}

isPreventa={isPreventa}

goToDetail={goToDetail}

/>

<ProductCardPrice
product={p}
/>

<ProductCardStock
product={p}
/>

<ProductCardViewers
viewers={viewers}
/>

<ProductCardCTA

available={available}

isPreventa={isPreventa}

showWhatsAppButton={showWhatsAppButton}

isInCart={isInCart}

qtyInCart={qtyInCart}

onAdd={handleAdd}

onWhatsapp={handleWhatsApp}

/>

</div>

</div>

);

}
