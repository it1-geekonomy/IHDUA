import type {
  ContentStatus,
  HomeBannerItem,
  PaginationMeta,
} from "@/domains/admin/lib/api";

export type { ContentStatus, HomeBannerItem, PaginationMeta };

export interface HomeBannerFormValues {
  file: File | null;
  status: ContentStatus;
}

