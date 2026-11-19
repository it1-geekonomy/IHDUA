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

  return { policy, loading };
}