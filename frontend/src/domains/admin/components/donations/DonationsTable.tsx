"use client";

import { useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  HandCoins,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DONATION_STATUS_CONFIG,
  formatDonationAmount,
  formatDonationDate,
  type AdminDonationRow,
} from "./types";

interface DonationsTableProps {
  donations: AdminDonationRow[];
  totalCount: number;
  totalPages: number;
  page: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onViewDetail: (donation: AdminDonationRow) => void;
}

export function DonationsTable({
  donations,
  totalCount,
  totalPages,
  page,
  loading,
  onPageChange,
  onViewDetail,
}: DonationsTableProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-[#E5E0D8] bg-white p-12 text-[#5F6C6D] shadow-xs">
        <Loader2 className="h-6 w-6 animate-spin text-[#9739A8]" />
        <p className="mt-3 font-figtree text-xs">Loading donation records…</p>
      </div>
    );
  }

  if (donations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#D9D3C9] bg-white/50 p-12 text-center shadow-xs">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF8F4] text-[#8A847A] mb-3">
          <HandCoins className="h-6 w-6" />
        </div>
        <p className="font-figtree text-sm font-semibold text-[#0F1C1D]">
          No donation records found
        </p>
        <p className="mt-1 font-figtree text-xs text-[#5F6C6D] max-w-sm">
          No donations matched your search filters, or no online contributions have been recorded yet.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#E5E0D8] bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left font-figtree text-xs">
          <thead className="border-b border-[#E5E0D8] bg-[#FAF8F4] text-[11px] font-bold uppercase tracking-wider text-[#5F6C6D]">
            <tr>
              <th className="py-3 px-4">Donor</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Receipt / PAN</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right w-16">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E0D8]">
            {donations.map((item) => {
              const statusCfg =
                DONATION_STATUS_CONFIG[item.status.toLowerCase()] ||
                DONATION_STATUS_CONFIG.pending;

              return (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-[#FAF8F4]/60"
                >
                  {/* Donor */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#0F1C1D]">
                      {item.fullName}
                    </div>
                    {item.city && (
                      <div className="text-[11px] text-[#8A847A]">
                        {item.city}
                      </div>
                    )}
                  </td>

                  {/* Contact */}
                  <td className="py-3 px-4 text-[#5F6C6D]">
                    <div className="flex items-center gap-1.5">
                      <span>{item.email || "—"}</span>
                      {item.email && (
                        <button
                          type="button"
                          onClick={() => handleCopy(`email-${item.id}`, item.email!)}
                          className="text-[#8A847A] hover:text-[#0F1C1D] cursor-pointer"
                          title="Copy email"
                        >
                          {copiedKey === `email-${item.id}` ? (
                            <Check className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      )}
                    </div>
                    <div className="text-[11px] text-[#8A847A] mt-0.5">
                      {item.phone || "—"}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-sm text-[#0F1C1D]">
                      {formatDonationAmount(item.amount, item.currency)}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center rounded-md bg-[#FAF8F4] px-2 py-0.5 font-medium text-[11px] text-[#5F6C6D] border border-[#E5E0D8]">
                      {item.donationCategory || "General Donation"}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize",
                        statusCfg.badgeCls,
                      )}
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full", statusCfg.dotCls)} />
                      {statusCfg.label}
                    </span>
                  </td>

                  {/* Receipt & PAN */}
                  <td className="py-3 px-4 text-[#5F6C6D]">
                    {item.receiptNumber ? (
                      <div className="flex items-center gap-1 font-mono text-[11px]">
                        <span>{item.receiptNumber}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(`receipt-${item.id}`, item.receiptNumber!)}
                          className="text-[#8A847A] hover:text-[#0F1C1D] cursor-pointer"
                          title="Copy receipt number"
                        >
                          {copiedKey === `receipt-${item.id}` ? (
                            <Check className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <span className="text-[#8A847A]">—</span>
                    )}
                    {item.pan && (
                      <div className="text-[11px] text-[#8A847A] mt-0.5 font-mono">
                        PAN: {item.pan}
                      </div>
                    )}
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4 text-[#8A847A] whitespace-nowrap">
                    {formatDonationDate(item.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onViewDetail(item)}
                      title="View full donation details"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#5F6C6D] hover:bg-[#FAF8F4] hover:text-[#0F1C1D] transition-colors cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#E5E0D8] bg-[#FAF8F4] px-4 py-3 text-xs text-[#5F6C6D] font-figtree">
          <p>
            Showing Page <span className="font-semibold text-[#0F1C1D]">{page}</span> of{" "}
            <span className="font-semibold text-[#0F1C1D]">{totalPages}</span> ({totalCount} filtered)
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="inline-flex h-7 items-center gap-1 rounded-md border border-[#D9D3C9] bg-white px-2 font-medium text-[#0F1C1D] shadow-2xs hover:bg-[#FAF8F4] disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Prev</span>
            </button>
            <button
              type="button"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="inline-flex h-7 items-center gap-1 rounded-md border border-[#D9D3C9] bg-white px-2 font-medium text-[#0F1C1D] shadow-2xs hover:bg-[#FAF8F4] disabled:opacity-40 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

