import type { LeadVolunteer, PaginationMeta } from "@/domains/admin/lib/api";

export type { LeadVolunteer, PaginationMeta };

export interface VolunteerLeadEditFormData {
  fullName: string;
  email: string;
  phone: string;
  areaOfInterest: string;
  skills: string;
}

export const AREA_STYLES: Record<string, string> = {
  "Teaching & Education": "bg-blue-50 text-blue-700 border-blue-200/80",
  "Healthcare & Medical Camps": "bg-teal-50 text-teal-700 border-teal-200/80",
  "Community Outreach": "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  "Women Empowerment": "bg-rose-50 text-rose-700 border-rose-200/80",
  "Agriculture & Sustainability": "bg-amber-50 text-amber-700 border-amber-200/80",
  "Youth Development": "bg-purple-50 text-purple-700 border-purple-200/80",
  "Event Support": "bg-orange-50 text-orange-700 border-orange-200/80",
  "Design & Digital Marketing": "bg-indigo-50 text-indigo-700 border-indigo-200/80",
  "Administration & Operations": "bg-cyan-50 text-cyan-700 border-cyan-200/80",
  Other: "bg-stone-100 text-stone-700 border-stone-200",
};

export function formatVolunteerDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return iso;
  }
}
