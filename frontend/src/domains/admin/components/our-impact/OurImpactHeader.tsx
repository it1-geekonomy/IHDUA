"use client";

import { Plus, RefreshCw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface OurImpactHeaderProps {
  totalCategories: number;
  totalInitiatives: number;
  loading: boolean;
  onRefresh: () => void;
  onCreate: () => void;
}

export function OurImpactHeader({
  totalCategories,
  totalInitiatives,
  loading,
  onRefresh,
  onCreate,
}: OurImpactHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-[#E5E0D8] pb-5">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF8F4] text-[#9739A8] border border-[#E5E0D8]">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h1 className="font-lora text-2xl font-medium text-[#0F1C1D]">
              Our Impact Pages
            </h1>
            <p className="text-xs text-[#5F6C6D] mt-0.5">
              Manage category templates, dynamic initiative pages, and visual sections.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <span className="rounded-full bg-[#1A0F1C]/5 px-3 py-1 font-figtree text-xs font-semibold text-[#1A0F1C]">
          {totalCategories} Categories · {totalInitiatives} Pages
        </span>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#D9D3C9] bg-white text-[#5F6C6D] hover:text-[#0F1C1D] transition-colors disabled:opacity-50 shadow-2xs cursor-pointer"
          title="Refresh initiatives"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
        </button>

        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#1A0F1C] px-3.5 py-1.5 font-figtree text-xs font-semibold text-white shadow-xs hover:bg-[#2C1A30] active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Initiative Page</span>
        </button>
      </div>
    </div>
  );
}

