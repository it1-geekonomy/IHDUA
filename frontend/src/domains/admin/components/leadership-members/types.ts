import type { LeadershipMemberItem, PaginationMeta } from "@/domains/admin/lib/api";

export type { LeadershipMemberItem, PaginationMeta };

export type MemberStatus = "published" | "draft" | "archived";

export type StatusFilter = "all" | MemberStatus;

export interface LeadershipMemberFormValues {
  name: string;
  designation: string;
  sortOrder: number;
  status: MemberStatus;
  file: File | null;
}

export const STATUS_CONFIG: Record<
  MemberStatus,
  { label: string; badgeCls: string; dotCls: string }
> = {
  published: {
    label: "Published",
    badgeCls: "bg-[#E7F6EE] text-[#1F6B45] border-[#1F6B45]/20",
    dotCls: "bg-[#1F6B45]",
  },
  draft: {
    label: "Draft",
    badgeCls: "bg-[#FEF6EE] text-[#B54708] border-[#B54708]/20",
    dotCls: "bg-[#B54708]",
  },
  archived: {
    label: "Archived",
    badgeCls: "bg-[#F2F4F7] text-[#344054] border-[#344054]/20",
    dotCls: "bg-[#667085]",
  },
};

