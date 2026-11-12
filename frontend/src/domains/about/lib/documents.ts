export type ApiDocument = {
  id: string;
  title: string;
  fileUrl: string;
  sortOrder?: number;
  reportYear?: string;
  status?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Creates a fetcher for one endpoint. The request is shared only while it is
 * in flight (Strict Mode's second effect run reuses it: 1 call, not 2) and is
 * cleared as soon as it settles, so the next page visit makes a fresh call.
 */
function inFlightList(path: string) {
  let inFlight: Promise<ApiDocument[]> | null = null;

  return function fetchList(): Promise<ApiDocument[]> {
    if (inFlight) return inFlight;

    const request = fetch(`${API_URL}${path}`, {
      headers: { accept: "application/json" },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to load ${path} (${res.status})`);
        const json = await res.json();
        // Handles both { statusCode, data: [...] } and a bare array
        return (Array.isArray(json) ? json : (json?.data ?? [])) as ApiDocument[];
      })
      .finally(() => {
        inFlight = null;
      });

    inFlight = request;
    return request;
  };
}

/** API already sorts by sortOrder ASC (annual reports: then reportYear DESC) */
export const fetchPublishedOrganizationalDocuments = inFlightList(
  "/organizational-documents/published",
);
export const fetchPublishedAnnualReports = inFlightList("/annual-reports/published");