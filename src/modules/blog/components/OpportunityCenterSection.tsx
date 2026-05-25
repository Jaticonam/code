import { Link } from "react-router-dom";
import { ArrowRight, Lightbulb, Zap } from "lucide-react";
import { FALLBACK_OPPORTUNITIES } from "../data/fallbackOpportunities";

export default function OpportunityCenterSection(){
  const main=FALLBACK_OPPORTUNITIES[0];
  const rest=FALLBACK_OPPORTUNITIES.slice(1);

  return(
    <section className="opportunity-center-section">
      <div className="opportunity-center-head">
        <span><Lightbulb size={16}/> OPORTUNIDAD WOOLY</span>
        <h2>Ideas comerciales listas para convertir</h2>
        <p>Detecta campañas, productos y combinaciones que pueden ayudarte a vender con más intención.</p>
      </div>

      <div className="opportunity-center-layout">
        <article className="opportunity-main-card">
          <div className="opportunity-main-top">
            <div className="opportunity-emoji">{main.emoji}</div>
            <span><Zap size={14}/> Recomendación activa</span>
          </div>

          <h3>{main.title}</h3>
          <p>{main.subtitle}</p>

          <div className="opportunity-metrics">
            {main.metrics.map(m=>(
              <div key={m.label} className="opportunity-metric">
                <div><strong>{m.label}</strong><small>{m.score}%</small></div>
                <span><i style={{width:`${m.score}%`}}/></span>
              </div>
            ))}
          </div>

          <div className="opportunity-action-box">
            <b>Acción recomendada</b>
            <p>{main.action}</p>
          </div>

          <Link to={main.href} className="opportunity-button">
            Ver oportunidad <ArrowRight size={16}/>
          </Link>
        </article>

        <div className="opportunity-side-list">
          {rest.map(item=>(
            <Link key={item.id} to={item.href} className="opportunity-mini-card">
              <div className="opportunity-emoji small">{item.emoji}</div>
              <div>
                <small>Oportunidad</small>
                <strong>{item.title}</strong>
                <p>{item.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
