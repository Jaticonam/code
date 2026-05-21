import { Product } from "@/types/product";

export interface NextTier {

targetQty:number;

unitPrice:number;

}

export function getNextTier(

product:Product,
qty:number

):NextTier|null{

const tiers=[

{

targetQty:3,
unitPrice:product.price_3

},

{

targetQty:12,
unitPrice:product.price_12

},

{

targetQty:50,
unitPrice:product.price_50

},

{

targetQty:100,
unitPrice:product.price_100

}

];

const valid=

tiers.filter(

tier=>

typeof tier.unitPrice==="number"

&&

Number.isFinite(
tier.unitPrice
)

&&

tier.unitPrice>0

);

return(

valid.find(

tier=>

qty<tier.targetQty

)

??null

);

}
