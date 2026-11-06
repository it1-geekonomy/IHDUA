"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminAuth } from "@/domains/admin/components/AdminAuthProvider";
import {
  createImpactCategory,
  fetchImpactCategories,
  type ImpactCategoryItem,
} from "@/domains/admin/lib/api";
import { getCategoryDef } from "./layouts";

/** Resolves one of the five fixed categories to its backend record (matched by layout type). */
export function useImpactCategory(slug: string) {
  const { token, ready } = useAdminAuth();
  const def = getCategoryDef(slug);
  const [category, setCategory] = useState<ImpactCategoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [settingUp, setSettingUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token || !def) return;
    try {
      const res = await fetchImpactCategories(token);
      setCategory(res.data.find((c) => c.layoutType === def.layoutType) ?? null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load the category.");
    } finally {
      setLoading(false);
    }
  }, [token, def]);

  useEffect(() => {
    if (ready && token) void load();
  }, [ready, token, load]);

  const setUp = async () => {
    if (!token || !def) return;
    setSettingUp(true);
    setError(null);
    try {
      setCategory(
        await createImpactCategory(token, {
          name: def.name,
          slug: def.slug,
          layoutType: def.layoutType,
          displayOrder: def.displayOrder,
          status: "published",
        }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set up the category.");
    } finally {
      setSettingUp(false);
    }
  };

  return { def, category, loading, settingUp, error, setError, setUp, token };
}
