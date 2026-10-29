import type {
  BlogAndStoryItem,
  BlogCategoryItem,
  ContentStatus,
  PaginationMeta,
} from "@/domains/admin/lib/api";

export type { BlogAndStoryItem, BlogCategoryItem, ContentStatus, PaginationMeta };

export interface BlogAndStoryFormValues {
  title: string;
  slug: string;
  categoryId: string; // The category UUID
  blogDate: string; // YYYY-MM-DD
  shortDescription: string;
  content: string;
  status: ContentStatus;
  file: File | null;
  blogBannerUrl: string;
  metaTitle: string;
  metaDescription: string;
  schemaCode: string;
}

