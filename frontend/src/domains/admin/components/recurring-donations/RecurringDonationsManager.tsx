"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  Repeat,
  RotateCw,
  Search,
  X,
} from "lucide-react";
import Typography from "@/lib/Typography";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/domains/admin/components/AdminAuthProvider";
import { AdminSelect, type AdminSelectOption } from "@/domains/admin/components/AdminSelect";
import {
  fetchSubscriptions,
  type AdminSubscriptionRow,
  type DonationFrequency,
  type PaginationMeta,
  type SubscriptionStatus,
} from "@/domains/admin/lib/api";
import {
  formatDonationAmount,
  formatDonationDate,
} from "@/domains/admin/components/donations/types";
import { FREQUENCY_LABELS, SUBSCRIPTION_STATUS_CONFIG } from "./config";
import { RecurringDonationDetailModal } from "./RecurringDonationDetailModal";

type StatusFilter = "all" | SubscriptionStatus;
type FrequencyFilter = "all" | DonationFrequency;

const STATUS_OPTIONS: AdminSelectOption<StatusFilter>[] = [
  { value: "all", label: "All (started)" },
  { value: "active", label: "Active", dotColor: "bg-[#1F6B45]" },
  { value: "authenticated", label: "Authorised", dotColor: "bg-[#1D4ED8]" },
  { value: "paused", label: "Paused", dotColor: "bg-[#8A6A00]" },
  { value: "pending", label: "Payment retrying", dotColor: "bg-[#8A6A00]" },
  { value: "halted", label: "Halted", dotColor: "bg-[#A33B3B]" },
  { value: "cancelled", label: "Cancelled", dotColor: "bg-[#667085]" },
  { value: "completed", label: "Completed", dotColor: "bg-[#667085]" },
  { value: "created", label: "Not completed", dotColor: "bg-[#667085]" },
];

const FREQUENCY_OPTIONS: AdminSelectOption<FrequencyFilter>[] = [
  { value: "all", label: "All Frequencies" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

const LIMIT = 20;

export function RecurringDonationsManager() {
  const { token, ready } = useAdminAuth();

  const [rows, setRows] = useState<AdminSubscriptionRow[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [frequency, setFrequency] = useState<FrequencyFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const [reloadKey, setReloadKey] = useState(0);

  const load = useCallback(() => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (!ready || !token) return;
    let cancelled = false;
    fetchSubscriptions(token, {
      page,
      limit: LIMIT,
      search,
      status: status === "all" ? undefined : status,
      frequency: frequency === "all" ? undefined : frequency,
    })
      .then((result) => {
        if (cancelled) return;
        setRows(result.data ?? []);
        setMeta(result.meta);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load recurring donations.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [ready, token, page, search, status, frequency, reloadKey]);

  const totalPages = meta?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#E5E0D8] pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <Typography variant="h4" className="font-lora text-3xl text-[#0F1C1D]">
              Recurring Donations
            </Typography>
            {meta && (
              <span className="inline-flex items-center rounded-full bg-[#1A0F1C]/5 border border-[#1A0F1C]/10 px-2.5 py-0.5 text-xs font-figtree font-semibold text-[#1A0F1C]">
                {meta.total} {meta.total === 1 ? "donor" : "donors"}
              </span>
            )}
          </div>
          <Typography variant="body-sm" className="mt-1 font-figtree text-sm text-[#5F6C6D]">
            Monthly, quarterly and yearly donations via Razorpay. Every charge also appears under Donations.
          </Typography>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#D9D3C9] bg-white px-3 text-xs font-figtree font-medium text-[#0F1C1D] shadow-2xs hover:bg-[#FAF8F4] disabled:opacity-50 transition-colors cursor-pointer"
        >
          <RotateCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800 font-figtree font-medium shadow-2xs">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          <p className="flex-1">{error}</p>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-[240px] flex-1 sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8A847A]" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by donor name, email or phone..."
            className="h-8.5 w-full rounded-lg border border-[#D9D3C9] bg-white pl-9 pr-8 font-figtree text-xs text-[#0F1C1D] placeholder:text-[#8A847A] shadow-2xs focus:border-[#9739A8] focus:outline-hidden"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A847A] hover:text-[#0F1C1D] cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <AdminSelect<StatusFilter>
            value={status}
            onChange={(val) => {
              setStatus(val);
              setPage(1);
            }}
            options={STATUS_OPTIONS}
            size="sm"
            dropdownClassName="w-44"
          />
          <AdminSelect<FrequencyFilter>
            value={frequency}
            onChange={(val) => {
              setFrequency(val);
              setPage(1);
            }}
            options={FREQUENCY_OPTIONS}
            size="sm"
            dropdownClassName="w-40"
          />
        </div>
      </div>

      {loading && rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-[#E5E0D8] bg-white p-12 text-[#5F6C6D] shadow-xs">
          <Loader2 className="h-6 w-6 animate-spin text-[#9739A8]" />
          <p className="mt-3 font-figtree text-xs">Loading recurring donations…</p>
        </div>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#D9D3C9] bg-white/50 p-12 text-center shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF8F4] text-[#8A847A] mb-3">
            <Repeat className="h-6 w-6" />
          </div>
          <p className="font-figtree text-sm font-semibold text-[#0F1C1D]">
            No recurring donations found
          </p>
          <p className="mt-1 font-figtree text-xs text-[#5F6C6D] max-w-sm">
            Recurring donations appear here once a donor sets one up from the website.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#E5E0D8] bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-figtree text-xs">
              <thead className="border-b border-[#E5E0D8] bg-[#FAF8F4] text-[11px] font-bold uppercase tracking-wider text-[#5F6C6D]">
                <tr>
                  <th className="py-3 px-4">Donor</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Frequency</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Charges</th>
                  <th className="py-3 px-4">Next Charge</th>
                  <th className="py-3 px-4">Started</th>
                  <th className="py-3 px-4 text-right w-16">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D8]">
                {rows.map((row) => {
                  const statusCfg = SUBSCRIPTION_STATUS_CONFIG[row.status];
                  return (
                    <tr key={row.id} className="transition-colors hover:bg-[#FAF8F4]/60">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#0F1C1D]">{row.fullName}</div>
                        <div className="text-[11px] text-[#8A847A]">{row.email}</div>
                        <div className="text-[11px] text-[#8A847A]">{row.phone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-sm text-[#0F1C1D]">
                          {formatDonationAmount(row.amount, row.currency)}
                        </span>
                        <div className="text-[11px] text-[#8A847A]">{row.donationCategory}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center rounded-md bg-[#FAF5FC] px-2 py-0.5 font-semibold text-[11px] text-[#9739A8] border border-[#9739A8]/20">
                          {FREQUENCY_LABELS[row.frequency]}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                            statusCfg.badgeCls,
                          )}
                        >
                          <span className={cn("h-1.5 w-1.5 rounded-full", statusCfg.dotCls)} />
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#5F6C6D] whitespace-nowrap">
                        {row.paidCount} / {row.totalCount}
                      </td>
                      <td className="py-3 px-4 text-[#8A847A] whitespace-nowrap">
                        {row.nextChargeAt ? formatDonationDate(row.nextChargeAt) : "—"}
                      </td>
                      <td className="py-3 px-4 text-[#8A847A] whitespace-nowrap">
                        {formatDonationDate(row.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedId(row.id)}
                          title="View details and charges"
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

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[#E5E0D8] bg-[#FAF8F4] px-4 py-3 text-xs text-[#5F6C6D] font-figtree">
              <p>
                Page <span className="font-semibold text-[#0F1C1D]">{page}</span> of{" "}
                <span className="font-semibold text-[#0F1C1D]">{totalPages}</span>
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page <= 1}
                  className="inline-flex h-7 items-center gap-1 rounded-md border border-[#D9D3C9] bg-white px-2 font-medium text-[#0F1C1D] shadow-2xs hover:bg-[#FAF8F4] disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Prev</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
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
      )}

      {selectedId && token && (
        <RecurringDonationDetailModal
          id={selectedId}
          token={token}
          onClose={() => setSelectedId(null)}
          onChanged={load}
        />
      )}
    </div>
  );
}
