"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, Loader2, UploadCloud, X } from "lucide-react";
import { AdminSelect, type AdminSelectOption } from "@/domains/admin/components/AdminSelect";
import { AdminTimeSelect } from "@/domains/admin/components/AdminTimeSelect";
import type {
  ContentStatus,
  InteractiveProgrammeFormValues,
  InteractiveProgrammeItem,
} from "./types";

interface Props {
  isOpen: boolean;
  editingItem: InteractiveProgrammeItem | null;
  actionLoading: boolean;
  onClose: () => void;
  onSave: (values: InteractiveProgrammeFormValues) => void;
}

const STATUS_OPTIONS: AdminSelectOption<ContentStatus>[] = [
  { value: "draft", label: "Draft (Private in CMS)", dotColor: "bg-amber-500" },
  {
    value: "published",
    label: "Published (Visible on live website)",
    dotColor: "bg-emerald-500",
  },
  { value: "archived", label: "Archived (Unpublished)", dotColor: "bg-neutral-400" },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 255);
}

function isVideoUrl(url: string | null | undefined) {
  if (!url) return false;
  return /\.(mp4|webm)(\?|$)/i.test(url) || url.includes("/video");
}

/** Normalize DB time (HH:mm:ss) to HH:mm for <input type="time"> */
function toTimeInput(value: string | null | undefined) {
  if (!value) return "";
  return value.slice(0, 5);
}

function getTodayIsoDate(): string {
  return new Date().toISOString().split("T")[0];
}

const FIELD_CLS =
  "w-full h-10 rounded-lg border border-[#D9D3C9] bg-white px-3.5 py-2 font-figtree text-xs text-[#0F1C1D] placeholder:text-[#8A847A] focus:border-[#9739A8] focus:outline-hidden";

export function InteractiveProgrammeEditorModal({
  isOpen,
  editingItem,
  actionLoading,
  onClose,
  onSave,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState("");
  const [lockedSlug, setLockedSlug] = useState<string | null>(null);
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<ContentStatus>("draft");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [clearMedia, setClearMedia] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (editingItem) {
      setLockedSlug(editingItem.slug);
      setTitle(editingItem.title);
      setEventDate(
        editingItem.eventDate
          ? editingItem.eventDate.split("T")[0]
          : getTodayIsoDate(),
      );
      setEventLocation(editingItem.eventLocation || "");
      setEventTime(toTimeInput(editingItem.eventTime));
      setContent(editingItem.content || "");
      setStatus(editingItem.status);
      setFile(null);
      setPreviewUrl(editingItem.eventMediaUrl);
      setClearMedia(false);
    } else {
      setLockedSlug(null);
      setTitle("");
      setEventDate(getTodayIsoDate());
      setEventLocation("");
      setEventTime("");
      setContent("");
      setStatus("draft");
      setFile(null);
      setPreviewUrl(null);
      setClearMedia(false);
    }
    setError(null);
  }, [isOpen, editingItem]);

  if (!isOpen) return null;

  const handleFileSelect = (selected: File | null) => {
    if (!selected) return;
    const imageTypes = ["image/webp", "image/avif", "image/jpeg", "image/png"];
    const videoTypes = ["video/mp4", "video/webm"];
    if (![...imageTypes, ...videoTypes].includes(selected.type)) {
      setError("Use WebP/AVIF/JPEG/PNG image or MP4/WebM video.");
      return;
    }
    if (imageTypes.includes(selected.type) && selected.size > 5 * 1024 * 1024) {
      setError("Image must be 5MB or smaller.");
      return;
    }
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setClearMedia(false);
    setError(null);
  };

  const handleRemoveMedia = () => {
    setFile(null);
    setPreviewUrl(null);
    setClearMedia(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }
    const slug = lockedSlug || slugify(trimmedTitle);
    if (!slug) {
      setError("Title must include letters or numbers so a URL slug can be created.");
      return;
    }

    onSave({
      title: trimmedTitle,
      slug,
      eventDate: eventDate || null,
      eventLocation: eventLocation.trim() || null,
      eventTime: eventTime || null,
      content: content.trim() || null,
      status,
      eventMediaFile: file,
      eventMediaUrl: clearMedia ? null : editingItem?.eventMediaUrl ?? null,
      clearMedia,
    });
  };

  const previewIsVideo =
    (file && file.type.startsWith("video/")) || isVideoUrl(previewUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#E5E0D8] bg-white shadow-2xl font-figtree">
        <div className="flex items-center justify-between border-b border-[#E5E0D8] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5E0D8] bg-[#FAF8F4] text-[#9739A8]">
              <CalendarDays className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-lora text-lg text-[#0F1C1D]">
                {editingItem ? "Edit programme" : "Add programme"}
              </h2>
              <p className="text-xs text-[#5F6C6D]">
                Interactive programmes / events for the website
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-neutral-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="space-y-4 overflow-y-auto px-5 py-4">
            {error && (
              <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {error}
              </p>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#0F1C1D]">
                Title <span className="text-rose-600">*</span>
              </label>
              <input
                className={FIELD_CLS}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Rural Health Awareness Camp 2026"
              />
            </div>

            {lockedSlug && (
              <p className="text-[10px] text-[#5F6C6D]">
                Slug: <span className="font-mono">{lockedSlug}</span>
              </p>
            )}

            {/* Date & Status — same 2-col pattern as Blogs editor */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#0F1C1D]">
                  Event Date
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className={FIELD_CLS}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#0F1C1D]">
                  Publication Status
                </label>
                <AdminSelect
                  value={status}
                  onChange={setStatus}
                  options={STATUS_OPTIONS}
                  size="md"
                  className="w-full"
                  dropdownClassName="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#0F1C1D]">
                  Event Time
                </label>
                <AdminTimeSelect
                  value={eventTime}
                  onChange={setEventTime}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#0F1C1D]">
                  Location
                </label>
                <input
                  className={FIELD_CLS}
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="IHDUA Center, Mysore"
                />
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-semibold">
                Event banner or video
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/webp,image/avif,image/jpeg,image/png,video/mp4,video/webm"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
              />
              {previewUrl ? (
                <div className="relative overflow-hidden rounded-xl border border-[#E5E0D8]">
                  {previewIsVideo ? (
                    <video
                      src={previewUrl}
                      controls
                      className="max-h-48 w-full bg-black object-contain"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt="Event media preview"
                      className="max-h-48 w-full object-cover"
                    />
                  )}
                  <button
                    type="button"
                    onClick={handleRemoveMedia}
                    className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-rose-600 shadow"
                    title="Remove media"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-[#D9D3C9] bg-[#FAF8F4] px-4 py-8 text-xs text-[#5F6C6D] hover:border-[#9739A8]/40"
                >
                  <UploadCloud className="h-5 w-5 text-[#9739A8]" />
                  Upload image or video
                </button>
              )}
              {previewUrl && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 text-xs font-semibold text-[#9739A8]"
                >
                  Replace media
                </button>
              )}
            </div>

            <label className="block text-xs font-semibold">
              Content
              <textarea
                className="mt-1 min-h-[120px] w-full rounded-lg border border-[#D9D3C9] px-3 py-2"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Full event description…"
              />
            </label>
          </div>

          <div className="flex justify-end gap-2 border-t border-[#E5E0D8] px-5 py-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#D9D3C9] px-3.5 py-2 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-[#9739A8] px-3.5 py-2 text-xs font-semibold text-white disabled:opacity-60"
            >
              {actionLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {editingItem ? "Save changes" : "Create programme"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
