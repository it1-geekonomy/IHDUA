"use client";

import { AlertCircle, Check, X } from "lucide-react";
import { useVolunteerLeads } from "./leads/volunteer/useVolunteerLeads";
import { VolunteerLeadsToolbar } from "./leads/volunteer/VolunteerLeadsToolbar";
import { VolunteerLeadsTable } from "./leads/volunteer/VolunteerLeadsTable";
import { VolunteerLeadDetailModal } from "./leads/volunteer/VolunteerLeadDetailModal";
import { VolunteerLeadEditorModal } from "./leads/volunteer/VolunteerLeadEditorModal";

export function VolunteerLeadsPage() {
  const {
    activeTab,
    setActiveTab,
    filteredLeads,
    meta,
    loading,
    error,
    setError,
    searchTerm,
    setSearchTerm,
    selectedArea,
    setSelectedArea,
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
  } = useVolunteerLeads();

  return (
    <div className="space-y-6">
      {/* Page Title Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-lora text-2xl font-medium text-[#0F1C1D]">
            Volunteer Inquiries
          </h1>
          <span className="rounded-full bg-[#1A0F1C]/5 px-2.5 py-0.5 font-figtree text-xs font-semibold text-[#1A0F1C]">
            {meta.total} {meta.total === 1 ? "applicant" : "applicants"}
          </span>
        </div>
        <p className="mt-1 font-figtree text-xs text-[#5F6C6D]">
          Review, evaluate, and manage volunteer applications and resume submissions.
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

      {/* Toolbar */}
      <VolunteerLeadsToolbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedArea={selectedArea}
        onAreaChange={setSelectedArea}
        limit={limit}
        onLimitChange={setLimit}
        loading={loading}
        onRefresh={() => loadLeads()}
      />

      {/* Leads Table */}
      <VolunteerLeadsTable
        leads={filteredLeads}
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
      <VolunteerLeadDetailModal
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
      <VolunteerLeadEditorModal
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
