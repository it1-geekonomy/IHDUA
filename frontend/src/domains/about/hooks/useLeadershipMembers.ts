"use client";

import { useEffect, useState } from "react";
import { fetchPublishedLeadership } from "@/domains/about/lib/leadership";

export type Leader = {
  id: string;
  name: string;
  designation: string;
  image: string | null;
};

/**
 * Returns `null` while loading, then the published leaders ordered by
 * `sortOrder` (ties: oldest first). An empty list means nothing is
 * published or the API failed. There is no static fallback.
 * Called once per visit.
 */
export function useLeadershipMembers() {
  const [leaders, setLeaders] = useState<Leader[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchPublishedLeadership()
      .then((members) => {
        const list = members
          .filter((m) => m.name)
          .sort((a, b) => {
            const bySort = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
            return bySort !== 0
              ? bySort
              : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          })
          .map<Leader>((m) => ({
            id: m.id,
            name: m.name,
            designation: m.designation ?? "",
            image: m.photoUrl || null,
          }));

        if (!cancelled) setLeaders(list);
      })
      .catch(() => {
        if (!cancelled) setLeaders([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return leaders;
}