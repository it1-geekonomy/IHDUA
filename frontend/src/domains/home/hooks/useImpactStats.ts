"use client";

import { useEffect, useState } from "react";
import {
  CARD_POSITION_INDEX,
  fetchPublicImpactStats,
} from "@/domains/home/lib/impactStats";

export type Sheet = {
  id: string;
  display: string;
  label: string;
};

export const SLOT_COUNT = 4;

const emptySlots = (): Sheet[][] => Array.from({ length: SLOT_COUNT }, () => []);

/**
 * Returns `null` while loading, then one sheet list per card slot.
 * A slot with nothing published is an empty list. If the API fails, every
 * slot is empty. There is no static fallback. Called once per visit.
 */
export function useImpactStats() {
  const [slots, setSlots] = useState<Sheet[][] | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchPublicImpactStats()
      .then((stats) => {
        const fromApi = emptySlots();

        for (const s of stats) {
          const slot = CARD_POSITION_INDEX[s.cardPosition];
          if (slot === undefined || !s.metricName || !s.metricValue) continue;
          fromApi[slot].push({
            id: s.id,
            display: s.metricValue,
            label: s.metricName,
          });
        }

        if (!cancelled) setSlots(fromApi);
      })
      .catch(() => {
        if (!cancelled) setSlots(emptySlots());
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return slots;
}