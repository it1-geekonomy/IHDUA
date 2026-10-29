"use client";

import { AlertCircle, Check, X } from "lucide-react";
import { useMilestones } from "./useMilestones";
import { MilestonesHeader } from "./MilestonesHeader";
import { MilestonesToolbar } from "./MilestonesToolbar";
import { MilestonesTable } from "./MilestonesTable";
import { MilestoneEditorModal } from "./MilestoneEditorModal";
import { MilestoneDeleteModal } from "./MilestoneDeleteModal";

export function MilestonesManager() {
  const {
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
    promptDelete,
    cancelDelete,
    handleSave,
    handleQuickStatus,
    handleDeleteConfirm,
    handleRestore,
    setPage,
  } = useMilestones();

  return (
    <div className="space-y-6">
      {/* Header */}
      <MilestonesHeader
        total={meta.total}
        loading={loading}
        onRefresh={loadData}
        onCreate={openCreate}
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

      {/* Toolbar: Tabs, Search & Filters */}
      <MilestonesToolbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Table */}
      <MilestonesTable
        items={items}
        loading={loading}
        actionLoading={actionLoading}
        activeTab={activeTab}
        meta={meta}
        onPageChange={setPage}
        onEdit={openEdit}
        onQuickStatus={handleQuickStatus}
        onDeletePrompt={promptDelete}
        onRestore={handleRestore}
      />

      {/* Editor Modal */}
      <MilestoneEditorModal
        isOpen={isEditorOpen}
        editingItem={editingItem}
        actionLoading={actionLoading}
        onClose={closeEditor}
        onSave={handleSave}
      />

      {/* Delete Confirmation Modal */}
      <MilestoneDeleteModal
        item={deleteTarget}
        actionLoading={actionLoading}
        onCancel={cancelDelete}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

