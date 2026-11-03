"use client";

import { useRef, useState } from "react";
import { FileText, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportPdfUploaderProps {
  file: File | null;
  error?: string;
  isEditing: boolean;
  onFileSelect: (file: File) => void;
  onRemoveFile: () => void;
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function ReportPdfUploader({
  file,
  error,
  isEditing,
  onFileSelect,
  onRemoveFile,
}: ReportPdfUploaderProps) {
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
        PDF Report File {!isEditing && <span className="text-rose-600">*</span>}
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
          accept="application/pdf"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFileSelect(f);
          }}
          className="hidden"
        />

        {file ? (
          <div className="flex items-center justify-between w-full rounded-lg border border-[#E5E0D8] bg-white p-3 shadow-xs">
            <div className="flex items-center gap-2.5 truncate pr-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FAF5FC] text-[#9739A8]">
                <FileText className="h-4 w-4" />
              </div>
              <div className="text-left truncate">
                <p className="font-figtree text-xs font-semibold text-[#0F1C1D] truncate">
                  {file.name}
                </p>
                <p className="font-mono text-[10px] text-[#8A847A]">
                  {formatBytes(file.size)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onRemoveFile}
              className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#9739A8] shadow-xs mb-2 border border-[#E5E0D8]">
              <UploadCloud className="h-5 w-5" />
            </div>
            <p className="font-figtree text-xs font-semibold text-[#0F1C1D]">
              Drag & drop report PDF here, or{" "}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[#9739A8] underline hover:text-[#7A288A] cursor-pointer"
              >
                browse
              </button>
            </p>
            <p className="mt-1 font-figtree text-[11px] text-[#8A847A]">
              PDF document only (max 25MB)
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

