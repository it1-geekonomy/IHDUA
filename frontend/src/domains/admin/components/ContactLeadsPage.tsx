"use client";

import { AlertCircle, Check, X } from "lucide-react";
import { useContactLeads } from "./leads/contact/useContactLeads";
import { ContactLeadsToolbar } from "./leads/contact/ContactLeadsToolbar";
import { ContactLeadsTable } from "./leads/contact/ContactLeadsTable";
import { ContactLeadDetailModal } from "./leads/contact/ContactLeadDetailModal";
import { ContactLeadEditorModal } from "./leads/contact/ContactLeadEditorModal";

export function ContactLeadsPage() {
  const {
    activeTab,
    setActiveTab,
    displayedLeads,
    meta,
    loading,
    error,
    setError,
    searchTerm,
    setSearchTerm,
    selectedSubject,
    setSelectedSubject,
    selectedLead,
    setSelectedLead,
    isEditing,
    setIsEditing,
    editFormData,
    setEditFormData,
    copiedId,
    actionInProgress,
    savingEdit,
    feedback,
    setFeedback,
    loadLeads,
    copyToClipboard,
    handleDelete,
    handleRestore,
    startEdit,
    handleSaveEdit,
    setPage,
    limit,
    setLimit,
  } = useContactLeads();

  return (
    <div className="space-y-6">
      {/* Page Title Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-lora text-2xl font-medium text-[#0F1C1D]">
            Contact Leads
          </h1>
          <span className="rounded-full bg-[#1A0F1C]/5 px-2.5 py-0.5 font-figtree text-xs font-semibold text-[#1A0F1C]">
            {meta.total} {meta.total === 1 ? "lead" : "leads"}
          </span>
        </div>
        <p className="mt-1 font-figtree text-xs text-[#5F6C6D]">
          Manage inquiries, messages, and partnership requests submitted via website forms.
        </p>
      </div>

      {/* Notifications / Alerts */}
      {feedback && (
        <div
          className={`flex items-center gap-2.5 rounded-xl border p-3 font-figtree text-xs font-medium shadow-2xs ${
            feedback.type === "success"
              ? "border-[#1F6B45]/20 bg-[#E7F6EE] text-[#1F6B45]"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {feedback.type === "success" ? (
            <Check className="h-4 w-4 shrink-0 text-[#1F6B45]" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          )}
          <p className="flex-1">{feedback.text}</p>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-neutral-500 hover:text-neutral-800 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 font-figtree text-xs font-medium text-rose-800 shadow-2xs">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
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

      {/* Toolbar: Navigation Pills, Tabs, Filters & Search */}
      <ContactLeadsToolbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedSubject={selectedSubject}
        onSubjectChange={setSelectedSubject}
        limit={limit}
        onLimitChange={setLimit}
        loading={loading}
        onRefresh={() => loadLeads()}
      />

      {/* Leads Table */}
      <ContactLeadsTable
        leads={displayedLeads}
        loading={loading}
        activeTab={activeTab}
        actionInProgress={actionInProgress}
        copiedId={copiedId}
        meta={meta}
        onPageChange={setPage}
        onCopy={copyToClipboard}
        onView={setSelectedLead}
        onEdit={startEdit}
        onDelete={handleDelete}
        onRestore={handleRestore}
      />

      {/* Detail Modal */}
      <ContactLeadDetailModal
        lead={selectedLead}
        copiedId={copiedId}
        onCopy={copyToClipboard}
        onClose={() => setSelectedLead(null)}
        onEdit={(lead) => {
          setSelectedLead(null);
          startEdit(lead);
        }}
      />

      {/* Edit Modal */}
      <ContactLeadEditorModal
        isOpen={isEditing}
        saving={savingEdit}
        formData={editFormData}
        onChange={setEditFormData}
        onClose={() => setIsEditing(false)}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
