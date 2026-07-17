import {
  CAMPAIGN_CONFIG,
  getCampaignStyle,
} from "@/shared/config/campaigns";

import "@/shared/styles/catalog/header-campaign-filter.css";

interface HeaderCampaignFilterProps {
  active: string;
  counts?: Record<string, number>;
  onSelect: (id: string) => void;
}

export function HeaderCampaignFilter({
  active,
  counts = {},
  onSelect,
}: HeaderCampaignFilterProps) {
  const visibleCampaigns = CAMPAIGN_CONFIG.filter(
    (campaign) => (counts[campaign.id] ?? 0) > 0,
  );

  if (!visibleCampaigns.length) return null;

  return (
    <div className="header-campaign-filter">
      {visibleCampaigns.map((campaign) => {
        const isActive = active === campaign.id;
        const count = counts[campaign.id] ?? 0;

        return (
          <button
            key={campaign.id}
            type="button"
            onClick={() => onSelect(isActive ? "" : campaign.id)}
            className={`header-campaign-chip ${
              isActive ? "active" : ""
            }`}
            style={isActive ? undefined : getCampaignStyle(campaign.id)}
            aria-pressed={isActive}
            title={campaign.name}
          >
            <div className="header-campaign-content">
              <span className="header-campaign-name">
                {campaign.name}
              </span>

              <span className="header-campaign-count">
                {count} {count === 1 ? "producto" : "productos"}
              </span>
            </div>

            <span
              className="header-campaign-icon"
              aria-hidden="true"
            >
              {campaign.icon}
            </span>
          </button>
        );
      })}
    </div>
  );
}