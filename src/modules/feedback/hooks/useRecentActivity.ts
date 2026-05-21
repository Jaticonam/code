import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "@/shared/types/product";

import {
  RECENT_ACTIVITY_ACTIONS,
  RECENT_ACTIVITY_NAMES,
  RECENT_ACTIVITY_PLACES,
  RECENT_ACTIVITY_TIMING,
} from "@/modules/feedback/config/recentActivity";

import {
  randomDelay,
  randomItem,
  randomMinutes,
} from "@/shared/lib/random";

export interface RecentActivityData {
  name: string;
  place: string;
  action: string;
  product: string;
  time: number;
}

export function useRecentActivity(products: Product[]) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const [data, setData] = useState<RecentActivityData>({
    name: "",
    place: "",
    action: "",
    product: "",
    time: 0,
  });

  const lastProductRef = useRef<string | null>(null);
  const timersRef = useRef<number[]>([]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay);
    timersRef.current.push(id);
  }, []);

  const show = useCallback(() => {
    if (products.length === 0) return;

    let selected = randomItem(products);

    if (products.length > 1 && selected.title === lastProductRef.current) {
      selected = randomItem(products);
    }

    lastProductRef.current = selected.title;

    setData({
      name: randomItem(RECENT_ACTIVITY_NAMES),
      place: randomItem(RECENT_ACTIVITY_PLACES),
      action: randomItem(RECENT_ACTIVITY_ACTIONS),
      product: selected.title,
      time: randomMinutes(1, 6),
    });

    setLeaving(false);
    setVisible(true);

    schedule(() => {
      setLeaving(true);

      schedule(() => {
        setVisible(false);

        schedule(
          show,
          randomDelay(
            RECENT_ACTIVITY_TIMING.nextMinDelay,
            RECENT_ACTIVITY_TIMING.nextMaxExtraDelay
          )
        );
      }, RECENT_ACTIVITY_TIMING.exitDuration);
    }, RECENT_ACTIVITY_TIMING.visibleDuration);
  }, [products, schedule]);

  useEffect(() => {
    clearAllTimers();

    if (products.length === 0) return;

    schedule(show, RECENT_ACTIVITY_TIMING.firstDelay);

    return clearAllTimers;
  }, [products, show, schedule, clearAllTimers]);

  return {
    visible,
    leaving,
    data,
  };
}
