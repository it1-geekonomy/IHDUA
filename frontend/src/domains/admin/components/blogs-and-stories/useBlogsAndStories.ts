"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminAuth } from "@/domains/admin/components/AdminAuthProvider";
import {
  createBlogAndStory,
  deleteBlogAndStory,
  fetchBlogCategories,
  fetchBlogsAndStories,
  fetchDeletedBlogsAndStories,
  restoreBlogAndStory,
  updateBlogAndStory,
  type BlogAndStoryItem,
  type BlogCategoryItem,
  type ContentStatus,
  type PaginationMeta,
} from "@/domains/admin/lib/api";
import type { BlogAndStoryFormValues } from "./types";

export function useBlogsAndStories() {
  const { token, ready } = useAdminAuth();

  // Tab & list states
  const [activeTab, setActiveTab] = useState<"active" | "deleted">("active");
  const [items, setItems] = useState<BlogAndStoryItem[]>([]);
  const [categories, setCategories] = useState<BlogCategoryItem[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [statusFilter, setStatusFilter] = useState<ContentStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
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
  const [editingItem, setEditingItem] = useState<BlogAndStoryItem | null>(null);
  const [previewItem, setPreviewItem] = useState<BlogAndStoryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BlogAndStoryItem | null>(null);

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

  // Load categories list for select dropdowns
  const loadCategories = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetchBlogCategories(token, { limit: 100 });
      setCategories(res.data || []);
    } catch {
      // Non-critical, ignore or silent fallback
    }
  }, [token]);

  useEffect(() => {
    if (ready && token) {
      void loadCategories();
    }
  }, [ready, token, loadCategories]);

  // Fetch blogs & stories
  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      if (activeTab === "active") {
        const res = await fetchBlogsAndStories(token, {
          page,
          limit,
          search: debouncedSearch,
          status: statusFilter === "all" ? undefined : statusFilter,
          categoryId: categoryFilter === "all" ? undefined : categoryFilter,
          sort: sortOrder,
        });
        setItems(res.data || []);
        if (res.meta) setMeta(res.meta);
      } else {
        const res = await fetchDeletedBlogsAndStories(token, {
          page,
          limit,
          search: debouncedSearch,
          categoryId: categoryFilter === "all" ? undefined : categoryFilter,
          sort: sortOrder,
        });
        setItems(res.data || []);
        if (res.meta) setMeta(res.meta);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load blogs and stories.");
    } finally {
      setLoading(false);
    }
  }, [token, activeTab, page, limit, debouncedSearch, statusFilter, categoryFilter, sortOrder]);

  useEffect(() => {
    if (ready && token) {
      void loadData();
    }
  }, [ready, token, loadData]);

  // Editor actions
  const openCreate = () => {
    void loadCategories(); // refresh categories list when creating
    setEditingItem(null);
    setIsEditorOpen(true);
  };

  const openEdit = (item: BlogAndStoryItem) => {
    void loadCategories();
    setEditingItem(item);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingItem(null);
  };

  // Preview actions
  const openPreview = (item: BlogAndStoryItem) => {
    setPreviewItem(item);
  };

  const closePreview = () => {
    setPreviewItem(null);
  };

  // Delete actions
  const promptDelete = (item: BlogAndStoryItem) => {
    setDeleteTarget(item);
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  // Save handler (create / update)
  const handleSave = async (values: BlogAndStoryFormValues) => {
    if (!token) return;
    setActionLoading(true);
    setError(null);
    try {
      if (editingItem) {
        await updateBlogAndStory(token, editingItem.id, {
          title: values.title,
          slug: values.slug,
          categoryId: values.categoryId || null,
          blogDate: values.blogDate || null,
          shortDescription: values.shortDescription || null,
          content: values.content || null,
          status: values.status,
          file: values.file || undefined,
          blogBanner: values.file ? undefined : values.blogBannerUrl || undefined,
          metaTitle: values.metaTitle || null,
          metaDescription: values.metaDescription || null,
          schemaCode: values.schemaCode || null,
        });
        setSuccessMessage(`"${values.title}" updated successfully.`);
      } else {
        await createBlogAndStory(token, {
          title: values.title,
          slug: values.slug,
          categoryId: values.categoryId || null,
          blogDate: values.blogDate || null,
          shortDescription: values.shortDescription || null,
          content: values.content || null,
          status: values.status,
          file: values.file,
          blogBanner: values.file ? undefined : values.blogBannerUrl || undefined,
          metaTitle: values.metaTitle || null,
          metaDescription: values.metaDescription || null,
          schemaCode: values.schemaCode || null,
        });
        setSuccessMessage(`"${values.title}" created successfully.`);
      }
      closeEditor();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save blog or story.");
    } finally {
      setActionLoading(false);
    }
  };

  // Quick status toggle (Draft / Published / Archived)
  const handleQuickStatus = async (item: BlogAndStoryItem, newStatus: ContentStatus) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await updateBlogAndStory(token, item.id, { status: newStatus });
      setSuccessMessage(`Status updated to "${newStatus}" for "${item.title}".`);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change story status.");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete confirm
  const handleDeleteConfirm = async () => {
    if (!token || !deleteTarget) return;
    setActionLoading(true);
    try {
      await deleteBlogAndStory(token, deleteTarget.id);
      setSuccessMessage(`"${deleteTarget.title}" moved to trash.`);
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete blog or story.");
    } finally {
      setActionLoading(false);
    }
  };

  // Restore confirm
  const handleRestore = async (item: BlogAndStoryItem) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await restoreBlogAndStory(token, item.id);
      setSuccessMessage(`"${item.title}" restored from trash.`);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to restore blog or story.");
    } finally {
      setActionLoading(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    items,
    categories,
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
    categoryFilter,
    setCategoryFilter,
    sortOrder,
    setSortOrder,
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

