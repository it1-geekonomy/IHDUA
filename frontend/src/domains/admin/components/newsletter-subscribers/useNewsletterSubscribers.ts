"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "@/domains/admin/components/AdminAuthProvider";
import {
  deleteNewsletterSubscriber,
  fetchDeletedNewsletterSubscribers,
  fetchNewsletterSubscribers,
  restoreNewsletterSubscriber,
  updateNewsletterSubscriber,
  type NewsletterSubscriberItem,
  type PaginationMeta,
} from "@/domains/admin/lib/api";
import type { SubscriberStatusFilter } from "./types";

export function useNewsletterSubscribers() {
  const { token, ready } = useAdminAuth();

  // Tab & list states
  const [activeTab, setActiveTab] = useState<"active" | "deleted">("active");
  const [items, setItems] = useState<NewsletterSubscriberItem[]>([]);
  const [page, setPage] = useState(1);
  const limit = 15;
  const [statusFilter, setStatusFilter] = useState<SubscriberStatusFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 1,
  });

  // Loading & status states
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsletterSubscriberItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NewsletterSubscriberItem | null>(null);

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
        const res = await fetchNewsletterSubscribers(token, {
          page,
          limit,
          search: debouncedSearch,
        });
        setItems(res.data || []);
        if (res.meta) setMeta(res.meta);
      } else {
        const res = await fetchDeletedNewsletterSubscribers(token, {
          page,
          limit,
          search: debouncedSearch,
        });
        setItems(res.data || []);
        if (res.meta) setMeta(res.meta);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load newsletter subscribers.");
    } finally {
      setLoading(false);
    }
  }, [token, activeTab, page, limit, debouncedSearch]);

  useEffect(() => {
    if (ready && token) {
      void loadData();
    }
  }, [ready, token, loadData]);

  // Filter items by status on active tab
  const filteredItems = useMemo(() => {
    if (activeTab === "deleted" || statusFilter === "all") {
      return items;
    }
    if (statusFilter === "active") {
      return items.filter((i) => i.isActive);
    }
    return items.filter((i) => !i.isActive);
  }, [items, activeTab, statusFilter]);

  // Editor actions
  const openEdit = (item: NewsletterSubscriberItem) => {
    setEditingItem(item);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingItem(null);
  };

  // Delete actions
  const promptDelete = (item: NewsletterSubscriberItem) => {
    setDeleteTarget(item);
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  // Save handler (update email / active state)
  const handleSave = async (data: { email: string; isActive: boolean }) => {
    if (!token || !editingItem) return;
    setActionLoading(true);
    setError(null);
    try {
      await updateNewsletterSubscriber(token, editingItem.id, data);
      setSuccessMessage(`Subscriber "${data.email}" updated successfully.`);
      closeEditor();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update subscriber.");
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle active status
  const handleToggleStatus = async (item: NewsletterSubscriberItem) => {
    if (!token) return;
    setActionLoading(true);
    try {
      const nextState = !item.isActive;
      await updateNewsletterSubscriber(token, item.id, { isActive: nextState });
      setSuccessMessage(
        `Subscription for "${item.email}" ${nextState ? "activated" : "deactivated"}.`,
      );
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update subscription status.");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete confirmation
  const handleDeleteConfirm = async () => {
    if (!token || !deleteTarget) return;
    setActionLoading(true);
    try {
      await deleteNewsletterSubscriber(token, deleteTarget.id);
      setSuccessMessage(`Subscriber "${deleteTarget.email}" moved to trash.`);
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete subscriber.");
    } finally {
      setActionLoading(false);
    }
  };

  // Restore action
  const handleRestore = async (item: NewsletterSubscriberItem) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await restoreNewsletterSubscriber(token, item.id);
      setSuccessMessage(`Subscriber "${item.email}" restored successfully.`);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to restore subscriber.");
    } finally {
      setActionLoading(false);
    }
  };

  // Export to CSV
  const exportToCsv = () => {
    if (!filteredItems.length) return;
    const header = ["Email", "Status", "Subscribed At", "Last Updated"];
    const rows = filteredItems.map((i) => [
      `"${i.email}"`,
      i.isActive ? "Active" : "Inactive",
      `"${new Date(i.createdAt).toLocaleString("en-IN")}"`,
      `"${new Date(i.updatedAt).toLocaleString("en-IN")}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `newsletter_subscribers_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    activeTab,
    setActiveTab,
    items: filteredItems,
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
    deleteTarget,
    loadData,
    openEdit,
    closeEditor,
    promptDelete,
    cancelDelete,
    handleSave,
    handleToggleStatus,
    handleDeleteConfirm,
    handleRestore,
    exportToCsv,
  };
}
