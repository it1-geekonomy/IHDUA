"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Image as ImageIcon, UploadCloud } from "lucide-react";
import { FieldLabel } from "./FieldRenderer";

const ALLOWED = ["image/webp", "image/avif", "image/jpeg", "image/png"];
const MAX_BYTES = 5 * 1024 * 1024;

interface BannerImageFieldProps {
  label: string;
  hint: string;
  required?: boolean;
  currentUrl?: string | null;
  file: File | null;
  onFileChange: (file: File | null) => void;
  aspect?: string;
}

/** Hero and card images are sent to the backend as files on save. */
export function BannerImageField({
  label,
  hint,
  required,
  currentUrl,
  file,
  onFileChange,
  aspect = "aspect-[16/7]",
}: BannerImageFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const pick = (selected?: File) => {
    if (!selected) return;
    if (!ALLOWED.includes(selected.type)) {
      setError("Use a WebP, AVIF, JPEG or PNG image.");
      return;
    }
    if (selected.size > MAX_BYTES) {
      setError("Image must be 5 MB or smaller.");
      return;
    }
    setError(null);
    onFileChange(selected);
  };

  const shown = preview || currentUrl;

  return (
    <div>
      <FieldLabel label={label} required={required} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`group relative flex w-full ${aspect} items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[#D9D3C9] bg-[#FAF8F4]/40 hover:border-[#9739A8]/60 cursor-pointer`}
      >
        {shown ? (
          <>
            <img src={shown} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
              Replace image
            </span>
          </>
        ) : (
          <span className="flex flex-col items-center gap-1.5 text-[#8A847A]">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E0D8] bg-white text-[#9739A8]">
              {required ? <UploadCloud className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />}
            </span>
            <span className="text-xs font-semibold text-[#0F1C1D]">Click to upload</span>
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED.join(",")}
        className="hidden"
        onChange={(e) => {
          pick(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <p className="mt-1 text-[10px] text-[#8A847A]">{hint}</p>
      {error && <p className="mt-1 text-[11px] font-medium text-rose-600">{error}</p>}
    </div>
  );
}
