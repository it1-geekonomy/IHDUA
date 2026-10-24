"use client";

import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { FileText, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResumeDropzoneProps {
  label: string;
  required?: boolean;
  file: File | null;
  onFileChange: (file: File | null) => void;
  error?: string;
  maxSizeBytes?: number;
  acceptedExtensions?: string[];
}

export function ResumeDropzone({
  label,
  required,
  file,
  onFileChange,
  error,
  maxSizeBytes = 5 * 1024 * 1024, // 5 MB
  acceptedExtensions = ["pdf", "doc", "docx"],
}: ResumeDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [internalError, setInternalError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSet = (selectedFile: File) => {
    if (selectedFile.size > maxSizeBytes) {
      setInternalError(`File size exceeds ${(maxSizeBytes / (1024 * 1024)).toFixed(0)} MB limit.`);
      return;
    }

    const ext = selectedFile.name.split(".").pop()?.toLowerCase();
    if (!ext || !acceptedExtensions.includes(ext)) {
      setInternalError(`Allowed formats: ${acceptedExtensions.join(", ").toUpperCase()}`);
      return;
    }

    setInternalError("");
    onFileChange(selectedFile);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) validateAndSet(droppedFile);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) validateAndSet(selectedFile);
  };

  const handleRemove = () => {
    onFileChange(null);
    setInternalError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const displayError = error || internalError;

  return (
    <div className="w-full font-figtree">
      <label className="block text-[13px] font-medium text-[#111827] mb-1.5">
        {label}
        {required && <span className="text-[#9739A8] ml-0.5">*</span>}
      </label>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1",
          displayError
            ? "border-red-400 bg-red-50/30"
            : isDragging
            ? "border-[#9739A8] bg-[#FAF5FC]"
            : "border-[#E5E7EB] hover:border-[#9739A8]/60 bg-white"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptedExtensions.map((ext) => `.${ext}`).join(",")}
          className="hidden"
          onChange={handleInputChange}
        />

        {file ? (
          <div className="flex items-center gap-2 text-left w-full justify-between px-3 py-1 bg-[#F9FAFB] rounded border border-gray-200">
            <div className="flex items-center gap-2.5 truncate">
              <FileText className="w-5 h-5 text-[#9739A8] shrink-0" />
              <div className="truncate">
                <p className="text-[13px] font-medium text-[#111827] truncate">{file.name}</p>
                <p className="text-[11px] text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="p-1 hover:text-red-500 text-gray-400 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#374151]">
              <FileText className="w-4 h-4 text-gray-400" />
              <span>Attach Resume</span>
            </div>
            <p className="text-[11px] text-[#9CA3AF]">
              Upload your resume ({acceptedExtensions.join("/").toUpperCase()}) - Max{" "}
              {(maxSizeBytes / (1024 * 1024)).toFixed(0)} MB
            </p>
          </>
        )}
      </div>

      {displayError && <p className="mt-1 text-[11px] text-red-500">{displayError}</p>}
    </div>
  );
}
