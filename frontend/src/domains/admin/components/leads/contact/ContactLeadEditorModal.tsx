"use client";

import { Loader2, Pencil, X } from "lucide-react";
import { AdminSelect, type AdminSelectOption } from "@/domains/admin/components/AdminSelect";
import { CONTACT_SUBJECTS } from "@/domains/admin/constants";
import type { ContactLeadEditFormData } from "./types";

interface ContactLeadEditorModalProps {
  isOpen: boolean;
  saving: boolean;
  formData: ContactLeadEditFormData;
  onChange: (data: ContactLeadEditFormData) => void;
  onClose: () => void;
  onSave: () => void;
}

const EDIT_SUBJECT_OPTIONS: AdminSelectOption<string>[] = CONTACT_SUBJECTS.map((subj) => ({
  value: subj,
  label: subj,
}));

export function ContactLeadEditorModal({
  isOpen,
  saving,
  formData,
  onChange,
  onClose,
  onSave,
}: ContactLeadEditorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#E5E0D8] font-figtree animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF8F4] text-[#9739A8] border border-[#E5E0D8]">
              <Pencil className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-lora text-base font-medium text-[#0F1C1D]">
                Edit Contact Inquiry
              </h3>
              <p className="text-xs text-[#5F6C6D]">Update lead metadata and notes.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#5F6C6D] hover:bg-neutral-100 hover:text-[#0F1C1D] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#0F1C1D] mb-1">
              Contact Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onChange({ ...formData, name: e.target.value })}
              className="h-9 w-full rounded-lg border border-[#D9D3C9] bg-white px-3 text-xs text-[#0F1C1D] focus:border-[#9739A8] focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0F1C1D] mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => onChange({ ...formData, email: e.target.value })}
                className="h-9 w-full rounded-lg border border-[#D9D3C9] bg-white px-3 text-xs text-[#0F1C1D] focus:border-[#9739A8] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#0F1C1D] mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.mobile}
                onChange={(e) => onChange({ ...formData, mobile: e.target.value })}
                className="h-9 w-full rounded-lg border border-[#D9D3C9] bg-white px-3 text-xs text-[#0F1C1D] focus:border-[#9739A8] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F1C1D] mb-1">
              Subject Category
            </label>
            <AdminSelect<string>
              value={formData.subject}
              onChange={(val) => onChange({ ...formData, subject: val })}
              options={EDIT_SUBJECT_OPTIONS}
              size="md"
              className="w-full"
              dropdownClassName="w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F1C1D] mb-1">
              Message Content
            </label>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) => onChange({ ...formData, message: e.target.value })}
              className="w-full rounded-lg border border-[#D9D3C9] bg-white p-3 text-xs text-[#0F1C1D] focus:border-[#9739A8] focus:outline-hidden resize-none"
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2 border-t border-[#E5E0D8] pt-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-[#D9D3C9] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#5F6C6D] hover:text-[#0F1C1D] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1A0F1C] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#2C1A30] disabled:opacity-50 transition-all cursor-pointer"
          >
            {saving && <Loader2 className="h-3 w-3 animate-spin" />}
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
}

