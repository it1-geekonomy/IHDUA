"use client";

import { useEffect, useState } from "react";
import {
  fetchPublishedAnnualReports,
  fetchPublishedOrganizationalDocuments,
  type ApiDocument,
} from "@/domains/about/lib/documents";

export type DocumentItem = { id: string; title: string; url: string };

export type DocumentItems = {
  organizational: DocumentItem[];
  annual: DocumentItem[];
};

const toItems = (docs: ApiDocument[]): DocumentItem[] =>
  docs
    .filter((d) => d.title && d.fileUrl)
    .map((d) => ({ id: d.id, title: d.title, url: d.fileUrl }));

/**
 * Returns `null` while loading, then the published items per group.
 * A group whose request fails or has nothing published gets an empty list.
 * No hardcoded fallback. Called once per visit to the page.
 */
export function useDocumentItems() {
  const [items, setItems] = useState<DocumentItems | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([
      fetchPublishedOrganizationalDocuments(),
      fetchPublishedAnnualReports(),
    ]).then(([org, annual]) => {
      if (cancelled) return;

      setItems({
        organizational: org.status === "fulfilled" ? toItems(org.value) : [],
        annual: annual.status === "fulfilled" ? toItems(annual.value) : [],
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return items;
}