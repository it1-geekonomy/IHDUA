"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminAuth } from "@/domains/admin/components/AdminAuthProvider";
import {
  createLeadershipMember,
  deleteLeadershipMember,
  fetchDeletedLeadershipMembers,
  fetchLeadershipMembers,
  restoreLeadershipMember,
  updateLeadershipMember,
  type LeadershipMemberItem,
  type PaginationMeta,
} from "@/domains/admin/lib/api";
import type { LeadershipMemberFormValues, MemberStatus, StatusFilter } from "./types";

export function useLeadershipMembers() {
  const { token, ready } = useAdminAuth();

  // Tab & list states
  const [activeTab, setActiveTab] = useState<"active" | "deleted">("active");
  const [items, setItems] = useState<LeadershipMemberItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
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
  const [editingItem, setEditingItem] = useState<LeadershipMemberItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LeadershipMemberItem | null>(null);

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

  // Fetch leadership members
  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      if (activeTab === "active") {
        const res = await fetchLeadershipMembers(token, {
          page,
          limit,
          search: debouncedSearch || undefined,
          status: statusFilter === "all" ? undefined : (statusFilter as MemberStatus),
        });
        setItems(res.data || []);
        if (res.meta) setMeta(res.meta);
      } else {
        const res = await fetchDeletedLeadershipMembers(token, {
          page,
          limit,
          search: debouncedSearch || undefined,
        });
        let data: LeadershipMemberItem[] = res.data || [];
        if (statusFilter !== "all") {
          data = data.filter((item: LeadershipMemberItem) => item.status === statusFilter);
        }
        setItems(data);
        if (res.meta) setMeta(res.meta);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load leadership members.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [token, activeTab, page, limit, debouncedSearch, statusFilter]);

  // Trigger load on ready & dependencies
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
    setStatusFilter("all");
  };

  // Open editor for creating
  const handleOpenCreate = () => {
    setEditingItem(null);
    setIsEditorOpen(true);
  };

  // Open editor for updating
  const handleOpenEdit = (item: LeadershipMemberItem) => {
    setEditingItem(item);
    setIsEditorOpen(true);
  };

  // Close editor
  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingItem(null);
  };

  // Save (Create or Update)
  const handleSave = async (values: LeadershipMemberFormValues) => {
    if (!token) return;
    setActionLoading(true);
    setError(null);
    try {
      if (editingItem) {
        await updateLeadershipMember(token, editingItem.id, {
          name: values.name,
          designation: values.designation,
          sortOrder: values.sortOrder,
          status: values.status,
          file: values.file,
        });
        setSuccessMessage(`"${values.name}" updated successfully.`);
      } else {
        if (!values.file) {
          throw new Error("Member photo is required for new entries.");
        }
        await createLeadershipMember(token, {
          name: values.name,
          designation: values.designation,
          sortOrder: values.sortOrder,
          status: values.status,
          file: values.file,
        });
        setSuccessMessage(`"${values.name}" added successfully.`);
      }
      handleCloseEditor();
      await loadData();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save leadership member.";
      setError(msg);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // Open delete prompt
  const handleOpenDelete = (item: LeadershipMemberItem) => {
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
      await deleteLeadershipMember(token, deleteTarget.id);
      setSuccessMessage(`"${deleteTarget.name}" moved to trash.`);
      handleCloseDelete();
      await loadData();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete leadership member.";
      setError(msg);
    } finally {
      setActionLoading(false);
    }
  };

  // Restore from trash (PATCH)
  const handleRestore = async (item: LeadershipMemberItem) => {
    if (!token) return;
    setActionLoading(true);
    setError(null);
    try {
      await restoreLeadershipMember(token, item.id);
      setSuccessMessage(`"${item.name}" restored from trash.`);
      await loadData();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to restore leadership member.";
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
    statusFilter,
    setStatusFilter,
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
