"use client";

import { Calendar, ExternalLink, Tag, X } from "lucide-react";
import type { BlogAndStoryItem } from "./types";

interface BlogAndStoryPreviewModalProps {
  item: BlogAndStoryItem | null;
  onClose: () => void;
}

function formatDisplayDate(dateStr: string | null) {
  if (!dateStr) return "Unscheduled";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function BlogAndStoryPreviewModal({
  item,
  onClose,
}: BlogAndStoryPreviewModalProps) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-[#E5E0D8] font-figtree">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-[#E5E0D8] px-6 py-4 shrink-0 bg-[#FAF8F4]">
          <div className="flex items-center gap-2">
            <span className="font-figtree text-xs font-bold uppercase tracking-wider text-[#9739A8]">
              Story Preview
            </span>
            <span className="font-mono text-[11px] text-[#8A847A]">
              /blogs/{item.slug}
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

        {/* Modal Body: Article Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Banner */}
          {item.blogBanner && (
            <div className="w-full overflow-hidden rounded-xl border border-[#E5E0D8] bg-[#FAF8F4]">
              <img
                src={item.blogBanner}
                alt={item.title}
                className="h-64 sm:h-80 w-full object-cover"
              />
            </div>
          )}

          {/* Meta Tags / Category / Date */}
          <div className="flex flex-wrap items-center gap-3">
            {item.category?.name && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FAF8F4] px-3 py-1 font-semibold text-xs text-[#9739A8] border border-[#E5E0D8]">
                <Tag className="h-3.5 w-3.5" />
                <span>{item.category.name}</span>
              </span>
            )}
            <div className="flex items-center gap-1.5 text-xs text-[#5F6C6D]">
              <Calendar className="h-3.5 w-3.5 text-[#8A847A]" />
              <span>{formatDisplayDate(item.blogDate)}</span>
            </div>
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

          {/* Title */}
          <h1 className="font-lora text-2xl sm:text-3xl font-bold text-[#0F1C1D] leading-tight">
            {item.title}
          </h1>

          {/* Short Excerpt */}
          {item.shortDescription && (
            <div className="border-l-3 border-[#9739A8] pl-4 py-1 italic font-figtree text-sm text-[#3E4C4D] bg-[#FAF8F4]/50 rounded-r-lg">
              {item.shortDescription}
            </div>
          )}

          {/* Full Rich Content */}
          {item.content ? (
            <div
              className="prose prose-stone max-w-none text-xs sm:text-sm text-[#0F1C1D] leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          ) : (
            <p className="text-xs italic text-[#8A847A]">
              No full content written for this story yet.
            </p>
          )}

          {/* SEO Details Footer */}
          {(item.metaTitle || item.metaDescription) && (
            <div className="mt-8 pt-4 border-t border-[#E5E0D8] text-xs text-[#5F6C6D] space-y-1 bg-[#FAF8F4] p-3 rounded-xl">
              <p className="font-bold text-[#0F1C1D]">Search Engine Snippet:</p>
              <p className="font-semibold text-blue-700">
                {item.metaTitle || item.title} | IHDUA
              </p>
              <p className="text-[#8A847A]">
                {item.metaDescription || item.shortDescription || "No description set"}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end border-t border-[#E5E0D8] px-6 py-3 shrink-0 bg-[#FAF8F4]">
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

