import type { AdminDonationRow } from "@/domains/admin/lib/api";

export type { AdminDonationRow };

export type DonationStatusType = "pending" | "paid" | "failed" | "refunded";

export type StatusFilter = "all" | DonationStatusType;

export const DONATION_STATUS_CONFIG: Record<
  string,
  { label: string; badgeCls: string; dotCls: string }
> = {
  paid: {
    label: "Paid",
    badgeCls: "bg-[#E7F6EE] text-[#1F6B45] border-[#1F6B45]/20",
    dotCls: "bg-[#1F6B45]",
  },
  success: {
    label: "Paid",
    badgeCls: "bg-[#E7F6EE] text-[#1F6B45] border-[#1F6B45]/20",
    dotCls: "bg-[#1F6B45]",
  },
  pending: {
    label: "Pending",
    badgeCls: "bg-[#FFF6DB] text-[#8A6A00] border-[#8A6A00]/20",
    dotCls: "bg-[#8A6A00]",
  },
  failed: {
    label: "Failed",
    badgeCls: "bg-[#FDECEC] text-[#A33B3B] border-[#A33B3B]/20",
    dotCls: "bg-[#A33B3B]",
  },
  refunded: {
    label: "Refunded",
    badgeCls: "bg-[#F2F4F7] text-[#344054] border-[#344054]/20",
    dotCls: "bg-[#667085]",
  },
};

export function formatDonationAmount(amount: string, currency: string = "INR"): string {
  const n = Number(amount);
  if (Number.isNaN(n)) return `${currency} ${amount}`;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency || "INR",
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatDonationDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

