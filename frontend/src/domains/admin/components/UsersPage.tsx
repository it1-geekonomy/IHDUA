"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Check, X } from "lucide-react";
import { useAdminAuth } from "@/domains/admin/components/AdminAuthProvider";
import {
  createUser,
  deleteUser,
  fetchUsers,
  updateUser,
  type AdminUserRole,
  type AdminUserRow,
  type CreateUserPayload,
  type UpdateUserPayload,
} from "@/domains/admin/lib/api";
import { UsersHeader } from "./users/UsersHeader";
import { UsersToolbar } from "./users/UsersToolbar";
import { UsersTable } from "./users/UsersTable";
import { UserEditorModal, type UserFormValues } from "./users/UserEditorModal";
import { UserDeleteModal } from "./users/UserDeleteModal";

export function UsersPage() {
  const { token, user: currentUser, ready } = useAdminAuth();
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<AdminUserRole | "ALL">("ALL");

  // Modals state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUserRow | null>(null);

  // Auto-dismiss success message
  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const loadUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsers(token);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (ready && token) {
      loadUsers();
    }
  }, [ready, token, loadUsers]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !searchTerm.trim() ||
        u.fullName?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        (u.role || "ADMIN").toLowerCase().includes(searchTerm.toLowerCase().trim());

      const matchesRole =
        roleFilter === "ALL" || (u.role || "ADMIN").toUpperCase() === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const hasFilters = Boolean(searchTerm.trim() || roleFilter !== "ALL");

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("ALL");
  };

  // Editor actions
  const openCreate = () => {
    setEditingUser(null);
    setIsEditorOpen(true);
    setError(null);
  };

  const openEdit = (user: AdminUserRow) => {
    setEditingUser(user);
    setIsEditorOpen(true);
    setError(null);
  };

  const closeEditor = () => {
    if (actionLoading) return;
    setIsEditorOpen(false);
    setEditingUser(null);
  };

  const handleSave = async (values: UserFormValues) => {
    if (!token) return;
    setActionLoading(true);
    setError(null);

    try {
      if (editingUser) {
        // Update user
        const payload: UpdateUserPayload = {
          fullName: values.fullName,
          email: values.email,
          role: values.role,
        };
        if (values.password) {
          payload.password = values.password;
        }

        const updated = await updateUser(token, editingUser.id, payload);
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? { ...u, ...updated } : u)),
        );
        setSuccessMessage(`User "${values.fullName}" was successfully updated.`);
      } else {
        // Create user
        const payload: CreateUserPayload = {
          fullName: values.fullName,
          email: values.email,
          role: values.role,
          password: values.password || "",
        };

        const created = await createUser(token, payload);
        setUsers((prev) => [created, ...prev]);
        setSuccessMessage(`User "${values.fullName}" was created successfully.`);
      }
      setIsEditorOpen(false);
      setEditingUser(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save user account",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Delete actions
  const promptDelete = (user: AdminUserRow) => {
    if (currentUser?.id === user.id || currentUser?.email === user.email) {
      setError("You cannot delete your own logged-in administrator account.");
      return;
    }
    setDeleteTarget(user);
    setError(null);
  };

  const cancelDelete = () => {
    if (actionLoading) return;
    setDeleteTarget(null);
  };

  const handleDeleteConfirm = async () => {
    if (!token || !deleteTarget) return;
    setActionLoading(true);
    setError(null);

    try {
      await deleteUser(token, deleteTarget.id);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      setSuccessMessage(`User "${deleteTarget.fullName}" was deleted.`);
      setDeleteTarget(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete user account",
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <UsersHeader
        total={users.length}
        loading={loading}
        onRefresh={loadUsers}
        onCreate={openCreate}
      />

      {/* Success Banner */}
      {successMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-[#1F6B45]/20 bg-[#E7F6EE] px-4 py-3 text-xs text-[#1F6B45] font-figtree font-medium shadow-2xs animate-in fade-in-50 duration-200">
          <Check className="h-4 w-4 shrink-0" />
          <p className="flex-1">{successMessage}</p>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-[#1F6B45]/70 hover:text-[#1F6B45] cursor-pointer"
            title="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800 font-figtree font-medium shadow-2xs animate-in fade-in-50 duration-200">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          <p className="flex-1">{error}</p>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-500 hover:text-rose-700 cursor-pointer"
            title="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <UsersToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        filteredCount={filteredUsers.length}
        totalCount={users.length}
      />

      {/* Users Table */}
      <UsersTable
        users={filteredUsers}
        loading={loading}
        currentUser={currentUser}
        onEdit={openEdit}
        onDeletePrompt={promptDelete}
        onClearFilters={clearFilters}
        hasFilters={hasFilters}
      />

      {/* Editor Modal */}
      <UserEditorModal
        isOpen={isEditorOpen}
        editingItem={editingUser}
        actionLoading={actionLoading}
        onClose={closeEditor}
        onSave={handleSave}
      />

      {/* Delete Confirmation Modal */}
      <UserDeleteModal
        user={deleteTarget}
        actionLoading={actionLoading}
        onCancel={cancelDelete}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
