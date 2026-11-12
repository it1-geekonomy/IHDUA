export type MilestoneStatus = "draft" | "published" | "archived";

export type ApiMilestone = {
  id: string;
  year: string | number;
  description: string;
  status?: MilestoneStatus;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Request currently in flight. Strict Mode's second effect run happens
 * before the response arrives, so it reuses this promise (1 call, not 2).
 * It is cleared as soon as the request settles, so the next page visit
 * always makes a fresh call.
 */
let inFlight: Promise<ApiMilestone[]> | null = null;

export function fetchPublicMilestones(): Promise<ApiMilestone[]> {
  if (inFlight) return inFlight;

  const request = fetch(`${API_URL}/milestones/year-wise`, {
    headers: { accept: "application/json" },
  })
    .then(async (res) => {
      if (!res.ok) throw new Error(`Failed to load milestones (${res.status})`);
      const json = await res.json();
      // Handles both { statusCode, data: [...] } and a bare array
      return (Array.isArray(json) ? json : (json?.data ?? [])) as ApiMilestone[];
    })
    .finally(() => {
      inFlight = null;
    });

  inFlight = request;
  return request;
}