"use client";

import {
  ArchiveRestore,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Eye,
  FileText,
  HeartHandshake,
  Loader2,
  Mail,
  Pencil,
  Phone,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatVolunteerDate,
  AREA_STYLES,
  type LeadVolunteer,
  type PaginationMeta,
} from "./types";

interface VolunteerLeadsTableProps {
  leads: LeadVolunteer[];
  loading: boolean;
  activeTab: "active" | "deleted";
  actionInProgress: string | null;
  copiedId: string | null;
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onCopy: (text: string, id: string) => void;
  onView: (lead: LeadVolunteer) => void;
  onEdit: (lead: LeadVolunteer) => void;
  onDelete: (lead: LeadVolunteer) => void;
  onRestore: (lead: LeadVolunteer) => void;
}

export function VolunteerLeadsTable({
  leads,
  loading,
  activeTab,
  actionInProgress,
  copiedId,
  meta,
  onPageChange,
  onCopy,
  onView,
  onEdit,
  onDelete,
  onRestore,
}: VolunteerLeadsTableProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-[#E5E0D8] bg-white p-12 text-[#5F6C6D] shadow-xs">
        <Loader2 className="h-6 w-6 animate-spin text-[#9739A8]" />
        <p className="mt-3 font-figtree text-xs">Loading volunteer inquiries…</p>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#D9D3C9] bg-white/50 p-12 text-center shadow-xs">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF8F4] text-[#8A847A] mb-3">
          <HeartHandshake className="h-6 w-6" />
        </div>
        <p className="font-figtree text-sm font-semibold text-[#0F1C1D]">
          {activeTab === "active" ? "No volunteer inquiries found" : "Trash is empty"}
        </p>
        <p className="mt-1 font-figtree text-xs text-[#5F6C6D] max-w-sm">
          {activeTab === "active"
            ? "Volunteer applications submitted through the website will appear here in real time."
            : "Soft-deleted applications will appear here for recovery."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#E5E0D8] bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left font-figtree text-xs">
          <thead className="border-b border-[#E5E0D8] bg-[#FAF8F4] text-[11px] font-bold uppercase tracking-wider text-[#5F6C6D]">
            <tr>
              <th className="py-3 px-4 w-48">Volunteer Applicant</th>
              <th className="py-3 px-4 w-60">Contact Details</th>
              <th className="py-3 px-4 w-44">Area of Interest</th>
              <th className="py-3 px-4">Skills & Background</th>
              <th className="py-3 px-4 text-center w-28">Resume</th>
              <th className="py-3 px-4 text-right w-28">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E0D8]">
            {leads.map((lead) => {
              const areaBadgeClass =
                AREA_STYLES[lead.areaOfInterest] || "bg-stone-100 text-stone-700 border-stone-200";
              const isWorking = actionInProgress === lead.id;

              return (
                <tr
                  key={lead.id}
                  className="hover:bg-[#FAF8F4]/60 transition-colors group"
                >
                  {/* Name & Date */}
                  <td className="py-3.5 px-4 font-medium text-[#0F1C1D]">
                    <div className="font-semibold text-xs text-[#0F1C1D]">
                      {lead.fullName}
                    </div>
                    <div className="mt-0.5 text-[11px] text-[#8A847A]">
                      {formatVolunteerDate(lead.createdAt)}
                    </div>
                  </td>

                  {/* Contact Details */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] text-[#5F6C6D]">
                        <Mail className="h-3 w-3 text-[#8A847A] shrink-0" />
                        <span className="truncate max-w-[170px]" title={lead.email}>
                          {lead.email}
                        </span>
                        <button
                          type="button"
                          onClick={() => onCopy(lead.email, `email-${lead.id}`)}
                          className="text-[#8A847A] hover:text-[#0F1C1D] transition-colors p-0.5 rounded cursor-pointer"
                          title="Copy email"
                        >
                          {copiedId === `email-${lead.id}` ? (
                            <Check className="h-2.5 w-2.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-2.5 w-2.5" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-[#5F6C6D]">
                        <Phone className="h-3 w-3 text-[#8A847A] shrink-0" />
                        <span>{lead.phone}</span>
                        <button
                          type="button"
                          onClick={() => onCopy(lead.phone, `phone-${lead.id}`)}
                          className="text-[#8A847A] hover:text-[#0F1C1D] transition-colors p-0.5 rounded cursor-pointer"
                          title="Copy phone"
                        >
                          {copiedId === `phone-${lead.id}` ? (
                            <Check className="h-2.5 w-2.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-2.5 w-2.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Area of Interest */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold border",
                        areaBadgeClass,
                      )}
                    >
                      {lead.areaOfInterest}
                    </span>
                  </td>

                  {/* Skills & Background */}
                  <td className="py-3.5 px-4 max-w-xs text-[11px] text-[#5F6C6D]">
                    <p className="line-clamp-2 leading-relaxed">
                      {lead.skills || "—"}
                    </p>
                  </td>

                  {/* Resume PDF */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {lead.resumeUrl ? (
                      <a
                        href={lead.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-md bg-[#FAF5FC] border border-[#9739A8]/20 px-2 py-1 text-[11px] font-semibold text-[#9739A8] hover:bg-[#9739A8] hover:text-white transition-all shadow-2xs"
                        title="View Resume PDF"
                      >
                        <FileText className="h-3 w-3" />
                        <span>PDF</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    ) : (
                      <span className="text-[#8A847A] font-mono text-[10px]">No file</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {activeTab === "active" ? (
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onView(lead)}
                          className="rounded-lg p-1.5 text-[#5F6C6D] hover:bg-[#FAF5FC] hover:text-[#9739A8] transition-colors cursor-pointer"
                          title="View application"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit(lead)}
                          className="rounded-lg p-1.5 text-[#5F6C6D] hover:bg-neutral-100 hover:text-[#0F1C1D] transition-colors cursor-pointer"
                          title="Edit application"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(lead)}
                          disabled={isWorking}
                          className="rounded-lg p-1.5 text-[#5F6C6D] hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer disabled:opacity-50"
                          title="Move to trash"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => onRestore(lead)}
                          disabled={isWorking}
                          className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer disabled:opacity-50"
                          title="Restore application"
                        >
                          <ArchiveRestore className="h-3 w-3" />
                          <span>Restore</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {meta.totalPages > 1 && (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-[#E5E0D8] px-4 py-3 sm:flex-row font-figtree text-xs text-[#5F6C6D] bg-[#FAF8F4]/50">
          <div>
            Showing{" "}
            <span className="font-semibold text-[#0F1C1D]">
              {(meta.page - 1) * meta.limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-[#0F1C1D]">
              {Math.min(meta.page * meta.limit, meta.total)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#0F1C1D]">{meta.total}</span> applications
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onPageChange(meta.page - 1)}
              disabled={meta.page <= 1}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#D9D3C9] bg-white px-2.5 text-xs font-semibold text-[#0F1C1D] shadow-2xs hover:bg-[#FAF8F4] disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Prev</span>
            </button>
            <span className="px-2 font-mono text-[11px]">
              {meta.page} / {meta.totalPages}
            </span>
            <button
              type="button"
              onClick={() => onPageChange(meta.page + 1)}
              disabled={meta.page >= meta.totalPages}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#D9D3C9] bg-white px-2.5 text-xs font-semibold text-[#0F1C1D] shadow-2xs hover:bg-[#FAF8F4] disabled:opacity-40 transition-colors cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
