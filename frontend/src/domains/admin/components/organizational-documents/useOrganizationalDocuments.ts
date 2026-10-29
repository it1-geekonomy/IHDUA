"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminAuth } from "@/domains/admin/components/AdminAuthProvider";
import {
  createOrganizationalDocument,
  deleteOrganizationalDocument,
  fetchDeletedOrganizationalDocuments,
  fetchOrganizationalDocuments,
  restoreOrganizationalDocument,
  updateOrganizationalDocument,
  type ContentStatus,
  type OrganizationalDocumentItem,
  type PaginationMeta,
} from "@/domains/admin/lib/api";
import type { OrganizationalDocumentFormValues } from "./types";

export function useOrganizationalDocuments() {
  const { token, ready } = useAdminAuth();

  // Tab & list states
  const [activeTab, setActiveTab] = useState<"active" | "deleted">("active");
  const [items, setItems] = useState<OrganizationalDocumentItem[]>([]);
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
  const [editingItem, setEditingItem] = useState<OrganizationalDocumentItem | null>(null);
  const [previewItem, setPreviewItem] = useState<OrganizationalDocumentItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<OrganizationalDocumentItem | null>(null);

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
        const res = await fetchOrganizationalDocuments(token, {
          page,
          limit,
          search: debouncedSearch,
          status: statusFilter === "all" ? undefined : statusFilter,
        });
        setItems(res.data || []);
        if (res.meta) setMeta(res.meta);
      } else {
        const res = await fetchDeletedOrganizationalDocuments(token, {
          page,
          limit,
          search: debouncedSearch,
        });
        setItems(res.data || []);
        if (res.meta) setMeta(res.meta);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load organizational documents.",
      );
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

  const openEdit = (item: OrganizationalDocumentItem) => {
    setEditingItem(item);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingItem(null);
  };

  // Preview actions
  const openPreview = (item: OrganizationalDocumentItem) => {
    setPreviewItem(item);
  };

  const closePreview = () => {
    setPreviewItem(null);
  };

  // Delete actions
  const promptDelete = (item: OrganizationalDocumentItem) => {
    setDeleteTarget(item);
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  // Save handler (create / update)
  const handleSave = async (values: OrganizationalDocumentFormValues) => {
    if (!token) return;
    setActionLoading(true);
    setError(null);
    try {
      if (editingItem) {
        await updateOrganizationalDocument(token, editingItem.id, {
          title: values.title,
          sortOrder: values.sortOrder,
          status: values.status,
          file: values.file || undefined,
        });
        setSuccessMessage(`"${values.title}" updated successfully.`);
      } else {
        if (!values.file) {
          setError("Document PDF file is required.");
          setActionLoading(false);
          return;
        }
        await createOrganizationalDocument(token, {
          title: values.title,
          sortOrder: values.sortOrder,
          status: values.status,
          file: values.file,
        });
        setSuccessMessage(`"${values.title}" uploaded successfully.`);
      }
      closeEditor();
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save organizational document.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Quick status toggle (Publish / Archive)
  const handleQuickStatus = async (
    item: OrganizationalDocumentItem,
    newStatus: ContentStatus,
  ) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await updateOrganizationalDocument(token, item.id, { status: newStatus });
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
      await deleteOrganizationalDocument(token, deleteTarget.id);
      setSuccessMessage(`"${deleteTarget.title}" moved to trash.`);
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete organizational document.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Restore action
  const handleRestore = async (item: OrganizationalDocumentItem) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await restoreOrganizationalDocument(token, item.id);
      setSuccessMessage(`"${item.title}" restored successfully.`);
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to restore organizational document.",
      );
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
