"use client";

import { useEffect, useState } from "react";
import { FileText, Loader2, X } from "lucide-react";
import { AdminSelect, type AdminSelectOption } from "@/domains/admin/components/AdminSelect";
import { ReportPdfUploader } from "./ReportPdfUploader";
import type { AnnualReportFormValues, AnnualReportItem, ContentStatus } from "./types";

interface AnnualReportEditorModalProps {
  isOpen: boolean;
  editingItem: AnnualReportItem | null;
  actionLoading: boolean;
  onClose: () => void;
  onSave: (values: AnnualReportFormValues) => void;
}

const MODAL_STATUS_OPTIONS: AdminSelectOption<ContentStatus>[] = [
  { value: "draft", label: "Draft", dotColor: "bg-amber-500" },
  { value: "published", label: "Published (Live Website)", dotColor: "bg-emerald-500" },
  { value: "archived", label: "Archived", dotColor: "bg-neutral-400" },
];

export function AnnualReportEditorModal({
  isOpen,
  editingItem,
  actionLoading,
  onClose,
  onSave,
}: AnnualReportEditorModalProps) {
  const [title, setTitle] = useState("");
  const [reportYear, setReportYear] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [status, setStatus] = useState<ContentStatus>("draft");
  const [file, setFile] = useState<File | null>(null);

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

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf" && !selectedFile.name.endsWith(".pdf")) {
      setErrors((prev) => ({ ...prev, file: "Only PDF files are supported." }));
      return;
    }
    setFile(selectedFile);
    setErrors((prev) => ({ ...prev, file: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!title.trim()) newErrors.title = "Report title is required.";
    if (!reportYear.trim()) newErrors.reportYear = "Report year is required (e.g. 2025-2026).";
    if (!editingItem && !file) newErrors.file = "Please upload the annual report PDF document.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave({
        title: title.trim(),
        reportYear: reportYear.trim(),
        sortOrder: Number(sortOrder) || 0,
        status,
        file: file || null,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#E5E0D8] font-figtree animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF8F4] text-[#9739A8] border border-[#E5E0D8]">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-lora text-lg font-medium text-[#0F1C1D]">
                {editingItem ? "Edit Annual Report" : "Upload Annual Report"}
              </h2>
              <p className="text-xs text-[#5F6C6D]">
                {editingItem
                  ? "Update report title, year, or replace the document."
                  : "Upload an official annual report PDF to publish on the website."}
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
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
              Report Title <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Annual Report 2025-26"
              className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3.5 py-2 font-figtree text-xs text-[#0F1C1D] focus:border-[#9739A8] focus:outline-hidden"
            />
            {errors.title && (
              <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.title}</p>
            )}
          </div>

          {/* Year & Sort Order */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
                Financial Year <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={reportYear}
                onChange={(e) => setReportYear(e.target.value)}
                placeholder="2025-2026"
                className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3.5 py-2 font-figtree text-xs text-[#0F1C1D] focus:border-[#9739A8] focus:outline-hidden"
              />
              {errors.reportYear && (
                <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.reportYear}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                placeholder="0"
                className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3.5 py-2 font-figtree text-xs text-[#0F1C1D] focus:border-[#9739A8] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Status */}
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

          {/* PDF File Dropzone */}
          <ReportPdfUploader
            file={file}
            error={errors.file}
            isEditing={Boolean(editingItem)}
            onFileSelect={handleFileSelect}
            onRemoveFile={() => setFile(null)}
          />

          {/* Footer Actions */}
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
              <span>{editingItem ? "Update Report" : "Upload Report"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
