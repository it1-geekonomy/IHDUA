"use client";

import { useEffect, useRef, useState } from "react";
import { Image as ImageIcon, Loader2, Upload, X } from "lucide-react";
import { AdminSelect, type AdminSelectOption } from "@/domains/admin/components/AdminSelect";
import type {
  LeadershipMemberFormValues,
  LeadershipMemberItem,
  MemberStatus,
} from "./types";

interface LeadershipMemberEditorModalProps {
  isOpen: boolean;
  editingItem: LeadershipMemberItem | null;
  loading: boolean;
  onClose: () => void;
  onSave: (values: LeadershipMemberFormValues) => Promise<void>;
}

const STATUS_SELECT_OPTIONS: AdminSelectOption<MemberStatus>[] = [
  { value: "draft", label: "Draft", dotColor: "bg-[#B54708]" },
  { value: "published", label: "Published", dotColor: "bg-[#1F6B45]" },
  { value: "archived", label: "Archived", dotColor: "bg-[#667085]" },
];

export function LeadershipMemberEditorModal({
  isOpen,
  editingItem,
  loading,
  onClose,
  onSave,
}: LeadershipMemberEditorModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [status, setStatus] = useState<MemberStatus>("draft");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setDesignation(editingItem.designation);
      setSortOrder(editingItem.sortOrder ?? 0);
      setStatus(editingItem.status);
      setSelectedFile(null);
      setPreviewUrl(editingItem.photoUrl || null);
    } else {
      setName("");
      setDesignation("");
      setSortOrder(0);
      setStatus("draft");
      setSelectedFile(null);
      setPreviewUrl(null);
    }
    setFormError(null);
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setFormError("Please upload a valid image file (JPEG, PNG, WebP).");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFormError("Image size must be less than 5MB.");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setFormError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError("Member name is required.");
      return;
    }
    if (!designation.trim()) {
      setFormError("Designation / role is required.");
      return;
    }
    if (!editingItem && !selectedFile) {
      setFormError("Member photo is required.");
      return;
    }

    setFormError(null);
    try {
      await onSave({
        name: name.trim(),
        designation: designation.trim(),
        sortOrder: Number(sortOrder) || 0,
        status,
        file: selectedFile,
      });
    } catch {
      // Handled in hook
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-figtree">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-[#E5E0D8]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D8]">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#0F1C1D]">
              {editingItem ? "Edit Leadership Member" : "Add Leadership Member"}
            </h2>
            <p className="text-xs text-[#5F6C6D] mt-0.5">
              {editingItem
                ? "Update member details, designation, status, or photo."
                : "Fill in the details to add a new leadership member."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-1 text-[#8A847A] hover:bg-[#FAF8F4] hover:text-[#0F1C1D] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error message */}
        {formError && (
          <div className="mt-4 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">
            {formError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Photo Uploader */}
          <div>
            <label className="block text-xs font-semibold text-[#0F1C1D] mb-1.5">
              Member Photo {!editingItem && <span className="text-rose-600">*</span>}
            </label>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#D9D3C9] bg-[#FAF8F4]">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center text-[#8A847A]">
                    <ImageIcon className="h-7 w-7 stroke-1" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-1.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#D9D3C9] bg-white px-3 py-1.5 text-xs font-semibold text-[#0F1C1D] shadow-2xs hover:bg-[#FAF8F4] transition-colors cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>{previewUrl ? "Change Photo" : "Upload Photo"}</span>
                </button>
                <p className="text-[11px] text-[#8A847A]">
                  JPEG, PNG, WebP up to 5MB. Square or portrait recommended.
                </p>
              </div>
            </div>
          </div>

          {/* Member Name */}
          <div>
            <label className="block text-xs font-semibold text-[#0F1C1D] mb-1">
              Full Name <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Jane Doe"
              maxLength={150}
              required
              className="h-9 w-full rounded-lg border border-[#D9D3C9] bg-white px-3 text-xs text-[#0F1C1D] placeholder:text-[#8A847A] shadow-2xs focus:border-[#9739A8] focus:outline-hidden"
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block text-xs font-semibold text-[#0F1C1D] mb-1">
              Designation / Role <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="e.g. Managing Trustee, Board Member"
              maxLength={150}
              required
              className="h-9 w-full rounded-lg border border-[#D9D3C9] bg-white px-3 text-xs text-[#0F1C1D] placeholder:text-[#8A847A] shadow-2xs focus:border-[#9739A8] focus:outline-hidden"
            />
          </div>

          {/* Two Column: Sort Order & Status */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-[#0F1C1D] mb-1">
                Sort Order Index
              </label>
              <input
                type="number"
                min={0}
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
                className="h-9 w-full rounded-lg border border-[#D9D3C9] bg-white px-3 text-xs text-[#0F1C1D] shadow-2xs focus:border-[#9739A8] focus:outline-hidden"
              />
              <span className="text-[11px] text-[#8A847A] mt-0.5 block">
                Lower numbers display first (0, 1, 2...).
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F1C1D] mb-1">
                Publication Status
              </label>
              <AdminSelect<MemberStatus>
                value={status}
                onChange={setStatus}
                options={STATUS_SELECT_OPTIONS}
                className="h-9 w-full"
                dropdownClassName="w-full"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E5E0D8]">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-[#D9D3C9] bg-white px-3.5 py-2 text-xs font-medium text-[#0F1C1D] shadow-2xs hover:bg-[#FAF8F4] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#9739A8] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#832e92] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{editingItem ? "Update Member" : "Save Member"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

