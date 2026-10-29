import type { ContentStatus, PaginationMeta } from "@/domains/admin/lib/api";

export interface LegalDocumentItem {
  id: string;
  title: string;
  content: string;
  status: ContentStatus;
  metaTitle: string | null;
  metaDescription: string | null;
  schemaCode: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface LegalDocumentDto {
  title: string;
  content: string;
  status?: ContentStatus;
  metaTitle?: string;
  metaDescription?: string;
  schemaCode?: string;
}

export interface LegalDocumentApi {
  fetchList: (
    token: string,
    params?: { page?: number; limit?: number; search?: string; status?: ContentStatus },
  ) => Promise<{ data: LegalDocumentItem[]; meta: PaginationMeta }>;
  fetchDeleted: (
    token: string,
    params?: { page?: number; limit?: number; search?: string },
  ) => Promise<{ data: LegalDocumentItem[]; meta: PaginationMeta }>;
  create: (token: string, data: LegalDocumentDto) => Promise<LegalDocumentItem>;
  update: (token: string, id: string, data: Partial<LegalDocumentDto>) => Promise<LegalDocumentItem>;
  remove: (token: string, id: string) => Promise<void>;
  restore: (token: string, id: string) => Promise<LegalDocumentItem>;
}
