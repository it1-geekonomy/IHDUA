"use client";

import { AdminSelect, type AdminSelectOption } from "@/domains/admin/components/AdminSelect";
import type { ContentStatus } from "./types";
import { cn } from "@/lib/utils";

interface HomeBannersToolbarProps {
  activeTab: "active" | "deleted";
  onTabChange: (tab: "active" | "deleted") => void;
  statusFilter: ContentStatus | "all";
  onStatusFilterChange: (status: ContentStatus | "all") => void;
}

const STATUS_OPTIONS: AdminSelectOption<ContentStatus | "all">[] = [
  { value: "all", label: "All Statuses" },
  { value: "published", label: "Published", dotColor: "bg-emerald-500" },
  { value: "draft", label: "Draft", dotColor: "bg-amber-500" },
  { value: "archived", label: "Archived", dotColor: "bg-neutral-400" },
];

export function HomeBannersToolbar({
  activeTab,
  onTabChange,
  statusFilter,
  onStatusFilterChange,
}: HomeBannersToolbarProps) {
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
          Active Banners
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

      {/* Status Filter */}
      {activeTab === "active" && (
        <div className="flex items-center gap-2.5">
          <label className="font-figtree text-xs text-[#5F6C6D]">Filter status:</label>
          <AdminSelect<ContentStatus | "all">
            value={statusFilter}
            onChange={onStatusFilterChange}
            options={STATUS_OPTIONS}
            dropdownClassName="w-40 right-0 left-auto"
          />
        </div>
      )}
    </div>
  );
}

