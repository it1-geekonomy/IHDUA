"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Archive,
  ArchiveRestore,
  BookOpen,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  ImageIcon,
  Loader2,
  Pencil,
  Tag,
  Trash2,
} from "lucide-react";
import type { BlogAndStoryItem, ContentStatus, PaginationMeta } from "./types";
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

function formatDisplayDate(dateStr: string | null) {
  if (!dateStr) return "Not set";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

interface BlogsAndStoriesTableProps {
  items: BlogAndStoryItem[];
  loading: boolean;
  actionLoading: boolean;
  activeTab: "active" | "deleted";
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onPreview: (item: BlogAndStoryItem) => void;
  onEdit: (item: BlogAndStoryItem) => void;
  onQuickStatus: (item: BlogAndStoryItem, status: ContentStatus) => void;
  onDeletePrompt: (item: BlogAndStoryItem) => void;
  onRestore: (item: BlogAndStoryItem) => void;
}

export function BlogsAndStoriesTable({
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
}: BlogsAndStoriesTableProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-[#E5E0D8] bg-white p-12 text-[#5F6C6D] shadow-xs">
        <Loader2 className="h-6 w-6 animate-spin text-[#9739A8]" />
        <p className="mt-3 font-figtree text-xs">Loading blogs and stories…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#D9D3C9] bg-white/50 p-12 text-center shadow-xs">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF8F4] text-[#8A847A] mb-3">
          <BookOpen className="h-6 w-6" />
        </div>
        <p className="font-figtree text-sm font-semibold text-[#0F1C1D]">
          {activeTab === "active" ? "No stories found" : "Trash is empty"}
        </p>
        <p className="mt-1 font-figtree text-xs text-[#5F6C6D] max-w-sm">
          {activeTab === "active"
            ? "Create a new story using the button above to publish community updates and articles."
            : "No deleted stories were found in trash."}
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
              <th className="py-3 px-4">Story & Slug</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Publish Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E0D8]">
            {items.map((item) => {
              const statusCfg = STATUS_BADGES[item.status] || STATUS_BADGES.draft;

              return (
                <tr
                  key={item.id}
                  className="hover:bg-[#FAF8F4]/60 transition-colors group"
                >
                  {/* Banner + Title + Slug */}
                  <td className="py-3.5 px-4 font-medium text-[#0F1C1D]">
                    <div className="flex items-start gap-3">
                      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-[#E5E0D8] bg-[#FAF8F4]">
                        {item.blogBanner ? (
                          <img
                            src={item.blogBanner}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[#8A847A]">
                            <ImageIcon className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 max-w-md">
                        <p className="font-semibold text-sm text-[#0F1C1D] line-clamp-1 group-hover:text-[#9739A8] transition-colors">
                          {item.title}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-[#5F6C6D]">
                          <span className="truncate">/{item.slug}</span>
                          {item.status === "published" && (
                            <Link
                              href={`/blogs/${item.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#9739A8] hover:underline inline-flex items-center gap-0.5"
                              title="View published story on live website"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    {item.category?.name ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-[#FAF8F4] px-2 py-1 font-semibold text-[11px] text-[#9739A8] border border-[#E5E0D8]">
                        <Tag className="h-3 w-3" />
                        <span>{item.category.name}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-stone-100 px-2 py-0.5 text-[11px] text-[#8A847A]">
                        Uncategorized
                      </span>
                    )}
                  </td>

                  {/* Publish Date */}
                  <td className="py-3.5 px-4 text-[#5F6C6D] whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-[#8A847A]" />
                      <span>{formatDisplayDate(item.blogDate)}</span>
                    </div>
                  </td>

                  {/* Status Badge & Quick Status Controls */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border",
                          statusCfg.bg,
                          statusCfg.text,
                          statusCfg.border,
                        )}
                      >
                        <span className={cn("h-1.5 w-1.5 rounded-full", statusCfg.dot)} />
                        {statusCfg.label}
                      </span>

                      {/* Quick Status Toggles (Active mode only) */}
                      {activeTab === "active" && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          {item.status !== "published" && (
                            <button
                              type="button"
                              onClick={() => onQuickStatus(item, "published")}
                              disabled={actionLoading}
                              className="rounded px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 cursor-pointer"
                              title="Publish this story"
                            >
                              Publish
                            </button>
                          )}
                          {item.status === "published" && (
                            <button
                              type="button"
                              onClick={() => onQuickStatus(item, "draft")}
                              disabled={actionLoading}
                              className="rounded px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 cursor-pointer"
                              title="Revert to draft"
                            >
                              To Draft
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {activeTab === "active" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => onPreview(item)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[#D9D3C9] bg-white text-[#5F6C6D] hover:border-[#00191B] hover:text-[#00191B] transition-colors cursor-pointer"
                            title="Preview story"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onEdit(item)}
                            disabled={actionLoading}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[#D9D3C9] bg-white text-[#5F6C6D] hover:border-[#9739A8] hover:text-[#9739A8] transition-colors cursor-pointer"
                            title="Edit story"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeletePrompt(item)}
                            disabled={actionLoading}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[#D9D3C9] bg-white text-rose-500 hover:border-rose-300 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Move to trash"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onRestore(item)}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#D9D3C9] bg-white px-2.5 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-colors cursor-pointer"
                          title="Restore story"
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

      {/* Pagination Controls */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#E5E0D8] bg-[#FAF8F4] px-4 py-3">
          <p className="font-figtree text-xs text-[#5F6C6D]">
            Showing Page <span className="font-semibold text-[#0F1C1D]">{meta.page}</span> of{" "}
            <span className="font-semibold text-[#0F1C1D]">{meta.totalPages}</span> ({meta.total} total)
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onPageChange(meta.page - 1)}
              disabled={meta.page <= 1 || actionLoading}
              className="inline-flex h-7 items-center gap-1 rounded-lg border border-[#D9D3C9] bg-white px-2 text-xs font-medium text-[#5F6C6D] hover:text-[#00191B] disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Prev</span>
            </button>
            <button
              type="button"
              onClick={() => onPageChange(meta.page + 1)}
              disabled={meta.page >= meta.totalPages || actionLoading}
              className="inline-flex h-7 items-center gap-1 rounded-lg border border-[#D9D3C9] bg-white px-2 text-xs font-medium text-[#5F6C6D] hover:text-[#00191B] disabled:opacity-40 transition-colors cursor-pointer"
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

