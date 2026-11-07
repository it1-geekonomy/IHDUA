"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Monitor, Smartphone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ImpactPageData } from "@/domains/impact/cms/ImpactPageView";
import { PREVIEW_DATA, PREVIEW_READY } from "@/domains/impact/cms/ImpactPreviewFrame";

interface ImpactPagePreviewProps {
  data: Omit<ImpactPageData, "heroImage" | "heroImageMobile">;
  heroImage: File | string | null | undefined;
  heroImageMobile: File | string | null | undefined;
  onClose: () => void;
}

function useImageUrl(source: File | string | null | undefined): string {
  const url = useMemo(
    () => (source instanceof File ? URL.createObjectURL(source) : source ?? ""),
    [source],
  );
  useEffect(() => {
    return () => {
      if (url.startsWith("blob:")) URL.revokeObjectURL(url);
    };
  }, [url]);
  return url;
}

/** Full-screen preview of the unsaved page, rendered in an iframe so mobile breakpoints apply. */
export function ImpactPagePreview({ data, heroImage, heroImageMobile, onClose }: ImpactPagePreviewProps) {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const heroUrl = useImageUrl(heroImage);
  const heroMobileUrl = useImageUrl(heroImageMobile);

  useEffect(() => {
    const payload: ImpactPageData = { ...data, heroImage: heroUrl, heroImageMobile: heroMobileUrl };
    const send = () =>
      frameRef.current?.contentWindow?.postMessage({ type: PREVIEW_DATA, payload }, window.location.origin);
    const onMessage = (e: MessageEvent) => {
      if (e.origin === window.location.origin && e.data?.type === PREVIEW_READY) send();
    };
    window.addEventListener("message", onMessage);
    send();
    return () => window.removeEventListener("message", onMessage);
  }, [data, heroUrl, heroMobileUrl]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  const toggle = (value: "desktop" | "mobile", Icon: typeof Monitor, label: string) => (
    <button
      type="button"
      onClick={() => setDevice(value)}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold cursor-pointer",
        device === value ? "bg-white text-[#0F1C1D] shadow-xs" : "text-white/70 hover:text-white",
      )}
    >
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#1A0F1C]">
      <div className="flex items-center justify-between gap-4 px-4 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">Preview: {data.heroTitle || "Untitled page"}</p>
          <p className="text-[11px] text-white/60">How the page will look on the website. Nothing is saved from here.</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-white/10 p-1">
          {toggle("desktop", Monitor, "Desktop")}
          {toggle("mobile", Smartphone, "Mobile")}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10 cursor-pointer"
        >
          <X className="h-3.5 w-3.5" /> Close
        </button>
      </div>
      <div className="flex flex-1 justify-center overflow-hidden bg-[#2C1A30] p-3">
        <iframe
          ref={frameRef}
          src="/impact-preview"
          title="Page preview"
          className={cn(
            "h-full rounded-lg bg-white shadow-2xl transition-[width] duration-300",
            device === "desktop" ? "w-full" : "w-[390px]",
          )}
        />
      </div>
    </div>,
    document.body,
  );
}
