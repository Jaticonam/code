import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, CheckCircle2 } from "lucide-react";
import { FALLBACK_CAMPAIGNS } from "../data/fallbackCampaigns";

export default function CampaignCenterSection(){
  return(
    <section className="campaign-center-section">
      <div className="campaign-center-head">
        <span><CalendarDays size={16}/> CAMPAÑAS COMERCIALES</span>
        <h2>Prepárate antes que todos</h2>
        <p>
          Fechas clave para planificar inventario, crear combos y vender con más intención.
        </p>
      </div>

      <div className="campaign-center-grid">
        {FALLBACK_CAMPAIGNS.map(campaign=>(
          <article key={campaign.id} className="campaign-center-card">
            <div className="campaign-center-emoji">{campaign.emoji}</div>
            <small>{campaign.season}</small>
            <h3>{campaign.title}</h3>
            <p>{campaign.description}</p>

            <div className="campaign-center-checklist">
              {campaign.checklist.map(item=>(
                <span key={item}><CheckCircle2 size={13}/>{item}</span>
              ))}
            </div>

            <Link to={campaign.href}>
              Preparar campaña <ArrowRight size={16}/>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
