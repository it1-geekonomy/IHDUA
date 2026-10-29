"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Loader2, Sparkles, X } from "lucide-react";
import type { ContentStatus } from "@/domains/admin/lib/api";
import type { LegalDocumentDto, LegalDocumentItem } from "./types";
import { TinyMceEditor } from "@/domains/admin/components/TinyMceEditor";
import { cn } from "@/lib/utils";

interface LegalDocumentEditorModalProps {
  isOpen: boolean;
  editingItem: LegalDocumentItem | null;
  documentNoun: string;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  actionLoading: boolean;
  onClose: () => void;
  onSave: (dto: LegalDocumentDto) => void;
}

export function LegalDocumentEditorModal({
  isOpen,
  editingItem,
  documentNoun,
  defaultMetaTitle,
  defaultMetaDescription,
  actionLoading,
  onClose,
  onSave,
}: LegalDocumentEditorModalProps) {
  const [formData, setFormData] = useState<LegalDocumentDto>({
    title: "",
    content: "",
    status: "draft",
    metaTitle: "",
    metaDescription: "",
    schemaCode: "",
  });
  const [formErrors, setFormErrors] = useState<{ title?: string; content?: string }>({});
  const [showSeo, setShowSeo] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (editingItem) {
      setFormData({
        title: editingItem.title,
        content: editingItem.content,
        status: editingItem.status,
        metaTitle: editingItem.metaTitle || "",
        metaDescription: editingItem.metaDescription || "",
        schemaCode: editingItem.schemaCode || "",
      });
      setShowSeo(Boolean(editingItem.metaTitle || editingItem.metaDescription));
    } else {
      setFormData({
        title: "",
        content: `<p>Write or paste your ${documentNoun} clauses here...</p>`,
        status: "draft",
        metaTitle: defaultMetaTitle,
        metaDescription: defaultMetaDescription,
        schemaCode: "",
      });
      setShowSeo(false);
    }
    setFormErrors({});
  }, [isOpen, editingItem, documentNoun, defaultMetaTitle, defaultMetaDescription]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const errors: { title?: string; content?: string } = {};
    if (!formData.title.trim()) {
      errors.title = "Document title is required.";
    }
    if (!formData.content.trim() || formData.content.trim() === "<p></p>") {
      errors.content = "Content cannot be empty.";
    }
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      onSave({
        title: formData.title.trim(),
        content: formData.content,
        status: formData.status || "draft",
        metaTitle: formData.metaTitle?.trim() || undefined,
        metaDescription: formData.metaDescription?.trim() || undefined,
        schemaCode: formData.schemaCode?.trim() || undefined,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="relative flex flex-col w-full max-w-4xl max-h-[92vh] rounded-2xl bg-white shadow-2xl border border-[#E5E0D8] overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E0D8] px-6 py-4 bg-[#FAF8F4]">
          <div>
            <h2 className="font-lora text-lg font-medium text-[#0F1C1D]">
              {editingItem ? `Edit ${documentNoun}` : `Create New ${documentNoun}`}
            </h2>
            <p className="font-figtree text-xs text-[#5F6C6D]">
              Type or paste formatted clauses directly. Formatting is saved and synced to the backend.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#5F6C6D] hover:bg-stone-200 hover:text-[#0F1C1D] cursor-pointer transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 font-figtree">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-[#0F1C1D]">
                Document Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (formErrors.title) setFormErrors({ ...formErrors, title: undefined });
                }}
                placeholder={`e.g. ${documentNoun} - 2026 Revision`}
                className={cn(
                  "w-full rounded-lg border bg-white px-3 py-2 text-xs text-[#0F1C1D] placeholder:text-[#8A847A] focus:outline-hidden transition-all",
                  formErrors.title ? "border-rose-400 focus:border-rose-500" : "border-[#D9D3C9] focus:border-[#9739A8]",
                )}
              />
              {formErrors.title && <p className="text-[11px] text-rose-500">{formErrors.title}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#0F1C1D]">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ContentStatus })}
                className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3 py-2 text-xs text-[#0F1C1D] focus:border-[#9739A8] focus:outline-hidden cursor-pointer"
              >
                <option value="draft">Draft</option>
                <option value="published">Published (Live)</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* SEO Metadata Accordion */}
          <div className="rounded-lg border border-[#E5E0D8] overflow-hidden">
            <button
              type="button"
              onClick={() => setShowSeo(!showSeo)}
              className="w-full flex items-center justify-between px-3.5 py-2 bg-[#FAF8F4] hover:bg-stone-100 text-left text-xs font-semibold text-[#5F6C6D] cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#9739A8]" />
                Search Engine Metadata (Optional)
              </span>
              <ChevronDown
                className={cn("h-3.5 w-3.5 transition-transform duration-200", showSeo && "rotate-180")}
              />
            </button>

            {showSeo && (
              <div className="p-3.5 space-y-3 bg-white border-t border-[#E5E0D8] text-xs">
                <div>
                  <label className="font-medium text-[#0F1C1D] block mb-1">Meta Title</label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    placeholder="Page Title for search engines..."
                    className="w-full rounded-md border border-[#D9D3C9] px-2.5 py-1.5 text-xs text-[#0F1C1D] placeholder:text-[#8A847A] focus:border-[#9739A8] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-medium text-[#0F1C1D] block mb-1">Meta Description</label>
                  <textarea
                    rows={2}
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    placeholder="Page description snippet..."
                    className="w-full rounded-md border border-[#D9D3C9] px-2.5 py-1.5 text-xs text-[#0F1C1D] placeholder:text-[#8A847A] focus:border-[#9739A8] focus:outline-hidden"
                  />
                </div>
              </div>
            )}
          </div>

          {/* TinyMCE Editor */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0F1C1D] block">
              Content <span className="text-rose-500">*</span>
            </label>
            <TinyMceEditor
              value={formData.content}
              onChange={(newHtml) => {
                setFormData({ ...formData, content: newHtml });
                if (formErrors.content) setFormErrors({ ...formErrors, content: undefined });
              }}
              height={440}
            />
            {formErrors.content && <p className="text-[11px] text-rose-500">{formErrors.content}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-[#E5E0D8] bg-[#FAF8F4] px-6 py-3 font-figtree">
          <button
            type="button"
            onClick={onClose}
            disabled={actionLoading}
            className="rounded-lg border border-[#D9D3C9] bg-white px-4 py-1.5 text-xs font-semibold text-[#5F6C6D] hover:text-[#00191B] cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={actionLoading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1A0F1C] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#2C1A30] cursor-pointer shadow-xs disabled:opacity-50"
          >
            {actionLoading && <Loader2 className="h-3 w-3 animate-spin" />}
            <span>{editingItem ? "Update Document" : "Save Document"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
