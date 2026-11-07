"use client";

import { useRef, useState } from "react";
import { Image as ImageIcon, Video as VideoIcon, UploadCloud, Film } from "lucide-react";
import { cn } from "@/lib/utils";

export type BlogMediaType = "image" | "video";

interface BlogBannerUploaderProps {
  mediaType: BlogMediaType;
  onMediaTypeChange: (type: BlogMediaType) => void;
  imagePreviewUrl: string | null;
  videoPreviewUrl: string | null;
  error?: string;
  onImageSelect: (file: File) => void;
  onVideoSelect: (file: File) => void;
  onRemoveMedia: () => void;
}

export function BlogBannerUploader({
  mediaType,
  onMediaTypeChange,
  imagePreviewUrl,
  videoPreviewUrl,
  error,
  onImageSelect,
  onVideoSelect,
  onRemoveMedia,
}: BlogBannerUploaderProps) {
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    if (mediaType === "image") {
      onImageSelect(droppedFile);
    } else {
      onVideoSelect(droppedFile);
    }
  };

  return (
    <div>
      {/* Header with Title and Mode Switcher */}
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-[#0F1C1D]">
          Video or Image
        </label>
        <div className="inline-flex items-center rounded-lg bg-[#FAF8F4] p-0.5 border border-[#E5E0D8]">
          <button
            type="button"
            onClick={() => onMediaTypeChange("image")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer",
              mediaType === "image"
                ? "bg-[#1A0F1C] text-white shadow-xs"
                : "text-[#5F6C6D] hover:text-[#0F1C1D]",
            )}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Image</span>
          </button>
          <button
            type="button"
            onClick={() => onMediaTypeChange("video")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer",
              mediaType === "video"
                ? "bg-[#1A0F1C] text-white shadow-xs"
                : "text-[#5F6C6D] hover:text-[#0F1C1D]",
            )}
          >
            <VideoIcon className="h-3.5 w-3.5" />
            <span>Video</span>
          </button>
        </div>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onImageSelect(f);
        }}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/mp4,video/webm"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onVideoSelect(f);
        }}
        className="hidden"
      />

      {/* Uploader Box / Preview Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 transition-all text-center",
          isDragging
            ? "border-[#9739A8] bg-[#FAF8F4]"
            : "border-[#D9D3C9] hover:border-[#9739A8]/60 bg-[#FAF8F4]/40",
        )}
      >
        {mediaType === "image" ? (
          imagePreviewUrl ? (
            <div className="relative w-full overflow-hidden rounded-lg border border-[#E5E0D8] bg-black/5 group">
              <img
                src={imagePreviewUrl}
                alt="Story Banner Preview"
                className="h-48 w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-[#0F1C1D] shadow-md hover:bg-neutral-100 cursor-pointer"
                >
                  Change Image
                </button>
                <button
                  type="button"
                  onClick={onRemoveMedia}
                  className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-rose-700 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#9739A8] shadow-xs mb-2 border border-[#E5E0D8]">
                <UploadCloud className="h-5 w-5" />
              </div>
              <p className="font-figtree text-xs font-semibold text-[#0F1C1D]">
                Drag and drop story banner here, or{" "}
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="text-[#9739A8] underline hover:text-[#7A288A] cursor-pointer"
                >
                  browse
                </button>
              </p>
              <p className="mt-1 font-figtree text-[11px] text-[#8A847A]">
                WebP, AVIF, JPEG, or PNG (recommended: 1200×630, max 5MB)
              </p>
            </div>
          )
        ) : videoPreviewUrl ? (
          <div className="w-full overflow-hidden rounded-lg border border-[#E5E0D8] bg-black">
            <video
              src={videoPreviewUrl}
              controls
              className="h-56 w-full object-contain bg-black"
            />
            <div className="flex items-center justify-end gap-2 p-2.5 bg-[#FAF8F4] border-t border-[#E5E0D8]">
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-[#0F1C1D] border border-[#D9D3C9] shadow-xs hover:bg-neutral-100 cursor-pointer"
              >
                Change Video
              </button>
              <button
                type="button"
                onClick={onRemoveMedia}
                className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 cursor-pointer"
              >
                Remove Video
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#9739A8] shadow-xs mb-2 border border-[#E5E0D8]">
              <Film className="h-5 w-5" />
            </div>
            <p className="font-figtree text-xs font-semibold text-[#0F1C1D]">
              Drag and drop story video here, or{" "}
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                className="text-[#9739A8] underline hover:text-[#7A288A] cursor-pointer"
              >
                browse
              </button>
            </p>
            <p className="mt-1 font-figtree text-[11px] text-[#8A847A]">
              MP4 or WebM (recommended: 16:9)
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-[11px] font-medium text-rose-600">{error}</p>
      )}
    </div>
  );
}

export { BlogBannerUploader as BlogMediaUploader };
