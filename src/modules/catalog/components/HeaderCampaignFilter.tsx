import { CAMPAIGN_CONFIG } from "@/shared/config/campaigns";
import "./HeaderCampaignFilter.css";

export interface HeaderCampaignOption {
  id: string;
  name: string;
  icon: string;
  colorClass?: string;
}

interface Props {
  campaigns?: ReadonlyArray<HeaderCampaignOption>;
  active: string;
  counts?: Record<string, number>;
  show?: boolean;
  onSelect: (id: string) => void;
}

export function HeaderCampaignFilter({
  campaigns = CAMPAIGN_CONFIG,
  active,
  counts = {},
  show = false,
  onSelect,
}: Props) {
  if (!show) return null;

  const visible = campaigns.filter((c) => (counts[c.id] ?? 0) > 0);
  if (!visible.length) return null;

  return (
    <div className="header-campaign-filter">
      {visible.map((c) => {
        const count = counts[c.id] ?? 0;
        const isActive = active === c.id;
        const styleClass = c.colorClass ?? "catalog-campaign-purple";

        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(isActive ? "" : c.id)}
            className={`header-campaign-chip ${styleClass} ${
              isActive ? "active" : ""
            }`}
          >
            <span className="header-campaign-content">
              <span className="header-campaign-name">{c.name}</span>

              <span className="header-campaign-count">
                {count} {count === 1 ? "producto" : "productos"} de campaña
              </span>
            </span>

            <span className="header-campaign-icon">{c.icon}</span>
          </button>
        );
      })}
    </div>
  );
}
