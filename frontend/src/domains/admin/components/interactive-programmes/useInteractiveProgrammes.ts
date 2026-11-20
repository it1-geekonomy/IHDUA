"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminAuth } from "@/domains/admin/components/AdminAuthProvider";
import {
  createInteractiveProgramme,
  deleteInteractiveProgramme,
  fetchDeletedInteractiveProgrammes,
  fetchInteractiveProgrammeById,
  fetchInteractiveProgrammes,
  restoreInteractiveProgramme,
  updateInteractiveProgramme,
  type ContentStatus,
  type InteractiveProgrammeItem,
  type PaginationMeta,
} from "@/domains/admin/lib/api";
import type { InteractiveProgrammeFormValues } from "./types";

export function useInteractiveProgrammes() {
  const { token, ready } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<"active" | "deleted">("active");
  const [items, setItems] = useState<InteractiveProgrammeItem[]>([]);
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
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InteractiveProgrammeItem | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] =
    useState<InteractiveProgrammeItem | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res =
        activeTab === "active"
          ? await fetchInteractiveProgrammes(token, {
              page,
              limit,
              search: debouncedSearch,
              status: statusFilter === "all" ? undefined : statusFilter,
            })
          : await fetchDeletedInteractiveProgrammes(token, {
              page,
              limit,
              search: debouncedSearch,
            });
      setItems(res.data || []);
      if (res.meta) setMeta(res.meta);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load interactive programmes.",
      );
    } finally {
      setLoading(false);
    }
  }, [token, activeTab, page, limit, debouncedSearch, statusFilter]);

  useEffect(() => {
    if (ready && token) void loadData();
  }, [ready, token, loadData]);

  const openCreate = () => {
    setEditingItem(null);
    setIsEditorOpen(true);
  };

  const openEdit = async (item: InteractiveProgrammeItem) => {
    if (!token) return;
    setActionLoading(true);
    setError(null);
    try {
      const full = await fetchInteractiveProgrammeById(token, item.id);
      setEditingItem(full);
      setIsEditorOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load programme.");
    } finally {
      setActionLoading(false);
    }
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingItem(null);
  };

  const handleSave = async (values: InteractiveProgrammeFormValues) => {
    if (!token) return;
    setActionLoading(true);
    setError(null);
    try {
      const payload = {
        title: values.title,
        slug: values.slug,
        eventDate: values.eventDate || null,
        eventLocation: values.eventLocation || null,
        eventTime: values.eventTime || null,
        content: values.content || null,
        status: values.status,
        eventMediaFile: values.eventMediaFile,
        eventMediaUrl: values.clearMedia
          ? null
          : values.eventMediaFile
            ? undefined
            : values.eventMediaUrl,
      };

      if (editingItem) {
        await updateInteractiveProgramme(token, editingItem.id, payload);
        setSuccessMessage(`Updated “${values.title}”.`);
      } else {
        await createInteractiveProgramme(token, payload);
        setSuccessMessage(`Created “${values.title}”.`);
      }
      closeEditor();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleQuickStatus = async (
    item: InteractiveProgrammeItem,
    status: ContentStatus,
  ) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await updateInteractiveProgramme(token, item.id, { status });
      setSuccessMessage(`Marked “${item.title}” as ${status}.`);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status update failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!token || !deleteTarget) return;
    setActionLoading(true);
    try {
      await deleteInteractiveProgramme(token, deleteTarget.id);
      setSuccessMessage(`Moved “${deleteTarget.title}” to trash.`);
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestore = async (item: InteractiveProgrammeItem) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await restoreInteractiveProgramme(token, item.id);
      setSuccessMessage(`Restored “${item.title}”.`);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Restore failed.");
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
    promptDelete: setDeleteTarget,
    cancelDelete: () => setDeleteTarget(null),
    handleSave,
    handleQuickStatus,
    handleDeleteConfirm,
    handleRestore,
    setPage,
  };
}
