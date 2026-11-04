"use client";

import { useEffect, useState } from "react";
import { Loader2, Tag, X } from "lucide-react";
import type { BlogCategoryFormValues, BlogCategoryItem } from "./types";

interface BlogCategoryEditorModalProps {
  isOpen: boolean;
  editingItem: BlogCategoryItem | null;
  actionLoading: boolean;
  onClose: () => void;
  onSave: (values: BlogCategoryFormValues) => void;
}

export function BlogCategoryEditorModal({
  isOpen,
  editingItem,
  actionLoading,
  onClose,
  onSave,
}: BlogCategoryEditorModalProps) {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    if (!isOpen) return;
    if (editingItem) {
      setName(editingItem.name);
    } else {
      setName("");
    }
    setErrors({});
  }, [isOpen, editingItem]);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string } = {};

    const trimmedName = name.trim();

    if (!trimmedName) {
      newErrors.name = "Category name is required.";
    } else if (trimmedName.length > 100) {
      newErrors.name = "Category name cannot exceed 100 characters.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave({
        name: trimmedName,
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
              <Tag className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-lora text-lg font-medium text-[#0F1C1D]">
                {editingItem ? "Edit Category" : "Add Blog Category"}
              </h2>
              <p className="text-xs text-[#5F6C6D]">
                {editingItem
                  ? "Update category name for blogs and stories."
                  : "Create a new category for blogs and story filtering."}
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
          {/* Category Name */}
          <div>
            <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
              Category Name <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Healthcare & Medical"
              maxLength={100}
              className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3.5 py-2 font-figtree text-xs text-[#0F1C1D] placeholder:text-[#8A847A] focus:border-[#9739A8] focus:outline-hidden transition-all"
            />
            {errors.name && (
              <p className="mt-1 text-[11px] font-medium text-rose-600">
                {errors.name}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#E5E0D8]">
            <button
              type="button"
              onClick={onClose}
              disabled={actionLoading}
              className="rounded-lg border border-[#D9D3C9] bg-white px-4 py-2 text-xs font-semibold text-[#5F6C6D] hover:text-[#00191B] disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#9739A8] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#832e92] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {actionLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{editingItem ? "Update Category" : "Create Category"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
