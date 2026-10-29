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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function BlogCategoryEditorModal({
  isOpen,
  editingItem,
  actionLoading,
  onClose,
  onSave,
}: BlogCategoryEditorModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; slug?: string }>({});

  useEffect(() => {
    if (!isOpen) return;
    if (editingItem) {
      setName(editingItem.name);
      setSlug(editingItem.slug);
      setIsSlugManuallyEdited(true);
    } else {
      setName("");
      setSlug("");
      setIsSlugManuallyEdited(false);
    }
    setErrors({});
  }, [isOpen, editingItem]);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isSlugManuallyEdited) {
      setSlug(slugify(val));
    }
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleSlugChange = (val: string) => {
    setSlug(val);
    setIsSlugManuallyEdited(true);
    if (errors.slug) {
      setErrors((prev) => ({ ...prev, slug: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; slug?: string } = {};

    const trimmedName = name.trim();
    const trimmedSlug = (slug.trim() || slugify(trimmedName)).trim();

    if (!trimmedName) {
      newErrors.name = "Category name is required.";
    } else if (trimmedName.length > 100) {
      newErrors.name = "Category name cannot exceed 100 characters.";
    }

    if (!trimmedSlug) {
      newErrors.slug = "Category slug is required.";
    } else if (trimmedSlug.length > 120) {
      newErrors.slug = "Slug cannot exceed 120 characters.";
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmedSlug)) {
      newErrors.slug =
        "Slug must be lowercase alphanumeric characters with single hyphens (e.g. healthcare-and-medical).";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave({
        name: trimmedName,
        slug: trimmedSlug,
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
                  ? "Update category name and URL identifier."
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

          {/* Slug */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#0F1C1D]">
                Category Slug <span className="text-rose-600">*</span>
              </label>
              {!isSlugManuallyEdited && (
                <span className="text-[11px] text-[#8A847A] italic">
                  Auto-generated from name
                </span>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#8A847A]">
                /
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="healthcare-and-medical"
                maxLength={120}
                className="w-full rounded-lg border border-[#D9D3C9] bg-white pl-6 pr-3.5 py-2 font-mono text-xs text-[#0F1C1D] placeholder:text-[#8A847A] focus:border-[#9739A8] focus:outline-hidden transition-all"
              />
            </div>
            {errors.slug ? (
              <p className="mt-1 text-[11px] font-medium text-rose-600">
                {errors.slug}
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-[#5F6C6D]">
                Used for URL filtering and linking stories under this category.
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
              <span>{editingItem ? "Update Category" : "Create Category"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

