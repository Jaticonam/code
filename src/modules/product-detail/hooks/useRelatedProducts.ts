import{
 useMemo
}
from"react";

export function
useRelatedProducts(

 products,
 product

){

 return useMemo(()=>{

 if(
 !product
 ){

 return[];

 }

 const same=

 products.filter(

 item=>

 item.category===
 product.category
 &&

 item.id!==
 product.id

 );

 const other=

 products.filter(

 item=>

 item.category!==
 product.category
 &&

 item.id!==
 product.id

 );

 return[

 ...same.slice(
 0,
 4
 ),

 ...other.slice(
 0,
 4
 )

 ];

 },[
 products,
 product
 ]);

}
