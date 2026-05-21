import{
 CheckCircle,
 AlertTriangle,
 Clock,
 XCircle
}
from"lucide-react";

export function
getStockPresentation(

 product:any,
 isPreventa:boolean,

){

 if(
 isPreventa
 ){

 return{

 text:"Preventa",
 icon:Clock,
 className:
 "bg-green-50 text-green-700"

 };

 }

 if(
 !product?.price_1
 ||
 product.stock===null
 ){

 return{

 text:"Próximo",
 icon:Clock,
 className:
 "bg-slate-100 text-slate-600"

 };

 }

 if(
 product.stock===0
 ){

 return{

 text:"Agotado",
 icon:XCircle,
 className:
 "bg-red-50 text-red-600"

 };

 }

 if(
 product.stock<=12
 ){

 return{

 text:
 `Últimas:${product.stock}`,

 icon:
 AlertTriangle,

 className:
 "bg-red-50 text-red-600"

 };

 }

 if(
 product.stock<=36
 ){

 return{

 text:
 "Stock limitado",

 icon:
 AlertTriangle,

 className:
 "bg-orange-50 text-orange-600"

 };

 }

 return{

 text:
 "Disponible",

 icon:
 CheckCircle,

 className:
 "bg-green-50 text-green-700"

 };

}
