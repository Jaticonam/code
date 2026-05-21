import { useNavigate } from "react-router-dom";
import type { Product } from "@/types/product";

export function useSearchNavigation(
 value:string,
 onChange:(value:string)=>void,
 setActiveIndex:(n:number)=>void,
 setFocused:(v:boolean)=>void
){

 const navigate=
 useNavigate();

 const reset=()=>{

 onChange("");
 setActiveIndex(-1);
 setFocused(false);

 };

 const goToProduct=(product:Product)=>{

 const current=
 value.trim();

 reset();

 navigate(
 `/catalogo/producto.html?id=${product.id}&cat=${product.category}`,
 {
 state:{
 fromSearch:true,
 searchQuery:current
 }
 });

 };

 const goToCategory=(
 category:string
 )=>{

 reset();

 navigate(
 `/catalogo/categoria.html?cat=${category}`
 );

 };

 return{

 goToProduct,
 goToCategory

 };

}
