"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminAuth } from "@/domains/admin/components/AdminAuthProvider";
import type { ContentStatus, PaginationMeta } from "@/domains/admin/lib/api";
import type { LegalDocumentApi, LegalDocumentDto, LegalDocumentItem } from "./types";

interface UseLegalDocumentsOptions {
  api: LegalDocumentApi;
  documentNoun: string;
}

export function useLegalDocuments({ api, documentNoun }: UseLegalDocumentsOptions) {
  const { token, ready } = useAdminAuth();

  // Tab & list states
  const [activeTab, setActiveTab] = useState<"active" | "deleted">("active");
  const [items, setItems] = useState<LegalDocumentItem[]>([]);
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
  const [editingItem, setEditingItem] = useState<LegalDocumentItem | null>(null);
  const [previewItem, setPreviewItem] = useState<LegalDocumentItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LegalDocumentItem | null>(null);

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
        const res = await api.fetchList(token, {
          page,
          limit,
          search: debouncedSearch,
          status: statusFilter === "all" ? undefined : statusFilter,
        });
        setItems(res.data || []);
        if (res.meta) setMeta(res.meta);
      } else {
        const res = await api.fetchDeleted(token, {
          page,
          limit,
          search: debouncedSearch,
        });
        setItems(res.data || []);
        if (res.meta) setMeta(res.meta);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to load ${documentNoun} records.`);
    } finally {
      setLoading(false);
    }
  }, [token, activeTab, page, limit, debouncedSearch, statusFilter, api, documentNoun]);

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

  const openEdit = (item: LegalDocumentItem) => {
    setEditingItem(item);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingItem(null);
  };

  // Preview actions
  const openPreview = (item: LegalDocumentItem) => {
    setPreviewItem(item);
  };

  const closePreview = () => {
    setPreviewItem(null);
  };

  // Delete actions
  const promptDelete = (item: LegalDocumentItem) => {
    setDeleteTarget(item);
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  // Save handler
  const handleSave = async (dto: LegalDocumentDto) => {
    if (!token) return;
    setActionLoading(true);
    setError(null);
    try {
      if (editingItem) {
        await api.update(token, editingItem.id, dto);
        setSuccessMessage(`"${dto.title}" updated successfully.`);
      } else {
        await api.create(token, dto);
        setSuccessMessage(`"${dto.title}" created successfully.`);
      }
      closeEditor();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to save ${documentNoun}.`);
    } finally {
      setActionLoading(false);
    }
  };

  // Quick status toggle (Publish / Archive)
  const handleQuickStatus = async (item: LegalDocumentItem, newStatus: ContentStatus) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await api.update(token, item.id, { status: newStatus });
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
      await api.remove(token, deleteTarget.id);
      setSuccessMessage(`"${deleteTarget.title}" moved to trash.`);
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to delete ${documentNoun}.`);
    } finally {
      setActionLoading(false);
    }
  };

  // Restore action
  const handleRestore = async (item: LegalDocumentItem) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await api.restore(token, item.id);
      setSuccessMessage(`"${item.title}" restored successfully.`);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to restore ${documentNoun}.`);
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
