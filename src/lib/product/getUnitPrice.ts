import type { Product } from "@/types/product";

export function getUnitPrice(
 qty:number,
 product:Product
){

 if(
 qty>=100
 &&
 product.price_100
 ){
  return product.price_100;
 }

 if(
 qty>=50
 &&
 product.price_50
 ){
  return product.price_50;
 }

 if(
 qty>=12
 &&
 product.price_12
 ){
  return product.price_12;
 }

 if(
 qty>=3
 &&
 product.price_3
 ){
  return product.price_3;
 }

 return product.price_1||0;

}
