import type {
  NewsletterSubscriberItem,
  PaginationMeta,
} from "@/domains/admin/lib/api";

export type { NewsletterSubscriberItem, PaginationMeta };

export type SubscriberStatusFilter = "all" | "active" | "inactive";
