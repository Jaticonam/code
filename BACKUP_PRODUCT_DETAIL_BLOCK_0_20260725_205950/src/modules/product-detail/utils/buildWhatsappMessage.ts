import type { Product } from "@/shared/types/product";

export function buildWhatsappMessage(
 product:Product,
 isPreventa:boolean,
 isOutOfStock:boolean
){

if(isPreventa){

return[
"Hola, quiero información sobre este producto en preventa:",
"",
`ID: ${product.id}`,
`Producto: ${product.title}`,
`Categoría: ${product.category}`
].join("%0A");

}

if(isOutOfStock){

return[
"Hola, quiero pedir reposición de este producto:",
"",
`ID: ${product.id}`,
`Producto: ${product.title}`,
`Categoría: ${product.category}`
].join("%0A");

}

return[
"Hola, quiero más información sobre este producto:",
"",
`ID: ${product.id}`,
`Producto: ${product.title}`,
`Categoría: ${product.category}`
].join("%0A");

}
