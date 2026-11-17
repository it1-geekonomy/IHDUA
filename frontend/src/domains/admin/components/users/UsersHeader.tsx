"use client";

import { Loader2, Plus, RefreshCw, Users } from "lucide-react";
import { ADMIN_COPY } from "@/domains/admin/constants";

interface UsersHeaderProps {
  total: number;
  loading: boolean;
  onRefresh: () => void;
  onCreate: () => void;
}

export function UsersHeader({
  total,
  loading,
  onRefresh,
  onCreate,
}: UsersHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF8F4] text-[#9739A8] border border-[#E5E0D8]">
            <Users className="h-4 w-4" />
          </div>
          <h1 className="font-lora text-2xl font-medium text-[#0F1C1D] sm:text-3xl">
            {ADMIN_COPY.usersTitle}
          </h1>
          <span className="rounded-full bg-[#FAF8F4] border border-[#E5E0D8] px-2.5 py-0.5 font-figtree text-xs font-semibold text-[#5F6C6D]">
            {total}
          </span>
        </div>
        <p className="mt-1 font-figtree text-xs sm:text-sm text-[#5F6C6D]">
          {ADMIN_COPY.usersSubtitle}
        </p>
      </div>

      <div className="flex items-center gap-2.5 self-start sm:self-auto">
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#D9D3C9] bg-white px-3 text-xs font-semibold text-[#5F6C6D] shadow-2xs hover:bg-[#FAF8F4] hover:text-[#0F1C1D] disabled:opacity-50 cursor-pointer transition-all"
          title="Refresh user list"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-[#9739A8]" : ""}`} />
          <span>Refresh</span>
        </button>

        <button
          type="button"
          onClick={onCreate}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#FFD638] px-4 text-xs font-bold text-[#140816] shadow-sm hover:bg-[#ffe169] active:scale-95 cursor-pointer transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add User</span>
        </button>
      </div>
    </div>
  );
}
