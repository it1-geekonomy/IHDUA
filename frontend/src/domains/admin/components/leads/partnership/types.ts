import type { LeadPartnership, PaginationMeta } from "@/domains/admin/lib/api";

export type { LeadPartnership, PaginationMeta };

export interface PartnershipInquiryEditFormData {
  yourName: string;
  orgName: string;
  phone: string;
  partnershipType: string;
  proposal: string;
}

export const TYPE_STYLES: Record<string, string> = {
  "CSR Partnership": "bg-purple-50 text-purple-700 border-purple-200/80",
  "NGO / Non-Profit Collaboration": "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  "Academic Partnership": "bg-blue-50 text-blue-700 border-blue-200/80",
  "Corporate Partnership": "bg-indigo-50 text-indigo-700 border-indigo-200/80",
  "Programme Sponsorship": "bg-amber-50 text-amber-700 border-amber-200/80",
  "Infrastructure Development": "bg-teal-50 text-teal-700 border-teal-200/80",
  Other: "bg-stone-100 text-stone-700 border-stone-200",
};

export function formatPartnershipDate(iso: string) {
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
