"use client";

import { useRef, useState } from "react";
import { Image as ImageIcon, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogBannerUploaderProps {
  previewUrl: string | null;
  error?: string;
  isEditing: boolean;
  onFileSelect: (file: File) => void;
  onRemoveBanner: () => void;
}

export function BlogBannerUploader({
  previewUrl,
  error,
  isEditing,
  onFileSelect,
  onRemoveBanner,
}: BlogBannerUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) onFileSelect(droppedFile);
  };

  return (
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
        onDrop={handleDrop}
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
            const f = e.target.files?.[0];
            if (f) onFileSelect(f);
          }}
          className="hidden"
        />

        {previewUrl ? (
          <div className="relative w-full overflow-hidden rounded-lg border border-[#E5E0D8] bg-black/5 group">
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
                onClick={onRemoveBanner}
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
                onClick={() => fileInputRef.current?.click()}
                className="text-[#9739A8] underline hover:text-[#7A288A] cursor-pointer"
              >
                browse
              </button>
            </p>
            <p className="mt-1 font-figtree text-[11px] text-[#8A847A]">
              WebP, AVIF, JPEG, or PNG (recommended: 1200×630, max 5MB)
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

