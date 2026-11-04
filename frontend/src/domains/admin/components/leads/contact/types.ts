import type { LeadContact, PaginationMeta } from "@/domains/admin/lib/api";

export type { LeadContact, PaginationMeta };

export interface ContactLeadEditFormData {
  name: string;
  email: string;
  mobile: string;
  subject: string;
  message: string;
}

export const SUBJECT_STYLES: Record<string, string> = {
  "General Enquiry": "bg-blue-50 text-blue-700 border-blue-200/80",
  "Programme Information": "bg-purple-50 text-purple-700 border-purple-200/80",
  "Donation Enquiry": "bg-amber-50 text-amber-700 border-amber-200/80",
  "Volunteer Opportunities": "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  "Partnership & Collaboration": "bg-indigo-50 text-indigo-700 border-indigo-200/80",
  "CSR Projects": "bg-cyan-50 text-cyan-700 border-cyan-200/80",
  "Education Programmes": "bg-rose-50 text-rose-700 border-rose-200/80",
  "Healthcare Initiatives": "bg-teal-50 text-teal-700 border-teal-200/80",
  "Women's Empowerment": "bg-pink-50 text-pink-700 border-pink-200/80",
  Other: "bg-stone-100 text-stone-700 border-stone-200",
};

export function formatLeadDate(iso: string) {
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

