"use client";

import { useState } from "react";
import { Check, Copy, Pencil, X } from "lucide-react";
import type { LegalDocumentItem } from "./types";
import { cn } from "@/lib/utils";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

interface LegalDocumentPreviewModalProps {
  item: LegalDocumentItem | null;
  onClose: () => void;
  onEdit: (item: LegalDocumentItem) => void;
}

export function LegalDocumentPreviewModal({
  item,
  onClose,
  onEdit,
}: LegalDocumentPreviewModalProps) {
  const [tab, setTab] = useState<"rendered" | "raw">("rendered");
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const handleCopy = () => {
    void navigator.clipboard.writeText(item.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="relative flex flex-col w-full max-w-3xl max-h-[90vh] rounded-2xl bg-white shadow-2xl border border-[#E5E0D8] overflow-hidden my-auto">
        <div className="flex items-center justify-between border-b border-[#E5E0D8] px-6 py-4 bg-[#FAF8F4]">
          <div>
            <h3 className="font-lora text-base font-medium text-[#0F1C1D]">{item.title}</h3>
            <p className="font-figtree text-xs text-[#5F6C6D] mt-0.5">
              Last updated {formatDate(item.updatedAt)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-md border border-[#D9D3C9] bg-white p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTab("rendered")}
                className={cn(
                  "rounded px-2.5 py-1 cursor-pointer transition-all",
                  tab === "rendered" ? "bg-[#1A0F1C] text-white shadow-2xs" : "text-[#5F6C6D] hover:text-[#0F1C1D]",
                )}
              >
                Formatted
              </button>
              <button
                type="button"
                onClick={() => setTab("raw")}
                className={cn(
                  "rounded px-2.5 py-1 cursor-pointer transition-all",
                  tab === "raw" ? "bg-[#1A0F1C] text-white shadow-2xs" : "text-[#5F6C6D] hover:text-[#0F1C1D]",
                )}
              >
                HTML
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#5F6C6D] hover:bg-stone-200 hover:text-[#0F1C1D] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8 font-figtree">
          {tab === "rendered" ? (
            <div
              className="prose prose-stone max-w-none text-xs sm:text-sm text-[#0F1C1D] leading-relaxed space-y-3"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          ) : (
            <div className="relative">
              <pre className="rounded-xl bg-[#1A0F1C] p-4 font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                {item.content}
              </pre>
              <button
                type="button"
                onClick={handleCopy}
                className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-xs font-semibold text-white hover:bg-white/20 cursor-pointer"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#E5E0D8] bg-[#FAF8F4] px-6 py-3 font-figtree">
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(item);
            }}
            className="inline-flex items-center gap-1 rounded-lg bg-[#1A0F1C] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#2C1A30] cursor-pointer shadow-xs"
          >
            <Pencil className="h-3 w-3" />
            <span>Edit Document</span>
          </button>
        </div>
      </div>
    </div>
  );
}
