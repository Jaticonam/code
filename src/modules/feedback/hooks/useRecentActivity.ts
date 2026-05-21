import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "@/shared/types/product";

import {
  RECENT_ACTIVITY_ACTIONS,
  RECENT_ACTIVITY_NAMES,
  RECENT_ACTIVITY_PLACES,
  RECENT_ACTIVITY_TIMING,
} from "@/modules/feedback/config/recentActivity";

import { randomDelay, randomItem, randomMinutes } from "@/shared/lib/random";

export interface RecentActivityData {
  name: string;
  place: string;
  action: string;
  product: string;
  time: number;
}

const EMPTY_ACTIVITY: RecentActivityData = {
  name: "",
  place: "",
  action: "",
  product: "",
  time: 0,
};

export function useRecentActivity(products: Product[]) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [data, setData] = useState<RecentActivityData>(EMPTY_ACTIVITY);

  const lastProductRef = useRef<string | null>(null);
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(window.clearTimeout);
    timersRef.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay);
    timersRef.current.push(id);
  }, []);

  const pickProduct = useCallback(() => {
    const available =
      products.length > 1
        ? products.filter((p) => p.title !== lastProductRef.current)
        : products;

    const selected = randomItem(available);
    lastProductRef.current = selected.title;

    return selected;
  }, [products]);

  const show = useCallback(() => {
    if (!products.length) return;

    const selected = pickProduct();

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
  }, [products.length, pickProduct, schedule]);

  useEffect(() => {
    clearTimers();

    if (products.length) {
      schedule(show, RECENT_ACTIVITY_TIMING.firstDelay);
    }

    return clearTimers;
  }, [products.length, show, schedule, clearTimers]);

  return { visible, leaving, data };
}