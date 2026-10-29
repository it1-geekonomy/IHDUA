"use client";

import {
  ArchiveRestore,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Tag,
  Trash2,
} from "lucide-react";
import type { BlogCategoryItem, PaginationMeta } from "./types";
import { cn } from "@/lib/utils";

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

interface BlogCategoriesTableProps {
  items: BlogCategoryItem[];
  loading: boolean;
  actionLoading: boolean;
  activeTab: "active" | "deleted";
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onEdit: (item: BlogCategoryItem) => void;
  onDeletePrompt: (item: BlogCategoryItem) => void;
  onRestore: (item: BlogCategoryItem) => void;
}

export function BlogCategoriesTable({
  items,
  loading,
  actionLoading,
  activeTab,
  meta,
  onPageChange,
  onEdit,
  onDeletePrompt,
  onRestore,
}: BlogCategoriesTableProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-[#E5E0D8] bg-white p-12 text-[#5F6C6D] shadow-xs">
        <Loader2 className="h-6 w-6 animate-spin text-[#9739A8]" />
        <p className="mt-3 font-figtree text-xs">Loading categories…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#D9D3C9] bg-white/50 p-12 text-center shadow-xs">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF8F4] text-[#8A847A] mb-3">
          <Tag className="h-6 w-6" />
        </div>
        <p className="font-figtree text-sm font-semibold text-[#0F1C1D]">
          {activeTab === "active" ? "No categories found" : "Trash is empty"}
        </p>
        <p className="mt-1 font-figtree text-xs text-[#5F6C6D] max-w-sm">
          {activeTab === "active"
            ? "Create your first category above to begin organizing blogs and stories."
            : "No deleted categories were found in trash."}
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
              <th className="py-3 px-4">Category Name</th>
              <th className="py-3 px-4">Slug</th>
              <th className="py-3 px-4">Created At</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E0D8]">
            {items.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-[#FAF8F4]/60 transition-colors group"
              >
                {/* Category Name */}
                <td className="py-3.5 px-4 font-medium text-[#0F1C1D]">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FAF8F4] text-[#9739A8] border border-[#E5E0D8]">
                      <Tag className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-semibold text-sm text-[#0F1C1D]">
                      {item.name}
                    </span>
                  </div>
                </td>

                {/* Slug */}
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center rounded-md bg-[#FAF8F4] px-2 py-1 font-mono text-[11px] text-[#5F6C6D] border border-[#E5E0D8]">
                    /{item.slug}
                  </span>
                </td>

                {/* Created Date */}
                <td className="py-3.5 px-4 text-[#5F6C6D] whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#8A847A]" />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    {activeTab === "active" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          disabled={actionLoading}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[#D9D3C9] bg-white text-[#5F6C6D] hover:border-[#9739A8] hover:text-[#9739A8] transition-colors cursor-pointer"
                          title="Edit category"
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
                        title="Restore category"
                      >
                        <ArchiveRestore className="h-3.5 w-3.5" />
                        <span>Restore</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
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
