"use client";

import { Plus, RotateCw } from "lucide-react";

interface LeadershipMembersHeaderProps {
  total: number;
  loading: boolean;
  onRefresh: () => void;
  onCreate: () => void;
}

export function LeadershipMembersHeader({
  total,
  loading,
  onRefresh,
  onCreate,
}: LeadershipMembersHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#0F1C1D]">
            Leadership & Team
          </h1>
          <span className="inline-flex items-center rounded-full bg-[#FAF8F4] border border-[#E5E0D8] px-2.5 py-0.5 text-xs font-figtree font-semibold text-[#5F6C6D]">
            {total} {total === 1 ? "member" : "members"}
          </span>
        </div>
        <p className="mt-1 font-figtree text-xs text-[#5F6C6D]">
          Manage board trustees, key executives, and leadership members displayed on the website.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#D9D3C9] bg-white px-3 text-xs font-figtree font-medium text-[#0F1C1D] shadow-2xs hover:bg-[#FAF8F4] disabled:opacity-50 cursor-pointer"
        >
          <RotateCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>

        <button
          type="button"
          onClick={onCreate}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#9739A8] px-3.5 text-xs font-figtree font-semibold text-white shadow-xs hover:bg-[#832e92] transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Member</span>
        </button>
      </div>
    </div>
  );
}

