"use client";

import { useEffect, useState } from "react";
import { ADMIN_COPY } from "@/domains/admin/constants";
import { useAdminAuth } from "@/domains/admin/components/AdminAuthProvider";
import {
  fetchDonations,
  type AdminDonationRow,
} from "@/domains/admin/lib/api";
import { cn } from "@/lib/utils";

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatAmount(amount: string, currency: string) {
  const n = Number(amount);
  if (Number.isNaN(n)) return `${currency} ${amount}`;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency || "INR",
    maximumFractionDigits: 2,
  }).format(n);
}

const STATUS_STYLE: Record<AdminDonationRow["status"], string> = {
  success: "bg-[#E7F6EE] text-[#1F6B45]",
  pending: "bg-[#FFF6DB] text-[#8A6A00]",
  failed: "bg-[#FDECEC] text-[#A33B3B]",
};

export function DonationsPage() {
  const { token, ready } = useAdminAuth();
  const [rows, setRows] = useState<AdminDonationRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready || !token) return;
    let cancelled = false;

    setLoading(true);
    fetchDonations(token)
      .then((data) => {
        if (!cancelled) setRows(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load donations",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ready, token]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-lora text-3xl text-[#0F1C1D]">
          {ADMIN_COPY.donationsTitle}
        </h1>
        <p className="mt-1 font-figtree text-sm text-[#5F6C6D]">
          {ADMIN_COPY.donationsSubtitle}
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#D7E0E1] bg-white shadow-sm">
        {loading ? (
          <p className="p-6 font-figtree text-sm text-[#5F6C6D]">{ADMIN_COPY.loading}</p>
        ) : error ? (
          <p className="p-6 font-figtree text-sm text-[#A33B3B]">{error}</p>
        ) : rows.length === 0 ? (
          <p className="p-6 font-figtree text-sm text-[#5F6C6D]">
            {ADMIN_COPY.emptyDonations}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left font-figtree text-sm">
              <thead className="bg-[#F4F6F7] text-[#5F6C6D]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Donor</th>
                  <th className="px-4 py-3 font-semibold">Contact</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">PAN / Aadhaar</th>
                  <th className="px-4 py-3 font-semibold">Receipt</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-[#E7EEEE]">
                    <td className="px-4 py-3 font-medium text-[#0F1C1D]">
                      {row.fullName}
                    </td>
                    <td className="px-4 py-3 text-[#5F6C6D]">
                      <div>{row.email ?? "—"}</div>
                      <div>{row.phone ?? "—"}</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-[#0F1C1D]">
                      {formatAmount(row.amount, row.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
                          STATUS_STYLE[row.status],
                        )}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#5F6C6D]">{row.pan ?? "—"}</td>
                    <td className="px-4 py-3 text-[#5F6C6D]">
                      {row.receiptNumber ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-[#5F6C6D]">
                      {formatDate(row.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
