export function useSearchKeyboard(

 activeIndex:number,
 setActiveIndex:(cb:any)=>void,

 total:number,

 suggestions:number,

 onProduct:()=>void,
 onResults:()=>void,

 reset:()=>void

){

 function handleKeyDown(
 event:any
 ){

 if(
 total===0
 )return;

 if(
 event.key==="ArrowDown"
 ){

 event.preventDefault();

 setActiveIndex(
 (c:number)=>

 c<total-1
 ?c+1
 :0

 );

 return;

 }

 if(
 event.key==="ArrowUp"
 ){

 event.preventDefault();

 setActiveIndex(
 (c:number)=>

 c>0
 ?c-1
 :total-1

 );

 return;

 }

 if(
 event.key==="Enter"
 ){

 event.preventDefault();

 if(
 activeIndex>=0
 &&
 activeIndex<
 suggestions
 ){

 onProduct();
 return;

 }

 onResults();
 return;

 }

 if(
 event.key==="Escape"
 ){

 event.preventDefault();
 reset();

 }

 }

 return handleKeyDown;

}
