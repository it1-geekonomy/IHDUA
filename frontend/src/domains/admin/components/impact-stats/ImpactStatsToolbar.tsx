"use client";

import { Search, Trash2 } from "lucide-react";
import { AdminSelect, type AdminSelectOption } from "@/domains/admin/components/AdminSelect";
import type { PositionFilter } from "./types";

interface ImpactStatsToolbarProps {
  activeTab: "active" | "deleted";
  onTabChange: (tab: "active" | "deleted") => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  positionFilter: PositionFilter;
  onPositionFilterChange: (pos: PositionFilter) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
}

const POSITION_OPTIONS: AdminSelectOption<PositionFilter>[] = [
  { value: "all", label: "All Positions" },
  { value: "first", label: "Card 1 (Purple Theme)", dotColor: "bg-[#9739A8]" },
  { value: "second", label: "Card 2 (Yellow Theme)", dotColor: "bg-[#F5C93B]" },
  { value: "third", label: "Card 3 (Purple Theme)", dotColor: "bg-[#9739A8]" },
  { value: "fourth", label: "Card 4 (Yellow Theme)", dotColor: "bg-[#F5C93B]" },
];

const LIMIT_OPTIONS: AdminSelectOption<string>[] = [
  { value: "10", label: "10 / page" },
  { value: "20", label: "20 / page" },
  { value: "50", label: "50 / page" },
];

export function ImpactStatsToolbar({
  activeTab,
  onTabChange,
  searchTerm,
  onSearchChange,
  positionFilter,
  onPositionFilterChange,
  limit,
  onLimitChange,
}: ImpactStatsToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Tabs */}
      <div className="inline-flex rounded-lg border border-[#E5E0D8] bg-white p-0.5 shadow-2xs font-figtree">
        <button
          type="button"
          onClick={() => onTabChange("active")}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "active"
              ? "bg-[#1A0F1C] text-white shadow-2xs"
              : "text-[#5F6C6D] hover:text-[#0F1C1D]"
          }`}
        >
          Active Stats
        </button>
        <button
          type="button"
          onClick={() => onTabChange("deleted")}
          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "deleted"
              ? "bg-[#1A0F1C] text-white shadow-2xs"
              : "text-[#5F6C6D] hover:text-[#0F1C1D]"
          }`}
        >
          <Trash2 className="h-3 w-3" />
          <span>Trash</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative min-w-[200px] flex-1 sm:w-64 sm:flex-initial">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8A847A]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search metric name or value…"
            className="h-8 w-full rounded-lg border border-[#D9D3C9] bg-white pl-8 pr-3 font-figtree text-xs text-[#0F1C1D] placeholder:text-[#8A847A] shadow-2xs focus:border-[#9739A8] focus:outline-hidden"
          />
        </div>

        {/* Position Filter */}
        <AdminSelect<PositionFilter>
          value={positionFilter}
          onChange={onPositionFilterChange}
          options={POSITION_OPTIONS}
          size="sm"
          dropdownClassName="w-56"
        />

        {/* Rows per page */}
        <AdminSelect<string>
          value={String(limit)}
          onChange={(val) => onLimitChange(Number(val))}
          options={LIMIT_OPTIONS}
          size="sm"
          dropdownClassName="w-32"
        />
      </div>
    </div>
  );
}

