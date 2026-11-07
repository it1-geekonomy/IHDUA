"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface BlogSeoAccordionProps {
  metaTitle: string;
  onMetaTitleChange: (val: string) => void;
  metaDescription: string;
  onMetaDescriptionChange: (val: string) => void;
  schemaCode?: string;
  onSchemaCodeChange?: (val: string) => void;
  showSchemaCode?: boolean;
}

export function BlogSeoAccordion({
  metaTitle,
  onMetaTitleChange,
  metaDescription,
  onMetaDescriptionChange,
  schemaCode = "",
  onSchemaCodeChange,
  showSchemaCode = true,
}: BlogSeoAccordionProps) {
  const [showSeo, setShowSeo] = useState(
    Boolean(metaTitle || metaDescription || schemaCode),
  );

  return (
    <div className="rounded-xl border border-[#E5E0D8] bg-[#FAF8F4]/50 p-4">
      <button
        type="button"
        onClick={() => setShowSeo((prev) => !prev)}
        className="flex w-full items-center justify-between font-figtree text-xs font-semibold text-[#0F1C1D] cursor-pointer"
      >
        <span>Search Engine Optimization (SEO & Social Sharing)</span>
        {showSeo ? (
          <ChevronUp className="h-4 w-4 text-[#8A847A]" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[#8A847A]" />
        )}
      </button>

      {showSeo && (
        <div className="mt-4 space-y-4 pt-3 border-t border-[#E5E0D8]">
          <div>
            <label className="block text-[11px] font-semibold text-[#0F1C1D] mb-1">
              Meta Title
            </label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => onMetaTitleChange(e.target.value)}
              placeholder="Custom browser tab and search engine title"
              className="w-full rounded-lg border border-[#D9D3C9] bg-white px-3 py-1.5 font-figtree text-xs text-[#0F1C1D] placeholder:text-[#8A847A] focus:border-[#9739A8] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#0F1C1D] mb-1">
              Meta Description
            </label>
            <textarea
              rows={2}
              value={metaDescription}
              onChange={(e) => onMetaDescriptionChange(e.target.value)}
              placeholder="Summary displayed in Google search snippets"
              className="w-full rounded-lg border border-[#D9D3C9] bg-white p-3 font-figtree text-xs text-[#0F1C1D] placeholder:text-[#8A847A] focus:border-[#9739A8] focus:outline-hidden resize-none"
            />
          </div>

          {showSchemaCode && (
            <div>
              <label className="block text-[11px] font-semibold text-[#0F1C1D] mb-1">
                JSON-LD Structured Schema (Optional)
              </label>
              <textarea
                rows={3}
                value={schemaCode}
                onChange={(e) => onSchemaCodeChange?.(e.target.value)}
                placeholder='<script type="application/ld+json">{ ... }</script>'
                className="w-full rounded-lg border border-[#D9D3C9] bg-white p-3 font-mono text-[11px] text-[#0F1C1D] placeholder:text-[#8A847A] focus:border-[#9739A8] focus:outline-hidden"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

