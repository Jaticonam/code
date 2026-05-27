import { CAMPAIGN_CONFIG } from "@/shared/config/campaigns";
import "@/shared/styles/catalog/campaign-filter.css";

interface Props {
  active: string;
  counts?: Record<string, number>;
  onSelect: (id: string) => void;
}

const CAMPAIGN_STYLE: Record<string, string> = {
  "todo-el-ano": "from-[var(--w-primary)] to-[var(--w-primary-dark)]",
  "san-valentin": "from-[#f286be] to-[#ffb7d5]",
  "dia-padre": "from-[#1e3a8a] to-[#3b82f6]",
  "dia-madre": "from-[#d946ef] to-[#f9a8d4]",
  "dia-mujer": "from-[#be185d] to-[#fb7185]",
  escolar: "from-[#0f766e] to-[#22c55e]",
  graduaciones: "from-[#7c3aed] to-[#a78bfa]",
  "flores-amarillas": "from-[#f5b025] to-[#facc15]",
  "hot-wheels": "from-[#dc2626] to-[#f97316]",
};

export function CampaignFilter({ active, counts = {}, onSelect }: Props) {
  const visible = CAMPAIGN_CONFIG.filter((c) => (counts[c.id] ?? 0) > 0);
  if (!visible.length) return null;

  return (
    <div>
      <h2 className="campaign-filter-title">Campañas activas</h2>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {visible.map((c) => {
          const isActive = active === c.id;
          const gradient =
            CAMPAIGN_STYLE[c.id] || "from-primary to-primary-dark";

          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(isActive ? "" : c.id)}
              className={`relative min-h-[104px] overflow-hidden rounded-[22px] border p-4 text-left transition-all duration-200 active:scale-[.98] ${
                isActive
                  ? "border-transparent bg-gradient-to-tr from-[var(--w-primary)] to-[var(--w-primary-dark)] text-white shadow-[0_16px_34px_rgba(29,130,153,.22)]"
                  : `border-transparent bg-gradient-to-tr ${gradient} text-white shadow-[0_8px_20px_rgba(15,23,42,.08)]`
              }`}
            >
              {isActive && (
                <span className="absolute right-2 top-2 rounded-full bg-white/20 px-2 py-[3px] text-[9px] font-black backdrop-blur-md">
                  ACTIVA
                </span>
              )}

              <div className="relative z-10 flex h-full flex-col justify-center">
                <div>
                  <h3 className="campaign-title">{c.name}</h3>

                  <p className="campaign-subtitle">
                    {counts[c.id] ?? 0} productos
                  </p>
                </div>
              </div>

              <div
                className={`campaign-ghost absolute bottom-0 right-[-10px] leading-none ${
                  isActive ? "text-white/14" : "text-white/22"
                }`}
              >
                {c.icon}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
