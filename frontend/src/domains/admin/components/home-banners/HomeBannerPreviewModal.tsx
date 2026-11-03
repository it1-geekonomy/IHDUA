"use client";

import { Calendar, ExternalLink, X } from "lucide-react";
import type { HomeBannerItem } from "./types";

interface HomeBannerPreviewModalProps {
  item: HomeBannerItem | null;
  onClose: () => void;
}

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

export function HomeBannerPreviewModal({
  item,
  onClose,
}: HomeBannerPreviewModalProps) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-[#E5E0D8] font-figtree overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-[#E5E0D8] px-6 py-4 bg-[#FAF8F4]">
          <div className="flex items-center gap-3">
            <span className="font-figtree text-xs font-bold uppercase tracking-wider text-[#9739A8]">
              Home Banner Preview
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase ${
                item.status === "published"
                  ? "bg-[#E7F6EE] text-[#1F6B45]"
                  : item.status === "draft"
                    ? "bg-[#FFF6DB] text-[#8A6A00]"
                    : "bg-neutral-100 text-[#5F6C6D]"
              }`}
            >
              {item.status}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#5F6C6D] hover:bg-neutral-200/60 hover:text-[#0F1C1D] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Full Image */}
        <div className="p-6 bg-neutral-900/90 flex items-center justify-center min-h-[300px] max-h-[70vh] overflow-hidden">
          <img
            src={item.bannerImageUrl}
            alt="Home Banner Full Preview"
            className="max-h-[65vh] w-auto max-w-full object-contain rounded-lg shadow-lg"
          />
        </div>

        {/* Footer info bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#E5E0D8] px-6 py-3.5 bg-[#FAF8F4] text-xs text-[#5F6C6D]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#8A847A]" />
              <span>Uploaded: {formatDate(item.createdAt)}</span>
            </div>
            <a
              href={item.bannerImageUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[#9739A8] hover:underline font-medium"
            >
              <span>View full image</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#1A0F1C] px-4 py-2 font-figtree text-xs font-semibold text-white shadow-xs hover:bg-[#2C1A30] cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}

