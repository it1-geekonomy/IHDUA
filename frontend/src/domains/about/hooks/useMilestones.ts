"use client";

import { useEffect, useState } from "react";
import type { Milestone } from "@/domains/about/constants/milestone";
import { fetchPublicMilestones } from "@/domains/about/lib/milestones";

/**
 * Returns:
 *  - `null` while loading
 *  - `[]` if nothing is published or the API fails
 *  - the published CMS milestones (sorted by year ASC by the API)
 * No hardcoded fallback. Called once per visit to the page.
 */
export function useMilestones() {
  const [milestones, setMilestones] = useState<readonly Milestone[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchPublicMilestones()
      .then((items) => {
        const mapped = items
          .filter((m) => m.year !== undefined && m.year !== null && m.description)
          .map((m) => ({
            year: m.year as Milestone["year"],
            description: m.description,
          })) as Milestone[];

        if (!cancelled) setMilestones(mapped);
      })
      .catch(() => {
        if (!cancelled) setMilestones([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return milestones;
}