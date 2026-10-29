"use client";

import { Download, ExternalLink, Pencil, X } from "lucide-react";
import type { AnnualReportItem } from "./types";

interface AnnualReportPdfModalProps {
  item: AnnualReportItem | null;
  onClose: () => void;
  onEdit: (item: AnnualReportItem) => void;
}

export function AnnualReportPdfModal({
  item,
  onClose,
  onEdit,
}: AnnualReportPdfModalProps) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="relative flex flex-col w-full max-w-4xl h-[90vh] rounded-2xl bg-white shadow-2xl border border-[#E5E0D8] overflow-hidden my-auto font-figtree">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E0D8] px-6 py-4 bg-[#FAF8F4]">
          <div className="min-w-0 pr-4">
            <div className="flex items-center gap-2">
              <h3 className="font-lora text-base font-medium text-[#0F1C1D] truncate">
                {item.title}
              </h3>
              <span className="rounded-md bg-stone-200/60 px-2 py-0.5 text-[11px] font-semibold text-[#5F6C6D]">
                {item.reportYear}
              </span>
            </div>
            <p className="text-xs text-[#5F6C6D] mt-0.5 truncate">
              Document URL: {item.fileUrl}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={item.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#D9D3C9] bg-white px-3 py-1.5 text-xs font-semibold text-[#5F6C6D] hover:text-[#00191B] cursor-pointer shadow-2xs"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Open in Tab</span>
            </a>

            <a
              href={item.fileUrl}
              download
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#D9D3C9] bg-white px-3 py-1.5 text-xs font-semibold text-[#5F6C6D] hover:text-[#00191B] cursor-pointer shadow-2xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#5F6C6D] hover:bg-stone-200 hover:text-[#0F1C1D] cursor-pointer transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Embedded PDF Viewer */}
        <div className="flex-1 w-full bg-stone-100 p-2 sm:p-4">
          <iframe
            src={`${item.fileUrl}#toolbar=1&navpanes=0`}
            title={item.title}
            className="w-full h-full rounded-xl border border-[#D9D3C9] bg-white shadow-inner"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-[#E5E0D8] bg-[#FAF8F4] px-6 py-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(item);
            }}
            className="inline-flex items-center gap-1 rounded-lg bg-[#1A0F1C] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#2C1A30] cursor-pointer shadow-xs"
          >
            <Pencil className="h-3 w-3" />
            <span>Edit Report Details</span>
          </button>
        </div>
      </div>
    </div>
  );
}
