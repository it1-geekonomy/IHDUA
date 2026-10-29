"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminAuth } from "@/domains/admin/components/AdminAuthProvider";
import {
  createAnnualReport,
  deleteAnnualReport,
  fetchAnnualReports,
  fetchDeletedAnnualReports,
  restoreAnnualReport,
  updateAnnualReport,
  type AnnualReportItem,
  type ContentStatus,
  type PaginationMeta,
} from "@/domains/admin/lib/api";
import type { AnnualReportFormValues } from "./types";

export function useAnnualReports() {
  const { token, ready } = useAdminAuth();

  // Tab & list states
  const [activeTab, setActiveTab] = useState<"active" | "deleted">("active");
  const [items, setItems] = useState<AnnualReportItem[]>([]);
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
  const [editingItem, setEditingItem] = useState<AnnualReportItem | null>(null);
  const [previewItem, setPreviewItem] = useState<AnnualReportItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AnnualReportItem | null>(null);

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

  // Fetch data
  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      if (activeTab === "active") {
        const res = await fetchAnnualReports(token, {
          page,
          limit,
          search: debouncedSearch,
          status: statusFilter === "all" ? undefined : statusFilter,
        });
        setItems(res.data || []);
        if (res.meta) setMeta(res.meta);
      } else {
        const res = await fetchDeletedAnnualReports(token, {
          page,
          limit,
          search: debouncedSearch,
        });
        setItems(res.data || []);
        if (res.meta) setMeta(res.meta);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load annual reports.");
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

  const openEdit = (item: AnnualReportItem) => {
    setEditingItem(item);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingItem(null);
  };

  // Preview actions
  const openPreview = (item: AnnualReportItem) => {
    setPreviewItem(item);
  };

  const closePreview = () => {
    setPreviewItem(null);
  };

  // Delete actions
  const promptDelete = (item: AnnualReportItem) => {
    setDeleteTarget(item);
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  // Save handler (create / update)
  const handleSave = async (values: AnnualReportFormValues) => {
    if (!token) return;
    setActionLoading(true);
    setError(null);
    try {
      if (editingItem) {
        await updateAnnualReport(token, editingItem.id, {
          title: values.title,
          reportYear: values.reportYear,
          sortOrder: values.sortOrder,
          status: values.status,
          file: values.file || undefined,
        });
        setSuccessMessage(`"${values.title}" updated successfully.`);
      } else {
        if (!values.file) {
          setError("Annual report PDF file is required.");
          setActionLoading(false);
          return;
        }
        await createAnnualReport(token, {
          title: values.title,
          reportYear: values.reportYear,
          sortOrder: values.sortOrder,
          status: values.status,
          file: values.file,
        });
        setSuccessMessage(`"${values.title}" uploaded successfully.`);
      }
      closeEditor();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save annual report.");
    } finally {
      setActionLoading(false);
    }
  };

  // Quick status toggle (Publish / Archive)
  const handleQuickStatus = async (item: AnnualReportItem, newStatus: ContentStatus) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await updateAnnualReport(token, item.id, { status: newStatus });
      setSuccessMessage(`Status updated to "${newStatus}" for "${item.title}".`);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change status.");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete confirm
  const handleDeleteConfirm = async () => {
    if (!token || !deleteTarget) return;
    setActionLoading(true);
    try {
      await deleteAnnualReport(token, deleteTarget.id);
      setSuccessMessage(`"${deleteTarget.title}" moved to trash.`);
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete annual report.");
    } finally {
      setActionLoading(false);
    }
  };

  // Restore action
  const handleRestore = async (item: AnnualReportItem) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await restoreAnnualReport(token, item.id);
      setSuccessMessage(`"${item.title}" restored successfully.`);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to restore annual report.");
    } finally {
      setActionLoading(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    items,
    page,
    setPage,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    meta,
    loading,
    actionLoading,
    error,
    setError,
    successMessage,
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
  };
}
