import { useNavigate } from "react-router-dom";

import type {
CartItem,
Product
} from "@/shared/types/product";

import {
isProductAvailable
} from "@/modules/catalog/utils/products";

import {
buildWhatsappMessage
} from "@/modules/product-detail/utils/buildWhatsappMessage";

export function useProductCard(

p:Product,
cart:CartItem[],

onAddToCart:
(product:Product)=>void

){

const navigate=
useNavigate();

const available=
isProductAvailable(p);

const isPreventa=

(p.status||"")
.trim()
.toLowerCase()==="preventa";

const isOutOfStock=

!isPreventa
&&
!!p.price_1
&&
p.stock===0;

const showWhatsAppButton=

isPreventa
||
isOutOfStock;

const cartItem=

cart.find(
item=>
item.id===p.id
);

const qtyInCart=

cartItem?.qty??0;

const isInCart=

qtyInCart>0;

function goToDetail(){

navigate(
`/catalogo/producto.html?id=${p.id}&cat=${p.category}`
);

}

function handleAdd(){

if(
!available
||
isPreventa
)return;

onAddToCart(p);

}

function handleWhatsApp(){

const message=

buildWhatsappMessage(

p,
isPreventa,
isOutOfStock

);

window.open(

`https://wa.me/51936188636?text=${message}`,

"_blank"

);

}

return{

available,
isPreventa,

isOutOfStock,
showWhatsAppButton,

qtyInCart,
isInCart,

goToDetail,
handleAdd,
handleWhatsApp

};

}
