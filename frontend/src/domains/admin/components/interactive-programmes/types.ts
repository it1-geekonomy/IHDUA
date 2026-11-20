import type {
  ContentStatus,
  InteractiveProgrammeItem,
  PaginationMeta,
} from "@/domains/admin/lib/api";

export type { ContentStatus, InteractiveProgrammeItem, PaginationMeta };

export interface InteractiveProgrammeFormValues {
  title: string;
  slug: string;
  eventMediaFile?: File | null;
  eventMediaUrl?: string | null;
  clearMedia?: boolean;
  eventDate?: string | null;
  eventLocation?: string | null;
  eventTime?: string | null;
  content?: string | null;
  status: ContentStatus;
}
