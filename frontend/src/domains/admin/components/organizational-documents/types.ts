import type {
  ContentStatus,
  OrganizationalDocumentItem,
  PaginationMeta,
} from "@/domains/admin/lib/api";

export type { ContentStatus, OrganizationalDocumentItem, PaginationMeta };

export interface OrganizationalDocumentFormValues {
  title: string;
  sortOrder: number;
  status: ContentStatus;
  file: File | null;
}
