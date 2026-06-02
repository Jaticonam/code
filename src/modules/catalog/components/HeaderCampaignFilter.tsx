import { CAMPAIGN_CONFIG } from "@/shared/config/campaigns";
import "@/shared/styles/catalog/header-campaign-filter.css";

interface Props {
  active: string;
  counts?: Record<string, number>;
  show?: boolean;
  onSelect: (id: string) => void;
}

const CAMPAIGN_STYLE: Record<string, string> = {
  "todo-el-ano": "header-campaign-teal",
  "san-valentin": "header-campaign-pink",
  "dia-padre": "header-campaign-blue",
  "dia-madre": "header-campaign-purple",
  "dia-mujer": "header-campaign-rose",
  escolar: "header-campaign-green",
  graduaciones: "header-campaign-violet",
  "flores-amarillas": "header-campaign-yellow",
  "hot-wheels": "header-campaign-red",
};

export function HeaderCampaignFilter({
  active,
  counts = {},
  show = false,
  onSelect,
}: Props) {
  if (!show) return null;

  const visible = CAMPAIGN_CONFIG.filter((c) => (counts[c.id] ?? 0) > 0);
  if (!visible.length) return null;

  return (
    <div className="header-campaign-filter">
      {visible.map((c) => {
        const isActive = active === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(isActive ? "" : c.id)}
            className={`header-campaign-chip ${CAMPAIGN_STYLE[c.id]} ${isActive ? "active" : ""}`}
          >
            <div className="header-campaign-content">
              <span className="header-campaign-name">{c.name}</span>
              <span className="header-campaign-count">
                {counts[c.id] ?? 0} productos
              </span>
            </div>
            <span className="header-campaign-icon">{c.icon}</span>
          </button>
        );
      })}
    </div>
  );
}
