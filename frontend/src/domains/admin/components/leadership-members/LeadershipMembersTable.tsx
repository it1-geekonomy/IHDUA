"use client";

import {
  ArchiveRestore,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Trash2,
  User,
  Users2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  STATUS_CONFIG,
  type LeadershipMemberItem,
  type PaginationMeta,
} from "./types";

interface LeadershipMembersTableProps {
  items: LeadershipMemberItem[];
  loading: boolean;
  actionLoading: boolean;
  activeTab: "active" | "deleted";
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onEdit: (item: LeadershipMemberItem) => void;
  onDeletePrompt: (item: LeadershipMemberItem) => void;
  onRestore: (item: LeadershipMemberItem) => void;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function LeadershipMembersTable({
  items,
  loading,
  actionLoading,
  activeTab,
  meta,
  onPageChange,
  onEdit,
  onDeletePrompt,
  onRestore,
}: LeadershipMembersTableProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-[#E5E0D8] bg-white p-12 text-[#5F6C6D] shadow-xs">
        <Loader2 className="h-6 w-6 animate-spin text-[#9739A8]" />
        <p className="mt-3 font-figtree text-xs">Loading leadership members…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#D9D3C9] bg-white/50 p-12 text-center shadow-xs">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF8F4] text-[#8A847A] mb-3">
          <Users2 className="h-6 w-6" />
        </div>
        <p className="font-figtree text-sm font-semibold text-[#0F1C1D]">
          {activeTab === "active" ? "No leadership members found" : "Trash is empty"}
        </p>
        <p className="mt-1 font-figtree text-xs text-[#5F6C6D] max-w-sm">
          {activeTab === "active"
            ? "Add your first leadership member above to feature them on the website."
            : "No deleted leadership members were found in trash."}
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
              <th className="py-3 px-4 w-16">Photo</th>
              <th className="py-3 px-4">Member Name</th>
              <th className="py-3 px-4">Designation</th>
              <th className="py-3 px-4 w-28 text-center">Sort Order</th>
              <th className="py-3 px-4 w-32">Status</th>
              <th className="py-3 px-4 w-32">Created</th>
              <th className="py-3 px-4 text-right w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E0D8]">
            {items.map((item) => {
              const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.draft;

              return (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-[#FAF8F4]/60"
                >
                  {/* Photo Thumbnail */}
                  <td className="py-3 px-4">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-[#E5E0D8] bg-[#FAF8F4]">
                      {item.photoUrl ? (
                        <img
                          src={item.photoUrl}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#8A847A]">
                          <User className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Name */}
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#0F1C1D]">
                      {item.name}
                    </span>
                  </td>

                  {/* Designation */}
                  <td className="py-3 px-4 text-[#5F6C6D]">
                    {item.designation}
                  </td>

                  {/* Sort Order */}
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center rounded-md bg-[#FAF8F4] px-2 py-0.5 font-mono text-[11px] font-medium text-[#5F6C6D] border border-[#E5E0D8]">
                      {item.sortOrder}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                        statusCfg.badgeCls,
                      )}
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full", statusCfg.dotCls)} />
                      {statusCfg.label}
                    </span>
                  </td>

                  {/* Created Date */}
                  <td className="py-3 px-4 text-[#8A847A]">
                    {formatDate(item.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {activeTab === "active" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => onEdit(item)}
                            title="Edit member"
                            disabled={actionLoading}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#5F6C6D] hover:bg-[#FAF8F4] hover:text-[#0F1C1D] transition-colors cursor-pointer"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeletePrompt(item)}
                            title="Move to trash"
                            disabled={actionLoading}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onRestore(item)}
                          title="Restore member"
                          disabled={actionLoading}
                          className="inline-flex h-7 items-center gap-1 rounded-md bg-[#1F6B45]/10 px-2 text-[11px] font-semibold text-[#1F6B45] hover:bg-[#1F6B45]/20 transition-colors cursor-pointer"
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

      {/* Pagination Footer */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#E5E0D8] bg-[#FAF8F4] px-4 py-3 text-xs text-[#5F6C6D] font-figtree">
          <p>
            Showing Page <span className="font-semibold text-[#0F1C1D]">{meta.page}</span> of{" "}
            <span className="font-semibold text-[#0F1C1D]">{meta.totalPages}</span> (
            {meta.total} total)
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onPageChange(meta.page - 1)}
              disabled={meta.page <= 1}
              className="inline-flex h-7 items-center gap-1 rounded-md border border-[#D9D3C9] bg-white px-2 font-medium text-[#0F1C1D] shadow-2xs hover:bg-[#FAF8F4] disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Prev</span>
            </button>
            <button
              type="button"
              onClick={() => onPageChange(meta.page + 1)}
              disabled={meta.page >= meta.totalPages}
              className="inline-flex h-7 items-center gap-1 rounded-md border border-[#D9D3C9] bg-white px-2 font-medium text-[#0F1C1D] shadow-2xs hover:bg-[#FAF8F4] disabled:opacity-40 cursor-pointer"
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

