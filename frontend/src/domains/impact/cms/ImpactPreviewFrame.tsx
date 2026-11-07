"use client";

import { useEffect, useState } from "react";
import { hasGalleryPage, ImpactGalleryView, ImpactPageView, type ImpactPageData } from "./ImpactPageView";

export const PREVIEW_READY = "impact-preview-ready";
export const PREVIEW_DATA = "impact-preview-data";

/** Rendered inside the CMS preview iframe; the editor posts the unsaved page data to it. */
export function ImpactPreviewFrame() {
  const [data, setData] = useState<ImpactPageData | null>(null);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.type !== PREVIEW_DATA) return;
      setData(e.data.payload as ImpactPageData);
    };
    window.addEventListener("message", onMessage);
    window.parent.postMessage({ type: PREVIEW_READY }, window.location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!data) return null;

  return (
    <main className="w-full pb-16">
      <ImpactPageView data={data} />
      {hasGalleryPage(data) && (
        <>
          <div className="mt-16 border-y border-dashed border-[#D9D3C9] bg-[#FAF8F4] px-6 py-3 text-center font-figtree text-xs font-semibold uppercase tracking-wider text-[#8A847A]">
            Separate gallery page · /{data.slug || "page-url"}/gallery
          </div>
          <ImpactGalleryView data={data} />
        </>
      )}
    </main>
  );
}
