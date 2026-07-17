import "./HeaderCampaignFilter.css";
export interface HeaderCampaignOption {
  id: string;
  name: string;
  icon: string;
  colorClass: string;
}

interface HeaderCampaignFilterProps {
  campaigns: ReadonlyArray<HeaderCampaignOption>;
  active: string;
  counts?: Record<string, number>;
  show?: boolean;
  onSelect: (id: string) => void;
}

export function HeaderCampaignFilter({
  campaigns,
  active,
  counts = {},
  show = true,
  onSelect,
}: HeaderCampaignFilterProps) {
  const visibleCampaigns = campaigns.filter(
    (campaign) => (counts[campaign.id] ?? 0) > 0,
  );

  if (!show || visibleCampaigns.length === 0) {
    return null;
  }

  return (
    <div className="header-campaign-filter" aria-label="Filtros de campaña">
      {visibleCampaigns.map((campaign) => {
        const isActive = active === campaign.id;
        const count = counts[campaign.id] ?? 0;

        return (
          <button
            key={campaign.id}
            type="button"
            onClick={() => onSelect(isActive ? "" : campaign.id)}
            className={[
              "header-campaign-chip",
              campaign.colorClass,
              isActive ? "active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-pressed={isActive}
            title={campaign.name}
          >
            <div className="header-campaign-content">
              <span className="header-campaign-name">{campaign.name}</span>

              <span className="header-campaign-count">
                {count} {count === 1 ? "producto" : "productos"}
              </span>
            </div>

            <span className="header-campaign-icon" aria-hidden="true">
              {campaign.icon}
            </span>
          </button>
        );
      })}
    </div>
  );
}
