import type {
  AnnualReportItem,
  ContentStatus,
  PaginationMeta,
} from "@/domains/admin/lib/api";

export type { AnnualReportItem, ContentStatus, PaginationMeta };

export interface AnnualReportFormValues {
  title: string;
  reportYear: string;
  sortOrder: number;
  status: ContentStatus;
  file: File | null;
}
