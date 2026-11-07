"use client";

import { Search, X } from "lucide-react";
import { AdminSelect, type AdminSelectOption } from "@/domains/admin/components/AdminSelect";
import type { StatusFilter } from "./types";

interface DonationsToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (status: StatusFilter) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
}

const STATUS_OPTIONS: AdminSelectOption<StatusFilter>[] = [
  { value: "all", label: "All Statuses" },
  { value: "paid", label: "Paid", dotColor: "bg-[#1F6B45]" },
  { value: "pending", label: "Pending", dotColor: "bg-[#8A6A00]" },
  { value: "failed", label: "Failed", dotColor: "bg-[#A33B3B]" },
  { value: "refunded", label: "Refunded", dotColor: "bg-[#667085]" },
];

const LIMIT_OPTIONS: AdminSelectOption<string>[] = [
  { value: "10", label: "10 / page" },
  { value: "20", label: "20 / page" },
  { value: "50", label: "50 / page" },
];

export function DonationsToolbar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  limit,
  onLimitChange,
}: DonationsToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Bar */}
      <div className="relative min-w-[240px] flex-1 sm:max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8A847A]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by donor name, email, phone, PAN, receipt..."
          className="h-8.5 w-full rounded-lg border border-[#D9D3C9] bg-white pl-9 pr-8 font-figtree text-xs text-[#0F1C1D] placeholder:text-[#8A847A] shadow-2xs focus:border-[#9739A8] focus:outline-hidden"
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

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status Filter */}
        <AdminSelect<StatusFilter>
          value={statusFilter}
          onChange={onStatusFilterChange}
          options={STATUS_OPTIONS}
          size="sm"
          dropdownClassName="w-40"
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

