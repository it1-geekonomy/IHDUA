"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogCategoriesToolbarProps {
  activeTab: "active" | "deleted";
  onTabChange: (tab: "active" | "deleted") => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export function BlogCategoriesToolbar({
  activeTab,
  onTabChange,
  searchTerm,
  onSearchChange,
}: BlogCategoriesToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-[#E5E0D8] bg-white p-3 shadow-xs">
      {/* Active vs Deleted Tabs */}
      <div className="flex rounded-lg border border-[#D9D3C9] bg-[#FAF8F4] p-0.5 shadow-2xs w-fit">
        <button
          type="button"
          onClick={() => onTabChange("active")}
          className={cn(
            "rounded-md px-3 py-1.5 font-figtree text-xs font-semibold transition-all cursor-pointer",
            activeTab === "active"
              ? "bg-white text-[#9739A8] shadow-2xs"
              : "text-[#5F6C6D] hover:text-[#00191B]",
          )}
        >
          Active Categories
        </button>
        <button
          type="button"
          onClick={() => onTabChange("deleted")}
          className={cn(
            "rounded-md px-3 py-1.5 font-figtree text-xs font-semibold transition-all cursor-pointer",
            activeTab === "deleted"
              ? "bg-white text-rose-600 shadow-2xs"
              : "text-[#5F6C6D] hover:text-[#00191B]",
          )}
        >
          Trash / Deleted
        </button>
      </div>

      {/* Search Filter */}
      <div className="flex items-center gap-2.5 flex-1 max-w-md justify-end">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8A847A]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search category name or slug..."
            className="w-full rounded-lg border border-[#D9D3C9] bg-white pl-8 pr-3 py-1.5 font-figtree text-xs text-[#0F1C1D] placeholder:text-[#8A847A] focus:border-[#9739A8] focus:outline-hidden transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A847A] hover:text-[#0F1C1D] cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

