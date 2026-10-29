"use client";

import {
  Archive,
  ArchiveRestore,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";
import type { AnnualReportItem, ContentStatus, PaginationMeta } from "./types";
import { cn } from "@/lib/utils";

const STATUS_BADGES: Record<
  ContentStatus,
  { label: string; bg: string; text: string; dot: string; border: string }
> = {
  published: {
    label: "Published",
    bg: "bg-[#E7F6EE]",
    text: "text-[#1F6B45]",
    dot: "bg-[#1F6B45]",
    border: "border-[#1F6B45]/20",
  },
  draft: {
    label: "Draft",
    bg: "bg-[#FFF6DB]",
    text: "text-[#8A6A00]",
    dot: "bg-[#8A6A00]",
    border: "border-[#8A6A00]/20",
  },
  archived: {
    label: "Archived",
    bg: "bg-[#F4F6F7]",
    text: "text-[#5F6C6D]",
    dot: "bg-[#8A847A]",
    border: "border-[#D7E0E1]",
  },
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

interface AnnualReportsTableProps {
  items: AnnualReportItem[];
  loading: boolean;
  actionLoading: boolean;
  activeTab: "active" | "deleted";
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onPreview: (item: AnnualReportItem) => void;
  onEdit: (item: AnnualReportItem) => void;
  onQuickStatus: (item: AnnualReportItem, status: ContentStatus) => void;
  onDeletePrompt: (item: AnnualReportItem) => void;
  onRestore: (item: AnnualReportItem) => void;
}

export function AnnualReportsTable({
  items,
  loading,
  actionLoading,
  activeTab,
  meta,
  onPageChange,
  onPreview,
  onEdit,
  onQuickStatus,
  onDeletePrompt,
  onRestore,
}: AnnualReportsTableProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-[#5F6C6D] rounded-xl border border-[#E5E0D8] bg-white">
        <Loader2 className="h-6 w-6 animate-spin text-[#9739A8] mb-2" />
        <p className="font-figtree text-xs">Loading annual reports...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-xl border border-[#E5E0D8] bg-white">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF8F4] text-[#8A847A] mb-3 border border-[#E5E0D8]">
          <FileText className="h-5 w-5" />
        </div>
        <h3 className="font-lora text-base font-medium text-[#0F1C1D]">
          {activeTab === "active" ? "No annual reports found" : "Trash is empty"}
        </h3>
        <p className="font-figtree text-xs text-[#5F6C6D] max-w-sm mt-1">
          {activeTab === "active"
            ? "Upload your first annual report PDF file to display it on the website."
            : "Soft-deleted annual reports will appear here with an option to restore them."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#E5E0D8] bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-figtree text-xs">
          <thead>
            <tr className="border-b border-[#E5E0D8] bg-[#FAF8F4] text-[#5F6C6D] font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4 sm:px-6">Report Title & Document</th>
              <th className="py-3 px-4">Report Year</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Display Priority</th>
              <th className="py-3 px-4">Last Updated</th>
              <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E0D8]">
            {items.map((item) => {
              const badge = STATUS_BADGES[item.status] || STATUS_BADGES.draft;

              return (
                <tr key={item.id} className="hover:bg-[#FAF8F4]/80 transition-colors">
                  {/* Title & PDF info */}
                  <td className="py-3.5 px-4 sm:px-6 align-middle max-w-md">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-[#0F1C1D] truncate">
                            {item.title}
                          </span>
                          {item.status === "published" && (
                            <span className="rounded-full bg-[#E7F6EE] px-2 py-0.5 text-[10px] font-bold text-[#1F6B45]">
                              LIVE
                            </span>
                          )}
                        </div>
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#9739A8] hover:underline text-[11px] truncate block mt-0.5"
                          title="Open PDF directly in new tab"
                        >
                          View PDF Document ↗
                        </a>
                      </div>
                    </div>
                  </td>

                  {/* Year */}
                  <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-[#FAF8F4] border border-[#E5E0D8] px-2.5 py-1 text-xs font-semibold text-[#0F1C1D]">
                      <Calendar className="h-3 w-3 text-[#5F6C6D]" />
                      <span>{item.reportYear}</span>
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border",
                        badge.bg,
                        badge.text,
                        badge.border,
                      )}
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full", badge.dot)} />
                      {badge.label}
                    </span>
                  </td>

                  {/* Sort Order */}
                  <td className="py-3.5 px-4 align-middle text-center whitespace-nowrap">
                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-[#FAF8F4] border border-[#E5E0D8] px-1.5 text-xs font-mono font-medium text-[#5F6C6D]">
                      {item.sortOrder}
                    </span>
                  </td>

                  {/* Timestamp */}
                  <td className="py-3.5 px-4 align-middle whitespace-nowrap text-[#5F6C6D]">
                    {formatDate(item.updatedAt)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 sm:px-6 align-middle text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {activeTab === "active" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => onPreview(item)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#D9D3C9] bg-white text-[#5F6C6D] hover:text-[#00191B] hover:bg-stone-50 cursor-pointer shadow-2xs"
                            title="Preview PDF"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onEdit(item)}
                            className="inline-flex items-center gap-1 rounded-md border border-[#D9D3C9] bg-white px-2.5 py-1 text-xs font-medium text-[#0F1C1D] hover:bg-stone-50 cursor-pointer shadow-2xs"
                            title="Edit report metadata / replace file"
                          >
                            <Pencil className="h-3 w-3 text-[#5F6C6D]" />
                            <span>Edit</span>
                          </button>

                          {item.status !== "published" ? (
                            <button
                              type="button"
                              onClick={() => onQuickStatus(item, "published")}
                              disabled={actionLoading}
                              className="inline-flex items-center gap-1 rounded-md border border-[#1F6B45]/30 bg-[#E7F6EE] px-2.5 py-1 text-xs font-semibold text-[#1F6B45] hover:bg-[#D5EFE2] cursor-pointer"
                              title="Publish on live website"
                            >
                              <Check className="h-3 w-3" />
                              <span>Publish</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onQuickStatus(item, "archived")}
                              disabled={actionLoading}
                              className="inline-flex items-center gap-1 rounded-md border border-[#D9D3C9] bg-[#FAF8F4] px-2.5 py-1 text-xs font-medium text-[#5F6C6D] hover:bg-stone-100 cursor-pointer"
                              title="Archive report"
                            >
                              <Archive className="h-3 w-3" />
                              <span>Archive</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onDeletePrompt(item)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#D9D3C9] bg-white text-[#8A847A] hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 cursor-pointer shadow-2xs"
                            title="Move to trash"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onRestore(item)}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-1 rounded-md border border-[#1F6B45]/30 bg-[#E7F6EE] px-2.5 py-1 text-xs font-semibold text-[#1F6B45] hover:bg-[#D5EFE2] cursor-pointer"
                        >
                          <ArchiveRestore className="h-3.5 w-3.5" />
                          <span>Restore</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#E5E0D8] bg-[#FAF8F4] px-4 sm:px-6 py-2.5 font-figtree text-xs text-[#5F6C6D]">
          <span>
            Page {meta.page} of {meta.totalPages} ({meta.total} records)
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onPageChange(Math.max(1, meta.page - 1))}
              disabled={meta.page <= 1}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#D9D3C9] bg-white text-[#5F6C6D] hover:bg-stone-50 disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onPageChange(Math.min(meta.totalPages, meta.page + 1))}
              disabled={meta.page >= meta.totalPages}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#D9D3C9] bg-white text-[#5F6C6D] hover:bg-stone-50 disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
