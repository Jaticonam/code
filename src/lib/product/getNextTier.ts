import type{
 Product
}
from "@/types/product";

export function
getNextTier(

 qty:number,
 product:Product

){

 if(
 qty<3
 &&
 product.price_3
 ){

 return{

 qty:3,
 price:product.price_3

 };

 }

 if(
 qty<12
 &&
 product.price_12
 ){

 return{

 qty:12,
 price:product.price_12

 };

 }

 if(
 qty<50
 &&
 product.price_50
 ){

 return{

 qty:50,
 price:product.price_50

 };

 }

 if(
 qty<100
 &&
 product.price_100
 ){

 return{

 qty:100,
 price:product.price_100

 };

 }

 return null;

}
