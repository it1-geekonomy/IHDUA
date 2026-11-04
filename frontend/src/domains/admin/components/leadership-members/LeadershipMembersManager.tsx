"use client";

import { AlertCircle, Check, X } from "lucide-react";
import { useLeadershipMembers } from "./useLeadershipMembers";
import { LeadershipMembersHeader } from "./LeadershipMembersHeader";
import { LeadershipMembersToolbar } from "./LeadershipMembersToolbar";
import { LeadershipMembersTable } from "./LeadershipMembersTable";
import { LeadershipMemberEditorModal } from "./LeadershipMemberEditorModal";
import { LeadershipMemberDeleteModal } from "./LeadershipMemberDeleteModal";

export function LeadershipMembersManager() {
  const {
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
    refresh,
  } = useLeadershipMembers();

  return (
    <div className="space-y-6">
      {/* Header */}
      <LeadershipMembersHeader
        total={meta.total}
        loading={loading}
        onRefresh={refresh}
        onCreate={handleOpenCreate}
      />

      {/* Success Alert */}
      {successMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-[#1F6B45]/20 bg-[#E7F6EE] px-4 py-3 text-xs text-[#1F6B45] font-figtree font-medium shadow-2xs">
          <Check className="h-4 w-4 shrink-0" />
          <p>{successMessage}</p>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800 font-figtree font-medium shadow-2xs">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          <p className="flex-1">{error}</p>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-500 hover:text-rose-700 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Toolbar */}
      <LeadershipMembersToolbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        limit={limit}
        onLimitChange={setLimit}
      />

      {/* Table */}
      <LeadershipMembersTable
        items={items}
        loading={loading}
        actionLoading={actionLoading}
        activeTab={activeTab}
        meta={meta}
        onPageChange={setPage}
        onEdit={handleOpenEdit}
        onDeletePrompt={handleOpenDelete}
        onRestore={handleRestore}
      />

      {/* Editor Modal */}
      <LeadershipMemberEditorModal
        isOpen={isEditorOpen}
        editingItem={editingItem}
        loading={actionLoading}
        onClose={handleCloseEditor}
        onSave={handleSave}
      />

      {/* Delete Modal */}
      <LeadershipMemberDeleteModal
        item={deleteTarget}
        loading={actionLoading}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

