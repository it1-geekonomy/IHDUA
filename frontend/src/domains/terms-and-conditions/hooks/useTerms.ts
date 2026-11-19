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

  return { terms, loading };
}