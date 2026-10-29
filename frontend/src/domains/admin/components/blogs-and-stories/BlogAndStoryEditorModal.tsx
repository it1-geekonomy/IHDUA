"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  Sparkles,
  Tag,
  UploadCloud,
  X,
} from "lucide-react";
import { TinyMceEditor } from "@/domains/admin/components/TinyMceEditor";
import type {
  BlogAndStoryFormValues,
  BlogAndStoryItem,
  BlogCategoryItem,
  ContentStatus,
} from "./types";
import { cn } from "@/lib/utils";

interface BlogAndStoryEditorModalProps {
  isOpen: boolean;
  editingItem: BlogAndStoryItem | null;
  categories: BlogCategoryItem[];
  actionLoading: boolean;
  onClose: () => void;
  onSave: (values: BlogAndStoryFormValues) => void;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getTodayIsoDate(): string {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

export function BlogAndStoryEditorModal({
  isOpen,
  editingItem,
  categories,
  actionLoading,
  onClose,
  onSave,
}: BlogAndStoryEditorModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [blogDate, setBlogDate] = useState("");
  const [status, setStatus] = useState<ContentStatus>("draft");
  const [shortDescription, setShortDescription] = useState("");
  const [content, setContent] = useState("");

  // Banner image states
  const [file, setFile] = useState<File | null>(null);
  const [blogBannerUrl, setBlogBannerUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // SEO fields
  const [showSeo, setShowSeo] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [schemaCode, setSchemaCode] = useState("");

  // Validation
  const [errors, setErrors] = useState<{
    title?: string;
    slug?: string;
    categoryId?: string;
    blogDate?: string;
    banner?: string;
  }>({});

  useEffect(() => {
    if (!isOpen) return;

    if (editingItem) {
      setTitle(editingItem.title);
      setSlug(editingItem.slug);
      setIsSlugManuallyEdited(true);
      setCategoryId(editingItem.categoryId || "");
      setBlogDate(
        editingItem.blogDate
          ? editingItem.blogDate.split("T")[0]
          : getTodayIsoDate(),
      );
      setStatus(editingItem.status);
      setShortDescription(editingItem.shortDescription || "");
      setContent(editingItem.content || "");
      setFile(null);
      setBlogBannerUrl(editingItem.blogBanner || "");
      setPreviewUrl(editingItem.blogBanner || null);
      setMetaTitle(editingItem.metaTitle || "");
      setMetaDescription(editingItem.metaDescription || "");
      setSchemaCode(editingItem.schemaCode || "");
      setShowSeo(Boolean(editingItem.metaTitle || editingItem.metaDescription || editingItem.schemaCode));
    } else {
      setTitle("");
      setSlug("");
      setIsSlugManuallyEdited(false);
      setCategoryId(categories.length > 0 ? categories[0].id : "");
      setBlogDate(getTodayIsoDate());
      setStatus("draft");
      setShortDescription("");
      setContent("");
      setFile(null);
      setBlogBannerUrl("");
      setPreviewUrl(null);
      setMetaTitle("");
      setMetaDescription("");
      setSchemaCode("");
      setShowSeo(false);
    }
    setErrors({});
  }, [isOpen, editingItem, categories]);

  if (!isOpen) return null;

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManuallyEdited) {
      setSlug(slugify(val));
    }
    if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
  };

  const handleSlugChange = (val: string) => {
    setSlug(val);
    setIsSlugManuallyEdited(true);
    if (errors.slug) setErrors((prev) => ({ ...prev, slug: undefined }));
  };

  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) return;
    const allowed = ["image/webp", "image/avif", "image/jpeg", "image/png"];
    if (!allowed.includes(selectedFile.type)) {
      setErrors((prev) => ({
        ...prev,
        banner: "Supported image formats: WebP, AVIF, JPEG, PNG (max 5MB).",
      }));
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        banner: "Banner image size exceeds 5MB limit.",
      }));
      return;
    }
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setErrors((prev) => ({ ...prev, banner: undefined }));
  };

  const handleRemoveImage = () => {
    setFile(null);
    setBlogBannerUrl("");
    setPreviewUrl(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    const trimmedTitle = title.trim();
    const trimmedSlug = (slug.trim() || slugify(trimmedTitle)).trim();

    if (!trimmedTitle) {
      newErrors.title = "Story title is required.";
    }

    if (!trimmedSlug) {
      newErrors.slug = "URL slug is required.";
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmedSlug)) {
      newErrors.slug =
        "Slug must consist of lowercase letters, numbers, and hyphens.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave({
        title: trimmedTitle,
        slug: trimmedSlug,
        categoryId: categoryId.trim(),
        blogDate: blogDate.trim(),
        shortDescription: shortDescription.trim(),
        content: content.trim(),
        status,
        file,
        blogBannerUrl,
        metaTitle: metaTitle.trim(),
        metaDescription: metaDescription.trim(),
        schemaCode: schemaCode.trim(),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-[#E5E0D8] font-figtree">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E5E0D8] px-6 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF8F4] text-[#9739A8] border border-[#E5E0D8]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-lora text-lg font-medium text-[#0F1C1D]">
                {editingItem ? "Edit Story / Article" : "Create Blog Story"}
              </h2>
              <p className="text-xs text-[#5F6C6D]">
                {editingItem
                  ? "Update content, category assignment, banner image, and SEO."
                  : "Draft or publish a new story, field report, or news article."}
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

        {/* Scrollable Form Body */}
        <form
          id="blog-story-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-6"
        >
          {/* Row 1: Title & Slug */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
                Story Title <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Transforming Rural Classrooms Across Karnataka in 2026"
                className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3.5 py-2 font-figtree text-xs text-[#0F1C1D] placeholder:text-[#8A847A] focus:border-[#9739A8] focus:outline-hidden transition-all"
              />
              {errors.title && (
                <p className="mt-1 text-[11px] font-medium text-rose-600">
                  {errors.title}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#0F1C1D]">
                    URL Slug <span className="text-rose-600">*</span>
                  </label>
                  {!isSlugManuallyEdited && (
                    <span className="text-[11px] text-[#8A847A] italic">
                      Auto-generated
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#8A847A]">
                    /blogs/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="transforming-rural-classrooms"
                    className="w-full rounded-lg border border-[#D9D3C9] bg-white pl-16 pr-3.5 py-2 font-mono text-xs text-[#0F1C1D] placeholder:text-[#8A847A] focus:border-[#9739A8] focus:outline-hidden transition-all"
                  />
                </div>
                {errors.slug && (
                  <p className="mt-1 text-[11px] font-medium text-rose-600">
                    {errors.slug}
                  </p>
                )}
              </div>

              {/* Category Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
                  Category <span className="text-rose-600">*</span>
                </label>
                {categories.length > 0 ? (
                  <select
                    value={categoryId}
                    onChange={(e) => {
                      setCategoryId(e.target.value);
                      if (errors.categoryId) {
                        setErrors((prev) => ({ ...prev, categoryId: undefined }));
                      }
                    }}
                    className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3.5 py-2 font-figtree text-xs text-[#0F1C1D] focus:border-[#9739A8] focus:outline-hidden cursor-pointer"
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
                    No categories found. Please create a category under{" "}
                    <strong>Blog Categories</strong> first.
                  </div>
                )}
                {errors.categoryId && (
                  <p className="mt-1 text-[11px] font-medium text-rose-600">
                    {errors.categoryId}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: Date & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
                  Publish Date
                </label>
                <input
                  type="date"
                  value={blogDate}
                  onChange={(e) => setBlogDate(e.target.value)}
                  className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3.5 py-2 font-figtree text-xs text-[#0F1C1D] focus:border-[#9739A8] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
                  Publication Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ContentStatus)}
                  className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3.5 py-2 font-figtree text-xs text-[#0F1C1D] focus:border-[#9739A8] focus:outline-hidden cursor-pointer"
                >
                  <option value="draft">Draft (Private in CMS)</option>
                  <option value="published">Published (Visible on live website)</option>
                  <option value="archived">Archived (Unpublished)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Banner Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
              Banner Image
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files?.[0]) {
                  handleFileSelect(e.dataTransfer.files[0]);
                }
              }}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 transition-all text-center",
                isDragging
                  ? "border-[#9739A8] bg-[#FAF8F4]"
                  : "border-[#D9D3C9] hover:border-[#9739A8]/60 bg-[#FAF8F4]/40",
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/avif"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
                }}
                className="hidden"
              />

              {previewUrl ? (
                <div className="relative w-full max-w-md overflow-hidden rounded-lg border border-[#E5E0D8] bg-black/5 group">
                  <img
                    src={previewUrl}
                    alt="Story Banner Preview"
                    className="h-44 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-[#0F1C1D] shadow-md hover:bg-neutral-100 cursor-pointer"
                    >
                      Change Image
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-rose-700 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#9739A8] shadow-xs mb-2 border border-[#E5E0D8]">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <p className="font-figtree text-xs font-semibold text-[#0F1C1D]">
                    Drag and drop banner image here, or{" "}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[#9739A8] underline hover:text-[#7A288A] cursor-pointer"
                    >
                      browse
                    </button>
                  </p>
                  <p className="mt-1 font-figtree text-[11px] text-[#8A847A]">
                    WebP, AVIF, JPEG, or PNG (recommended: 1600×900, max 5MB)
                  </p>
                </div>
              )}
            </div>
            {errors.banner && (
              <p className="mt-1 text-[11px] font-medium text-rose-600">
                {errors.banner}
              </p>
            )}
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
              Short Summary / Excerpt
            </label>
            <textarea
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="A brief 1-2 sentence excerpt summarizing the key takeaway for story cards and listings..."
              className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3.5 py-2 font-figtree text-xs text-[#0F1C1D] placeholder:text-[#8A847A] focus:border-[#9739A8] focus:outline-hidden transition-all"
            />
          </div>

          {/* Full Content (TinyMCE) */}
          <div>
            <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
              Full Story Content (Rich Text)
            </label>
            <div className="overflow-hidden rounded-xl border border-[#D9D3C9]">
              <TinyMceEditor
                value={content}
                onChange={setContent}
                placeholder="Write the complete story, add headings, quotes, lists, and takeaways..."
                height={400}
              />
            </div>
          </div>

          {/* Collapsible SEO Fields */}
          <div className="rounded-xl border border-[#E5E0D8] bg-[#FAF8F4]/50 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowSeo(!showSeo)}
              className="flex w-full items-center justify-between p-3.5 text-left font-figtree text-xs font-semibold text-[#0F1C1D] hover:bg-[#FAF8F4] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Tag className="h-3.5 w-3.5 text-[#9739A8]" />
                <span>SEO & Social Sharing Metadata (Optional)</span>
              </div>
              {showSeo ? (
                <ChevronUp className="h-4 w-4 text-[#8A847A]" />
              ) : (
                <ChevronDown className="h-4 w-4 text-[#8A847A]" />
              )}
            </button>

            {showSeo && (
              <div className="p-4 pt-1 space-y-3.5 border-t border-[#E5E0D8] bg-white">
                <div>
                  <label className="block text-[11px] font-semibold text-[#0F1C1D] mb-1">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Custom page title for search engines (defaults to story title)"
                    className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3 py-1.5 font-figtree text-xs text-[#0F1C1D] placeholder:text-[#8A847A] focus:border-[#9739A8] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#0F1C1D] mb-1">
                    Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Brief description for Google search snippets (150-160 chars recommended)"
                    className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3 py-1.5 font-figtree text-xs text-[#0F1C1D] placeholder:text-[#8A847A] focus:border-[#9739A8] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#0F1C1D] mb-1">
                    Schema Code (JSON-LD Markup)
                  </label>
                  <textarea
                    rows={3}
                    value={schemaCode}
                    onChange={(e) => setSchemaCode(e.target.value)}
                    placeholder='{"@context": "https://schema.org", "@type": "BlogPosting", ...}'
                    className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3 py-1.5 font-mono text-[11px] text-[#0F1C1D] placeholder:text-[#8A847A] focus:border-[#9739A8] focus:outline-hidden"
                  />
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2.5 border-t border-[#E5E0D8] px-6 py-4 shrink-0 bg-[#FAF8F4]">
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
            form="blog-story-form"
            disabled={actionLoading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1A0F1C] px-5 py-2 font-figtree text-xs font-semibold text-white shadow-xs hover:bg-[#2C1A30] disabled:opacity-50 transition-all cursor-pointer"
          >
            {actionLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{editingItem ? "Update Story" : "Create Story"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

