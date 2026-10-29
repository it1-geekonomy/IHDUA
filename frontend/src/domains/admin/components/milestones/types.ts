import type {
  ContentStatus,
  MilestoneItem,
  PaginationMeta,
} from "@/domains/admin/lib/api";

export type { ContentStatus, MilestoneItem, PaginationMeta };

export interface MilestoneFormValues {
  year: string;
  description: string;
  status: ContentStatus;
}

