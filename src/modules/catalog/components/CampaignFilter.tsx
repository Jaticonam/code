import { CAMPAIGN_CONFIG } from "@/shared/config/campaigns";

interface Props {
  active:string;
  onSelect:(id:string)=>void;
}

export function CampaignFilter({
  active,
  onSelect
}:Props){

  return(

    <div className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">

      <button
        onClick={()=>onSelect("")}
        className={`
          shrink-0 rounded-full px-4 py-2
          text-[12px] font-black transition
          ${
            !active
            ? "bg-primary text-white"
            : "bg-muted hover:bg-muted/80"
          }
        `}
      >
        🚀 Todas
      </button>

      {CAMPAIGN_CONFIG.map(campaign=>(

        <button
          key={campaign.id}
          onClick={()=>onSelect(campaign.id)}
          className={`
            shrink-0 rounded-full
            px-4 py-2
            text-[12px]
            font-black
            transition
            ${
              active===campaign.id
              ? "bg-primary text-white"
              : "bg-muted hover:bg-muted/80"
            }
          `}
        >
          {campaign.icon} {campaign.name}
        </button>

      ))}

    </div>

  );

}