"use client";

import { AlertTriangle, Loader2, X } from "lucide-react";
import type { LeadershipMemberItem } from "./types";

interface LeadershipMemberDeleteModalProps {
  item: LeadershipMemberItem | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function LeadershipMemberDeleteModal({
  item,
  loading,
  onClose,
  onConfirm,
}: LeadershipMemberDeleteModalProps) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-figtree">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-[#E5E0D8]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D8]">
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="font-serif text-base font-bold text-[#0F1C1D]">
              Move Member to Trash?
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-1 text-[#8A847A] hover:bg-[#FAF8F4] hover:text-[#0F1C1D] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="mt-4 space-y-2 text-xs text-[#5F6C6D]">
          <p>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-[#0F1C1D]">
              &ldquo;{item.name}&rdquo;
            </span>{" "}
            ({item.designation})?
          </p>
          <p>
            This member will be soft-deleted and moved to Trash. You can restore them anytime from the Trash tab.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-end gap-2 border-t border-[#E5E0D8] pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-[#D9D3C9] bg-white px-3.5 py-2 text-xs font-medium text-[#0F1C1D] shadow-2xs hover:bg-[#FAF8F4] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>Move to Trash</span>
          </button>
        </div>
      </div>
    </div>
  );
}

