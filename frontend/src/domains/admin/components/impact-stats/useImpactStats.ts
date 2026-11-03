"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminAuth } from "@/domains/admin/components/AdminAuthProvider";
import {
  createImpactStat,
  deleteImpactStat,
  fetchDeletedImpactStats,
  fetchImpactStats,
  restoreImpactStat,
  updateImpactStat,
  type ImpactCardPosition,
  type ImpactStatItem,
  type PaginationMeta,
} from "@/domains/admin/lib/api";
import type { ImpactStatFormValues, PositionFilter } from "./types";

export function useImpactStats() {
  const { token, ready } = useAdminAuth();

  // Tab & list states
  const [activeTab, setActiveTab] = useState<"active" | "deleted">("active");
  const [items, setItems] = useState<ImpactStatItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [positionFilter, setPositionFilter] = useState<PositionFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  // Loading & status states
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ImpactStatItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ImpactStatItem | null>(null);

  // Search debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Flash message auto-clear
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Fetch impact stats
  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      if (activeTab === "active") {
        const res = await fetchImpactStats(token, {
          page,
          limit,
          search: debouncedSearch,
          cardPosition: positionFilter === "all" ? undefined : (positionFilter as ImpactCardPosition),
        });
        let data = res.data || [];
        // If client filter is set and backend doesn't filter by cardPosition, filter client side as well
        if (positionFilter !== "all") {
          data = data.filter((item) => item.cardPosition === positionFilter);
        }
        setItems(data);
        if (res.meta) setMeta(res.meta);
      } else {
        const res = await fetchDeletedImpactStats(token, {
          page,
          limit,
          search: debouncedSearch,
          cardPosition: positionFilter === "all" ? undefined : (positionFilter as ImpactCardPosition),
        });
        let data = res.data || [];
        if (positionFilter !== "all") {
          data = data.filter((item) => item.cardPosition === positionFilter);
        }
        setItems(data);
        if (res.meta) setMeta(res.meta);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load impact stats.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [token, activeTab, page, limit, debouncedSearch, positionFilter]);

  // Trigger load on state change once auth is ready
  useEffect(() => {
    if (ready && token) {
      loadData();
    }
  }, [ready, token, loadData]);

  // Handle Tab switch
  const handleTabChange = (tab: "active" | "deleted") => {
    setActiveTab(tab);
    setPage(1);
    setSearchTerm("");
    setDebouncedSearch("");
    setPositionFilter("all");
  };

  // Open editor for creating
  const handleOpenCreate = () => {
    setEditingItem(null);
    setIsEditorOpen(true);
  };

  // Open editor for updating
  const handleOpenEdit = (item: ImpactStatItem) => {
    setEditingItem(item);
    setIsEditorOpen(true);
  };

  // Close editor
  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingItem(null);
  };

  // Save (Create or Update)
  const handleSave = async (values: ImpactStatFormValues) => {
    if (!token) return;
    setActionLoading(true);
    setError(null);
    try {
      if (editingItem) {
        await updateImpactStat(token, editingItem.id, values);
        setSuccessMessage("Impact stat updated successfully.");
      } else {
        await createImpactStat(token, values);
        setSuccessMessage("New impact stat created successfully.");
      }
      handleCloseEditor();
      await loadData();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save impact stat.";
      setError(msg);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // Open delete prompt
  const handleOpenDelete = (item: ImpactStatItem) => {
    setDeleteTarget(item);
  };

  // Close delete modal
  const handleCloseDelete = () => {
    setDeleteTarget(null);
  };

  // Soft delete confirm
  const handleConfirmDelete = async () => {
    if (!token || !deleteTarget) return;
    setActionLoading(true);
    setError(null);
    try {
      await deleteImpactStat(token, deleteTarget.id);
      setSuccessMessage(`"${deleteTarget.metricName}" moved to trash.`);
      handleCloseDelete();
      await loadData();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete impact stat.";
      setError(msg);
    } finally {
      setActionLoading(false);
    }
  };

  // Restore from trash (PATCH)
  const handleRestore = async (item: ImpactStatItem) => {
    if (!token) return;
    setActionLoading(true);
    setError(null);
    try {
      await restoreImpactStat(token, item.id);
      setSuccessMessage(`"${item.metricName}" restored from trash.`);
      await loadData();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to restore impact stat.";
      setError(msg);
    } finally {
      setActionLoading(false);
    }
  };

  return {
    items,
    loading,
    actionLoading,
    error,
    setError,
    successMessage,
    activeTab,
    page,
    limit,
    setLimit,
    positionFilter,
    setPositionFilter,
    searchTerm,
    setSearchTerm,
    meta,
    isEditorOpen,
    editingItem,
    deleteTarget,
    setPage,
    handleTabChange,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseEditor,
    handleSave,
    handleOpenDelete,
    handleCloseDelete,
    handleConfirmDelete,
    handleRestore,
    refresh: loadData,
  };
}

