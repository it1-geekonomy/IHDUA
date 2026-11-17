import type {
  ContentStatus,
  FundingComponentItem,
  FundingProjectItem,
  PaginationMeta,
} from "@/domains/admin/lib/api";

export type {
  ContentStatus,
  FundingComponentItem,
  FundingProjectItem,
  PaginationMeta,
};

export interface FundingProjectFormValues {
  slug: string;
  projectNumber: string;
  title: string;
  summary: string;
  totalLabel: string;
  cause: string;
  highlights: string[];
  components: FundingComponentItem[];
  sortOrder: number;
  status: ContentStatus;
}
