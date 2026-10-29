"use client";

import { Search, X } from "lucide-react";
import type { BlogCategoryItem, ContentStatus } from "./types";
import { cn } from "@/lib/utils";

interface BlogsAndStoriesToolbarProps {
  activeTab: "active" | "deleted";
  onTabChange: (tab: "active" | "deleted") => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  statusFilter: ContentStatus | "all";
  onStatusFilterChange: (status: ContentStatus | "all") => void;
  categories: BlogCategoryItem[];
  categoryFilter: string;
  onCategoryFilterChange: (catId: string) => void;
  sortOrder: "newest" | "oldest";
  onSortOrderChange: (sort: "newest" | "oldest") => void;
}

export function BlogsAndStoriesToolbar({
  activeTab,
  onTabChange,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categories,
  categoryFilter,
  onCategoryFilterChange,
  sortOrder,
  onSortOrderChange,
}: BlogsAndStoriesToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[#E5E0D8] bg-white p-3 shadow-xs">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
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
            Active Stories
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

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2 flex-1 justify-end">
          {/* Search */}
          <div className="relative min-w-[180px] sm:min-w-[220px] flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8A847A]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search story title or text..."
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

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className="rounded-lg border border-[#D9D3C9] bg-white px-3 py-1.5 font-figtree text-xs text-[#5F6C6D] focus:border-[#9739A8] focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter (only active tab) */}
          {activeTab === "active" && (
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value as ContentStatus | "all")}
              className="rounded-lg border border-[#D9D3C9] bg-white px-3 py-1.5 font-figtree text-xs text-[#5F6C6D] focus:border-[#9739A8] focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          )}

          {/* Sort Order */}
          <select
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value as "newest" | "oldest")}
            className="rounded-lg border border-[#D9D3C9] bg-white px-3 py-1.5 font-figtree text-xs text-[#5F6C6D] focus:border-[#9739A8] focus:outline-hidden cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>
    </div>
  );
}

