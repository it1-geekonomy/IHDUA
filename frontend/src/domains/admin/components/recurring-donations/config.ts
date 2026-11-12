import type {
  DonationFrequency,
  SubscriptionStatus,
} from "@/domains/admin/lib/api";

export const FREQUENCY_LABELS: Record<DonationFrequency, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
};

export const SUBSCRIPTION_STATUS_CONFIG: Record<
  SubscriptionStatus,
  { label: string; badgeCls: string; dotCls: string }
> = {
  active: {
    label: "Active",
    badgeCls: "bg-[#E7F6EE] text-[#1F6B45] border-[#1F6B45]/20",
    dotCls: "bg-[#1F6B45]",
  },
  authenticated: {
    label: "Authorised",
    badgeCls: "bg-[#EAF2FF] text-[#1D4ED8] border-[#1D4ED8]/20",
    dotCls: "bg-[#1D4ED8]",
  },
  created: {
    label: "Not completed",
    badgeCls: "bg-[#F2F4F7] text-[#344054] border-[#344054]/20",
    dotCls: "bg-[#667085]",
  },
  pending: {
    label: "Payment retrying",
    badgeCls: "bg-[#FFF6DB] text-[#8A6A00] border-[#8A6A00]/20",
    dotCls: "bg-[#8A6A00]",
  },
  halted: {
    label: "Halted",
    badgeCls: "bg-[#FDECEC] text-[#A33B3B] border-[#A33B3B]/20",
    dotCls: "bg-[#A33B3B]",
  },
  paused: {
    label: "Paused",
    badgeCls: "bg-[#FFF6DB] text-[#8A6A00] border-[#8A6A00]/20",
    dotCls: "bg-[#8A6A00]",
  },
  cancelled: {
    label: "Cancelled",
    badgeCls: "bg-[#F2F4F7] text-[#344054] border-[#344054]/20",
    dotCls: "bg-[#667085]",
  },
  completed: {
    label: "Completed",
    badgeCls: "bg-[#F2F4F7] text-[#344054] border-[#344054]/20",
    dotCls: "bg-[#667085]",
  },
  expired: {
    label: "Expired",
    badgeCls: "bg-[#F2F4F7] text-[#344054] border-[#344054]/20",
    dotCls: "bg-[#667085]",
  },
};

export const ENDED_STATUSES: SubscriptionStatus[] = [
  "cancelled",
  "completed",
  "expired",
];

/** Razorpay only allows pausing an active subscription and resuming a paused one. */
export function canPause(status: SubscriptionStatus) {
  return status === "active";
}

export function canResume(status: SubscriptionStatus) {
  return status === "paused";
}

export function canCancel(status: SubscriptionStatus) {
  return !ENDED_STATUSES.includes(status);
}
