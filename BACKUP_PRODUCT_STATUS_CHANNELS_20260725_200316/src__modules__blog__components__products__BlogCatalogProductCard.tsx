import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/shared/types/product";

const BADGE_ICONS: Record<string, string> = {
  "san valentin": "❤️",
  "día madre": "🌷",
  "dia madre": "🌷",
  "día padre": "👨",
  "dia padre": "👨",
  "hot wheels": "🏎️",
};

const formatBadge = (value?: string) => {
  if (!value) return "💡 Oportunidad";
  const normalized = value.replace(/-/g, " ").toLowerCase();
  const text = normalized.replace(/\b\w/g, (l) => l.toUpperCase());
  return `${BADGE_ICONS[normalized] || "💡"} ${text}`;
};

const TIERS = [
  { key: "price_3", label: "Mayor", qty: "3u", icon: "🔥" },
  { key: "price_12", label: "Docena", qty: "12u", icon: "⚡" },
  { key: "price_50", label: "Medio ciento", qty: "50u", icon: "🚀" },
  { key: "price_100", label: "Caja", qty: "100u", icon: "💎" },
] as const;

export default function BlogCatalogProductCard({
  product,
}: {
  product: Product;
}) {
  const campaign = formatBadge(product.campaigns?.[0] || product.badges?.[0]);
  const tiers = TIERS.filter((t) => product[t.key]);

  return (
    <Link
      to={`/catalogo/producto.html?id=${product.id}&cat=${product.category}`}
      className="hub-card blog-catalog-product-card"
    >
      <div className="blog-catalog-product-image">
        <img
          src={product.img || "/placeholder.svg"}
          alt={product.title}
          loading="lazy"
        />
        <span>{campaign}</span>
      </div>

      <div className="blog-catalog-product-body">
        <div className="blog-catalog-product-meta">
          <small>{product.id}</small>
          <small>{product.category}</small>
        </div>

        <h3>{product.title}</h3>
        <p>{product.description}</p>

        <div className="blog-catalog-product-price">
          <small>Precio base</small>
          <strong>S/ {Number(product.price_1).toFixed(2)}</strong>
        </div>

        {!!tiers.length && (
          <div className="blog-catalog-product-tiers">
            <b>📦 Precios mayoristas</b>
            {tiers.map((t) => (
              <span key={t.key}>
                <em>
                  {t.icon} {t.label} ({t.qty})
                </em>
                <strong>S/{Number(product[t.key]).toFixed(2)}</strong>
              </span>
            ))}
          </div>
        )}

        <b className="blog-catalog-product-cta">
          Ver oportunidad <ArrowRight size={15} />
        </b>
      </div>
    </Link>
  );
}
