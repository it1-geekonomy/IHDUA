"use client";

import { AlertCircle, Check, X } from "lucide-react";
import type { LegalDocumentApi } from "./types";
import { useLegalDocuments } from "./useLegalDocuments";
import { LegalDocumentHeader } from "./LegalDocumentHeader";
import { LegalDocumentToolbar } from "./LegalDocumentToolbar";
import { LegalDocumentTable } from "./LegalDocumentTable";
import { LegalDocumentEditorModal } from "./LegalDocumentEditorModal";
import { LegalDocumentPreviewModal } from "./LegalDocumentPreviewModal";
import { LegalDocumentDeleteModal } from "./LegalDocumentDeleteModal";

interface LegalDocumentManagerProps {
  documentType: string;
  documentNoun: string;
  api: LegalDocumentApi;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
}

export function LegalDocumentManager({
  documentType,
  documentNoun,
  api,
  defaultMetaTitle,
  defaultMetaDescription,
}: LegalDocumentManagerProps) {
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
  } = useLegalDocuments({ api, documentNoun });

  return (
    <div className="space-y-6">
      {/* Header */}
      <LegalDocumentHeader
        title={documentType}
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

      {/* Toolbar: Tabs & Search */}
      <LegalDocumentToolbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Table */}
      <LegalDocumentTable
        items={items}
        loading={loading}
        actionLoading={actionLoading}
        activeTab={activeTab}
        meta={meta}
        documentNoun={documentNoun}
        onPageChange={setPage}
        onPreview={openPreview}
        onEdit={openEdit}
        onQuickStatus={handleQuickStatus}
        onDeletePrompt={promptDelete}
        onRestore={handleRestore}
      />

      {/* Editor Modal */}
      <LegalDocumentEditorModal
        isOpen={isEditorOpen}
        editingItem={editingItem}
        documentNoun={documentNoun}
        defaultMetaTitle={defaultMetaTitle}
        defaultMetaDescription={defaultMetaDescription}
        actionLoading={actionLoading}
        onClose={closeEditor}
        onSave={handleSave}
      />

      {/* Preview Modal */}
      <LegalDocumentPreviewModal
        item={previewItem}
        onClose={closePreview}
        onEdit={openEdit}
      />

      {/* Delete Confirmation Modal */}
      <LegalDocumentDeleteModal
        item={deleteTarget}
        actionLoading={actionLoading}
        onCancel={cancelDelete}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
