import { Link } from "react-router-dom";
import { ArrowRight, FlaskConical } from "lucide-react";
import { FALLBACK_IDEAS } from "../data/fallbackIdeas";

export default function IdeaLabSection(){
  return(
    <section className="idea-lab-section">
      <div className="idea-lab-head">
        <span><FlaskConical size={16}/> LABORATORIO IDEAS WOOLY</span>
        <h2>¿Qué oportunidad puedes vender hoy?</h2>
        <p>
          Ideas accionables para convertir productos del catálogo en propuestas
          comerciales con mejor margen y mayor valor percibido.
        </p>
      </div>

      <div className="idea-lab-grid">
        {FALLBACK_IDEAS.map(idea=>(
          <article key={idea.id} className="idea-lab-card">
            <div className="idea-lab-top">
              <div className="idea-lab-emoji">{idea.emoji}</div>
              <span>{idea.label}</span>
            </div>

            <h3>{idea.title}</h3>
            <p>{idea.description}</p>

            <div className="idea-lab-products">
              {idea.products.map(product=>(
                <small key={product}>{product}</small>
              ))}
            </div>

            <Link to={idea.href}>
              Ver idea <ArrowRight size={16}/>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
