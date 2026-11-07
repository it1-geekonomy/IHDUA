"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { hasGalleryPage, ImpactGalleryView, ImpactPageView, type ImpactPageData } from "./ImpactPageView";

export const PREVIEW_READY = "impact-preview-ready";
export const PREVIEW_DATA = "impact-preview-data";
const GALLERY_ANCHOR = "preview-gallery-page";

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

  // Website routes don't exist inside the preview: the gallery link jumps to the gallery
  // rendered below, external links open in a new tab, and other site links do nothing.
  const onClickCapture = (e: MouseEvent<HTMLElement>) => {
    const anchor = (e.target as HTMLElement).closest("a");
    const href = anchor?.getAttribute("href");
    if (!anchor || !href || href.startsWith("#")) return;
    e.preventDefault();
    if (/^https?:\/\//.test(href) && new URL(href).origin !== window.location.origin) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else if (/\/gallery\/?$/.test(href)) {
      document.getElementById(GALLERY_ANCHOR)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="w-full pb-16" onClickCapture={onClickCapture}>
      <ImpactPageView data={data} />
      {hasGalleryPage(data) && (
        <>
          <div id={GALLERY_ANCHOR} className="mt-16 scroll-mt-4 border-y border-dashed border-[#D9D3C9] bg-[#FAF8F4] px-6 py-3 text-center font-figtree text-xs font-semibold uppercase tracking-wider text-[#8A847A]">
            Separate gallery page · /{data.slug || "page-url"}/gallery
          </div>
          <ImpactGalleryView data={data} />
        </>
      )}
    </main>
  );
}
