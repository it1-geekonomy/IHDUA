"use client";

import { Loader2, Trash2 } from "lucide-react";
import type { BlogCategoryItem } from "./types";

interface BlogCategoryDeleteModalProps {
  item: BlogCategoryItem | null;
  actionLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function BlogCategoryDeleteModal({
  item,
  actionLoading,
  onCancel,
  onConfirm,
}: BlogCategoryDeleteModalProps) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#E5E0D8] font-figtree">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
            <Trash2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-lora text-base font-medium text-[#0F1C1D]">
              Move Category to Trash?
            </h3>
            <p className="text-xs text-[#5F6C6D]">
              You can restore this category from the Trash tab at any time.
            </p>
          </div>
        </div>

        <div className="my-4 rounded-lg bg-[#FAF8F4] border border-[#E5E0D8] p-3 text-xs text-[#0F1C1D]">
          <span className="font-semibold block">{item.name}</span>
          <span className="text-[#5F6C6D] font-mono text-[11px] mt-0.5 block">
            Slug: /{item.slug}
          </span>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-[#D9D3C9] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#5F6C6D] hover:text-[#00191B] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={actionLoading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 cursor-pointer disabled:opacity-50 shadow-xs"
          >
            {actionLoading && <Loader2 className="h-3 w-3 animate-spin" />}
            <span>Move to Trash</span>
          </button>
        </div>
      </div>
    </div>
  );
}

