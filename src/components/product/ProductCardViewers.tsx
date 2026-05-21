interface ProductCardViewersProps{

viewers:number;

}

export function ProductCardViewers({

viewers

}:ProductCardViewersProps){

return(

<p
className="inline-flex items-center justify-center gap-1 text-[11px] text-slate-500"
>

👀

<span>

{viewers}

viendo ahora

</span>

</p>

);

}
