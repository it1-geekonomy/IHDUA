"use client";

import { useEffect, useRef, useState } from "react";
import { Image as ImageIcon, Loader2, UploadCloud, X } from "lucide-react";
import { AdminSelect, type AdminSelectOption } from "@/domains/admin/components/AdminSelect";
import type { ContentStatus, HomeBannerFormValues, HomeBannerItem } from "./types";
import { cn } from "@/lib/utils";

interface HomeBannerEditorModalProps {
  isOpen: boolean;
  editingItem: HomeBannerItem | null;
  actionLoading: boolean;
  onClose: () => void;
  onSave: (values: HomeBannerFormValues) => void;
}

const MODAL_STATUS_OPTIONS: AdminSelectOption<ContentStatus>[] = [
  { value: "draft", label: "Draft (Hidden in CMS)", dotColor: "bg-amber-500" },
  { value: "published", label: "Published (Visible on Homepage)", dotColor: "bg-emerald-500" },
  { value: "archived", label: "Archived (Unpublished)", dotColor: "bg-neutral-400" },
];

export function HomeBannerEditorModal({
  isOpen,
  editingItem,
  actionLoading,
  onClose,
  onSave,
}: HomeBannerEditorModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [status, setStatus] = useState<ContentStatus>("draft");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (editingItem) {
      setStatus(editingItem.status);
      setFile(null);
      setPreviewUrl(editingItem.bannerImageUrl);
    } else {
      setStatus("draft");
      setFile(null);
      setPreviewUrl(null);
    }
    setError(null);
  }, [isOpen, editingItem]);

  if (!isOpen) return null;

  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) return;
    const allowed = ["image/webp", "image/avif", "image/jpeg", "image/png"];
    if (!allowed.includes(selectedFile.type)) {
      setError("Supported image formats: WebP, AVIF, JPEG, PNG.");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Banner image size exceeds 5MB limit.");
      return;
    }
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setError(null);
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingItem && !file) {
      setError("Please select a banner image to upload.");
      return;
    }

    onSave({
      file,
      status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-[#E5E0D8] font-figtree">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF8F4] text-[#9739A8] border border-[#E5E0D8]">
              <ImageIcon className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-lora text-lg font-medium text-[#0F1C1D]">
                {editingItem ? "Edit Home Banner" : "Upload New Home Banner"}
              </h2>
              <p className="text-xs text-[#5F6C6D]">
                {editingItem
                  ? "Update banner image or publication status."
                  : "Upload a hero banner to feature on the homepage."}
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
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Banner Upload Area */}
          <div>
            <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
              Banner Image <span className="text-rose-600">*</span>
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
                <div className="relative w-full overflow-hidden rounded-lg border border-[#E5E0D8] bg-black/5 group">
                  <img
                    src={previewUrl}
                    alt="Home Banner Preview"
                    className="h-48 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-[#0F1C1D] shadow-md hover:bg-neutral-100 cursor-pointer"
                    >
                      {editingItem ? "Replace Image" : "Change Image"}
                    </button>
                    {!editingItem && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-rose-700 cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#9739A8] shadow-xs mb-2.5 border border-[#E5E0D8]">
                    <UploadCloud className="h-6 w-6" />
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
                    WebP, AVIF, JPEG, or PNG (recommended: 1920×800 or 16:9, max 5MB)
                  </p>
                </div>
              )}
            </div>
            {error && (
              <p className="mt-1.5 text-[11px] font-medium text-rose-600">
                {error}
              </p>
            )}
          </div>

          {/* Status Select */}
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
              <span>{editingItem ? "Update Banner" : "Upload Banner"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

