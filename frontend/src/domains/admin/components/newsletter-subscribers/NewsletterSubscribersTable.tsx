"use client";

import { useState } from "react";
import {
  ArchiveRestore,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Loader2,
  Mail,
  Pencil,
  Power,
  Trash2,
} from "lucide-react";
import type { NewsletterSubscriberItem, PaginationMeta } from "./types";
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

interface NewsletterSubscribersTableProps {
  items: NewsletterSubscriberItem[];
  loading: boolean;
  actionLoading: boolean;
  activeTab: "active" | "deleted";
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onEdit: (item: NewsletterSubscriberItem) => void;
  onToggleStatus: (item: NewsletterSubscriberItem) => void;
  onDeletePrompt: (item: NewsletterSubscriberItem) => void;
  onRestore: (item: NewsletterSubscriberItem) => void;
}

export function NewsletterSubscribersTable({
  items,
  loading,
  actionLoading,
  activeTab,
  meta,
  onPageChange,
  onEdit,
  onToggleStatus,
  onDeletePrompt,
  onRestore,
}: NewsletterSubscribersTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-[#5F6C6D] rounded-xl border border-[#E5E0D8] bg-white">
        <Loader2 className="h-6 w-6 animate-spin text-[#9739A8] mb-2" />
        <p className="font-figtree text-xs">Loading newsletter subscribers...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-xl border border-[#E5E0D8] bg-white">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF8F4] text-[#8A847A] mb-3 border border-[#E5E0D8]">
          <Mail className="h-5 w-5" />
        </div>
        <h3 className="font-lora text-base font-medium text-[#0F1C1D]">
          {activeTab === "active" ? "No subscribers found" : "Trash is empty"}
        </h3>
        <p className="font-figtree text-xs text-[#5F6C6D] max-w-sm mt-1">
          {activeTab === "active"
            ? "When visitors subscribe via the website newsletter section, they will appear here."
            : "Deleted subscribers will appear here with an option to restore them."}
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
              <th className="py-3 px-4 sm:px-6">Subscriber Email</th>
              <th className="py-3 px-4">Subscription Status</th>
              <th className="py-3 px-4">Subscribed On</th>
              <th className="py-3 px-4">Last Updated</th>
              <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E0D8]">
            {items.map((item) => {
              const isCopied = copiedId === item.id;

              return (
                <tr key={item.id} className="hover:bg-[#FAF8F4]/80 transition-colors">
                  {/* Email */}
                  <td className="py-3.5 px-4 sm:px-6 align-middle max-w-md">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FAF8F4] text-[#9739A8] border border-[#E5E0D8]">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-semibold text-sm text-[#0F1C1D] truncate">
                          {item.email}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(item.id, item.email)}
                          className="text-[#8A847A] hover:text-[#0F1C1D] p-1 rounded transition-colors cursor-pointer"
                          title="Copy email to clipboard"
                        >
                          {isCopied ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                    {item.isActive ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border bg-[#E7F6EE] text-[#1F6B45] border-[#1F6B45]/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#1F6B45]" />
                        Active Subscribed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border bg-[#F4F6F7] text-[#5F6C6D] border-[#D7E0E1]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#8A847A]" />
                        Inactive / Paused
                      </span>
                    )}
                  </td>

                  {/* Created At */}
                  <td className="py-3.5 px-4 align-middle whitespace-nowrap text-[#5F6C6D]">
                    {formatDate(item.createdAt)}
                  </td>

                  {/* Updated At */}
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
                            onClick={() => onToggleStatus(item)}
                            disabled={actionLoading}
                            className={cn(
                              "inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-semibold cursor-pointer transition-all",
                              item.isActive
                                ? "border-[#D9D3C9] bg-white text-[#5F6C6D] hover:bg-stone-50"
                                : "border-[#1F6B45]/30 bg-[#E7F6EE] text-[#1F6B45] hover:bg-[#D5EFE2]",
                            )}
                            title={item.isActive ? "Deactivate subscription" : "Reactivate subscription"}
                          >
                            <Power className="h-3 w-3" />
                            <span>{item.isActive ? "Deactivate" : "Activate"}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onEdit(item)}
                            className="inline-flex items-center gap-1 rounded-md border border-[#D9D3C9] bg-white px-2.5 py-1 text-xs font-medium text-[#0F1C1D] hover:bg-stone-50 cursor-pointer shadow-2xs"
                            title="Edit subscriber email"
                          >
                            <Pencil className="h-3 w-3 text-[#5F6C6D]" />
                            <span>Edit</span>
                          </button>

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
