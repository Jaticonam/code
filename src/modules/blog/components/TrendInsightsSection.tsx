import { Link } from "react-router-dom";
import { ArrowRight, Flame, Rocket, TrendingUp } from "lucide-react";
import { FALLBACK_TRENDS } from "../data/fallbackTrends";

const RADAR=[
  {name:"Flores",score:88},
  {name:"Papel",score:76},
  {name:"Peluches",score:61},
  {name:"Corporativo",score:42}
];

export default function TrendInsightsSection(){
  return(
    <section className="trend-insights-section">
      <div className="trend-insights-head">
        <span><TrendingUp size={16}/> TENDENCIAS WOOLY</span>
        <h2>Lo que mueve oportunidades hoy</h2>
        <p>Señales comerciales para descubrir productos, categorías e ideas que pueden ayudarte a vender mejor.</p>
      </div>

      <div className="trend-insights-grid trend-insights-grid-pro">
        <article className="trend-insights-card trend-hot-card">
          <h3><Flame size={18}/> Productos calientes</h3>

          {FALLBACK_TRENDS.map(trend=>(
            <Link key={trend.id} to={trend.href} className="trend-hot-item">
              <div className="trend-insights-main">
                <div className="trend-insights-emoji">{trend.emoji}</div>
                <div>
                  <small>{trend.label}</small>
                  <strong>{trend.title}</strong>
                </div>
              </div>

              <b>{trend.metric}</b>
            </Link>
          ))}
        </article>

        <article className="trend-insights-card trend-radar-card">
          <h3>📊 Radar comercial</h3>

          {RADAR.map(item=>(
            <div key={item.name} className="trend-radar-item">
              <div>
                <span>{item.name}</span>
                <small>{item.score}%</small>
              </div>

              <div className="trend-radar-bar">
                <i style={{width:`${item.score}%`}}/>
              </div>
            </div>
          ))}
        </article>

        <article className="trend-insights-card trend-opportunity-card">
          <h3><Rocket size={18}/> Oportunidad Wooly</h3>
          <p>Día de la Madre impulsa flores premium, papel coreano, cajas y regalos emocionales.</p>

          <Link to="/catalogo">
            Ver productos <ArrowRight size={15}/>
          </Link>
        </article>
      </div>
    </section>
  );
}