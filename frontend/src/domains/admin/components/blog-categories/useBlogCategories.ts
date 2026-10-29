"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminAuth } from "@/domains/admin/components/AdminAuthProvider";
import {
  createBlogCategory,
  deleteBlogCategory,
  fetchBlogCategories,
  fetchDeletedBlogCategories,
  restoreBlogCategory,
  updateBlogCategory,
  type BlogCategoryItem,
  type PaginationMeta,
} from "@/domains/admin/lib/api";
import type { BlogCategoryFormValues } from "./types";

export function useBlogCategories() {
  const { token, ready } = useAdminAuth();

  // Tab & list states
  const [activeTab, setActiveTab] = useState<"active" | "deleted">("active");
  const [items, setItems] = useState<BlogCategoryItem[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;
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
  const [editingItem, setEditingItem] = useState<BlogCategoryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BlogCategoryItem | null>(null);

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

  // Fetch categories
  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      if (activeTab === "active") {
        const res = await fetchBlogCategories(token, {
          page,
          limit,
          search: debouncedSearch,
        });
        setItems(res.data || []);
        if (res.meta) setMeta(res.meta);
      } else {
        const res = await fetchDeletedBlogCategories(token, {
          page,
          limit,
          search: debouncedSearch,
        });
        setItems(res.data || []);
        if (res.meta) setMeta(res.meta);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load blog categories.");
    } finally {
      setLoading(false);
    }
  }, [token, activeTab, page, limit, debouncedSearch]);

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

  const openEdit = (item: BlogCategoryItem) => {
    setEditingItem(item);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingItem(null);
  };

  // Delete actions
  const promptDelete = (item: BlogCategoryItem) => {
    setDeleteTarget(item);
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  // Save handler (create / update)
  const handleSave = async (values: BlogCategoryFormValues) => {
    if (!token) return;
    setActionLoading(true);
    setError(null);
    try {
      if (editingItem) {
        await updateBlogCategory(token, editingItem.id, {
          name: values.name,
          slug: values.slug,
        });
        setSuccessMessage(`Category "${values.name}" updated successfully.`);
      } else {
        await createBlogCategory(token, {
          name: values.name,
          slug: values.slug,
        });
        setSuccessMessage(`Category "${values.name}" created successfully.`);
      }
      closeEditor();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save blog category.");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete confirm
  const handleDeleteConfirm = async () => {
    if (!token || !deleteTarget) return;
    setActionLoading(true);
    try {
      await deleteBlogCategory(token, deleteTarget.id);
      setSuccessMessage(`"${deleteTarget.name}" moved to trash.`);
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category.");
    } finally {
      setActionLoading(false);
    }
  };

  // Restore confirm
  const handleRestore = async (item: BlogCategoryItem) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await restoreBlogCategory(token, item.id);
      setSuccessMessage(`"${item.name}" restored from trash.`);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to restore category.");
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
    handleDeleteConfirm,
    handleRestore,
    setPage,
  };
}

