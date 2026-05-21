import type { RecentActivityData } from "@/modules/feedback/hooks/useRecentActivity";

interface RecentActivityCardProps {
  data: RecentActivityData;
  leaving: boolean;
}

export function RecentActivityCard({
  data,
  leaving,
}: RecentActivityCardProps) {
  const initial = data.name.charAt(0);

  return (
    <div
      className={`fixed bottom-[calc(env(safe-area-inset-bottom)+110px)] left-4 z-[999] ${
        leaving ? "animate-recent-activity-out" : "animate-recent-activity-in"
      }`}
    >
      <div className="w-[320px] rounded-3xl border border-[#e2e8f0] bg-white/95 px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.12)] backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1d8299] text-white text-sm font-semibold">
            {initial}
          </div>

          <div className="min-w-0">
            <p className="text-[13px] leading-snug text-[#334155]">
              <span className="font-semibold text-[#0f172a]">
                {data.name}
              </span>{" "}
              de{" "}
              <span className="text-[#64748b]">
                {data.place}
              </span>{" "}
              <span className="text-[#475569]">
                {data.action}
              </span>{" "}
              <span className="font-semibold text-[#0f172a] line-clamp-1">
                {data.product}
              </span>
            </p>

            <p className="mt-1 text-[11px] text-[#94a3b8]">
              {data.time <= 2 ? "hace unos segundos" : `hace ${data.time} min`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
