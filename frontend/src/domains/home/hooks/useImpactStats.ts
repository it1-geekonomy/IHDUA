"use client";

import { useEffect, useState } from "react";
import { STAT_SETS, type StatValue } from "@/domains/home/constants/stat";
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

const statToSheet = (stat: StatValue, key: string): Sheet => {
  const decimals = stat.decimals ?? 0;
  const formatted = stat.value.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return {
    id: key,
    display: `${stat.prefix ?? ""}${formatted}${stat.suffix ?? ""}`,
    label: stat.label,
  };
};

/** Static data, shaped per slot: result[slotIndex] = sheets for that card. */
const buildFallback = (): Sheet[][] =>
  Array.from({ length: SLOT_COUNT }, (_, slot) =>
    STAT_SETS.map((set, step) =>
      set[slot] ? statToSheet(set[slot], `static-${slot}-${step}`) : null,
    ).filter((s): s is Sheet => s !== null),
  );

/** Result kept after the first load, so remounting shows the cards instantly with no new call. */
let resolvedSlots: Sheet[][] | null = null;

/**
 * Returns `null` while loading, then one sheet list per card slot.
 * Any slot with no API stats (or everything, if the API fails)
 * falls back to the static STAT_SETS data.
 */
export function useImpactStats() {
  const [slots, setSlots] = useState<Sheet[][] | null>(resolvedSlots);

  useEffect(() => {
    if (resolvedSlots) return; // already loaded earlier in this session

    let cancelled = false;
    const fallback = buildFallback();

    fetchPublicImpactStats()
      .then((stats) => {
        const fromApi: Sheet[][] = Array.from({ length: SLOT_COUNT }, () => []);

        for (const s of stats) {
          const slot = CARD_POSITION_INDEX[s.cardPosition];
          if (slot === undefined || !s.metricName || !s.metricValue) continue;
          fromApi[slot].push({
            id: s.id,
            display: s.metricValue,
            label: s.metricName,
          });
        }

        resolvedSlots = fromApi.map((sheets, i) => (sheets.length > 0 ? sheets : fallback[i]));
        if (!cancelled) setSlots(resolvedSlots);
      })
      .catch(() => {
        if (!cancelled) setSlots(fallback);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return slots;
}