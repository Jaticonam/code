import { CheckCircle2, X } from "lucide-react";

interface Props{onClose:()=>void;}

export function AddToCartModalHeader({onClose}:Props){
  return(
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-[#1d8299] via-[#228da5] to-[#156f84] text-white shadow-[0_12px_28px_rgba(29,130,153,.28)] ring-1 ring-black/5 backdrop-blur-sm">
         <CheckCircle2 className="h-[18px] w-[18px] stroke-[3.2] drop-shadow-[0_1px_2px_rgba(0,0,0,.18)]"/>
        </div>
        <div className="min-w-0">
          <h3 className="text-[17px] font-black leading-tight text-[#0f172a]">Tu caja está creciendo 🚀</h3>
          <p className="mt-0.5 text-[12px] font-bold text-[#1d8299]">Sigue sumando y mejora tu precio</p>
        </div>
      </div>

      <button onClick={onClose} className="rounded-full p-1.5 text-[#94a3b8] transition hover:bg-[#f1f5f9] hover:text-[#334155]" aria-label="Cerrar modal">
        <X className="h-4 w-4"/>
      </button>
    </div>
  );
}