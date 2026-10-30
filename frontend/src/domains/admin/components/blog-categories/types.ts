import type {
  BlogCategoryItem,
  PaginationMeta,
} from "@/domains/admin/lib/api";

export type { BlogCategoryItem, PaginationMeta };

export interface BlogCategoryFormValues {
  name: string;
  slug: string;
}

