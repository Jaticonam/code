import{

CheckCircle2,
X

}

from "lucide-react";

interface Props{

title:string;

product:string;

onClose:()=>void;

}

export function AddToCartModalHeader({

title,
product,
onClose

}:Props){

return(

<div className="flex items-start justify-between gap-3">

<div className="flex gap-3">

<div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dcfce7] text-[#16a34a]">

<CheckCircle2
className="h-5 w-5"
/>

</div>

<div>

<h3 className="text-[16px] font-extrabold text-[#334155]">

{title}

</h3>

<p className="line-clamp-1 text-[12px] font-medium text-[#64748b]">

{product}

</p>

</div>

</div>

<button

onClick={onClose}

className="rounded-full p-1"

>

<X
className="h-4 w-4"
/>

</button>

</div>

);

}
