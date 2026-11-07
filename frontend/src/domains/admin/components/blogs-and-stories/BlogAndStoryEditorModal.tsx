"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles, X } from "lucide-react";
import { TinyMceEditor } from "@/domains/admin/components/TinyMceEditor";
import { AdminSelect, type AdminSelectOption } from "@/domains/admin/components/AdminSelect";
import { BlogBannerUploader, type BlogMediaType } from "./BlogBannerUploader";
import { BlogSeoAccordion } from "./BlogSeoAccordion";
import type {
  BlogAndStoryFormValues,
  BlogAndStoryItem,
  BlogCategoryItem,
  ContentStatus,
} from "./types";

interface BlogAndStoryEditorModalProps {
  isOpen: boolean;
  editingItem: BlogAndStoryItem | null;
  categories: BlogCategoryItem[];
  actionLoading: boolean;
  onClose: () => void;
  onSave: (values: BlogAndStoryFormValues) => void;
}

const MODAL_STATUS_OPTIONS: AdminSelectOption<ContentStatus>[] = [
  { value: "draft", label: "Draft (Private in CMS)", dotColor: "bg-amber-500" },
  { value: "published", label: "Published (Visible on live website)", dotColor: "bg-emerald-500" },
  { value: "archived", label: "Archived (Unpublished)", dotColor: "bg-neutral-400" },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getTodayIsoDate(): string {
  return new Date().toISOString().split("T")[0];
}

export function BlogAndStoryEditorModal({
  isOpen,
  editingItem,
  categories,
  actionLoading,
  onClose,
  onSave,
}: BlogAndStoryEditorModalProps) {
  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [blogDate, setBlogDate] = useState("");
  const [status, setStatus] = useState<ContentStatus>("draft");
  const [shortDescription, setShortDescription] = useState("");
  const [content, setContent] = useState("");

  // Media (Image or Video) states
  const [mediaType, setMediaType] = useState<BlogMediaType>("image");
  const [file, setFile] = useState<File | null>(null);
  const [blogBannerUrl, setBlogBannerUrl] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);

  // SEO fields
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [schemaCode, setSchemaCode] = useState("");

  // Validation
  const [errors, setErrors] = useState<{
    title?: string;
    slug?: string;
    categoryId?: string;
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
        editingItem.blogDate ? editingItem.blogDate.split("T")[0] : getTodayIsoDate(),
      );
      setStatus(editingItem.status);
      setShortDescription(editingItem.shortDescription || "");
      setContent(editingItem.content || "");

      // Determine initial media type from existing item
      if (editingItem.video && !editingItem.blogBanner) {
        setMediaType("video");
      } else {
        setMediaType("image");
      }

      setBlogBannerUrl(editingItem.blogBanner || "");
      setImagePreviewUrl(editingItem.blogBanner || null);
      setFile(null);

      setVideoUrl(editingItem.video || "");
      setVideoPreviewUrl(editingItem.video || null);
      setVideoFile(null);

      setMetaTitle(editingItem.metaTitle || "");
      setMetaDescription(editingItem.metaDescription || "");
      setSchemaCode(editingItem.schemaCode || "");
    } else {
      setTitle("");
      setSlug("");
      setIsSlugManuallyEdited(false);
      setCategoryId(categories.length > 0 ? categories[0].id : "");
      setBlogDate(getTodayIsoDate());
      setStatus("draft");
      setShortDescription("");
      setContent("");
      setMediaType("image");
      setBlogBannerUrl("");
      setImagePreviewUrl(null);
      setFile(null);
      setVideoUrl("");
      setVideoPreviewUrl(null);
      setVideoFile(null);
      setMetaTitle("");
      setMetaDescription("");
      setSchemaCode("");
    }
    setErrors({});
  }, [isOpen, editingItem, categories]);

  if (!isOpen) return null;

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!isSlugManuallyEdited) {
      setSlug(slugify(newTitle));
    }
    if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
  };

  const handleImageSelect = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, banner: "Please select an image file (WebP, AVIF, JPEG, PNG)." }));
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, banner: "Image size must be under 5MB." }));
      return;
    }
    setFile(selectedFile);
    setImagePreviewUrl(URL.createObjectURL(selectedFile));
    setErrors((prev) => ({ ...prev, banner: undefined }));
  };

  const handleVideoSelect = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("video/")) {
      setErrors((prev) => ({ ...prev, banner: "Please select a video file (MP4, WebM)." }));
      return;
    }
    setVideoFile(selectedFile);
    setVideoPreviewUrl(URL.createObjectURL(selectedFile));
    setErrors((prev) => ({ ...prev, banner: undefined }));
  };

  const handleRemoveMedia = () => {
    if (mediaType === "image") {
      setFile(null);
      setImagePreviewUrl(null);
      setBlogBannerUrl("");
    } else {
      setVideoFile(null);
      setVideoPreviewUrl(null);
      setVideoUrl("");
    }
    setErrors((prev) => ({ ...prev, banner: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!title.trim()) newErrors.title = "Story title is required.";
    if (!slug.trim()) newErrors.slug = "URL slug is required.";
    if (!categoryId.trim()) newErrors.categoryId = "Please select a category.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave({
        title: title.trim(),
        slug: slug.trim(),
        categoryId: categoryId.trim(),
        blogDate: blogDate.trim(),
        shortDescription: shortDescription.trim(),
        content: content.trim(),
        status,
        mediaType,
        file,
        blogBannerUrl,
        videoFile,
        videoUrl,
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
                  ? "Update content, category assignment, video or image, and SEO."
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
          className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
        >
          {/* Title */}
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
              <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.title}</p>
            )}
          </div>

          {/* Slug & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#0F1C1D]">
                  URL Slug <span className="text-rose-600">*</span>
                </label>
                {!isSlugManuallyEdited && (
                  <span className="text-[11px] text-[#8A847A] italic">Auto-generated</span>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#8A847A]">
                  /blogs/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setIsSlugManuallyEdited(true);
                  }}
                  placeholder="transforming-rural-classrooms"
                  className="w-full rounded-lg border border-[#D9D3C9] bg-white pl-16 pr-3.5 py-2 font-mono text-xs text-[#0F1C1D] placeholder:text-[#8A847A] focus:border-[#9739A8] focus:outline-hidden"
                />
              </div>
              {errors.slug && (
                <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.slug}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
                Category <span className="text-rose-600">*</span>
              </label>
              {categories.length > 0 ? (
                <AdminSelect<string>
                  value={categoryId}
                  onChange={(val) => {
                    setCategoryId(val);
                    setErrors((prev) => ({ ...prev, categoryId: undefined }));
                  }}
                  options={categories.map((c) => ({ value: c.id, label: c.name }))}
                  placeholder="-- Select Category --"
                  searchable={categories.length > 5}
                  size="md"
                  className="w-full"
                  dropdownClassName="w-full"
                />
              ) : (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
                  Please create a category under Blog Categories first.
                </div>
              )}
              {errors.categoryId && (
                <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.categoryId}</p>
              )}
            </div>
          </div>

          {/* Date & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
                Publish Date
              </label>
              <input
                type="date"
                value={blogDate}
                onChange={(e) => setBlogDate(e.target.value)}
                className="w-full h-10 rounded-lg border border-[#D9D3C9] bg-white px-3.5 py-2 font-figtree text-xs text-[#0F1C1D] focus:border-[#9739A8] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
                Publication Status
              </label>
              <AdminSelect<ContentStatus>
                value={status}
                onChange={setStatus}
                options={MODAL_STATUS_OPTIONS}
                size="md"
                className="w-full"
                dropdownClassName="w-full"
              />
            </div>
          </div>

          {/* Video or Image Uploader Component */}
          <BlogBannerUploader
            mediaType={mediaType}
            onMediaTypeChange={(t) => {
              setMediaType(t);
              setErrors((prev) => ({ ...prev, banner: undefined }));
            }}
            imagePreviewUrl={imagePreviewUrl}
            videoPreviewUrl={videoPreviewUrl}
            error={errors.banner}
            onImageSelect={handleImageSelect}
            onVideoSelect={handleVideoSelect}
            onRemoveMedia={handleRemoveMedia}
          />

          {/* Short Description */}
          <div>
            <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
              Short Summary
            </label>
            <textarea
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Brief summary card teaser (1-2 sentences)"
              className="w-full rounded-lg border border-[#D9D3C9] bg-white p-3 font-figtree text-xs text-[#0F1C1D] placeholder:text-[#8A847A] focus:border-[#9739A8] focus:outline-hidden resize-none"
            />
          </div>

          {/* Rich Content Editor */}
          <div>
            <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
              Story Article Body
            </label>
            <TinyMceEditor value={content} onChange={setContent} height={320} />
          </div>

          {/* SEO Accordion Component */}
          <BlogSeoAccordion
            metaTitle={metaTitle}
            onMetaTitleChange={setMetaTitle}
            metaDescription={metaDescription}
            onMetaDescriptionChange={setMetaDescription}
            schemaCode={schemaCode}
            onSchemaCodeChange={setSchemaCode}
          />
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[#E5E0D8] px-6 py-4 bg-[#FAF8F4] shrink-0">
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
            className="inline-flex items-center gap-2 rounded-lg bg-[#1A0F1C] px-5 py-2 font-figtree text-xs font-semibold text-white shadow-xs hover:bg-[#2C1A30] disabled:opacity-50 transition-all cursor-pointer"
          >
            {actionLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{editingItem ? "Update Story" : "Publish / Save Story"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
