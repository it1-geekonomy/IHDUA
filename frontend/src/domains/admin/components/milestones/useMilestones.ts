"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminAuth } from "@/domains/admin/components/AdminAuthProvider";
import {
  createMilestone,
  deleteMilestone,
  fetchDeletedMilestones,
  fetchMilestones,
  restoreMilestone,
  updateMilestone,
  type ContentStatus,
  type MilestoneItem,
  type PaginationMeta,
} from "@/domains/admin/lib/api";
import type { MilestoneFormValues } from "./types";

export function useMilestones() {
  const { token, ready } = useAdminAuth();

  // Tab & list states
  const [activeTab, setActiveTab] = useState<"active" | "deleted">("active");
  const [items, setItems] = useState<MilestoneItem[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [statusFilter, setStatusFilter] = useState<ContentStatus | "all">("all");
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
  const [editingItem, setEditingItem] = useState<MilestoneItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MilestoneItem | null>(null);

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

  // Fetch milestones
  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      if (activeTab === "active") {
        const res = await fetchMilestones(token, {
          page,
          limit,
          search: debouncedSearch,
          status: statusFilter === "all" ? undefined : statusFilter,
        });
        setItems(res.data || []);
        if (res.meta) setMeta(res.meta);
      } else {
        const res = await fetchDeletedMilestones(token, {
          page,
          limit,
          search: debouncedSearch,
        });
        setItems(res.data || []);
        if (res.meta) setMeta(res.meta);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load milestones.");
    } finally {
      setLoading(false);
    }
  }, [token, activeTab, page, limit, debouncedSearch, statusFilter]);

  useEffect(() => {
    if (ready && token) {
      void loadData();
    }
  }, [ready, token, loadData]);

  // Editor actions
  const openCreate = () => {
    setEditingItem(null);
    setIsEditorOpen(true);
  };

  const openEdit = (item: MilestoneItem) => {
    setEditingItem(item);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingItem(null);
  };

  // Delete actions
  const promptDelete = (item: MilestoneItem) => {
    setDeleteTarget(item);
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  // Save handler (create / update)
  const handleSave = async (values: MilestoneFormValues) => {
    if (!token) return;
    setActionLoading(true);
    setError(null);
    try {
      if (editingItem) {
        await updateMilestone(token, editingItem.id, {
          year: values.year,
          description: values.description,
          status: values.status,
        });
        setSuccessMessage(`Milestone for "${values.year}" updated successfully.`);
      } else {
        await createMilestone(token, {
          year: values.year,
          description: values.description,
          status: values.status,
        });
        setSuccessMessage(`Milestone for "${values.year}" created successfully.`);
      }
      closeEditor();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save milestone.");
    } finally {
      setActionLoading(false);
    }
  };

  // Quick status toggle (Draft / Published / Archived)
  const handleQuickStatus = async (item: MilestoneItem, newStatus: ContentStatus) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await updateMilestone(token, item.id, { status: newStatus });
      setSuccessMessage(`Status updated to "${newStatus}" for milestone "${item.year}".`);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change milestone status.");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete confirm
  const handleDeleteConfirm = async () => {
    if (!token || !deleteTarget) return;
    setActionLoading(true);
    try {
      await deleteMilestone(token, deleteTarget.id);
      setSuccessMessage(`Milestone "${deleteTarget.year}" moved to trash.`);
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete milestone.");
    } finally {
      setActionLoading(false);
    }
  };

  // Restore confirm
  const handleRestore = async (item: MilestoneItem) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await restoreMilestone(token, item.id);
      setSuccessMessage(`Milestone "${item.year}" restored from trash.`);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to restore milestone.");
    } finally {
      setActionLoading(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    items,
    meta,
    loading,
    actionLoading,
    error,
    setError,
    successMessage,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    isEditorOpen,
    editingItem,
    deleteTarget,
    loadData,
    openCreate,
    openEdit,
    closeEditor,
    promptDelete,
    cancelDelete,
    handleSave,
    handleQuickStatus,
    handleDeleteConfirm,
    handleRestore,
    setPage,
  };
}

