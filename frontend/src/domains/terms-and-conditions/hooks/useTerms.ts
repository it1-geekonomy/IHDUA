"use client";

import { useEffect, useState } from "react";
import {
  getPublishedTerms,
  type TermsAndConditions,
} from "../lib/termsApi";

export function useTerms() {
  const [terms, setTerms] = useState<TermsAndConditions | null>(null);
  const [loading, setLoading] = useState(true);

  // Runs on every mount => API is called again on every page switch / refresh
  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    getPublishedTerms().then((data) => {
      if (cancelled) return;
      setTerms(data);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Apply meta title / description from the API once loaded
  useEffect(() => {
    if (!terms) return;

    const title = terms.metaTitle || terms.title;
    if (title) document.title = title;

    if (terms.metaDescription) {
      let tag = document.querySelector<HTMLMetaElement>(
        'meta[name="description"]'
      );
      if (!tag) {
        tag = document.createElement("meta");
        tag.name = "description";
        document.head.appendChild(tag);
      }
      tag.content = terms.metaDescription;
    }
  }, [terms]);

  return { terms, loading };
}