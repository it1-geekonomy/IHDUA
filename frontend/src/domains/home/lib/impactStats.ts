export type CardPosition = "first" | "second" | "third" | "fourth";

export type ImpactStat = {
  id: string;
  cardPosition: CardPosition;
  metricName: string;
  metricValue: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const CARD_POSITION_INDEX: Record<CardPosition, number> = {
  first: 0,
  second: 1,
  third: 2,
  fourth: 3,
};

/**
 * One shared request for the whole page session.
 * Strict Mode double effects, remounts and back/forward navigation all reuse it,
 * so /impact-stats/public is requested once per full page load.
 */
let request: Promise<ImpactStat[]> | null = null;

export function fetchPublicImpactStats(): Promise<ImpactStat[]> {
  if (request) return request;

  request = fetch(`${API_URL}/impact-stats/public`, {
    headers: { accept: "application/json" },
  })
    .then(async (res) => {
      if (!res.ok) throw new Error(`Failed to load impact stats (${res.status})`);
      const json = await res.json();
      // Handles both { statusCode, data: [...] } and a bare array
      return (Array.isArray(json) ? json : (json?.data ?? [])) as ImpactStat[];
    })
    .catch((err) => {
      request = null; // don't cache failures, so the next mount can retry
      throw err;
    });

  return request;
}