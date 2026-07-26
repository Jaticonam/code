import { CheckCircle,AlertTriangle,Clock,XCircle } from "lucide-react";

interface ProductCardStockProps{stock:number|null|undefined;price:number;status?:string;}

export function ProductCardStock({stock,price,status}:ProductCardStockProps){
  const isPreventa=(status||"").trim().toLowerCase()==="preventa";
  let stockText="",stockColorClass="",StockIcon:typeof CheckCircle=CheckCircle;

  if(isPreventa){stockText="Preventa";stockColorClass="bg-green-100 text-green-700";StockIcon=Clock;}
  else if(!price||price<=0||stock==null){stockText="Próximo";stockColorClass="bg-muted text-muted-foreground";StockIcon=Clock;}
  else if(stock===0){stockText="Agotado";stockColorClass="bg-destructive/10 text-destructive";StockIcon=XCircle;}
  else if(stock<=12){stockText=`Últimas ${stock}`;stockColorClass="bg-red-100 text-red-600";StockIcon=AlertTriangle;}
  else if(stock<=36){stockText="Stock limitado";stockColorClass="bg-orange-100 text-orange-600";StockIcon=AlertTriangle;}
  else if(stock<=50){stockText="Disponible";stockColorClass="bg-green-100 text-green-700";StockIcon=CheckCircle;}
  else{stockText="Alto stock";stockColorClass="bg-emerald-100 text-emerald-700";StockIcon=CheckCircle;}

  return(
    <span className={`inline-flex items-center justify-center gap-1 rounded-full px-2 py-[3px] text-[9px] font-black ${stockColorClass}`}>
      <StockIcon className="h-3 w-3"/>
      {stockText}
    </span>
  );
}