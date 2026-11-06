export type LeadershipStatus = "draft" | "published" | "archived";

export type LeadershipMember = {
  id: string;
  name: string;
  designation: string;
  photoUrl: string | null;
  sortOrder: number;
  status: LeadershipStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Request currently in flight. Strict Mode's second effect run happens
 * before the response arrives, so it reuses this promise (1 call, not 2).
 * It is cleared as soon as the request settles, so the next visit to
 * the page always makes a fresh call.
 */
let inFlight: Promise<LeadershipMember[]> | null = null;

export function fetchPublishedLeadership(): Promise<LeadershipMember[]> {
  if (inFlight) return inFlight;

  const request = fetch(`${API_URL}/leadership-members/published`, {
    headers: { accept: "application/json" },
  })
    .then(async (res) => {
      if (!res.ok) throw new Error(`Failed to load leadership (${res.status})`);
      const json = await res.json();
      // Handles both a bare array and { statusCode, data: [...] }
      return (Array.isArray(json) ? json : (json?.data ?? [])) as LeadershipMember[];
    })
    .finally(() => {
      inFlight = null;
    });

  inFlight = request;
  return request;
}