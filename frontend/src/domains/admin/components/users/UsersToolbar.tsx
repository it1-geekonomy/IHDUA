"use client";

import { Search, X } from "lucide-react";
import type { AdminUserRole } from "@/domains/admin/lib/api";

interface UsersToolbarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  roleFilter: AdminUserRole | "ALL";
  onRoleFilterChange: (role: AdminUserRole | "ALL") => void;
  filteredCount: number;
  totalCount: number;
}

export function UsersToolbar({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  filteredCount,
  totalCount,
}: UsersToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between font-figtree">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A847A]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, email, or role…"
          className="h-10 w-full rounded-xl border border-[#D9D3C9] bg-white pl-9 pr-9 text-xs text-[#0F1C1D] placeholder:text-[#8A847A] shadow-2xs focus:border-[#9739A8] focus:outline-none focus:ring-2 focus:ring-[#9739A8]/20 transition-all"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A847A] hover:text-[#0F1C1D] cursor-pointer"
            title="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Role Filter Tabs */}
      <div className="flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-[#E5E0D8] bg-white p-1 shadow-2xs">
        <button
          type="button"
          onClick={() => onRoleFilterChange("ALL")}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
            roleFilter === "ALL"
              ? "bg-[#1A0F1C] text-white shadow-xs"
              : "text-[#5F6C6D] hover:bg-[#FAF8F4] hover:text-[#0F1C1D]"
          }`}
        >
          All Roles
        </button>
        <button
          type="button"
          onClick={() => onRoleFilterChange("ADMIN")}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
            roleFilter === "ADMIN"
              ? "bg-[#9739A8] text-white shadow-xs"
              : "text-[#5F6C6D] hover:bg-[#FAF8F4] hover:text-[#0F1C1D]"
          }`}
        >
          Admin
        </button>
        <button
          type="button"
          onClick={() => onRoleFilterChange("CONTENT")}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
            roleFilter === "CONTENT"
              ? "bg-[#0284C7] text-white shadow-xs"
              : "text-[#5F6C6D] hover:bg-[#FAF8F4] hover:text-[#0F1C1D]"
          }`}
        >
          Content
        </button>
      </div>
    </div>
  );
}
