"use client";

import { useRef, useState } from "react";
import { Film, Image as ImageIcon, Loader2, Trash2, UploadCloud } from "lucide-react";
import { uploadImpactMedia } from "@/domains/admin/lib/api";
import { cn } from "@/lib/utils";

type MediaKind = "image" | "icon" | "video";

const ACCEPT: Record<MediaKind, string> = {
  image: "image/webp,image/avif,.webp,.avif",
  icon: "image/svg+xml,image/webp,.svg,.webp",
  video: "video/mp4,video/webm,.mp4,.webm",
};

const HINT: Record<MediaKind, string> = {
  image: "WebP or AVIF",
  icon: "SVG or WebP",
  video: "MP4 or WebM, up to 1 GB",
};

interface MediaInputProps {
  kind: MediaKind;
  url: string;
  onChange: (url: string) => void;
}

export function MediaInput({ kind, url, onChange }: MediaInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      onChange(await uploadImpactMedia(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const Placeholder = kind === "video" ? Film : ImageIcon;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#E5E0D8] bg-[#FAF8F4]",
            kind === "icon" ? "h-12 w-12" : "h-16 w-24",
          )}
        >
          {url ? (
            kind === "video" ? (
              <video src={url} className="h-full w-full object-cover" muted />
            ) : (
              <img src={url} alt="" className={cn("h-full w-full", kind === "icon" ? "object-contain p-1.5" : "object-cover")} />
            )
          ) : (
            <Placeholder className="h-5 w-5 text-[#B5AEA3]" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT[kind]}
              className="hidden"
              onChange={(e) => void handleFile(e.target.files?.[0])}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#D9D3C9] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#0F1C1D] hover:border-[#9739A8] disabled:opacity-50 cursor-pointer"
            >
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5" />}
              {uploading ? "Uploading…" : url ? "Replace" : "Upload"}
            </button>
            {url && !uploading && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            )}
            <span className="text-[10px] text-[#8A847A]">{HINT[kind]}</span>
          </div>
        </div>
      </div>
      {error && <p className="text-[11px] font-medium text-rose-600">{error}</p>}
    </div>
  );
}
