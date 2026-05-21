import type { Product } from "@/types/product";

import { useRecentActivity } from "@/hooks/useRecentActivity";
import { RecentActivityCard } from "@/components/RecentActivityCard";

interface RecentActivityProps {
  products: Product[];
}

export function RecentActivity({
  products,
}: RecentActivityProps) {
  const {
    visible,
    leaving,
    data,
  } = useRecentActivity(products);

  if (!visible) return null;

  return (
    <RecentActivityCard
      data={data}
      leaving={leaving}
    />
  );
}
