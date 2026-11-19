"use client";

import { useEffect, useState } from "react";
import {
  getPublishedPrivacyPolicy,
  type PrivacyPolicy,
} from "../lib/privacyPolicyApi";

export function usePrivacyPolicy() {
  const [policy, setPolicy] = useState<PrivacyPolicy | null>(null);
  const [loading, setLoading] = useState(true);

  // Runs on every mount => API is called again on every page switch / refresh
  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    getPublishedPrivacyPolicy().then((data) => {
      if (cancelled) return;
      setPolicy(data);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Apply meta title / description from the API once loaded
  useEffect(() => {
    if (!policy) return;

    const title = policy.metaTitle || policy.title;
    if (title) document.title = title;

    if (policy.metaDescription) {
      let tag = document.querySelector<HTMLMetaElement>(
        'meta[name="description"]'
      );
      if (!tag) {
        tag = document.createElement("meta");
        tag.name = "description";
        document.head.appendChild(tag);
      }
      tag.content = policy.metaDescription;
    }
  }, [policy]);

  return { policy, loading };
}