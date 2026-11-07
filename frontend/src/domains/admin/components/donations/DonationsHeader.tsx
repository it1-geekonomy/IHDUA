"use client";

import { HandCoins, RotateCw } from "lucide-react";
import Typography from "@/lib/Typography";
import { ADMIN_COPY } from "@/domains/admin/constants";

interface DonationsHeaderProps {
  totalCount: number;
  totalRaisedINR: number;
  loading: boolean;
  onRefresh: () => void;
}

export function DonationsHeader({
  totalCount,
  totalRaisedINR,
  loading,
  onRefresh,
}: DonationsHeaderProps) {
  const formattedRaised = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(totalRaisedINR);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#E5E0D8] pb-5">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <Typography variant="h4" className="font-lora text-3xl text-[#0F1C1D]">
            {ADMIN_COPY.donationsTitle}
          </Typography>
          <span className="inline-flex items-center rounded-full bg-[#1A0F1C]/5 border border-[#1A0F1C]/10 px-2.5 py-0.5 text-xs font-figtree font-semibold text-[#1A0F1C]">
            {totalCount} {totalCount === 1 ? "transaction" : "transactions"}
          </span>
          {totalRaisedINR > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E7F6EE] border border-[#1F6B45]/20 px-3 py-0.5 text-xs font-figtree font-bold text-[#1F6B45]">
              <HandCoins className="h-3.5 w-3.5" />
              <span>{formattedRaised} Raised</span>
            </span>
          )}
        </div>
        <Typography variant="body-sm" className="mt-1 font-figtree text-sm text-[#5F6C6D]">
          {ADMIN_COPY.donationsSubtitle}
        </Typography>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#D9D3C9] bg-white px-3 text-xs font-figtree font-medium text-[#0F1C1D] shadow-2xs hover:bg-[#FAF8F4] disabled:opacity-50 transition-colors cursor-pointer"
        >
          <RotateCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
}

