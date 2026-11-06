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
 * Request currently in flight. Strict Mode's second effect run happens
 * before the response arrives, so it reuses this promise (1 call, not 2).
 * It is cleared as soon as the request settles, so the next visit to
 * the Home page always makes a fresh call.
 */
let inFlight: Promise<ImpactStat[]> | null = null;

export function fetchPublicImpactStats(): Promise<ImpactStat[]> {
  if (inFlight) return inFlight;

  const request = fetch(`${API_URL}/impact-stats/public`, {
    headers: { accept: "application/json" },
  })
    .then(async (res) => {
      if (!res.ok) throw new Error(`Failed to load impact stats (${res.status})`);
      const json = await res.json();
      // Handles both { statusCode, data: [...] } and a bare array
      return (Array.isArray(json) ? json : (json?.data ?? [])) as ImpactStat[];
    })
    .finally(() => {
      inFlight = null;
    });

  inFlight = request;
  return request;
}