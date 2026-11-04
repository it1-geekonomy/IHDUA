"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminAuth } from "@/domains/admin/components/AdminAuthProvider";
import {
  createHomeBanner,
  deleteHomeBanner,
  fetchDeletedHomeBanners,
  fetchHomeBanners,
  restoreHomeBanner,
  updateHomeBanner,
  type ContentStatus,
  type HomeBannerItem,
  type PaginationMeta,
} from "@/domains/admin/lib/api";
import type { HomeBannerFormValues } from "./types";

export function useHomeBanners() {
  const { token, ready } = useAdminAuth();

  // Tab & list states
  const [activeTab, setActiveTab] = useState<"active" | "deleted">("active");
  const [items, setItems] = useState<HomeBannerItem[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [statusFilter, setStatusFilter] = useState<ContentStatus | "all">("all");
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
  const [editingItem, setEditingItem] = useState<HomeBannerItem | null>(null);
  const [previewItem, setPreviewItem] = useState<HomeBannerItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<HomeBannerItem | null>(null);

  // Flash message auto-clear
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Fetch home banners
  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      if (activeTab === "active") {
        const res = await fetchHomeBanners(token, {
          page,
          limit,
          status: statusFilter === "all" ? undefined : statusFilter,
        });
        setItems(res.data || []);
        if (res.meta) setMeta(res.meta);
      } else {
        const res = await fetchDeletedHomeBanners(token, {
          page,
          limit,
        });
        setItems(res.data || []);
        if (res.meta) setMeta(res.meta);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load home banners.");
    } finally {
      setLoading(false);
    }
  }, [token, activeTab, page, limit, statusFilter]);

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

  const openEdit = (item: HomeBannerItem) => {
    setEditingItem(item);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingItem(null);
  };

  // Preview actions
  const openPreview = (item: HomeBannerItem) => {
    setPreviewItem(item);
  };

  const closePreview = () => {
    setPreviewItem(null);
  };

  // Delete actions
  const promptDelete = (item: HomeBannerItem) => {
    setDeleteTarget(item);
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  // Save handler (create / update)
  const handleSave = async (values: HomeBannerFormValues) => {
    if (!token) return;
    setActionLoading(true);
    setError(null);
    try {
      if (editingItem) {
        await updateHomeBanner(token, editingItem.id, {
          file: values.file || undefined,
          status: values.status,
        });
        setSuccessMessage("Home banner updated successfully.");
      } else {
        if (!values.file) {
          setError("Banner image file is required.");
          setActionLoading(false);
          return;
        }
        await createHomeBanner(token, {
          file: values.file,
          status: values.status,
        });
        setSuccessMessage("Home banner uploaded successfully.");
      }
      closeEditor();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save home banner.");
    } finally {
      setActionLoading(false);
    }
  };

  // Quick status toggle (Draft / Published / Archived)
  const handleQuickStatus = async (item: HomeBannerItem, newStatus: ContentStatus) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await updateHomeBanner(token, item.id, { status: newStatus });
      setSuccessMessage(`Status updated to "${newStatus}".`);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change banner status.");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete confirm
  const handleDeleteConfirm = async () => {
    if (!token || !deleteTarget) return;
    setActionLoading(true);
    try {
      await deleteHomeBanner(token, deleteTarget.id);
      setSuccessMessage("Home banner moved to trash.");
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete home banner.");
    } finally {
      setActionLoading(false);
    }
  };

  // Restore confirm
  const handleRestore = async (item: HomeBannerItem) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await restoreHomeBanner(token, item.id);
      setSuccessMessage("Home banner restored from trash.");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to restore home banner.");
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
    statusFilter,
    setStatusFilter,
    isEditorOpen,
    editingItem,
    previewItem,
    deleteTarget,
    loadData,
    openCreate,
    openEdit,
    closeEditor,
    openPreview,
    closePreview,
    promptDelete,
    cancelDelete,
    handleSave,
    handleQuickStatus,
    handleDeleteConfirm,
    handleRestore,
    setPage,
  };
}

