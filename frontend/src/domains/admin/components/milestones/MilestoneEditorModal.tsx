"use client";

import { useEffect, useState } from "react";
import { Flag, Loader2, X } from "lucide-react";
import type { ContentStatus, MilestoneFormValues, MilestoneItem } from "./types";

interface MilestoneEditorModalProps {
  isOpen: boolean;
  editingItem: MilestoneItem | null;
  actionLoading: boolean;
  onClose: () => void;
  onSave: (values: MilestoneFormValues) => void;
}

export function MilestoneEditorModal({
  isOpen,
  editingItem,
  actionLoading,
  onClose,
  onSave,
}: MilestoneEditorModalProps) {
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ContentStatus>("draft");
  const [errors, setErrors] = useState<{ year?: string; description?: string }>({});

  useEffect(() => {
    if (!isOpen) return;
    if (editingItem) {
      setYear(editingItem.year);
      setDescription(editingItem.description);
      setStatus(editingItem.status);
    } else {
      setYear(String(new Date().getFullYear()));
      setDescription("");
      setStatus("draft");
    }
    setErrors({});
  }, [isOpen, editingItem]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { year?: string; description?: string } = {};

    const trimmedYear = year.trim();
    const trimmedDesc = description.trim();

    if (!trimmedYear) {
      newErrors.year = "Milestone year is required (e.g. 1991, 2026).";
    } else if (trimmedYear.length > 10) {
      newErrors.year = "Year cannot exceed 10 characters.";
    }

    if (!trimmedDesc) {
      newErrors.description = "Milestone description is required.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave({
        year: trimmedYear,
        description: trimmedDesc,
        status,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#E5E0D8] font-figtree">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF8F4] text-[#9739A8] border border-[#E5E0D8]">
              <Flag className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-lora text-lg font-medium text-[#0F1C1D]">
                {editingItem ? "Edit Milestone" : "Add Key Milestone"}
              </h2>
              <p className="text-xs text-[#5F6C6D]">
                {editingItem
                  ? "Update milestone year, description, or publication status."
                  : "Add an organizational milestone to the timeline on the public about page."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#5F6C6D] hover:bg-neutral-100 hover:text-[#0F1C1D] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Year Input */}
            <div>
              <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
                Year / Era <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                  if (errors.year) setErrors((prev) => ({ ...prev, year: undefined }));
                }}
                placeholder="e.g. 1991, 2026"
                maxLength={10}
                className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3.5 py-2 font-mono text-xs text-[#0F1C1D] placeholder:text-[#8A847A] focus:border-[#9739A8] focus:outline-hidden transition-all"
              />
              {errors.year && (
                <p className="mt-1 text-[11px] font-medium text-rose-600">
                  {errors.year}
                </p>
              )}
            </div>

            {/* Status Select */}
            <div>
              <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
                Publication Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ContentStatus)}
                className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3.5 py-2 font-figtree text-xs text-[#0F1C1D] focus:border-[#9739A8] focus:outline-hidden cursor-pointer"
              >
                <option value="draft">Draft (Internal only)</option>
                <option value="published">Published (Visible on About timeline)</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
              Milestone Achievement / Description <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
              }}
              placeholder="e.g. IHDUA established with dedicated focus on rural health and community empowerment."
              className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3.5 py-2 font-figtree text-xs text-[#0F1C1D] placeholder:text-[#8A847A] focus:border-[#9739A8] focus:outline-hidden transition-all"
            />
            {errors.description && (
              <p className="mt-1 text-[11px] font-medium text-rose-600">
                {errors.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#E5E0D8]">
            <button
              type="button"
              onClick={onClose}
              disabled={actionLoading}
              className="rounded-lg border border-[#D9D3C9] bg-white px-4 py-2 font-figtree text-xs font-semibold text-[#5F6C6D] hover:text-[#00191B] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1A0F1C] px-4 py-2 font-figtree text-xs font-semibold text-white shadow-xs hover:bg-[#2C1A30] disabled:opacity-50 transition-all cursor-pointer"
            >
              {actionLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{editingItem ? "Update Milestone" : "Save Milestone"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

