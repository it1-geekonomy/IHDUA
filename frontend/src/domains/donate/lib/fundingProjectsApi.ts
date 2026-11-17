import type { FundingProject } from "@/domains/donate/constants/fundingProjects";
import { FUNDING_PROJECTS as FALLBACK } from "@/domains/donate/constants/fundingProjects";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6061/api";

type ApiFundingProject = {
  id: string;
  slug: string;
  projectNumber: string;
  title: string;
  summary: string;
  totalLabel: string;
  cause: string;
  highlights?: string[];
  components?: FundingProject["components"];
  sortOrder?: number;
};

function mapProject(row: ApiFundingProject): FundingProject {
  return {
    id: row.slug || row.id,
    number: row.projectNumber,
    title: row.title,
    summary: row.summary,
    totalLabel: row.totalLabel,
    cause: row.cause,
    highlights: row.highlights || [],
    components: row.components || [],
  };
}

/** Public published funding projects for /donate. Falls back to hardcoded PDF data if API is empty/unavailable. */
export async function fetchFundingProjectsForDonate(): Promise<FundingProject[]> {
  try {
    const res = await fetch(`${API_URL}/funding-projects/published`, {
      headers: { accept: "application/json" },
      next: { revalidate: 60 },
    });
    if (!res.ok) return FALLBACK;
    const json = (await res.json()) as { data?: ApiFundingProject[] } | ApiFundingProject[];
    const rows = Array.isArray(json) ? json : json.data || [];
    if (!rows.length) return FALLBACK;
    return rows.map(mapProject);
  } catch {
    return FALLBACK;
  }
}
