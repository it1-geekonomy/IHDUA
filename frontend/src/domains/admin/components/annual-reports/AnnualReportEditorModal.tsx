"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, Loader2, UploadCloud, X } from "lucide-react";
import type { AnnualReportFormValues, AnnualReportItem, ContentStatus } from "./types";
import { cn } from "@/lib/utils";

interface AnnualReportEditorModalProps {
  isOpen: boolean;
  editingItem: AnnualReportItem | null;
  actionLoading: boolean;
  onClose: () => void;
  onSave: (values: AnnualReportFormValues) => void;
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function AnnualReportEditorModal({
  isOpen,
  editingItem,
  actionLoading,
  onClose,
  onSave,
}: AnnualReportEditorModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState("");
  const [reportYear, setReportYear] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [status, setStatus] = useState<ContentStatus>("draft");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [errors, setErrors] = useState<{
    title?: string;
    reportYear?: string;
    file?: string;
  }>({});

  useEffect(() => {
    if (!isOpen) return;
    if (editingItem) {
      setTitle(editingItem.title);
      setReportYear(editingItem.reportYear);
      setSortOrder(editingItem.sortOrder ?? 0);
      setStatus(editingItem.status);
      setFile(null);
    } else {
      const currentYear = new Date().getFullYear();
      setTitle(`Annual Report ${currentYear}-${(currentYear + 1).toString().slice(2)}`);
      setReportYear(`${currentYear}-${currentYear + 1}`);
      setSortOrder(0);
      setStatus("draft");
      setFile(null);
    }
    setErrors({});
  }, [isOpen, editingItem]);

  if (!isOpen) return null;

  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) return;
    if (selectedFile.type !== "application/pdf" && !selectedFile.name.endsWith(".pdf")) {
      setErrors((prev) => ({ ...prev, file: "Only PDF files are supported." }));
      return;
    }
    setFile(selectedFile);
    setErrors((prev) => ({ ...prev, file: undefined }));
  };

  const handleSubmit = () => {
    const newErrors: { title?: string; reportYear?: string; file?: string } = {};

    if (!title.trim()) {
      newErrors.title = "Report title is required.";
    }
    if (!reportYear.trim()) {
      newErrors.reportYear = "Report year is required (e.g. 2025-2026).";
    }
    if (!editingItem && !file) {
      newErrors.file = "Please upload the annual report PDF document.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave({
        title: title.trim(),
        reportYear: reportYear.trim(),
        sortOrder: Number(sortOrder) || 0,
        status,
        file,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="relative flex flex-col w-full max-w-xl max-h-[92vh] rounded-2xl bg-white shadow-2xl border border-[#E5E0D8] overflow-hidden my-auto font-figtree">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E0D8] px-6 py-4 bg-[#FAF8F4]">
          <div>
            <h2 className="font-lora text-lg font-medium text-[#0F1C1D]">
              {editingItem ? "Edit Annual Report" : "Upload Annual Report"}
            </h2>
            <p className="text-xs text-[#5F6C6D]">
              {editingItem
                ? "Update report metadata or replace the document file."
                : "Upload an official annual report PDF to publish on the website."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#5F6C6D] hover:bg-stone-200 hover:text-[#0F1C1D] cursor-pointer transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0F1C1D]">
              Report Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="e.g. Annual Report 2025-26"
              className={cn(
                "w-full rounded-lg border bg-white px-3 py-2 text-xs text-[#0F1C1D] placeholder:text-[#8A847A] focus:outline-hidden transition-all",
                errors.title
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-[#D9D3C9] focus:border-[#9739A8]",
              )}
            />
            {errors.title && <p className="text-[11px] text-rose-500">{errors.title}</p>}
          </div>

          {/* Report Year & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#0F1C1D]">
                Report Year <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={reportYear}
                onChange={(e) => {
                  setReportYear(e.target.value);
                  if (errors.reportYear) setErrors((prev) => ({ ...prev, reportYear: undefined }));
                }}
                placeholder="e.g. 2025-2026 or 2025"
                className={cn(
                  "w-full rounded-lg border bg-white px-3 py-2 text-xs text-[#0F1C1D] placeholder:text-[#8A847A] focus:outline-hidden transition-all",
                  errors.reportYear
                    ? "border-rose-400 focus:border-rose-500"
                    : "border-[#D9D3C9] focus:border-[#9739A8]",
                )}
              />
              {errors.reportYear && (
                <p className="text-[11px] text-rose-500">{errors.reportYear}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#0F1C1D]">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ContentStatus)}
                className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3 py-2 text-xs text-[#0F1C1D] focus:border-[#9739A8] focus:outline-hidden cursor-pointer"
              >
                <option value="draft">Draft</option>
                <option value="published">Published (Live Website)</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Sort Order */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0F1C1D]">
              Display Priority (Sort Order)
            </label>
            <input
              type="number"
              min={0}
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
              className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3 py-2 text-xs text-[#0F1C1D] focus:border-[#9739A8] focus:outline-hidden"
              placeholder="0 (Lower numbers appear first)"
            />
            <p className="text-[11px] text-[#5F6C6D]">
              Items are sorted by priority first (ASC), then by report year (DESC).
            </p>
          </div>

          {/* PDF File Upload */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-semibold text-[#0F1C1D] block">
              PDF Document {!editingItem && <span className="text-rose-500">*</span>}
            </label>

            {editingItem && (
              <div className="flex items-center justify-between rounded-lg bg-[#FAF8F4] border border-[#E5E0D8] px-3 py-2 text-xs">
                <span className="text-[#5F6C6D]">Current File:</span>
                <a
                  href={editingItem.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#9739A8] hover:underline truncate max-w-xs"
                >
                  View uploaded document ↗
                </a>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
            />

            {!file ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFileSelect(e.dataTransfer.files?.[0] || null);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors",
                  isDragging
                    ? "border-[#9739A8] bg-[#9739A8]/5"
                    : "border-[#D9D3C9] bg-stone-50/50 hover:bg-stone-50 hover:border-stone-400",
                  errors.file && "border-rose-400 bg-rose-50/30",
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-2xs text-[#9739A8] mb-2 border border-[#E5E0D8]">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium text-[#0F1C1D]">
                  {editingItem ? "Click to replace PDF file" : "Click to browse or drag & drop"}
                </p>
                <p className="text-[11px] text-[#8A847A] mt-0.5">
                  PDF documents up to 50MB
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-xl border border-[#D9D3C9] bg-white p-3 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#0F1C1D] truncate">{file.name}</p>
                    <p className="text-[11px] text-[#8A847A]">{formatBytes(file.size)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-md border border-[#D9D3C9] bg-white px-2 py-1 text-xs text-[#5F6C6D] hover:bg-stone-50 cursor-pointer"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="rounded-md p-1 text-[#8A847A] hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                    title="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {errors.file && <p className="text-[11px] text-rose-500">{errors.file}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-[#E5E0D8] bg-[#FAF8F4] px-6 py-3">
          <button
            type="button"
            onClick={onClose}
            disabled={actionLoading}
            className="rounded-lg border border-[#D9D3C9] bg-white px-4 py-1.5 text-xs font-semibold text-[#5F6C6D] hover:text-[#00191B] cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={actionLoading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1A0F1C] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#2C1A30] cursor-pointer shadow-xs disabled:opacity-50"
          >
            {actionLoading && <Loader2 className="h-3 w-3 animate-spin" />}
            <span>{editingItem ? "Update Report" : "Upload Report"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
