"use client";

import { CheckCircle2, Loader2, Search, X } from "lucide-react";
import { OurImpactHeader } from "./OurImpactHeader";
import { CategoryAccordionCard } from "./CategoryAccordionCard";
import { InitiativeEditorModal } from "./InitiativeEditorModal";
import { useOurImpact } from "./useOurImpact";

export function OurImpactManager() {
  const {
    categories,
    initiatives,
    categoryGroups,
    loading,
    actionLoading,
    error,
    successMessage,
    searchTerm,
    setSearchTerm,
    isEditorOpen,
    editingItem,
    targetCategoryId,
    loadData,
    openCreate,
    openEdit,
    closeEditor,
    handleSave,
  } = useOurImpact();

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <OurImpactHeader
        totalCategories={categories.length}
        totalInitiatives={initiatives.length}
        loading={loading}
        onRefresh={loadData}
        onCreate={() => openCreate()}
      />

      {/* Toast Messages */}
      {successMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 shadow-xs animate-in fade-in slide-in-from-top-1">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-800 shadow-xs">
          <span>{error}</span>
          <button
            type="button"
            onClick={loadData}
            className="text-xs underline hover:text-rose-950 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3 rounded-xl border border-[#E5E0D8] bg-white p-3 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8A847A]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search initiative pages by name or slug..."
            className="w-full rounded-lg border border-[#D9D3C9] bg-white pl-8 pr-8 py-1.5 font-figtree text-xs text-[#0F1C1D] placeholder:text-[#8A847A] focus:border-[#9739A8] focus:outline-hidden transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A847A] hover:text-[#0F1C1D] cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <span className="hidden sm:inline font-figtree text-xs text-[#5F6C6D]">
          Click any category card to view its initiative pages
        </span>
      </div>

      {/* Accordion Categories List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-[#E5E0D8] bg-white p-16 text-[#5F6C6D] shadow-xs">
          <Loader2 className="h-6 w-6 animate-spin text-[#9739A8]" />
          <p className="mt-3 font-figtree text-xs">Loading impact categories and templates…</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {categoryGroups.map((group) => (
            <CategoryAccordionCard
              key={group.category.id}
              category={group.category}
              initiatives={group.initiatives}
              initiallyExpanded={true}
              onEditInitiative={openEdit}
              onAddInitiativeToCategory={(cat) => openCreate(cat.id)}
            />
          ))}
        </div>
      )}

      {/* Initiative Editor Modal */}
      <InitiativeEditorModal
        isOpen={isEditorOpen}
        editingItem={editingItem}
        defaultCategoryId={targetCategoryId}
        categories={categories}
        actionLoading={actionLoading}
        onClose={closeEditor}
        onSave={handleSave}
      />
    </div>
  );
}

