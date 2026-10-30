"use client";

import { Plus, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface LegalDocumentHeaderProps {
  title: string;
  total: number;
  loading: boolean;
  onRefresh: () => void;
  onCreate: () => void;
}

export function LegalDocumentHeader({
  title,
  total,
  loading,
  onRefresh,
  onCreate,
}: LegalDocumentHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-[#E5E0D8] pb-5">
      <div className="flex items-center gap-3">
        <h1 className="font-lora text-2xl font-medium text-[#0F1C1D]">{title}</h1>
        <span className="rounded-full bg-[#1A0F1C]/5 px-2.5 py-0.5 font-figtree text-xs font-semibold text-[#1A0F1C]">
          {total} {total === 1 ? "document" : "documents"}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#D9D3C9] bg-white text-[#5F6C6D] hover:text-[#00191B] transition-colors disabled:opacity-50 shadow-2xs cursor-pointer"
          title="Refresh records"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
        </button>

        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#1A0F1C] px-3.5 py-1.5 font-figtree text-xs font-semibold text-white shadow-xs hover:bg-[#2C1A30] active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Create New {title.includes("Terms") ? "Terms" : "Policy"}</span>
        </button>
      </div>
    </div>
  );
}
